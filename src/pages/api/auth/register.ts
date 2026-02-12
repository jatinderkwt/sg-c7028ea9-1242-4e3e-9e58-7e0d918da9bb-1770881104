import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, password, companyName } = req.body;

    // Validation
    if (!name || !email || !password || !companyName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create tenant
    const tenant = await prisma.tenant.create({
      data: {
        name: companyName,
        email,
      },
    });

    // Create default role
    const defaultRole = await prisma.role.create({
      data: {
        name: "Admin",
        description: "Administrator",
        tenantId: tenant.id,
      },
    });

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        tenantId: tenant.id,
        roleId: defaultRole.id,
      },
      include: {
        role: true,
        tenant: true,
      },
    });

    // Create default subscription (free trial)
    const trialPlan = await prisma.subscriptionPlan.findFirst();
    if (trialPlan) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 14); // 14 day trial

      await prisma.subscription.create({
        data: {
          tenantId: tenant.id,
          planId: trialPlan.id,
          status: "active",
          startDate: new Date(),
          endDate,
        },
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      user: userWithoutPassword,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
