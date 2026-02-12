import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "GET") {
      await requireRole(["admin", "manager"], session);
      
      const campaigns = await prisma.campaign.findMany({
        where: { tenantId: session.tenantId },
        include: {
          template: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ campaigns });
    }

    if (req.method === "POST") {
      await requireRole(["admin", "manager"], session);
      
      const { templateId, name, scheduledAt, segmentConfig } = req.body;

      const campaign = await prisma.campaign.create({
        data: {
          tenantId: session.tenantId,
          templateId,
          name,
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
          segmentConfig,
          status: scheduledAt ? "scheduled" : "draft",
        },
      });

      return res.status(201).json(campaign);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500).json({ error: error.message });
  }
}