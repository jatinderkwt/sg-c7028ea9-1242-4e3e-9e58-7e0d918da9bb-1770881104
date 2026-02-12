import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "GET") {
      // Get user's subscription
      const subscription = await prisma.subscription.findUnique({
        where: { tenantId: session.tenantId },
        include: {
          plan: true,
        },
      });

      if (!subscription) {
        return res.status(404).json({ error: "No active subscription" });
      }

      return res.status(200).json(subscription);
    }

    if (req.method === "POST") {
      // Update subscription (e.g., upgrade/downgrade)
      const { planId } = req.body;

      if (!planId) {
        return res.status(400).json({ error: "Plan ID is required" });
      }

      // Verify plan exists
      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId },
      });

      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }

      // Update subscription
      const subscription = await prisma.subscription.update({
        where: { tenantId: session.tenantId },
        data: {
          planId,
          updatedAt: new Date(),
        },
        include: { plan: true },
      });

      return res.status(200).json(subscription);
    }

    if (req.method === "DELETE") {
      // Cancel subscription
      const subscription = await prisma.subscription.update({
        where: { tenantId: session.tenantId },
        data: {
          status: "cancelled",
          endDate: new Date(),
          updatedAt: new Date(),
        },
      });

      return res.status(200).json(subscription);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Billing error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
