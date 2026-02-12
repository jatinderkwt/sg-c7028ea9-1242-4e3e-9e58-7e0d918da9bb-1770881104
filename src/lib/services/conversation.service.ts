import { prisma } from "@/lib/prisma";

export class ConversationService {
  async getConversations(tenantId: string, userId?: string) {
    return await prisma.conversation.findMany({
      where: {
        tenantId,
        ...(userId && { assignedToId: userId }),
      },
      include: {
        contact: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });
  }

  async getConversation(id: string) {
    return await prisma.conversation.findUnique({
      where: { id },
      include: {
        contact: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  async getConversationMessages(conversationId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
    return conversation?.messages || [];
  }

  async createConversation(tenantId: string, contactId: string) {
    // Check if open conversation exists
    const existing = await prisma.conversation.findFirst({
      where: {
        tenantId,
        contactId,
        status: "open",
      },
    });

    if (existing) return existing;

    return await prisma.conversation.create({
      data: {
        tenantId,
        contactId,
        status: "open",
      },
    });
  }

  async getOrCreateConversation(tenantId: string, contactId: string) {
    return this.createConversation(tenantId, contactId);
  }

  async closeConversation(id: string) {
    return await prisma.conversation.update({
      where: { id },
      data: { status: "closed" },
    });
  }

  async assignConversation(id: string, userId: string) {
    return await prisma.conversation.update({
      where: { id },
      data: { assignedToId: userId },
    });
  }

  async canSendFreeFormMessage(tenantId: string, contactId: string): Promise<boolean> {
    const lastInbound = await prisma.message.findFirst({
      where: {
        tenantId,
        conversation: { contactId },
        direction: "inbound",
      },
      orderBy: { createdAt: "desc" },
    });

    if (!lastInbound) return false;

    const window = 24 * 60 * 60 * 1000; // 24 hours
    const now = new Date().getTime();
    const lastMsgTime = lastInbound.createdAt.getTime();

    return now - lastMsgTime < window;
  }
}

export const conversationService = new ConversationService();