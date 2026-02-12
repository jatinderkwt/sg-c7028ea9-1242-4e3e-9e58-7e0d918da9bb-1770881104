import React, { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, MessageSquare } from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      id: "starter",
      name: "Starter",
      description: "Perfect for small teams",
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        "1 WhatsApp Number",
        "2 Agents",
        "Basic Automation",
        "500 Contacts",
        "Community Support",
        "Email Support",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
    {
      id: "growth",
      name: "Growth",
      description: "For growing businesses",
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        "3 WhatsApp Numbers",
        "5 Agents",
        "Full Automation",
        "5,000 Contacts",
        "CRM Integration",
        "Priority Support",
        "Analytics Dashboard",
        "Custom Workflows",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large scale operations",
      monthlyPrice: 299,
      yearlyPrice: 2990,
      features: [
        "Unlimited Numbers",
        "Unlimited Agents",
        "API Access",
        "Unlimited Contacts",
        "White Label",
        "Dedicated Support",
        "Advanced Analytics",
        "Custom Integration",
        "SLA Guarantee",
        "Priority Onboarding",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <>
      <SEO
        title="Pricing - WhatsApp Business API Platform"
        description="Choose the perfect plan for your WhatsApp Business needs. From startups to enterprises."
        image="/og-image.png"
      />

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
        {/* Header */}
        <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <MessageSquare className="w-8 h-8 text-emerald-600" />
              <span className="text-xl font-bold">WhatsApp Business</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/pricing" className="text-sm font-medium text-emerald-600">
                Pricing
              </Link>
              <Link href="/features" className="text-sm font-medium">
                Features
              </Link>
              <Link href="/docs" className="text-sm font-medium">
                Docs
              </Link>
              <Link href="/installer">
                <Button variant="default" className="bg-emerald-600">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </header>

        {/* Pricing Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Transparent Pricing for Every Scale
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Choose the plan that's right for your business. Always transparent, never hidden fees.
            </p>

            {/* Billing Toggle */}
            <div className="flex justify-center items-center gap-4 mb-12">
              <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-emerald-600" : "text-gray-600"}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 dark:bg-gray-700"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                    billingCycle === "yearly" ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === "yearly" ? "text-emerald-600" : "text-gray-600"}`}>
                Yearly <span className="text-emerald-600 font-bold">Save 17%</span>
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.highlighted
                    ? "md:scale-105 border-emerald-500 shadow-lg"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-emerald-600">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      ${billingCycle === "monthly" ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12)}/mo
                    </span>
                    {billingCycle === "yearly" && (
                      <p className="text-sm text-gray-500 mt-2">
                        Billed ${plan.yearlyPrice}/year
                      </p>
                    )}
                  </div>

                  <Button
                    className={`w-full mb-8 ${
                      plan.highlighted ? "bg-emerald-600 hover:bg-emerald-700" : ""
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>

                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Can I change my plan anytime?",
                  a: "Yes, upgrade or downgrade your plan at any time. Changes take effect immediately.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards via Stripe. Enterprise customers can also pay via invoice.",
                },
                {
                  q: "Do you offer discounts for annual billing?",
                  a: "Yes! Annual subscribers save 17% compared to monthly billing.",
                },
                {
                  q: "Is there a free trial?",
                  a: "Yes, all plans come with a 14-day free trial. No credit card required.",
                },
              ].map((item, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
