import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  Users,
  Zap,
  BarChart3,
  Shield,
  Sparkles,
  Database,
  Rocket,
  CheckCircle2,
  Mail,
  Lock,
  TrendingUp,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: MessageSquare,
      title: "Shared Inbox",
      description: "Unified conversations from all WhatsApp numbers with AI-powered routing and assignment.",
      items: ["Multi-agent support", "Real-time notifications", "Chat history", "Customer notes"],
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Create powerful workflows without coding. Trigger actions based on keywords, time, or events.",
      items: ["Visual flow builder", "Keyword triggers", "Time-based messages", "AI chatbot"],
    },
    {
      icon: Users,
      title: "CRM Integration",
      description: "360-degree customer view with contact management, custom fields, and segments.",
      items: ["Contact profiles", "Deal tracking", "Task management", "Custom fields"],
    },
    {
      icon: Mail,
      title: "Broadcast Campaigns",
      description: "Send template-based campaigns to thousands of customers with delivery tracking.",
      items: ["Template builder", "Audience segmentation", "Delivery tracking", "Read metrics"],
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Real-time insights into message volume, agent performance, and campaign ROI.",
      items: ["Message analytics", "Agent performance", "Campaign reports", "Custom dashboards"],
    },
    {
      icon: Shield,
      title: "Compliance & Security",
      description: "Enterprise-grade security with encryption, audit logs, and regulatory compliance.",
      items: ["AES-256 encryption", "Audit logging", "RBAC", "Opt-in tracking"],
    },
  ];

  return (
    <>
      <SEO
        title="Features - WhatsApp Business API Platform"
        description="Discover powerful features for managing WhatsApp Business communication at scale."
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
              <Link href="/features" className="text-sm font-medium text-emerald-600">
                Features
              </Link>
              <Link href="/pricing" className="text-sm font-medium">
                Pricing
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

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Powerful Features for Enterprise Scale
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to manage WhatsApp Business at scale, from sales to support.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Icon className="w-10 h-10 text-emerald-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <CardTitle>{feature.title}</CardTitle>
                        <CardDescription className="text-base mt-2">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Advanced Features */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold mb-8">Advanced Capabilities</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Sparkles,
                  title: "AI-Powered",
                  items: ["Auto-reply assistant", "Lead scoring", "Sentiment analysis", "Conversation routing"],
                },
                {
                  icon: Database,
                  title: "Scalable",
                  items: ["Handle millions of messages", "Multi-tenant architecture", "Real-time processing", "99.9% uptime"],
                },
                {
                  icon: Rocket,
                  title: "Developer-Friendly",
                  items: ["REST API", "Webhooks", "SDK available", "Comprehensive documentation"],
                },
              ].map((group, idx) => {
                const Icon = group.icon;
                return (
                  <div key={idx}>
                    <Icon className="w-10 h-10 text-emerald-600 mb-4" />
                    <h3 className="font-bold text-lg mb-4">{group.title}</h3>
                    <ul className="space-y-2">
                      {group.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="text-sm text-gray-600 dark:text-gray-400">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Industry Solutions */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Built for Every Industry</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { title: "E-commerce", description: "Order updates, delivery tracking, customer support" },
                { title: "Healthcare", description: "Appointment reminders, patient communication, follow-ups" },
                { title: "Education", description: "Class updates, student notifications, parent communication" },
                { title: "Real Estate", description: "Property inquiries, viewing schedules, document sharing" },
              ].map((industry, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">{industry.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{industry.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start your free 14-day trial today. No credit card required.</p>
            <Link href="/installer">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
