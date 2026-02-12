import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "GET") {
      const { status, assignedUserId, limit, offset } = req.query;

      const where: any = {
        tenantId: session.tenantId,
      };

      if (status) {
        where.status = status;
      }

      if (assignedUserId) {
        where.assignedUserId = assignedUserId;
      }

      const conversations = await prisma.conversation.findMany({
        where,
        include: {
          contact: true,
          assignedTo: true,
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { lastMessageAt: "desc" },
        take: Number(limit),
        skip: Number(offset),
      });

      return res.status(200).json({ conversations });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("Conversations API error:", error);
    return res.status(error.message === "Unauthorized" ? 401 : 500).json({ error: error.message });
  }
}