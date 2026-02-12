import type { NextApiRequest, NextApiResponse } from "next";
import { isInstalled } from "@/lib/installer";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (isInstalled()) {
    return res.status(403).json({ error: "System is already installed" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { admin, company } = req.body;

    // 1. Create Tenant
    const tenant = await prisma.tenant.create({
      data: {
        name: company.name,
        email: company.email,
        domain: company.website, // Assuming website as domain/identifier
        isActive: true,
        settings: {
          phone: company.phone,
          address: company.address,
          country: company.country,
          currency: company.currency,
          timezone: company.timezone,
          language: company.language,
        },
      },
    });

    // 2. Create Super Admin Role
    // Use findFirst to avoid unique constraint issues if it exists, though it shouldn't
    let adminRole = await prisma.role.findFirst({
      where: {
        tenantId: tenant.id,
        name: "super_admin",
      },
    });

    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: {
          tenantId: tenant.id,
          name: "super_admin",
          description: "Full system access",
        },
      });
    }

    // 3. Create Super Admin User
    const hashedPassword = await bcrypt.hash(admin.password, 10);

    const user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: admin.email,
        name: admin.name,
        password: hashedPassword,
        roleId: adminRole.id,
        isActive: true,
      },
    });

    return res.status(200).json({ success: true, tenantId: tenant.id, userId: user.id });
  } catch (error: any) {
    console.error("Create admin error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: errorMessage });
  }
}