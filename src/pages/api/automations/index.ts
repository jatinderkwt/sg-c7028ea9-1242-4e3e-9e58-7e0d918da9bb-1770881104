import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "GET") {
      await requireRole(["super_admin", "admin", "manager"], session);
      
      const automations = await prisma.automation.findMany({
        where: { tenantId: session.tenantId },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ automations });
    }

    if (req.method === "POST") {
      await requireRole(["super_admin", "admin", "manager"], session);
      
      const { name, description, trigger, conditions, actions, isActive } = req.body;

      const automation = await prisma.automation.create({
        data: {
          tenantId: session.tenantId,
          name,
          description,
          trigger,
          conditions: conditions || {},
          actions,
          isActive: isActive !== false,
        },
      });

      return res.status(201).json(automation);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500).json({ error: error.message });
  }
}