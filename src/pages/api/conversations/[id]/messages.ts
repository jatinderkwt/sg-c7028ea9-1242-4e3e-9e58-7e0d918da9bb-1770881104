import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { conversationService } from "@/lib/services/conversation.service";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth();
    const { id } = req.query;

    const conversation = await prisma.conversation.findUnique({
      where: { id: id as string },
    });

    if (!conversation || conversation.tenantId !== session.tenantId) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (req.method === "GET") {
      const { limit } = req.query;

      const messages = await conversationService.getConversationMessages(
        id as string,
        limit ? parseInt(limit as string) : 50
      );

      return res.status(200).json({ messages: messages.reverse() });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("Messages API error:", error);
    return res.status(error.message === "Unauthorized" ? 401 : 500).json({ error: error.message });
  }
}