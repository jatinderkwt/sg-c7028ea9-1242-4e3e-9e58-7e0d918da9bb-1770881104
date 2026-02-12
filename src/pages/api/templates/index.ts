import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { metaAPI } from "@/lib/services/meta-api.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth();

    if (req.method === "GET") {
      const { whatsappAccountId, status } = req.query;

      const where: any = {
        tenantId: session.tenantId,
      };

      if (whatsappAccountId) {
        where.whatsappAccountId = whatsappAccountId;
      }

      if (status) {
        where.status = status;
      }

      const templates = await prisma.template.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ templates });
    }

    if (req.method === "POST") {
      const { whatsappAccountId, name, category, language, components } = req.body;

      if (!whatsappAccountId || !name || !category || !components) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const whatsappAccount = await prisma.whatsAppAccount.findUnique({
        where: { id: whatsappAccountId },
      });

      if (!whatsappAccount || whatsappAccount.tenantId !== session.tenantId) {
        return res.status(404).json({ error: "WhatsApp account not found" });
      }

      const template = await prisma.template.create({
        data: {
          tenantId: session.tenantId,
          whatsappAccountId,
          name,
          category,
          language: language || "en",
          components,
          status: "pending",
        },
      });

      return res.status(201).json(template);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("Templates API error:", error);
    return res.status(error.message === "Unauthorized" ? 401 : 500).json({ error: error.message });
  }
}