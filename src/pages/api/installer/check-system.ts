import type { NextApiRequest, NextApiResponse } from "next";
import { isInstalled, checkSystemRequirements } from "@/lib/installer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Allow check even if installed (for diagnostics)
    const checks = await checkSystemRequirements();
    
    return res.status(200).json({
      installed: isInstalled(),
      checks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("System check error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ 
      error: errorMessage,
      checks: [{
        name: "System Check",
        status: "error",
        message: "Failed to perform system checks",
        details: errorMessage
      }]
    });
  }
}