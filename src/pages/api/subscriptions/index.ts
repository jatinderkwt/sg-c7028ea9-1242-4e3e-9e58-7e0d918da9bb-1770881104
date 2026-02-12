import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "GET") {
      await requireRole(["super_admin"], session);
      
      const subscriptions = await prisma.subscription.findMany({
        include: {
          tenant: {
            select: {
              name: true,
              email: true,
            },
          },
          plan: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ subscriptions });
    }

    if (req.method === "POST") {
      await requireRole(["super_admin"], session);
      
      const { tenantId, planId, startDate, endDate, status } = req.body;

      const subscription = await prisma.subscription.create({
        data: {
          tenantId,
          planId,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          status: status || "active",
          autoRenew: true,
        },
        include: {
          tenant: true,
          plan: true,
        },
      });

      return res.status(201).json(subscription);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500).json({ error: error.message });
  }
}