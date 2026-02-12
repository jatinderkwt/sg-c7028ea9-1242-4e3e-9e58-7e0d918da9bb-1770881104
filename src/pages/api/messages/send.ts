import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { messageService } from "@/lib/services/message.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "POST") {
      const { phoneNumber, type, content, templateName, templateLanguage } = req.body;

      const message = await messageService.sendMessage(session.tenantId, {
        phoneNumber,
        type,
        content,
        templateName,
        templateLanguage,
        userId: session.userId,
      });

      return res.status(201).json(message);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : 500).json({ error: error.message });
  }
}