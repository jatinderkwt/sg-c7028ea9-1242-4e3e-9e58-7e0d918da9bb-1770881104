import { prisma } from "@/lib/prisma";
import { metaAPI } from "./meta-api.service";
import { conversationService } from "./conversation.service";

export class MessageService {
  async sendMessage(params: {
    tenantId: string;
    conversationId: string;
    whatsappAccountId: string;
    userId: string;
    type: "text" | "template" | "image" | "audio" | "video" | "document";
    content?: string;
    templateName?: string;
    templateParams?: string[];
    mediaUrl?: string;
  }) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: params.conversationId },
      include: {
        contact: true,
        whatsappAccount: true,
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const canSendFreeForm = await conversationService.canSendFreeFormMessage(
      params.conversationId
    );

    if (params.type === "text" && !canSendFreeForm) {
      throw new Error(
        "Cannot send free-form message outside 24-hour window. Use a template instead."
      );
    }

    try {
      const result = await metaAPI.sendMessage({
        phoneNumberId: conversation.whatsappAccount.phoneNumberId,
        accessToken: conversation.whatsappAccount.accessToken,
        to: conversation.contact.phoneNumber,
        type: params.type,
        content: params.content,
        templateName: params.templateName,
        templateLanguage: "en",
        templateParams: params.templateParams,
        mediaUrl: params.mediaUrl,
      });

      const message = await prisma.message.create({
        data: {
          tenantId: params.tenantId,
          conversationId: params.conversationId,
          whatsappAccountId: params.whatsappAccountId,
          contactId: conversation.contactId,
          userId: params.userId,
          messageId: result.messageId,
          direction: "outbound",
          type: params.type,
          content: params.content,
          templateName: params.templateName,
          templateParams: params.templateParams,
          mediaUrl: params.mediaUrl,
          status: "sent",
        },
      });

      await prisma.conversation.update({
        where: { id: params.conversationId },
        data: { lastMessageAt: new Date() },
      });

      await this.logMessageUsage(params.tenantId);

      return message;
    } catch (error: any) {
      const message = await prisma.message.create({
        data: {
          tenantId: params.tenantId,
          conversationId: params.conversationId,
          whatsappAccountId: params.whatsappAccountId,
          contactId: conversation.contactId,
          userId: params.userId,
          direction: "outbound",
          type: params.type,
          content: params.content,
          status: "failed",
          failureReason: error.message,
        },
      });

      throw error;
    }
  }

  async handleIncomingMessage(params: {
    tenantId: string;
    whatsappAccountId: string;
    contactPhoneNumber: string;
    messageId: string;
    type: string;
    content?: string;
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
          optInTimestamp: new Date(),
        },
      });
    }

    const conversation = await conversationService.getOrCreateConversation({
      tenantId: params.tenantId,
      whatsappAccountId: params.whatsappAccountId,
      contactId: contact.id,
    });

    await conversationService.updateSessionWindow(conversation.id);

    const message = await prisma.message.create({
      data: {
        tenantId: params.tenantId,
        conversationId: conversation.id,
        whatsappAccountId: params.whatsappAccountId,
        contactId: contact.id,
        messageId: params.messageId,
        direction: "inbound",
        type: params.type,
        content: params.content,
        mediaUrl: params.mediaUrl,
        status: "received",
      },
    });

    await prisma.contact.update({
      where: { id: contact.id },
      data: { lastMessageAt: new Date() },
    });

    return { conversation, message, contact };
  }

  async updateMessageStatus(params: {
    messageId: string;
    status: "sent" | "delivered" | "read" | "failed";
    timestamp: Date;
    failureReason?: string;
  }) {
    const updateData: any = {
      status: params.status,
      statusTimestamp: params.timestamp,
    };

    if (params.status === "delivered") {
      updateData.deliveredAt = params.timestamp;
    } else if (params.status === "read") {
      updateData.readAt = params.timestamp;
    } else if (params.status === "failed") {
      updateData.failureReason = params.failureReason;
    }

    return prisma.message.update({
      where: { messageId: params.messageId },
      data: updateData,
    });
  }

  private async logMessageUsage(tenantId: string) {
    await prisma.$transaction([
      prisma.tenant.update({
        where: { id: tenantId },
        data: { messagesUsed: { increment: 1 } },
      }),
      prisma.usageLog.create({
        data: {
          tenantId,
          resourceType: "message",
          quantity: 1,
        },
      }),
    ]);
  }

  async checkQuotaExceeded(tenantId: string): Promise<boolean> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) return true;

    return tenant.messagesUsed >= tenant.messageQuota;
  }
}

export const messageService = new MessageService();