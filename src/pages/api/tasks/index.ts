import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "GET") {
      const { status, assignedUserId } = req.query;
      
      const where: any = { tenantId: session.tenantId };
      if (status) where.status = status;
      if (assignedUserId) where.assignedUserId = assignedUserId;

      const tasks = await prisma.task.findMany({
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
        orderBy: { dueDate: "asc" },
      });

      return res.status(200).json({ tasks });
    }

    if (req.method === "POST") {
      const { contactId, title, description, type, priority, dueDate, assignedUserId } = req.body;

      const task = await prisma.task.create({
        data: {
          tenantId: session.tenantId,
          contactId,
          title,
          description,
          type: type || "general",
          priority: priority || "medium",
          status: "pending",
          dueDate: dueDate ? new Date(dueDate) : null,
          assignedUserId,
        },
        include: {
          contact: true,
          assignedUser: true,
        },
      });

      return res.status(201).json(task);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : 500).json({ error: error.message });
  }
}