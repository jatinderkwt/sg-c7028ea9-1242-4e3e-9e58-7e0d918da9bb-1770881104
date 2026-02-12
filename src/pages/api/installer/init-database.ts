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
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;

    // Step 2: Check if tables exist
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' AND tablename = 'SubscriptionPlan'
    `;

    const hasTables = tables.length > 0;

    if (!hasTables) {
      return res.status(500).json({
        error: "Database tables not initialized",
        details: "Please run: npx prisma migrate deploy",
        instructions: [
          "1. Run: npx prisma migrate deploy",
          "2. Then try initializing again",
          "3. Or manually run: npm run setup:db"
        ]
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
    const systemTenant = await prisma.tenant.create({
      data: {
        name: "System",
        domain: "system.local",
        isActive: true,
      },
    });

    // Step 5: Create Roles with Permissions
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

    // Step 6: Create Subscription Plans
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
    console.error("Database initialization error:", error);

    const errorMessage = error.message || "Unknown error occurred";
    
    return res.status(500).json({
      error: "Database initialization failed",
      details: errorMessage,
      code: error.code,
    });
  }
}