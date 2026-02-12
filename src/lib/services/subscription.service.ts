import { prisma } from "@/lib/prisma";

export type PlanFeatures = {
  maxUsers: number;
  maxContacts: number;
  maxTemplates: number;
  apiAccess: boolean;
};

export class SubscriptionService {
  async getSubscription(tenantId: string) {
    return await prisma.subscription.findUnique({
      where: { tenantId },
      include: { plan: true },
    });
  }

  async createSubscription(tenantId: string, planId: string) {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) throw new Error("Plan not found");

    const startDate = new Date();
    const endDate = new Date();
    if (plan.billingCycle === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    return await prisma.subscription.create({
      data: {
        tenantId,
        planId,
        status: "active",
        startDate: startDate,
        endDate: endDate,
      },
    });
  }

  async checkFeatureLimit(tenantId: string, feature: keyof PlanFeatures, currentCount: number) {
    const subscription = await this.getSubscription(tenantId);
    if (!subscription || subscription.status !== "active") return false;

    const features = subscription.plan.features as PlanFeatures;
    const limit = features[feature];

    if (typeof limit === "number") {
      return currentCount < limit;
    }

    return Boolean(limit);
  }
}

export const subscriptionService = new SubscriptionService();