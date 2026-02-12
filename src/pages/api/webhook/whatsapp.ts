import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { messageService } from "@/lib/services/message.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    const whatsappAccount = await prisma.whatsAppAccount.findFirst({
      where: { webhookVerifyToken: token as string },
    });

    if (mode === "subscribe" && whatsappAccount) {
      return res.status(200).send(challenge);
    }

    return res.status(403).send("Forbidden");
  }

  if (req.method === "POST") {
    try {
      const body = req.body;

      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (!value) {
        return res.status(200).json({ success: true });
      }

      const phoneNumberId = value.metadata?.phone_number_id;

      const whatsappAccount = await prisma.whatsAppAccount.findUnique({
        where: { phoneNumberId },
      });

      if (!whatsappAccount) {
        return res.status(404).json({ error: "WhatsApp account not found" });
      }

      if (value.messages) {
        for (const message of value.messages) {
          await handleIncomingMessage(whatsappAccount, message);
        }
      }

      if (value.statuses) {
        for (const status of value.statuses) {
          await handleStatusUpdate(status);
        }
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Webhook error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

async function handleIncomingMessage(whatsappAccount: any, message: any) {
  const type = message.type;
  let content: string | undefined;
  let mediaUrl: string | undefined;

  if (type === "text") {
    content = message.text.body;
  } else if (["image", "audio", "video", "document"].includes(type)) {
    mediaUrl = message[type].id;
  }

  await messageService.handleIncomingMessage({
    tenantId: whatsappAccount.tenantId,
    whatsappAccountId: whatsappAccount.id,
    contactPhoneNumber: message.from,
    messageId: message.id,
    type,
    content,
    mediaUrl,
  });
}

async function handleStatusUpdate(status: any) {
  await messageService.updateMessageStatus({
    messageId: status.id,
    status: status.status,
    timestamp: new Date(parseInt(status.timestamp) * 1000),
    failureReason: status.errors?.[0]?.title,
  });
}