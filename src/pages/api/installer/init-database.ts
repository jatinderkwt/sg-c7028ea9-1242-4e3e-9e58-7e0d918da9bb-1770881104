import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { isInstalled } from "@/lib/installer";

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

  const prisma = new PrismaClient();

  try {
    // Step 1: Test database connection with a timeout
    const connectionPromise = prisma.$connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Database connection timed out")), 5000)
    );
    
    await Promise.race([connectionPromise, timeoutPromise]);
    await prisma.$executeRaw`SELECT 1`;

    // Step 2: Check if tables exist
    // This query checks specifically for the SubscriptionPlan table in the public schema
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' AND tablename = 'SubscriptionPlan'
    `;

    const hasTables = tables.length > 0;

    if (!hasTables) {
      // Tables don't exist - return 400 with specific instructions
      // We do NOT try to run migrations here to avoid timeouts/crashes
      return res.status(400).json({
        error: "Database schema not initialized",
        details: "The database tables have not been created yet.",
        instructions: [
          "1. Go to your Dokploy Dashboard",
          "2. Edit the DATABASE_URL environment variable",
          "3. Append '?schema=public' to the end of the URL",
          "   Example: postgresql://user:pass@host:port/db?schema=public",
          "4. Save and Redeploy the application",
          "5. If tables are still not created, run 'npx prisma db push' in the Dokploy terminal"
        ],
        requiresAction: true
      });
    }

    // Step 3: Check for existing data
    const existingTenant = await prisma.tenant.findFirst();
    
    if (existingTenant) {
      return res.status(400).json({
        error: "Database already initialized",
        details: "Default data already exists in the database."
      });
    }

    // Step 4: Create System Tenant
    // Schema: name, domain, isActive (default true)
    const systemTenant = await prisma.tenant.create({
      data: {
        name: "System",
        domain: "system.local",
        isActive: true,
      },
    });

    // Step 5: Define Permissions
    const rolePermissions = {
      superAdmin: [
        { resource: "tenants", action: "create" },
        { resource: "tenants", action: "read" },
        { resource: "tenants", action: "update" },
        { resource: "tenants", action: "delete" },
        { resource: "users", action: "create" },
        { resource: "users", action: "read" },
        { resource: "users", action: "update" },
        { resource: "users", action: "delete" },
        { resource: "roles", action: "create" },
        { resource: "roles", action: "read" },
        { resource: "roles", action: "update" },
        { resource: "roles", action: "delete" },
        { resource: "contacts", action: "create" },
        { resource: "contacts", action: "read" },
        { resource: "contacts", action: "update" },
        { resource: "contacts", action: "delete" },
        { resource: "messages", action: "create" },
        { resource: "messages", action: "read" },
        { resource: "campaigns", action: "create" },
        { resource: "campaigns", action: "read" },
        { resource: "campaigns", action: "update" },
        { resource: "campaigns", action: "delete" },
      ],
      admin: [
        { resource: "users", action: "create" },
        { resource: "users", action: "read" },
        { resource: "users", action: "update" },
        { resource: "contacts", action: "create" },
        { resource: "contacts", action: "read" },
        { resource: "contacts", action: "update" },
        { resource: "contacts", action: "delete" },
        { resource: "messages", action: "create" },
        { resource: "messages", action: "read" },
        { resource: "campaigns", action: "create" },
        { resource: "campaigns", action: "read" },
      ],
      manager: [
        { resource: "contacts", action: "read" },
        { resource: "contacts", action: "update" },
        { resource: "messages", action: "create" },
        { resource: "messages", action: "read" },
        { resource: "campaigns", action: "read" },
      ],
      agent: [
        { resource: "contacts", action: "read" },
        { resource: "messages", action: "create" },
        { resource: "messages", action: "read" },
      ],
    };

    // Helper to map permissions
    const createPermissions = (roleType: keyof typeof rolePermissions) => {
      return {
        create: rolePermissions[roleType].map(p => ({
          resource: p.resource,
          action: p.action,
          tenantId: systemTenant.id,
        })),
      };
    };

    // Create roles
    await prisma.role.create({
      data: {
        name: "Super Admin",
        tenantId: systemTenant.id,
        permissions: createPermissions("superAdmin"),
      },
    });

    await prisma.role.create({
      data: {
        name: "Admin",
        tenantId: systemTenant.id,
        permissions: createPermissions("admin"),
      },
    });

    await prisma.role.create({
      data: {
        name: "Manager",
        tenantId: systemTenant.id,
        permissions: createPermissions("manager"),
      },
    });

    await prisma.role.create({
      data: {
        name: "Agent",
        tenantId: systemTenant.id,
        permissions: createPermissions("agent"),
      },
    });

    // Step 6: Create Subscription Plans
    // Schema: name, description, price, billingCycle, features, isActive
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
          price: 4900, // Cents
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
          price: 14900, // Cents
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
          price: 49900, // Cents
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

    await prisma.$disconnect();

    return res.status(200).json({
      success: true,
      message: "Database initialized successfully",
      details: {
        tenant: systemTenant.name,
        roles: 4,
        permissions: 22,
        plans: 4,
      },
    });

  } catch (error: any) {
    await prisma.$disconnect();
    
    console.error("Database initialization error:", error);

    const errorMessage = error.message || "Unknown error occurred";
    
    return res.status(500).json({
      error: "Database initialization failed",
      details: errorMessage,
      code: error.code,
    });
  }
}