import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "GET") {
      const { stage, assignedUserId } = req.query;
      
      const where: any = { tenantId: session.tenantId };
      if (stage) where.stage = stage;
      if (assignedUserId) where.assignedUserId = assignedUserId;

      const deals = await prisma.deal.findMany({
        where,
        include: {
          contact: {
            select: {
              id: true,
              name: true,
              phoneNumber: true,
            },
          },
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ deals });
    }

    if (req.method === "POST") {
      const { contactId, title, value, stage, assignedUserId, expectedCloseDate } = req.body;

      const deal = await prisma.deal.create({
        data: {
          tenantId: session.tenantId,
          contactId,
          title,
          value: value ? parseFloat(value) : null,
          stage: stage || "lead",
          assignedUserId,
          expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
        },
        include: {
          contact: true,
          assignedUser: true,
        },
      });

      return res.status(201).json(deal);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : 500).json({ error: error.message });
  }
}