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

    // Find the system tenant or the first tenant created
    let tenant = await prisma.tenant.findFirst({
      where: { name: "System" }
    });

    // If System tenant not found, try to find any company tenant
    if (!tenant) {
      tenant = await prisma.tenant.findFirst({
        orderBy: { createdAt: "asc" }
      });
    }

    if (!tenant) {
      return res.status(500).json({
        error: "No tenant found",
        details: "Database initialization may have failed. Please reinitialize."
      });
    }

    // Update tenant with configuration
    await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        name: companyName || tenant.name,
        settings: {
          website: website || "",
          email: email || "",
          phone: phone || "",
          address: address || "",
          country: country || "",
          currency: currency || "USD",
          timezone: timezone || "UTC",
          language: language || "en",
          saasEnabled: saasEnabled || false,
          trialDuration: trialDuration || 14,
          smtp: {
            host: smtpHost || "",
            port: smtpPort || 587,
            user: smtpUser || "",
            password: smtpPassword || "",
            senderEmail: senderEmail || email || "noreply@example.com",
          },
        } as any,
      },
    });

    // Create installation lock file
    try {
      createLockFile();
    } catch (lockError: any) {
      console.warn("Could not create lock file:", lockError.message);
      // Don't fail if lock file creation fails
    }

    return res.status(200).json({
      success: true,
      message: "Installation completed successfully",
      tenant: {
        id: tenant.id,
        name: companyName || tenant.name
      },
      redirectTo: "/dashboard"
    });
  } catch (error: unknown) {
    console.error("Complete installation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      error: "Installation completion failed",
      details: errorMessage,
      code: error instanceof Error ? (error as any).code : undefined
    });
  }
}