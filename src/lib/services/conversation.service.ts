import { prisma } from "@/lib/prisma";
import { metaAPI } from "./meta-api.service";

export class ConversationService {
  async getOrCreateConversation(params: {
    tenantId: string;
    whatsappAccountId: string;
    contactId: string;
  }) {
    let conversation = await prisma.conversation.findFirst({
      where: {
        tenantId: params.tenantId,
        whatsappAccountId: params.whatsappAccountId,
        contactId: params.contactId,
        status: { in: ["open", "pending"] },
      },
      include: {
        contact: true,
        whatsappAccount: true,
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          tenantId: params.tenantId,
          whatsappAccountId: params.whatsappAccountId,
          contactId: params.contactId,
          status: "open",
        },
        include: {
          contact: true,
          whatsappAccount: true,
        },
      });
    }

    return conversation;
  }

  async canSendFreeFormMessage(conversationId: string): Promise<boolean> {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || !conversation.lastInboundAt) {
      return false;
    }

    return metaAPI.isWithin24HourWindow(conversation.lastInboundAt);
  }

  async updateSessionWindow(conversationId: string) {
    const now = new Date();
    const expiry = metaAPI.calculateSessionExpiry(now);

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastInboundAt: now,
        sessionWindowExpiry: expiry,
      },
    });
  }

  async assignAgent(conversationId: string, userId: string) {
    return prisma.conversation.update({
      where: { id: conversationId },
      data: { assignedUserId: userId },
    });
  }

  async closeConversation(conversationId: string) {
    return prisma.conversation.update({
      where: { id: conversationId },
      data: { status: "closed" },
    });
  }

  async getConversationMessages(conversationId: string, limit: number = 50) {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }
}

export const conversationService = new ConversationService();