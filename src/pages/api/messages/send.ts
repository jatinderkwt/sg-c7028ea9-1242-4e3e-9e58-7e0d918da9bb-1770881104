import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { messageService } from "@/lib/services/message.service";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await requireAuth();

    const { conversationId, type, content, templateName, templateParams, mediaUrl } = req.body;

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID is required" });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.tenantId !== session.tenantId) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const quotaExceeded = await messageService.checkQuotaExceeded(session.tenantId);

    if (quotaExceeded) {
      return res.status(403).json({ error: "Message quota exceeded" });
    }

    const message = await messageService.sendMessage({
      tenantId: session.tenantId,
      conversationId,
      whatsappAccountId: conversation.whatsappAccountId,
      userId: session.userId,
      type: type || "text",
      content,
      templateName,
      templateParams,
      mediaUrl,
    });

    return res.status(200).json(message);
  } catch (error: any) {
    console.error("Send message error:", error);
    return res.status(error.message === "Unauthorized" ? 401 : 500).json({ error: error.message });
  }
}