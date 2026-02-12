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
        // Removed channel property as it's not in schema
      },
    });
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
}

export const conversationService = new ConversationService();