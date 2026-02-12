import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getSession();

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { tenant: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        tenant: {
          id: user.tenant.id,
          name: user.tenant.name,
          logo: user.tenant.logo,
          primaryColor: user.tenant.primaryColor,
          secondaryColor: user.tenant.secondaryColor,
          theme: user.tenant.theme,
        },
      },
    });
  } catch (error) {
    console.error("Session error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}