import type { NextApiRequest, NextApiResponse } from "next";
import { isInstalled, createLockFile } from "@/lib/installer";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (isInstalled()) {
    return res.status(403).json({ error: "System already installed" });
  }

  try {
    const {
      companyName,
      website,
      email,
      phone,
      address,
      country,
      currency,
      timezone,
      language,
      saasEnabled,
      trialDuration,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
      senderEmail,
    } = req.body;

    const tenant = await prisma.tenant.findFirst({
      where: { name: "System" },
    });

    if (!tenant) {
      return res.status(500).json({ error: "System tenant not found" });
    }

    await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        name: companyName || "System",
        settings: {
          website,
          email,
          phone,
          address,
          country,
          currency: currency || "USD",
          timezone: timezone || "UTC",
          language: language || "en",
          saasEnabled: saasEnabled || false,
          trialDuration: trialDuration || 14,
          smtp: {
            host: smtpHost,
            port: smtpPort,
            user: smtpUser,
            password: smtpPassword,
            senderEmail,
          },
        } as any,
      },
    });

    createLockFile();

    return res.status(200).json({ 
      success: true,
      message: "Installation completed successfully",
      redirectTo: "/auth/login",
    });
  } catch (error: unknown) {
    console.error("Complete installation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: errorMessage });
  }
}