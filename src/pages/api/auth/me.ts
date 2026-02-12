import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req);

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        tenant: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({
      ...userWithoutPassword,
      // Add missing image property placeholder
      image: null, 
    });
  } catch (error) {
    console.error("Session error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}