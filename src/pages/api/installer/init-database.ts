import type { NextApiRequest, NextApiResponse } from "next";
import { isInstalled } from "@/lib/installer";
import { prisma } from "@/lib/prisma";

// Increase API route timeout
export const config = {
  api: {
    bodyParser: true,
    responseLimit: false,
    externalResolver: true,
  },
  maxDuration: 300,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check if already installed
  if (isInstalled()) {
    return res.status(400).json({ 
      error: "System already installed",
      details: "Database has already been initialized. To reinstall, contact support."
    });
  }

  try {
    // Step 1: Test database connection
    console.log("[Init DB] Testing database connection...");
    await prisma.$connect();
    const connectionTest = await prisma.$queryRaw`SELECT 1`;
    console.log("[Init DB] Database connection successful");

    // Step 2: Check if tables exist
    console.log("[Init DB] Checking if database schema exists...");
    let tables: Array<{ tablename: string }> = [];
    
    try {
      tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' AND tablename = 'Tenant'
      `;
    } catch (tableCheckError: any) {
      console.error("[Init DB] Error checking tables:", tableCheckError.message);
    }

    const hasTables = tables.length > 0;
    console.log("[Init DB] Tables exist:", hasTables);

    if (!hasTables) {
      console.error("[Init DB] Database schema not found - migrations not run");
      return res.status(400).json({
        error: "Database schema not found",
        details: "Prisma migrations have not been run yet",
        instructions: [
          "Before running the installer, you must initialize the database schema:",
          "1. Open terminal in project directory",
          "2. Run: npx prisma migrate deploy",
          "3. Then return to this installer and try Step 2 again",
          "",
          "If migrations still fail, try:",
          "- npm run setup:db"
        ]
      });
    }

    // Step 3: Check for existing data
    console.log("[Init DB] Checking for existing data...");
    const existingTenant = await prisma.tenant.findFirst();
    
    if (existingTenant) {
      console.log("[Init DB] System already initialized");
      return res.status(400).json({
        error: "Database already initialized",
        details: "Default data already exists in the database."
      });
    }

    // Step 4: Create System Tenant
    console.log("[Init DB] Creating System tenant...");
    const systemTenant = await prisma.tenant.create({
      data: {
        name: "System",
        domain: "system.local",
        isActive: true,
      },
    });
    console.log("[Init DB] System tenant created:", systemTenant.id);

    // Step 5: Create Roles with Permissions
    console.log("[Init DB] Creating roles...");
    const rolePermissions = {
      super_admin: [
        { resource: "tenants", action: "create" },
        { resource: "tenants", action: "read" },
        { resource: "tenants", action: "update" },
        { resource: "tenants", action: "delete" },
        { resource: "users", action: "create" },
        { resource: "users", action: "read" },
        { resource: "users", action: "update" },
        { resource: "users", action: "delete" },
      ],
      admin: [
        { resource: "users", action: "create" },
        { resource: "users", action: "read" },
        { resource: "contacts", action: "create" },
        { resource: "contacts", action: "read" },
      ],
      manager: [
        { resource: "contacts", action: "read" },
        { resource: "messages", action: "create" },
        { resource: "messages", action: "read" },
      ],
      agent: [
        { resource: "contacts", action: "read" },
        { resource: "messages", action: "create" },
      ],
    };

    // Create roles
    const superAdminRole = await prisma.role.create({
      data: {
        name: "super_admin",
        description: "Super Administrator with full access",
        tenantId: systemTenant.id,
        permissions: {
          create: rolePermissions.super_admin.map(p => ({
            resource: p.resource,
            action: p.action,
            tenantId: systemTenant.id,
          })),
        },
      },
    });
    console.log("[Init DB] super_admin role created");

    await prisma.role.create({
      data: {
        name: "admin",
        description: "Administrator",
        tenantId: systemTenant.id,
        permissions: {
          create: rolePermissions.admin.map(p => ({
            resource: p.resource,
            action: p.action,
            tenantId: systemTenant.id,
          })),
        },
      },
    });
    console.log("[Init DB] admin role created");

    await prisma.role.create({
      data: {
        name: "manager",
        description: "Manager",
        tenantId: systemTenant.id,
        permissions: {
          create: rolePermissions.manager.map(p => ({
            resource: p.resource,
            action: p.action,
            tenantId: systemTenant.id,
          })),
        },
      },
    });
    console.log("[Init DB] manager role created");

    await prisma.role.create({
      data: {
        name: "agent",
        description: "Agent",
        tenantId: systemTenant.id,
        permissions: {
          create: rolePermissions.agent.map(p => ({
            resource: p.resource,
            action: p.action,
            tenantId: systemTenant.id,
          })),
        },
      },
    });
    console.log("[Init DB] agent role created");

    // Step 6: Create Subscription Plans
    console.log("[Init DB] Creating subscription plans...");
    await prisma.subscriptionPlan.createMany({
      data: [
        {
          name: "Free",
          description: "Basic plan for getting started",
          price: 0,
          billingCycle: "MONTHLY",
          features: {
            messages: 500,
            contacts: 100,
            whatsappAccounts: 1,
            templates: 5,
            campaigns: false,
            automation: false,
            crm: false,
            analytics: false,
            support: "Email",
            historyDays: 30,
          },
          isActive: true,
        },
        {
          name: "Starter",
          description: "Perfect for small businesses",
          price: 4900,
          billingCycle: "MONTHLY",
          features: {
            messages: 5000,
            contacts: 1000,
            whatsappAccounts: 2,
            templates: 20,
            campaigns: true,
            automation: false,
            crm: true,
            analytics: true,
            support: "Email + Chat",
            historyDays: 90,
          },
          isActive: true,
        },
        {
          name: "Professional",
          description: "Advanced features for growing companies",
          price: 14900,
          billingCycle: "MONTHLY",
          features: {
            messages: 25000,
            contacts: 10000,
            whatsappAccounts: 5,
            templates: 100,
            campaigns: true,
            automation: true,
            crm: true,
            analytics: true,
            support: "Priority",
            historyDays: 365,
          },
          isActive: true,
        },
        {
          name: "Enterprise",
          description: "Unlimited features for large organizations",
          price: 49900,
          billingCycle: "MONTHLY",
          features: {
            messages: -1,
            contacts: -1,
            whatsappAccounts: -1,
            templates: -1,
            campaigns: true,
            automation: true,
            crm: true,
            analytics: true,
            support: "Dedicated",
            historyDays: -1,
          },
          isActive: true,
        },
      ],
    });
    console.log("[Init DB] Subscription plans created");

    console.log("[Init DB] ✅ Database initialization completed successfully");
    return res.status(200).json({
      success: true,
      message: "Database initialized successfully",
      details: {
        tenant: systemTenant.name,
        roles: 4,
        plans: 4,
      },
    });

  } catch (error: any) {
    console.error("[Init DB] ❌ Database initialization error:", error);
    
    const errorMessage = error.message || "Unknown error occurred";
    const errorCode = error.code || "UNKNOWN";
    
    // Parse specific Prisma errors
    let userFriendlyMessage = errorMessage;
    let suggestions: string[] = [];

    if (errorCode === "P1000") {
      userFriendlyMessage = "Could not connect to the database server";
      suggestions = [
        "1. Check if PostgreSQL is running",
        "2. Verify DATABASE_URL in .env file",
        "3. Check username and password are correct",
        "4. Verify the database exists"
      ];
    } else if (errorCode === "P1001") {
      userFriendlyMessage = "Could not reach the database server";
      suggestions = [
        "1. Check database server is accessible",
        "2. Check network connectivity",
        "3. Verify hostname/IP address is correct"
      ];
    } else if (errorCode === "P1002") {
      userFriendlyMessage = "The database server timed out";
      suggestions = [
        "1. Check database server status",
        "2. Try again in a moment",
        "3. Check network stability"
      ];
    } else if (errorCode === "P1008") {
      userFriendlyMessage = "Operations timed out";
      suggestions = [
        "1. Try again - the database might be slow",
        "2. Check database server resources",
        "3. Try restarting the database"
      ];
    } else if (errorMessage.includes("does not exist")) {
      userFriendlyMessage = "Database or schema not found";
      suggestions = [
        "1. Create the database first",
        "2. Or run migrations: npx prisma migrate deploy"
      ];
    } else if (errorMessage.includes("permission denied")) {
      userFriendlyMessage = "Database permission denied";
      suggestions = [
        "1. Check database user permissions",
        "2. Ensure user can create tables",
        "3. Try with an admin user"
      ];
    }
    
    return res.status(500).json({
      error: "Database initialization failed",
      userMessage: userFriendlyMessage,
      details: errorMessage,
      code: errorCode,
      suggestions: suggestions,
      nextSteps: [
        "1. Check the error details above",
        "2. Fix the database configuration",
        "3. Run: npx prisma migrate deploy",
        "4. Try the installer again"
      ]
    });
  }
}