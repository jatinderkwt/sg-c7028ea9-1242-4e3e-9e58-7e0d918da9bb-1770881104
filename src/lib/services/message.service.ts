import { prisma } from "@/lib/prisma";
import { metaAPI } from "./meta-api.service";
import { conversationService } from "./conversation.service";

export class MessageService {
  async sendMessage(tenantId: string, data: any) {
    if (data.type !== "template") {
      const canSend = await conversationService.canSendFreeFormMessage(data.conversationId);
      if (!canSend) {
        throw new Error("Cannot send free-form message outside 24-hour window");
      }
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: data.conversationId },
      include: { contact: true },
    });

    if (!conversation || conversation.tenantId !== tenantId) {
      throw new Error("Conversation not found");
    }

    const whatsappAccount = await prisma.whatsAppAccount.findUnique({
      where: { tenantId },
    });

    if (!whatsappAccount) {
      throw new Error("WhatsApp account not configured");
    }

    const metaResponse = await metaAPI.sendMessage({
      phoneNumberId: whatsappAccount.phoneNumberId,
      accessToken: whatsappAccount.accessToken,
      to: conversation.contact.phoneNumber,
      type: data.type,
      content: data.content,
      templateName: data.templateName,
      templateLanguage: "en",
      templateParams: data.templateParams,
      mediaUrl: data.mediaUrl,
    });

    const message = await prisma.message.create({
      data: {
        conversationId: data.conversationId,
        wamid: metaResponse.messages[0].id,
        direction: "outbound",
        type: data.type,
        status: "sent",
        content: data.content || {},
        senderId: data.userId,
      },
    });

    await prisma.conversation.update({
      where: { id: data.conversationId },
      data: { 
        lastMessageAt: new Date(),
      },
    });

    return message;
  }

  async handleIncomingMessage(params: {
    tenantId: string;
    whatsappAccountId: string;
    contactPhoneNumber: string;
    messageId: string;
    type: string;
    content?: any;
    mediaUrl?: string;
  }) {
    let contact = await prisma.contact.findUnique({
      where: {
        tenantId_phoneNumber: {
          tenantId: params.tenantId,
          phoneNumber: params.contactPhoneNumber,
        },
      },
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          tenantId: params.tenantId,
          phoneNumber: params.contactPhoneNumber,
          optInStatus: "implicit",
          optInSource: "inbound_message",
        },
      });
    }

    const conversation = await conversationService.getOrCreateConversation({
      tenantId: params.tenantId,
      contactId: contact.id,
    });

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        wamid: params.messageId,
        direction: "inbound",
        type: params.type,
        status: "delivered",
        content: params.content || {},
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    return { conversation, message, contact };
  }

  async updateMessageStatus(params: {
    messageId: string;
    status: string;
    timestamp: Date;
    failureReason?: string;
  }) {
    return prisma.message.update({
      where: { wamid: params.messageId },
      data: {
        status: params.status,
      },
    });
  }

  async checkQuotaExceeded(tenantId: string): Promise<boolean> {
    return false;
  }
}

export const messageService = new MessageService();