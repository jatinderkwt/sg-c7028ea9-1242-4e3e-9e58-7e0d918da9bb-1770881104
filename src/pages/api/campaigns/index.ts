import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "GET") {
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
      await requireRole(["super_admin", "admin", "manager"], session);
      
      const { name, templateId, segment, scheduleAt } = req.body;

      const campaign = await prisma.campaign.create({
        data: {
          tenantId: session.tenantId,
          name,
          templateId,
          segment,
          scheduleAt: scheduleAt ? new Date(scheduleAt) : null,
          status: scheduleAt ? "scheduled" : "draft",
        },
      });

      return res.status(201).json(campaign);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500).json({ error: error.message });
  }
}