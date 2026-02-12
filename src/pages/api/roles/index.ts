import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "GET") {
      await requireRole(["super_admin", "admin"], session);
      
      const roles = await prisma.role.findMany({
        where: { tenantId: session.tenantId },
        include: {
          permissions: true,
          _count: {
            select: { users: true },
          },
        },
        orderBy: { name: "asc" },
      });

      return res.status(200).json({ roles });
    }

    if (req.method === "POST") {
      await requireRole(["super_admin", "admin"], session);
      
      const { name, description, permissions } = req.body;

      const role = await prisma.role.create({
        data: {
          tenantId: session.tenantId,
          name,
          description,
          permissions: {
            create: permissions.map((p: string) => ({
              permission: p,
              tenantId: session.tenantId,
            })),
          },
        },
        include: { permissions: true },
      });

      return res.status(201).json(role);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500).json({ error: error.message });
  }
}