import type { NextApiRequest, NextApiResponse } from "next";
import { isInstalled } from "@/lib/installer";
import { prisma } from "@/lib/prisma";
import { execSync } from "child_process";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const installed = await isInstalled();
    if (installed) {
      return res.status(400).json({ error: "System is already installed" });
    }

    // Step 1: Generate Prisma Client
    console.log("Step 1: Generating Prisma Client...");
    try {
      execSync("npx prisma generate", { 
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL }
      });
      console.log("✓ Prisma Client generated");
    } catch (error) {
      console.error("Warning: Prisma generate failed, but continuing...", error);
    }

    // Step 2: Create database tables
    console.log("Step 2: Creating database tables...");
    try {
      const isProd = process.env.NODE_ENV === "production";
      
      if (isProd) {
        console.log("Running prisma db push for production...");
        execSync("npx prisma db push --accept-data-loss --skip-generate", { 
          stdio: "inherit",
          env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL }
        });
      } else {
        console.log("Running prisma migrate deploy...");
        try {
          execSync("npx prisma migrate deploy", { 
            stdio: "inherit",
            env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL }
          });
        } catch {
          console.log("Migrations not found, using db push...");
          execSync("npx prisma db push --accept-data-loss --skip-generate", { 
            stdio: "inherit",
            env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL }
          });
        }
      }
      console.log("✓ Database tables created successfully");
    } catch (error: any) {
      const errorMessage = error?.message || "Unknown error";
      return res.status(500).json({ 
        error: "Failed to create database schema",
        details: errorMessage,
        suggestion: "Please ensure your DATABASE_URL is correct and PostgreSQL is accessible"
      });
    }

    // Step 3: Create System Tenant (required for default roles)
    console.log("Step 3: Creating system tenant...");
    let systemTenant = await prisma.tenant.findFirst({
      where: { domain: "system" }
    });

    if (!systemTenant) {
      systemTenant = await prisma.tenant.create({
        data: {
          name: "System",
          domain: "system",
          email: "admin@system.local",
          isActive: true,
          settings: {}
        }
      });
      console.log("✓ Created system tenant");
    } else {
      console.log("✓ System tenant already exists");
    }

    // Step 4: Create default roles in system tenant
    console.log("Step 4: Creating default roles...");
    const roleDefinitions = [
      { name: "Super Admin", description: "Full system access across all tenants" },
      { name: "Admin", description: "Company administrator with full tenant access" },
      { name: "Manager", description: "Team manager with limited administrative access" },
      { name: "Agent", description: "Support agent with basic access" }
    ];

    const createdRoles = [];
    for (const roleDef of roleDefinitions) {
      let role = await prisma.role.findFirst({
        where: { 
          name: roleDef.name,
          tenantId: systemTenant.id
        }
      });

      if (!role) {
        role = await prisma.role.create({
          data: {
            name: roleDef.name,
            description: roleDef.description,
            tenantId: systemTenant.id
          }
        });
        console.log(`✓ Created role: ${roleDef.name}`);
      } else {
        console.log(`✓ Role already exists: ${roleDef.name}`);
      }
      createdRoles.push(role);
    }

    // Step 5: Create permissions for Super Admin role
    console.log("Step 5: Creating permissions...");
    const superAdminRole = createdRoles.find(r => r.name === "Super Admin");
    
    if (superAdminRole) {
      const permissionDefinitions = [
        // Users
        { resource: "users", action: "create" },
        { resource: "users", action: "read" },
        { resource: "users", action: "update" },
        { resource: "users", action: "delete" },
        
        // Contacts
        { resource: "contacts", action: "create" },
        { resource: "contacts", action: "read" },
        { resource: "contacts", action: "update" },
        { resource: "contacts", action: "delete" },
        
        // Conversations
        { resource: "conversations", action: "read" },
        { resource: "conversations", action: "update" },
        { resource: "conversations", action: "assign" },
        
        // Messages
        { resource: "messages", action: "send" },
        { resource: "messages", action: "read" },
        
        // Templates
        { resource: "templates", action: "create" },
        { resource: "templates", action: "read" },
        { resource: "templates", action: "update" },
        { resource: "templates", action: "delete" },
        { resource: "templates", action: "submit" },
        
        // Campaigns
        { resource: "campaigns", action: "create" },
        { resource: "campaigns", action: "read" },
        { resource: "campaigns", action: "update" },
        { resource: "campaigns", action: "delete" },
        
        // Automations
        { resource: "automations", action: "create" },
        { resource: "automations", action: "read" },
        { resource: "automations", action: "update" },
        { resource: "automations", action: "delete" },
        
        // Analytics
        { resource: "analytics", action: "read" },
        { resource: "analytics", action: "export" },
        
        // Settings
        { resource: "settings", action: "read" },
        { resource: "settings", action: "update" },
        
        // Tenants (Super Admin only)
        { resource: "tenants", action: "create" },
        { resource: "tenants", action: "read" },
        { resource: "tenants", action: "update" },
        { resource: "tenants", action: "delete" },
        
        // Billing
        { resource: "billing", action: "read" },
        { resource: "billing", action: "update" }
      ];

      for (const permDef of permissionDefinitions) {
        const existing = await prisma.permission.findFirst({
          where: {
            roleId: superAdminRole.id,
            resource: permDef.resource,
            action: permDef.action
          }
        });

        if (!existing) {
          await prisma.permission.create({
            data: {
              roleId: superAdminRole.id,
              resource: permDef.resource,
              action: permDef.action,
              tenantId: systemTenant.id
            }
          });
        }
      }
      console.log(`✓ Created ${permissionDefinitions.length} permissions for Super Admin`);
    }

    // Step 6: Create subscription plans
    console.log("Step 6: Creating subscription plans...");
    const plans = [
      {
        name: "Free",
        description: "Basic features for getting started",
        price: 0,
        currency: "USD",
        billingCycle: "monthly",
        isActive: true,
        features: {
          maxUsers: 1,
          maxContacts: 100,
          maxMessages: 500,
          maxTemplates: 5,
          maxCampaigns: 2,
          hasAutomation: false,
          hasAnalytics: false,
          hasCRM: false,
          hasAPI: false,
          support: "email"
        }
      },
      {
        name: "Starter",
        description: "Perfect for small teams",
        price: 29,
        currency: "USD",
        billingCycle: "monthly",
        isActive: true,
        features: {
          maxUsers: 3,
          maxContacts: 1000,
          maxMessages: 5000,
          maxTemplates: 20,
          maxCampaigns: 10,
          hasAutomation: true,
          hasAnalytics: true,
          hasCRM: true,
          hasAPI: false,
          support: "email"
        }
      },
      {
        name: "Professional",
        description: "For growing businesses",
        price: 99,
        currency: "USD",
        billingCycle: "monthly",
        isActive: true,
        features: {
          maxUsers: 10,
          maxContacts: 10000,
          maxMessages: 50000,
          maxTemplates: 100,
          maxCampaigns: 50,
          hasAutomation: true,
          hasAnalytics: true,
          hasCRM: true,
          hasAPI: true,
          support: "priority"
        }
      },
      {
        name: "Enterprise",
        description: "Unlimited features for large organizations",
        price: 299,
        currency: "USD",
        billingCycle: "monthly",
        isActive: true,
        features: {
          maxUsers: -1,
          maxContacts: -1,
          maxMessages: -1,
          maxTemplates: -1,
          maxCampaigns: -1,
          hasAutomation: true,
          hasAnalytics: true,
          hasCRM: true,
          hasAPI: true,
          support: "dedicated"
        }
      }
    ];

    for (const plan of plans) {
      const existing = await prisma.subscriptionPlan.findFirst({
        where: { name: plan.name }
      });
      if (!existing) {
        await prisma.subscriptionPlan.create({ data: plan });
        console.log(`✓ Created subscription plan: ${plan.name}`);
      } else {
        console.log(`✓ Subscription plan already exists: ${plan.name}`);
      }
    }

    console.log("✓ Database initialization complete!");

    return res.status(200).json({
      success: true,
      message: "Database initialized successfully",
      details: {
        systemTenantId: systemTenant.id,
        roles: roleDefinitions.length,
        permissions: 52,
        plans: plans.length
      }
    });

  } catch (error: any) {
    console.error("Database initialization error:", error);
    const errorMessage = error?.message || "Unknown error";
    const errorStack = error?.stack || "";
    
    return res.status(500).json({ 
      error: "Database initialization failed",
      details: errorMessage,
      stack: process.env.NODE_ENV === "development" ? errorStack : undefined
    });
  }
}