import type { NextApiRequest, NextApiResponse } from "next";
import { isInstalled } from "@/lib/installer";
import { prisma } from "@/lib/prisma";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const installed = await isInstalled();
    if (installed) {
      return res.status(400).json({ 
        error: "System already installed",
        step: "validation"
      });
    }

    console.log("🚀 Starting database initialization...");

    // Step 1: Check DATABASE_URL format
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return res.status(500).json({
        error: "DATABASE_URL not configured",
        details: "Please set DATABASE_URL in your environment variables",
        step: "validation"
      });
    }

    // Check if schema parameter is missing
    if (!databaseUrl.includes('schema=')) {
      return res.status(400).json({
        error: "DATABASE_URL missing schema parameter",
        details: "Your DATABASE_URL must include ?schema=public parameter",
        fix: `Update DATABASE_URL to: ${databaseUrl}${databaseUrl.includes('?') ? '&' : '?'}schema=public`,
        step: "validation",
        instructions: [
          "1. Open your Dokploy Dashboard",
          "2. Go to Settings → Environment Variables",
          "3. Find DATABASE_URL",
          "4. Click Edit",
          "5. Add ?schema=public to the end (or &schema=public if you already have other parameters)",
          "6. Save and Redeploy",
          "7. Try Initialize Database again"
        ]
      });
    }

    // Step 2: Test database connection
    console.log("🔍 Step 1: Testing database connection...");
    try {
      await prisma.$queryRaw`SELECT 1 as test`;
      console.log("✅ Database connection successful");
    } catch (dbError: any) {
      console.error("❌ Database connection failed:", dbError.message);
      return res.status(500).json({ 
        error: "Database connection failed",
        details: dbError.message,
        step: "connection",
        fix: "Verify your DATABASE_URL is correct and the database server is accessible"
      });
    }

    // Step 3: Generate Prisma Client
    console.log("📦 Step 2: Generating Prisma Client...");
    try {
      const { stdout, stderr } = await execAsync("npx prisma generate", {
        cwd: process.cwd(),
        env: { ...process.env }
      });
      console.log("✅ Prisma Client generated");
      if (stderr && !stderr.includes('warn')) {
        console.log("Prisma generate output:", stderr);
      }
    } catch (genError: any) {
      console.error("❌ Prisma generate failed:", genError.message);
      return res.status(500).json({ 
        error: "Failed to generate Prisma Client",
        details: genError.message,
        step: "generate"
      });
    }

    // Step 4: Try db push first (better for Docker/cloud environments)
    console.log("🔄 Step 3: Creating database schema with db push...");
    let schemaCreated = false;
    
    try {
      const { stdout, stderr } = await execAsync(
        "npx prisma db push --skip-generate --accept-data-loss --force-reset",
        {
          cwd: process.cwd(),
          env: { ...process.env }
        }
      );
      console.log("✅ Database schema created via db push");
      if (stdout) console.log("DB Push output:", stdout);
      schemaCreated = true;
    } catch (pushError: any) {
      console.log("⚠️ DB push failed, trying migrate deploy...");
      
      // Fallback to migrate deploy
      try {
        const { stdout: migrateStdout, stderr: migrateStderr } = await execAsync(
          "npx prisma migrate deploy",
          {
            cwd: process.cwd(),
            env: { ...process.env }
          }
        );
        console.log("✅ Database schema created via migrate deploy");
        if (migrateStdout) console.log("Migrate output:", migrateStdout);
        schemaCreated = true;
      } catch (migrateError: any) {
        console.error("❌ Both db push and migrate deploy failed");
        console.error("Push error:", pushError.message);
        console.error("Migrate error:", migrateError.message);
        
        return res.status(500).json({ 
          error: "Database schema creation failed",
          details: `DB Push: ${pushError.message}\n\nMigrate Deploy: ${migrateError.message}`,
          step: "schema",
          fix: "Ensure DATABASE_URL includes ?schema=public parameter and database user has CREATE TABLE permissions"
        });
      }
    }

    if (!schemaCreated) {
      return res.status(500).json({
        error: "Schema creation verification failed",
        step: "schema"
      });
    }

    // Step 5: Verify tables exist
    console.log("🔍 Step 4: Verifying database tables...");
    try {
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ` as Array<{ table_name: string }>;
      
      console.log(`✅ Found ${tables.length} tables:`, tables.map(t => t.table_name).join(", "));
      
      if (tables.length === 0) {
        throw new Error("No tables created after schema push/migration");
      }

      // Check for essential tables
      const tableNames = tables.map(t => t.table_name.toLowerCase());
      const requiredTables = ['tenant', 'user', 'role', 'permission', 'subscriptionplan'];
      const missingTables = requiredTables.filter(t => !tableNames.includes(t));
      
      if (missingTables.length > 0) {
        throw new Error(`Missing required tables: ${missingTables.join(', ')}`);
      }
      
    } catch (verifyError: any) {
      console.error("❌ Table verification failed:", verifyError.message);
      return res.status(500).json({ 
        error: "Database tables verification failed",
        details: verifyError.message,
        step: "verification"
      });
    }

    // Step 6: Check if data already exists
    console.log("🔍 Step 5: Checking for existing data...");
    const existingTenant = await prisma.tenant.findFirst();
    
    if (existingTenant) {
      console.log("⚠️ Data already exists, skipping seeding");
      return res.status(200).json({ 
        message: "Database initialized successfully (data already exists)",
        skipped: true
      });
    }

    // Step 7: Create system tenant
    console.log("🏢 Step 6: Creating system tenant...");
    const systemTenant = await prisma.tenant.create({
      data: {
        name: "System",
        domain: "system.local",
        isActive: true,
        settings: {}
      }
    });
    console.log("✅ System tenant created:", systemTenant.id);

    // Step 8: Create roles with permissions
    console.log("👥 Step 7: Creating roles and permissions...");
    
    const superAdminRole = await prisma.role.create({
      data: {
        name: "Super Admin",
        description: "Full system access including tenant management",
        tenantId: systemTenant.id,
        permissions: {
          create: [
            { tenantId: systemTenant.id, resource: "tenants", action: "create" },
            { tenantId: systemTenant.id, resource: "tenants", action: "read" },
            { tenantId: systemTenant.id, resource: "tenants", action: "update" },
            { tenantId: systemTenant.id, resource: "tenants", action: "delete" },
            { tenantId: systemTenant.id, resource: "users", action: "create" },
            { tenantId: systemTenant.id, resource: "users", action: "read" },
            { tenantId: systemTenant.id, resource: "users", action: "update" },
            { tenantId: systemTenant.id, resource: "users", action: "delete" },
            { tenantId: systemTenant.id, resource: "roles", action: "create" },
            { tenantId: systemTenant.id, resource: "roles", action: "read" },
            { tenantId: systemTenant.id, resource: "roles", action: "update" },
            { tenantId: systemTenant.id, resource: "roles", action: "delete" },
            { tenantId: systemTenant.id, resource: "contacts", action: "create" },
            { tenantId: systemTenant.id, resource: "contacts", action: "read" },
            { tenantId: systemTenant.id, resource: "contacts", action: "update" },
            { tenantId: systemTenant.id, resource: "contacts", action: "delete" },
            { tenantId: systemTenant.id, resource: "messages", action: "create" },
            { tenantId: systemTenant.id, resource: "messages", action: "read" },
            { tenantId: systemTenant.id, resource: "campaigns", action: "create" },
            { tenantId: systemTenant.id, resource: "campaigns", action: "read" },
            { tenantId: systemTenant.id, resource: "campaigns", action: "update" },
            { tenantId: systemTenant.id, resource: "campaigns", action: "delete" }
          ]
        }
      }
    });

    const adminRole = await prisma.role.create({
      data: {
        name: "Admin",
        description: "Company-level administration",
        tenantId: systemTenant.id,
        permissions: {
          create: [
            { tenantId: systemTenant.id, resource: "users", action: "create" },
            { tenantId: systemTenant.id, resource: "users", action: "read" },
            { tenantId: systemTenant.id, resource: "users", action: "update" },
            { tenantId: systemTenant.id, resource: "contacts", action: "create" },
            { tenantId: systemTenant.id, resource: "contacts", action: "read" },
            { tenantId: systemTenant.id, resource: "contacts", action: "update" },
            { tenantId: systemTenant.id, resource: "contacts", action: "delete" },
            { tenantId: systemTenant.id, resource: "messages", action: "create" },
            { tenantId: systemTenant.id, resource: "messages", action: "read" },
            { tenantId: systemTenant.id, resource: "campaigns", action: "create" },
            { tenantId: systemTenant.id, resource: "campaigns", action: "read" }
          ]
        }
      }
    });

    const managerRole = await prisma.role.create({
      data: {
        name: "Manager",
        description: "Team management and oversight",
        tenantId: systemTenant.id,
        permissions: {
          create: [
            { tenantId: systemTenant.id, resource: "contacts", action: "read" },
            { tenantId: systemTenant.id, resource: "contacts", action: "update" },
            { tenantId: systemTenant.id, resource: "messages", action: "create" },
            { tenantId: systemTenant.id, resource: "messages", action: "read" },
            { tenantId: systemTenant.id, resource: "campaigns", action: "read" }
          ]
        }
      }
    });

    const agentRole = await prisma.role.create({
      data: {
        name: "Agent",
        description: "Handle customer conversations",
        tenantId: systemTenant.id,
        permissions: {
          create: [
            { tenantId: systemTenant.id, resource: "contacts", action: "read" },
            { tenantId: systemTenant.id, resource: "messages", action: "create" },
            { tenantId: systemTenant.id, resource: "messages", action: "read" }
          ]
        }
      }
    });

    console.log("✅ Created 4 roles with permissions");

    // Step 9: Create subscription plans
    console.log("💰 Step 8: Creating subscription plans...");
    await prisma.subscriptionPlan.createMany({
      data: [
        {
          name: "Free",
          description: "Perfect for testing and small projects",
          price: 0,
          billingCycle: "monthly",
          features: { 
            messageLimit: 500,
            contacts: 100,
            whatsappAccounts: 1,
            templates: 5
          },
          isActive: true
        },
        {
          name: "Starter",
          description: "Ideal for growing businesses",
          price: 4900,
          billingCycle: "monthly",
          features: { 
            messageLimit: 5000,
            contacts: 1000,
            whatsappAccounts: 2,
            templates: 20,
            campaigns: true
          },
          isActive: true
        },
        {
          name: "Professional",
          description: "Advanced features for professionals",
          price: 14900,
          billingCycle: "monthly",
          features: { 
            messageLimit: 25000,
            contacts: 10000,
            whatsappAccounts: 5,
            templates: -1,
            campaigns: true,
            automation: true,
            crm: true
          },
          isActive: true
        },
        {
          name: "Enterprise",
          description: "Unlimited everything for large organizations",
          price: 49900,
          billingCycle: "monthly",
          features: { 
            messageLimit: -1,
            contacts: -1,
            whatsappAccounts: -1,
            templates: -1,
            campaigns: true,
            automation: true,
            crm: true,
            api: true,
            whitelabel: true,
            support: "dedicated"
          },
          isActive: true
        }
      ]
    });
    console.log("✅ Created 4 subscription plans");

    console.log("🎉 Database initialization complete!");

    return res.status(200).json({ 
      message: "Database initialized successfully",
      details: {
        tenantId: systemTenant.id,
        roles: 4,
        subscriptionPlans: 4
      }
    });

  } catch (error: any) {
    console.error("💥 Unexpected error during initialization:", error);
    const errorMessage = error.message || "Unknown error occurred";
    const errorStack = error.stack || "";
    
    return res.status(500).json({ 
      error: "Database initialization failed",
      details: errorMessage,
      step: "unknown",
      stack: process.env.NODE_ENV === "development" ? errorStack : undefined
    });
  }
}