import type { NextApiRequest, NextApiResponse } from "next";
import { isInstalled, checkSystemRequirements } from "@/lib/installer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (isInstalled()) {
    return res.status(403).json({ error: "System already installed" });
  }

  try {
    const checks = await checkSystemRequirements();
    return res.status(200).json({ checks });
  } catch (error: unknown) {
    console.error("System check error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: errorMessage });
  }
}