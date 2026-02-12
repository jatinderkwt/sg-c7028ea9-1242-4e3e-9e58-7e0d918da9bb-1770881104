import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { startDate, endDate } = req.query;
    
    const dateFilter = {
      gte: startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lte: endDate ? new Date(endDate as string) : new Date(),
    };

    const [
      totalContacts,
      totalConversations,
      openConversations,
      totalMessages,
      sentMessages,
      deliveredMessages,
      readMessages,
      activeCampaigns,
      activeAutomations,
      openDeals,
      pendingTasks,
    ] = await Promise.all([
      prisma.contact.count({
        where: { tenantId: session.tenantId },
      }),
      prisma.conversation.count({
        where: {
          tenantId: session.tenantId,
          createdAt: dateFilter,
        },
      }),
      prisma.conversation.count({
        where: {
          tenantId: session.tenantId,
          status: "open",
        },
      }),
      prisma.message.count({
        where: {
          conversation: { tenantId: session.tenantId },
          createdAt: dateFilter,
        },
      }),
      prisma.message.count({
        where: {
          conversation: { tenantId: session.tenantId },
          direction: "outbound",
          status: { in: ["sent", "delivered", "read"] },
          createdAt: dateFilter,
        },
      }),
      prisma.message.count({
        where: {
          conversation: { tenantId: session.tenantId },
          direction: "outbound",
          status: { in: ["delivered", "read"] },
          createdAt: dateFilter,
        },
      }),
      prisma.message.count({
        where: {
          conversation: { tenantId: session.tenantId },
          direction: "outbound",
          status: "read",
          createdAt: dateFilter,
        },
      }),
      prisma.campaign.count({
        where: {
          tenantId: session.tenantId,
          status: { in: ["active", "scheduled"] },
        },
      }),
      prisma.automation.count({
        where: {
          tenantId: session.tenantId,
          isActive: true,
        },
      }),
      prisma.deal.count({
        where: {
          tenantId: session.tenantId,
          stage: { notIn: ["won", "lost"] },
        },
      }),
      prisma.task.count({
        where: {
          tenantId: session.tenantId,
          status: "pending",
        },
      }),
    ]);

    const deliveryRate = sentMessages > 0 ? (deliveredMessages / sentMessages) * 100 : 0;
    const readRate = sentMessages > 0 ? (readMessages / sentMessages) * 100 : 0;

    return res.status(200).json({
      overview: {
        totalContacts,
        totalConversations,
        openConversations,
        totalMessages,
        sentMessages,
        deliveredMessages,
        readMessages,
        deliveryRate: deliveryRate.toFixed(2),
        readRate: readRate.toFixed(2),
      },
      crm: {
        openDeals,
        pendingTasks,
      },
      automation: {
        activeCampaigns,
        activeAutomations,
      },
    });
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : 500).json({ error: error.message });
  }
}