import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-10-28" as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sig = req.headers["stripe-signature"] as string;
    const body = req.body;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(JSON.stringify(body), sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return res.status(400).json({ error: "Webhook signature verification failed" });
    }

    // Handle events
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.metadata?.tenantId && session.metadata?.planId) {
          // Update or create subscription
          const subscription = await prisma.subscription.upsert({
            where: { tenantId: session.metadata.tenantId },
            create: {
              tenantId: session.metadata.tenantId,
              planId: session.metadata.planId,
              status: "active",
              startDate: new Date(),
              endDate: null,
            },
            update: {
              status: "active",
              planId: session.metadata.planId,
            },
          });

          console.log("Subscription created/updated:", subscription);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        if (subscription.metadata?.tenantId) {
          // Cancel subscription
          await prisma.subscription.updateMany({
            where: { tenantId: subscription.metadata.tenantId },
            data: { status: "cancelled", endDate: new Date() },
          });

          console.log("Subscription cancelled");
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Payment failed:", invoice);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Disable body parser for webhook
export const config = {
  api: {
    bodyParser: false,
  },
};
