import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { metaAPI } from "@/lib/services/meta-api.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "GET") {
      const { templateId } = req.query;

      const template = await prisma.template.findUnique({
        where: { id: templateId as string },
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

      if (!whatsappAccount || !template.name) {
         // If not submitted yet or no account
         return res.status(200).json({ status: template.status });
      }

      // Sync with Meta
      try {
        const metaStatus = await metaAPI.getTemplateStatus({
          businessAccountId: whatsappAccount.wabaId,
          accessToken: whatsappAccount.accessToken,
          templateName: template.name
        });

        const updated = await prisma.template.update({
          where: { id: template.id },
          data: {
            status: metaStatus.status,
            // rejectionReason is not in schema, ignoring it
          },
        });

        return res.status(200).json({ 
          status: updated.status,
          // rejectionReason: updated.rejectionReason 
        });

      } catch (error) {
        console.error("Meta sync error", error);
        return res.status(200).json({ status: template.status, error: "Sync failed" });
      }
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : 500).json({ error: error.message });
  }
}