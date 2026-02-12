import type { NextApiRequest, NextApiResponse } from "next";
import { isInstalled } from "@/lib/installer";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (isInstalled()) {
    return res.status(403).json({ error: "System is already installed" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Basic connectivity check was done in check-system
    // Here we might seed some initial data if needed, but strict roles/data are created in create-admin step
    // We can ensure the subscription plans exist

    // Create default plan if not exists
    const defaultPlan = await prisma.subscriptionPlan.findFirst({
        where: { name: "Enterprise Trial" }
    });

    if (!defaultPlan) {
        await prisma.subscriptionPlan.create({
            data: {
                name: "Enterprise Trial",
                description: "Full access trial for 14 days",
                price: 0,
                billingCycle: "monthly",
                features: {
                    maxUsers: 10,
                    maxContacts: 1000,
                    maxTemplates: 50,
                    apiAccess: true
                },
                isActive: true
            }
        });
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Init database error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: errorMessage });
  }
}