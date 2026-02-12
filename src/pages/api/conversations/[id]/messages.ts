import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { conversationService } from "@/lib/services/conversation.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);
    const { id, limit } = req.query;

    if (req.method === "GET") {
      const messages = await conversationService.getConversationMessages(
        id as string,
        limit ? Number(limit) : 50
      );
      return res.status(200).json({ messages });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : 500).json({ error: error.message });
  }
}