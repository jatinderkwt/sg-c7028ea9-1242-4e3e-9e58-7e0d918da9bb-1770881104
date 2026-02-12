import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { messageService } from "@/lib/services/message.service";
import { metaAPI } from "@/lib/services/meta-api.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Webhook verification
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // In a multi-tenant system, you might check against multiple tokens or a master token
    // For simplicity here, we assume a single verify token from env or first tenant match
    if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).json({ error: "Invalid verify token" });
  }

  if (req.method === "POST") {
    try {
      // Validate signature if secret exists
      if (process.env.WEBHOOK_APP_SECRET) {
        const signature = req.headers["x-hub-signature-256"] as string;
        if (!metaAPI.validateWebhookSignature(req.body, signature, process.env.WEBHOOK_APP_SECRET)) {
          return res.status(401).json({ error: "Invalid signature" });
        }
      }

      const body = req.body;

      if (body.object === "whatsapp_business_account") {
        for (const entry of body.entry) {
          // Identify Tenant via Phone Number ID (WABA ID/Phone ID logic)
          const changes = entry.changes[0];
          const value = changes.value;
          const metadata = value.metadata;
          
          if (!metadata) continue;

          // Lookup tenant by Phone Number ID
          const account = await prisma.whatsAppAccount.findFirst({
            where: { phoneNumberId: metadata.phone_number_id },
            select: { tenantId: true }
          });

          if (!account) {
            console.warn(`No tenant found for phone number ID: ${metadata.phone_number_id}`);
            continue;
          }

          if (value.messages) {
            for (const message of value.messages) {
              await messageService.handleIncomingMessage(account.tenantId, message);
            }
          }

          if (value.statuses) {
            for (const status of value.statuses) {
               await messageService.updateMessageStatus(account.tenantId, status);
            }
          }
        }
      }

      return res.status(200).send("OK");
    } catch (error) {
      console.error("Webhook error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}