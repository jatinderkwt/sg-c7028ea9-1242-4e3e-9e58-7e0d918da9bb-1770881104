import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "GET") {
      await requireRole(["super_admin", "admin", "manager"], session);
      
      // Removed complex include/select that was causing type issues
      // Returning just necessary fields
      const users = await prisma.user.findMany({
        where: { tenantId: session.tenantId },
        select: {
          id: true,
          email: true,
          name: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          role: {
             select: {
                 id: true,
                 name: true,
                 description: true,
             }
          }
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ users });
    }

    if (req.method === "POST") {
      await requireRole(["super_admin", "admin"], session);
      
      const { email, name, password, roleId } = req.body;

      const existingUser = await prisma.user.findFirst({
        where: { email, tenantId: session.tenantId },
      });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          tenantId: session.tenantId,
          email,
          name,
          password: hashedPassword,
          roleId,
          isActive: true,
        },
        include: {
          role: true,
        },
      });

      const { password: _, ...userWithoutPassword } = user;

      return res.status(201).json(userWithoutPassword);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : error.message === "Forbidden" ? 403 : 500).json({ error: error.message });
  }
}