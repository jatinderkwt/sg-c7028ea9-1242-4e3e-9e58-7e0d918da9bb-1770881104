import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tenant: true,
        role: true,
      },
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenantId,
        role: user.role?.name || "viewer",
      },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    res.setHeader(
      "Set-Cookie",
      `auth-token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}