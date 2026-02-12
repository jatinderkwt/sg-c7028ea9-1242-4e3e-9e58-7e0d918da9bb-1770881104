import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { messageService } from "@/lib/services/message.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await requireAuth(req);
    const { conversationId, type, content, templateName, templateParams, mediaUrl } = req.body;

    const message = await messageService.sendMessage(session.tenantId, {
      conversationId,
      userId: session.userId,
      type,
      content,
      templateName,
      templateParams,
      mediaUrl,
    });

    return res.status(200).json(message);
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : 500).json({ error: error.message });
  }
}