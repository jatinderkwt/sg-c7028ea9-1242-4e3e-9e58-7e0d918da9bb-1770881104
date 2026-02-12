import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { metaAPI } from "@/lib/services/meta-api.service";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "POST") {
      const { templateId } = req.body;

      const template = await prisma.template.findUnique({
        where: { id: templateId },
      });

      if (!template || template.tenantId !== session.tenantId) {
        return res.status(404).json({ error: "Template not found" });
      }

      if (!template.metaId) {
        return res.status(400).json({ error: "Template not submitted to Meta" });
      }

      // Get WhatsApp account for businessAccountId
      const whatsappAccount = await prisma.whatsAppAccount.findUnique({
        where: { tenantId: session.tenantId },
      });

      if (!whatsappAccount) {
        return res.status(400).json({ error: "WhatsApp account not configured" });
      }

      const status = await metaAPI.getTemplateStatus(
        whatsappAccount.wabaId,
        template.name
      );

      // Update local status
      const updated = await prisma.template.update({
        where: { id: templateId },
        data: { status: status.status },
      });

      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : 500).json({ error: error.message });
  }
}