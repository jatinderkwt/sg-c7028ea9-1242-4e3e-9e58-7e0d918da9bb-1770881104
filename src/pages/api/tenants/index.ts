import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "GET") {
      await requireRole(["super_admin"], session);
      
      const tenants = await prisma.tenant.findMany({
        include: {
          subscription: {
            include: {
              plan: true,
            },
          },
          _count: {
            select: {
              users: true,
              contacts: true,
              conversations: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ tenants });
    }

    if (req.method === "POST") {
      await requireRole(["super_admin"], session);
      
      const { name, email, domain, settings } = req.body;

      const tenant = await prisma.tenant.create({
        data: {
          name,
          email,
          domain,
          settings: settings || {},
          isActive: true,
        },
      });

      return res.status(201).json(tenant);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500).json({ error: error.message });
  }
}