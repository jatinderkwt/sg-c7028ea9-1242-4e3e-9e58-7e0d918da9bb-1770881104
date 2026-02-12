import { prisma } from "@/lib/prisma";
import { metaAPI } from "./meta-api.service";
import { conversationService } from "./conversation.service";

export type SendMessageData = {
  phoneNumber: string;
  type: "text" | "template" | "image" | "document" | "video";
  content: any;
  templateName?: string;
  templateLanguage?: string;
  userId?: string;
};

export class MessageService {
  async sendMessage(tenantId: string, data: SendMessageData) {
    // 1. Check Quota (Placeholder implementation)
    const canSend = await this.checkQuota(tenantId);
    if (!canSend) {
      throw new Error("Message quota exceeded");
    }

    // 2. Get or Create Contact & Conversation
    const contact = await prisma.contact.findFirst({
      where: { tenantId, phoneNumber: data.phoneNumber },
    });

    if (!contact) {
      throw new Error("Contact not found");
    }

    const conversation = await conversationService.getOrCreateConversation(tenantId, contact.id);

    // 3. Check 24h Window for non-template messages
    if (data.type !== "template") {
      const allowed = await conversationService.canSendFreeFormMessage(tenantId, contact.id);
      if (!allowed) {
        throw new Error("Outside 24h window. Please send a template message.");
      }
    }

    // 4. Get WhatsApp Account Info
    const whatsappAccount = await prisma.whatsAppAccount.findUnique({
      where: { tenantId },
    });

    if (!whatsappAccount) {
      throw new Error("WhatsApp account not configured");
    }

    // 5. Send via Meta API
    let metaResponse;
    if (data.type === "template") {
      if (!data.templateName || !data.templateLanguage) {
        throw new Error("Template name and language required");
      }
      metaResponse = await metaAPI.sendTemplate({
        phoneNumberId: whatsappAccount.phoneNumberId,
        phoneNumber: data.phoneNumber,
        templateName: data.templateName,
        languageCode: data.templateLanguage,
        components: data.content.components || [],
        accessToken: whatsappAccount.accessToken,
      });
    } else {
      metaResponse = await metaAPI.sendMessage({
        phoneNumberId: whatsappAccount.phoneNumberId,
        phoneNumber: data.phoneNumber,
        type: data.type,
        content: data.content,
        accessToken: whatsappAccount.accessToken,
      });
    }

    // 6. Store Message in DB
    const wamid = metaResponse?.messages?.[0]?.id || `wamid_${Date.now()}`;

    const message = await prisma.message.create({
      data: {
        tenantId,
        conversationId: conversation.id,
        direction: "outbound",
        type: data.type,
        status: "sent",
        wamid: wamid,
        content: data.content || {},
        senderId: data.userId,
      },
    });

    // 7. Update Conversation
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: new Date(),
        status: "open",
      },
    });

    return message;
  }

  async checkQuota(tenantId: string): Promise<boolean> {
    return true;
  }

  async handleIncomingMessage(tenantId: string, message: any) {
    // Basic implementation for handling inbound webhook messages
    const from = message.from;
    const type = message.type;
    const body = type === 'text' ? message.text.body : '[Media]';
    
    // 1. Find or create contact
    let contact = await prisma.contact.findFirst({
      where: { tenantId, phoneNumber: from }
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          tenantId,
          phoneNumber: from,
          name: message.profile?.name || from
        }
      });
    }

    // 2. Find or create conversation
    const conversation = await conversationService.getOrCreateConversation(tenantId, contact.id);

    // 3. Save message
    await prisma.message.create({
      data: {
        tenantId,
        conversationId: conversation.id,
        direction: "inbound",
        type,
        content: message,
        status: "delivered",
        wamid: message.id,
      }
    });

    // 4. Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date(), unreadCount: { increment: 1 } }
    });
  }

  async updateMessageStatus(tenantId: string, status: any) {
    const wamid = status.id;
    const newStatus = status.status;
    
    await prisma.message.updateMany({
      where: { wamid, tenantId },
      data: { status: newStatus }
    });
  }
}

export const messageService = new MessageService();