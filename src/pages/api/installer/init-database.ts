import type { NextApiRequest, NextApiResponse } from "next";
import { isInstalled } from "@/lib/installer";
import { prisma } from "@/lib/prisma";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (isInstalled()) {
    return res.status(403).json({ error: "System already installed" });
  }

  try {
    await execAsync("npx prisma migrate deploy");

    const rolesData = [
      { name: "super_admin", description: "Super Administrator", permissions: ["*"] },
      { name: "admin", description: "Tenant Administrator", permissions: ["manage_users", "manage_settings", "manage_whatsapp", "manage_templates", "manage_campaigns", "view_reports"] },
      { name: "manager", description: "Manager", permissions: ["view_conversations", "assign_conversations", "view_reports", "manage_contacts"] },
      { name: "agent", description: "Agent", permissions: ["handle_conversations", "send_messages", "view_contacts"] },
      { name: "viewer", description: "Viewer", permissions: ["view_conversations", "view_contacts"] },
    ];

    for (const role of rolesData) {
      await prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: role as any,
      });
    }

    const plansData = [
      {
        name: "Free Trial",
        price: 0,
        billingCycle: "monthly" as const,
        features: {
          maxUsers: 2,
          maxWhatsAppAccounts: 1,
          monthlyMessageQuota: 1000,
          maxAutomations: 3,
          maxCampaigns: 5,
          crmEnabled: true,
          analyticsEnabled: false,
          apiAccess: false,
          customBranding: false,
          prioritySupport: false,
        },
        isActive: true,
      },
      {
        name: "Starter",
        price: 49,
        billingCycle: "monthly" as const,
        features: {
          maxUsers: 5,
          maxWhatsAppAccounts: 2,
          monthlyMessageQuota: 10000,
          maxAutomations: 10,
          maxCampaigns: 20,
          crmEnabled: true,
          analyticsEnabled: true,
          apiAccess: false,
          customBranding: false,
          prioritySupport: false,
        },
        isActive: true,
      },
      {
        name: "Professional",
        price: 149,
        billingCycle: "monthly" as const,
        features: {
          maxUsers: 20,
          maxWhatsAppAccounts: 5,
          monthlyMessageQuota: 50000,
          maxAutomations: 50,
          maxCampaigns: 100,
          crmEnabled: true,
          analyticsEnabled: true,
          apiAccess: true,
          customBranding: true,
          prioritySupport: false,
        },
        isActive: true,
      },
      {
        name: "Enterprise",
        price: 499,
        billingCycle: "monthly" as const,
        features: {
          maxUsers: -1,
          maxWhatsAppAccounts: -1,
          monthlyMessageQuota: -1,
          maxAutomations: -1,
          maxCampaigns: -1,
          crmEnabled: true,
          analyticsEnabled: true,
          apiAccess: true,
          customBranding: true,
          prioritySupport: true,
        },
        isActive: true,
      },
    ];

    for (const plan of plansData) {
      await prisma.subscriptionPlan.upsert({
        where: { name: plan.name },
        update: {},
        create: plan as any,
      });
    }

    return res.status(200).json({ 
      success: true,
      message: "Database initialized successfully",
      rolesCreated: rolesData.length,
      plansCreated: plansData.length,
    });
  } catch (error: unknown) {
    console.error("Database init error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: errorMessage });
  }
}