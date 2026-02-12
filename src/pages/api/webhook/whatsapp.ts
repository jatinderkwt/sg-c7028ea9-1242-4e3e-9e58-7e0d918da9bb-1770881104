import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { messageService } from "@/lib/services/message.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token) {
      // Find account with this verify token
      const account = await prisma.whatsAppAccount.findFirst({
        where: { verifyToken: token as string },
      });

      if (account) {
        return res.status(200).send(challenge);
      }
    }
    return res.status(403).json({ error: "Forbidden" });
  }

  if (req.method === "POST") {
    try {
      const body = req.body;
      
      if (!body.entry || !body.entry[0].changes || !body.entry[0].changes[0].value) {
        return res.status(400).json({ error: "Invalid webhook format" });
      }

      const change = body.entry[0].changes[0];
      const value = change.value;
      
      // Find account by phone number ID
      const phoneNumberId = value.metadata?.phone_number_id;
      
      if (!phoneNumberId) {
        return res.status(200).json({ status: "ignored" });
      }

      const account = await prisma.whatsAppAccount.findFirst({
        where: { phoneNumberId: phoneNumberId },
      });

      if (!account) {
        console.error(`Received webhook for unknown phone number ID: ${phoneNumberId}`);
        return res.status(200).json({ status: "ignored_unknown_account" });
      }

      if (value.messages) {
        for (const message of value.messages) {
          await messageService.handleIncomingMessage({
            tenantId: account.tenantId,
            whatsappAccountId: account.id,
            contactPhoneNumber: message.from,
            messageId: message.id,
            type: message.type,
            content: message,
          });
        }
      }

      if (value.statuses) {
        for (const status of value.statuses) {
          await messageService.updateMessageStatus({
            messageId: status.id,
            status: status.status,
            timestamp: new Date(parseInt(status.timestamp) * 1000),
            failureReason: status.errors?.[0]?.title,
          });
        }
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Webhook processing error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}