import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { metaAPI } from "@/lib/services/meta-api.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await requireAuth();
    const { templateId } = req.query;

    if (!templateId) {
      return res.status(400).json({ error: "Template ID is required" });
    }

    const template = await prisma.template.findUnique({
      where: { id: templateId as string },
      include: { whatsappAccount: true },
    });

    if (!template || template.tenantId !== session.tenantId) {
      return res.status(404).json({ error: "Template not found" });
    }

    if (!template.metaTemplateId) {
      return res.status(400).json({ error: "Template not submitted to Meta" });
    }

    try {
      const status = await metaAPI.getTemplateStatus({
        businessAccountId: template.whatsappAccount.businessAccountId,
        accessToken: template.whatsappAccount.accessToken,
        templateName: template.name,
      });

      await prisma.template.update({
        where: { id: templateId as string },
        data: {
          status: status.status,
          rejectionReason: status.rejectionReason,
        },
      });

      return res.status(200).json(status);
    } catch (error: any) {
      console.error("Template status check error:", error);
      return res.status(500).json({ error: error.message });
    }
  } catch (error: any) {
    console.error("Template status API error:", error);
    return res.status(error.message === "Unauthorized" ? 401 : 500).json({ error: error.message });
  }
}