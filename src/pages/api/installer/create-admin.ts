import type { NextApiRequest, NextApiResponse } from "next";
import { isInstalled } from "@/lib/installer";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (isInstalled()) {
    return res.status(403).json({ error: "System already installed" });
  }

  try {
    const { name, email, password, timezone, language } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const tenant = await prisma.tenant.create({
      data: {
        name: "System",
        domain: "system.local",
        status: "active",
        primaryColor: "#3B82F6",
        secondaryColor: "#10B981",
        theme: "light",
        settings: {
          timezone: timezone || "UTC",
          language: language || "en",
          dateFormat: "YYYY-MM-DD",
          timeFormat: "24h",
        } as any,
      },
    });

    const superAdminRole = await prisma.role.findUnique({
      where: { name: "super_admin" },
    });

    if (!superAdminRole) {
      return res.status(500).json({ error: "Super admin role not found. Please initialize database first." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        roleId: superAdminRole.id,
        tenantId: tenant.id,
        status: "active",
        emailVerified: new Date(),
      },
    });

    return res.status(200).json({ 
      success: true,
      message: "Super admin created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: unknown) {
    console.error("Create admin error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: errorMessage });
  }
}