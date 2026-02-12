import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "GET") {
      const { status } = req.query;
      
      const where: any = { tenantId: session.tenantId };
      if (status) where.status = status;

      const templates = await prisma.template.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ templates });
    }

    if (req.method === "POST") {
      const { name, category, language, components } = req.body;

      const template = await prisma.template.create({
        data: {
          tenantId: session.tenantId,
          name,
          category,
          language,
          components,
          status: "pending",
        },
      });

      return res.status(201).json(template);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : 500).json({ error: error.message });
  }
}