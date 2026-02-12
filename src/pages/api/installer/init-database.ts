import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { isInstalled } from "@/lib/installer";

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

  if (isInstalled()) {
    return res.status(400).json({ 
      error: "System already installed",
      details: "Database has already been initialized."
    });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Test connection
    const client = await pool.connect();
    
    // Check if data already exists
    const existingCheck = await client.query(
      `SELECT COUNT(*) as count FROM "Tenant";`
    );
    
    if (parseInt(existingCheck.rows[0].count) > 0) {
      client.release();
      await pool.end();
      return res.status(400).json({
        error: "Database already initialized",
        details: "Default data already exists."
      });
    }

    // Generate UUIDs
    const tenantId = crypto.randomUUID();
    const superAdminRoleId = crypto.randomUUID();
    const adminRoleId = crypto.randomUUID();
    const managerRoleId = crypto.randomUUID();
    const agentRoleId = crypto.randomUUID();

    // Start transaction
    await client.query("BEGIN");

    // Create default tenant
    await client.query(
      `INSERT INTO "Tenant" (id, name, domain, "isActive", "createdAt", "updatedAt", settings)
       VALUES ($1, $2, $3, $4, NOW(), NOW(), $5)`,
      [tenantId, "System", "system.local", true, "{}"]
    );

    // Create roles
    await client.query(
      `INSERT INTO "Role" (id, name, description, "tenantId", "createdAt", "updatedAt")
       VALUES 
       ($1, 'Super Admin', 'Full system access', $5, NOW(), NOW()),
       ($2, 'Admin', 'Tenant administration', $5, NOW(), NOW()),
       ($3, 'Manager', 'Team management', $5, NOW(), NOW()),
       ($4, 'Agent', 'Basic user access', $5, NOW(), NOW())`,
      [superAdminRoleId, adminRoleId, managerRoleId, agentRoleId, tenantId]
    );

    // Create permissions for Super Admin
    const superAdminPerms = [
      ["tenants", "create"], ["tenants", "read"], ["tenants", "update"], ["tenants", "delete"],
      ["users", "create"], ["users", "read"], ["users", "update"], ["users", "delete"],
      ["roles", "create"], ["roles", "read"], ["roles", "update"], ["roles", "delete"],
      ["contacts", "create"], ["contacts", "read"], ["contacts", "update"], ["contacts", "delete"],
      ["messages", "create"], ["messages", "read"],
      ["campaigns", "create"], ["campaigns", "read"], ["campaigns", "update"], ["campaigns", "delete"]
    ];

    for (const [resource, action] of superAdminPerms) {
      await client.query(
        `INSERT INTO "Permission" (id, "roleId", resource, action, "tenantId", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [crypto.randomUUID(), superAdminRoleId, resource, action, tenantId]
      );
    }

    // Create permissions for Admin
    const adminPerms = [
      ["users", "create"], ["users", "read"], ["users", "update"],
      ["contacts", "create"], ["contacts", "read"], ["contacts", "update"], ["contacts", "delete"],
      ["messages", "create"], ["messages", "read"],
      ["campaigns", "create"], ["campaigns", "read"]
    ];

    for (const [resource, action] of adminPerms) {
      await client.query(
        `INSERT INTO "Permission" (id, "roleId", resource, action, "tenantId", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [crypto.randomUUID(), adminRoleId, resource, action, tenantId]
      );
    }

    // Create permissions for Manager
    const managerPerms = [
      ["contacts", "read"], ["contacts", "update"],
      ["messages", "create"], ["messages", "read"],
      ["campaigns", "read"]
    ];

    for (const [resource, action] of managerPerms) {
      await client.query(
        `INSERT INTO "Permission" (id, "roleId", resource, action, "tenantId", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [crypto.randomUUID(), managerRoleId, resource, action, tenantId]
      );
    }

    // Create permissions for Agent
    const agentPerms = [
      ["contacts", "read"],
      ["messages", "create"], ["messages", "read"]
    ];

    for (const [resource, action] of agentPerms) {
      await client.query(
        `INSERT INTO "Permission" (id, "roleId", resource, action, "tenantId", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [crypto.randomUUID(), agentRoleId, resource, action, tenantId]
      );
    }

    // Create subscription plans
    const plans = [
      {
        name: "Free",
        description: "Basic plan for getting started",
        price: 0,
        billingCycle: "MONTHLY",
        features: JSON.stringify({
          messages: 500,
          contacts: 100,
          whatsappAccounts: 1,
          templates: 5,
          campaigns: false,
          automation: false,
          crm: false,
          analytics: false,
          support: "Email",
          historyDays: 30
        })
      },
      {
        name: "Starter",
        description: "Perfect for small businesses",
        price: 4900,
        billingCycle: "MONTHLY",
        features: JSON.stringify({
          messages: 5000,
          contacts: 1000,
          whatsappAccounts: 2,
          templates: 20,
          campaigns: true,
          automation: false,
          crm: true,
          analytics: true,
          support: "Email + Chat",
          historyDays: 90
        })
      },
      {
        name: "Professional",
        description: "Advanced features for growing companies",
        price: 14900,
        billingCycle: "MONTHLY",
        features: JSON.stringify({
          messages: 25000,
          contacts: 10000,
          whatsappAccounts: 5,
          templates: 100,
          campaigns: true,
          automation: true,
          crm: true,
          analytics: true,
          support: "Priority",
          historyDays: 365
        })
      },
      {
        name: "Enterprise",
        description: "Unlimited features for large organizations",
        price: 49900,
        billingCycle: "MONTHLY",
        features: JSON.stringify({
          messages: -1,
          contacts: -1,
          whatsappAccounts: -1,
          templates: -1,
          campaigns: true,
          automation: true,
          crm: true,
          analytics: true,
          support: "Dedicated",
          historyDays: -1
        })
      }
    ];

    for (const plan of plans) {
      await client.query(
        `INSERT INTO "SubscriptionPlan" (id, name, description, price, "billingCycle", features, "isActive", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [crypto.randomUUID(), plan.name, plan.description, plan.price, plan.billingCycle, plan.features, true]
      );
    }

    // Commit transaction
    await client.query("COMMIT");
    
    client.release();
    await pool.end();

    return res.status(200).json({
      success: true,
      message: "Database initialized successfully",
      details: {
        tenant: "System",
        roles: 4,
        permissions: 22,
        plans: 4
      }
    });

  } catch (error: any) {
    await pool.end();
    
    console.error("Database initialization error:", error);

    return res.status(500).json({
      error: "Database initialization failed",
      details: error.message || "Unknown error occurred",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
}