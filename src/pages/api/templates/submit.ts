import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth, requireRole } from "@/lib/auth";
import { metaAPI } from "@/lib/services/meta-api.service";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "POST") {
      await requireRole(["super_admin", "admin", "manager"], session);

      const { templateId } = req.body;

      const template = await prisma.template.findUnique({
        where: { id: templateId },
      });

      if (!template || template.tenantId !== session.tenantId) {
        return res.status(404).json({ error: "Template not found" });
      }

      // Get WhatsApp account for WABA ID
      const whatsappAccount = await prisma.whatsAppAccount.findUnique({
        where: { tenantId: session.tenantId },
      });

      if (!whatsappAccount) {
        return res.status(400).json({ error: "WhatsApp account not configured" });
      }

      const metaResponse = await metaAPI.createTemplate({
        businessAccountId: whatsappAccount.wabaId,
        name: template.name,
        category: template.category,
        language: template.language,
        components: template.components as any[],
        accessToken: whatsappAccount.accessToken,
      });

      await prisma.template.update({
        where: { id: templateId },
        data: {
          status: "PENDING",
          metaId: metaResponse.id,
        },
      });

      return res.status(200).json({ success: true, metaId: metaResponse.id });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500).json({ error: error.message });
  }
}