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
    // Support both old format (admin, company) and new format (adminData, companyData)
    const adminPayload = req.body.admin || req.body.adminData || {};
    const companyPayload = req.body.company || req.body.companyData || {};

    // Validate required fields
    if (!adminPayload.email || !adminPayload.password) {
      return res.status(400).json({
        error: "Missing required admin fields",
        details: "email and password are required"
      });
    }

    if (!companyPayload.name) {
      return res.status(400).json({
        error: "Missing company name",
        details: "Company name is required"
      });
    }

    // Check if company tenant already exists
    let tenant = await prisma.tenant.findFirst({
      where: { name: companyPayload.name }
    });

    if (!tenant) {
      // 1. Create Tenant
      tenant = await prisma.tenant.create({
        data: {
          name: companyPayload.name,
          domain: companyPayload.domain || companyPayload.name.toLowerCase().replace(/\s+/g, "-"),
          isActive: true,
          settings: {
            phone: companyPayload.phone,
            address: companyPayload.address,
            country: companyPayload.country,
            currency: companyPayload.currency || "USD",
            timezone: companyPayload.timezone || "UTC",
            language: companyPayload.language || "en",
          },
        },
      });
    }

    // Check if admin user already exists for this tenant
    const existingUser = await prisma.user.findUnique({
      where: { tenantId_email: { tenantId: tenant.id, email: adminPayload.email } }
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Admin user already exists",
        details: `Email ${adminPayload.email} is already registered`
      });
    }

    // 2. Get or Create Super Admin Role for this tenant
    let adminRole = await prisma.role.findFirst({
      where: {
        tenantId: tenant.id,
        name: "super_admin",
      },
    });

    if (!adminRole) {
      // Try to find a system-wide admin role
      adminRole = await prisma.role.findFirst({
        where: {
          name: "super_admin",
        },
      });

      // If still not found, create one
      if (!adminRole) {
        adminRole = await prisma.role.create({
          data: {
            tenantId: tenant.id,
            name: "super_admin",
            description: "Full system access",
          },
        });
      }
    }

    // 3. Create Super Admin User
    const hashedPassword = await bcrypt.hash(adminPayload.password, 10);

    const user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: adminPayload.email,
        name: adminPayload.name,
        password: hashedPassword,
        roleId: adminRole.id,
        isActive: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Admin user created successfully",
      tenantId: tenant.id,
      userId: user.id,
      user: {
        email: user.email,
        name: user.name
      }
    });
  } catch (error: any) {
    console.error("Create admin error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      error: "Failed to create admin user",
      details: errorMessage,
      code: error.code
    });
  }
}