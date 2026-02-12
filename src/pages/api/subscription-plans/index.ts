import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "GET") {
      const plans = await prisma.subscriptionPlan.findMany({
        where: { isActive: true },
        orderBy: { price: "asc" },
      });

      return res.status(200).json({ plans });
    }

    if (req.method === "POST") {
      await requireRole(["super_admin"], session);
      
      const { name, description, price, billingCycle, features } = req.body;

      const plan = await prisma.subscriptionPlan.create({
        data: {
          name,
          description,
          price,
          billingCycle,
          features,
          isActive: true,
        },
      });

      return res.status(201).json(plan);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500).json({ error: error.message });
  }
}