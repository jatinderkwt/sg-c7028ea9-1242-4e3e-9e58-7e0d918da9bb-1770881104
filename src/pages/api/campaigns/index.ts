import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireRole(["admin", "manager"]);

    if (req.method === "GET") {
      const campaigns = await prisma.campaign.findMany({
        where: { tenantId: session.tenantId },
        include: {
          template: true,
          whatsappAccount: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ campaigns });
    }

    if (req.method === "POST") {
      const { whatsappAccountId, templateId, name, segmentTags, segmentCustomFields, scheduledAt } =
        req.body;

      if (!whatsappAccountId || !templateId || !name) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const template = await prisma.template.findUnique({
        where: { id: templateId },
      });

      if (!template || template.tenantId !== session.tenantId || template.status !== "approved") {
        return res.status(400).json({ error: "Invalid or unapproved template" });
      }

      const campaign = await prisma.campaign.create({
        data: {
          tenantId: session.tenantId,
          whatsappAccountId,
          templateId,
          name,
          segmentTags: segmentTags || [],
          segmentCustomFields: segmentCustomFields || {},
          scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        },
      });

      return res.status(201).json(campaign);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("Campaigns API error:", error);
    return res.status(error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500).json({ error: error.message });
  }
}