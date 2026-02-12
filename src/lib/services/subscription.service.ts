import { prisma } from "@/lib/prisma";

export type PlanFeatures = {
  maxUsers: number;
  maxWhatsAppAccounts: number;
  monthlyMessageQuota: number;
  maxAutomations: number;
  maxCampaigns: number;
  crmEnabled: boolean;
  analyticsEnabled: boolean;
  apiAccess: boolean;
  customBranding: boolean;
  prioritySupport: boolean;
};

export class SubscriptionService {
  async createPlan(data: {
    name: string;
    price: number;
    billingCycle: "monthly" | "yearly";
    features: PlanFeatures;
    isActive: boolean;
  }) {
    return await prisma.subscriptionPlan.create({
      data: {
        name: data.name,
        price: data.price,
        billingCycle: data.billingCycle,
        features: data.features as any,
        isActive: data.isActive,
      },
    });
  }

  async createSubscription(tenantId: string, planId: string, trialDays?: number) {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new Error("Plan not found");
    }

    const startDate = new Date();
    const trialEndDate = trialDays ? new Date(startDate.getTime() + trialDays * 24 * 60 * 60 * 1000) : null;
    const nextBillingDate = new Date(startDate);
    if (plan.billingCycle === "monthly") {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    } else {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    }

    return await prisma.subscription.create({
      data: {
        tenantId,
        planId,
        status: trialDays ? "trialing" : "active",
        currentPeriodStart: startDate,
        currentPeriodEnd: nextBillingDate,
        trialEnd: trialEndDate,
      },
    });
  }

  async checkFeatureAccess(tenantId: string, feature: keyof PlanFeatures): Promise<boolean> {
    const subscription = await prisma.subscription.findFirst({
      where: { 
        tenantId,
        status: { in: ["active", "trialing"] },
      },
      include: { plan: true },
    });

    if (!subscription) return false;

    const features = subscription.plan.features as PlanFeatures;
    return Boolean(features[feature]);
  }

  async checkUsageLimit(tenantId: string, limitType: keyof PlanFeatures, currentUsage: number): Promise<boolean> {
    const subscription = await prisma.subscription.findFirst({
      where: { 
        tenantId,
        status: { in: ["active", "trialing"] },
      },
      include: { plan: true },
    });

    if (!subscription) return false;

    const features = subscription.plan.features as PlanFeatures;
    const limit = features[limitType];
    
    if (typeof limit === "number") {
      return currentUsage < limit;
    }
    
    return Boolean(limit);
  }
}

export const subscriptionService = new SubscriptionService();