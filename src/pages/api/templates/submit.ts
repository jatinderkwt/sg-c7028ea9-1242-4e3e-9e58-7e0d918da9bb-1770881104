import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { metaAPI } from "@/lib/services/meta-api.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await requireAuth(req);
    await requireRole(["admin", "manager"], session);

    const { templateId } = req.body;

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: {
        tenant: {
          include: {
            whatsappAccount: true,
          },
        },
      },
    });

    if (!template || template.tenantId !== session.tenantId) {
      return res.status(404).json({ error: "Template not found" });
    }

    const whatsappAccount = template.tenant.whatsappAccount;

    if (!whatsappAccount) {
      return res.status(400).json({ error: "WhatsApp account not configured" });
    }

    try {
      const metaResponse = await metaAPI.createTemplate({
        businessAccountId: whatsappAccount.wabaId,
        accessToken: whatsappAccount.accessToken,
        name: template.name,
        category: template.category,
        language: template.language,
        components: template.components as any[], // Cast JsonValue to any[]
      });

      await prisma.template.update({
        where: { id: templateId },
        data: {
          metaId: metaResponse.templateId,
          status: "PENDING",
        },
      });

      return res.status(200).json({ success: true, templateId: metaResponse.templateId });
    } catch (metaError: any) {
      console.error("Meta API Error:", metaError);
      return res.status(400).json({ error: "Failed to submit to Meta", details: metaError.message });
    }
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500).json({ error: error.message });
  }
}