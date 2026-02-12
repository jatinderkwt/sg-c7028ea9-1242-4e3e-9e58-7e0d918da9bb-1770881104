import { prisma } from "@/lib/prisma";

export class ConversationService {
  async getConversations(tenantId: string, params: any) {
    const { status, assignedUserId, limit = 50, offset = 0 } = params;
    
    const where: any = {
      tenantId,
      status,
    };
    
    if (assignedUserId) {
      where.assignedToId = assignedUserId;
    }
    
    return await prisma.conversation.findMany({
      where,
      include: {
        contact: true,
        assignedTo: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: "desc" },
      take: Number(limit),
      skip: Number(offset),
    });
  }

  async createConversation(tenantId: string, data: any) {
    return await prisma.conversation.create({
      data: {
        tenantId,
        contactId: data.contactId,
        status: "open",
        channel: "whatsapp",
        assignedToId: data.assignedToId,
      },
      include: {
        contact: true,
        assignedTo: true,
      },
    });
  }

  async getOrCreateConversation(params: {
    tenantId: string;
    contactId: string;
  }) {
    const existing = await prisma.conversation.findFirst({
      where: {
        tenantId: params.tenantId,
        contactId: params.contactId,
        status: "open",
      },
    });

    if (existing) return existing;

    return await prisma.conversation.create({
      data: {
        tenantId: params.tenantId,
        contactId: params.contactId,
        status: "open",
        channel: "whatsapp",
      },
    });
  }

  async canSendFreeFormMessage(conversationId: string): Promise<boolean> {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          where: { direction: "inbound" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!conversation) return false;

    const lastInbound = conversation.messages[0];
    if (!lastInbound) return false;

    const lastInboundAt = lastInbound.createdAt;
    const now = new Date();
    const diff = now.getTime() - lastInboundAt.getTime();
    const hours = diff / (1000 * 60 * 60);

    return hours < 24;
  }

  async updateStatus(conversationId: string, status: string) {
    return await prisma.conversation.update({
      where: { id: conversationId },
      data: { status },
    });
  }
  
  async assignAgent(conversationId: string, userId: string) {
    return await prisma.conversation.update({
      where: { id: conversationId },
      data: { assignedToId: userId },
    });
  }

  async getConversationMessages(conversationId: string, limit: number = 50) {
    return await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: limit,
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
    });
  }
}

export const conversationService = new ConversationService();