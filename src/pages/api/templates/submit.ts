import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { metaAPI } from "@/lib/services/meta-api.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await requireRole(["admin", "manager"]);

    const { templateId } = req.body;

    if (!templateId) {
      return res.status(400).json({ error: "Template ID is required" });
    }

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: { whatsappAccount: true },
    });

    if (!template || template.tenantId !== session.tenantId) {
      return res.status(404).json({ error: "Template not found" });
    }

    if (template.status !== "pending") {
      return res.status(400).json({ error: "Template already submitted" });
    }

    try {
      const result = await metaAPI.createTemplate({
        businessAccountId: template.whatsappAccount.businessAccountId,
        accessToken: template.whatsappAccount.accessToken,
        name: template.name,
        category: template.category,
        language: template.language,
        components: template.components as any[],
      });

      await prisma.template.update({
        where: { id: templateId },
        data: {
          metaTemplateId: result.templateId,
          status: "submitted",
        },
      });

      return res.status(200).json({ success: true, templateId: result.templateId });
    } catch (error: any) {
      await prisma.template.update({
        where: { id: templateId },
        data: {
          status: "failed",
          rejectionReason: error.message,
        },
      });

      throw error;
    }
  } catch (error: any) {
    console.error("Template submit error:", error);
    return res.status(error.message === "Unauthorized" ? 401 : 500).json({ error: error.message });
  }
}