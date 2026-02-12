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

    console.log("📦 Step 1: Generating Prisma Client...");
    try {
      await execAsync("npx prisma generate", {
        cwd: process.cwd(),
        env: { ...process.env }
      });
      console.log("✅ Prisma Client generated");
    } catch (genError: any) {
      console.error("❌ Prisma generate failed:", genError.message);
      return res.status(500).json({ 
        error: "Failed to generate Prisma Client",
        details: genError.message,
        step: "generate"
      });
    }

    console.log("🔄 Step 2: Running migrations...");
    try {
      await execAsync("npx prisma migrate deploy", {
        cwd: process.cwd(),
        env: { ...process.env }
      });
      console.log("✅ Migrations completed");
    } catch (migrateError: any) {
      console.error("❌ Migration failed:", migrateError.message);
      return res.status(500).json({ 
        error: "Database migration failed",
        details: migrateError.message,
        step: "migrate"
      });
    }

    console.log("🔍 Step 3: Checking existing data...");
    const existingTenant = await prisma.tenant.findFirst();
    
    if (existingTenant) {
      console.log("⚠️ Data already exists");
      return res.status(200).json({ 
        message: "Database initialized (data already exists)",
        skipped: true
      });
    }

    console.log("🏢 Step 4: Creating system tenant...");
    const systemTenant = await prisma.tenant.create({
      data: {
        name: "System",
        domain: "system.local",
        isActive: true,
        settings: {}
      }
    });
    console.log("✅ System tenant created");

    console.log("👥 Step 5: Creating roles with permissions...");
    
    await prisma.role.create({
      data: {
        name: "Super Admin",
        description: "Full system access",
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

    await prisma.role.create({
      data: {
        name: "Admin",
        description: "Company administration",
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

    await prisma.role.create({
      data: {
        name: "Manager",
        description: "Team management",
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

    await prisma.role.create({
      data: {
        name: "Agent",
        description: "Handle conversations",
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

    console.log("✅ Roles created");

    console.log("💰 Step 6: Creating subscription plans...");
    await prisma.subscriptionPlan.createMany({
      data: [
        {
          name: "Free",
          description: "Basic plan",
          price: 0,
          billingCycle: "monthly",
          features: { messageLimit: 500 },
          isActive: true
        },
        {
          name: "Starter",
          description: "Growing businesses",
          price: 4900,
          billingCycle: "monthly",
          features: { messageLimit: 5000 },
          isActive: true
        },
        {
          name: "Professional",
          description: "Advanced features",
          price: 14900,
          billingCycle: "monthly",
          features: { messageLimit: 25000 },
          isActive: true
        },
        {
          name: "Enterprise",
          description: "Unlimited",
          price: 49900,
          billingCycle: "monthly",
          features: { messageLimit: -1 },
          isActive: true
        }
      ]
    });
    console.log("✅ Subscription plans created");

    console.log("🎉 Database initialization complete!");

    return res.status(200).json({ 
      message: "Database initialized successfully",
      details: {
        tenant: systemTenant.id,
        roles: 4,
        subscriptionPlans: 4
      }
    });

  } catch (error: any) {
    console.error("💥 Error:", error);
    return res.status(500).json({ 
      error: "Database initialization failed",
      details: error.message || "Unknown error"
    });
  }
}