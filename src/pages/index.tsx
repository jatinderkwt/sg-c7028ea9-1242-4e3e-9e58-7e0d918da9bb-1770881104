import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Zap, Shield, BarChart3, Bot, Clock, CheckCircle2, ArrowRight, Smartphone, Send, Globe } from "lucide-react";

export default function Home() {
  return (
    <>
      <SEO 
        title="Enterprise WhatsApp Business API Platform"
        description="Production-ready WhatsApp Business SaaS platform with full Meta Cloud API compliance, multi-tenant architecture, and advanced automation."
      />
      
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">WhatsApp Business API</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Enterprise Platform</p>
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="#compliance" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                  Compliance
                </Link>
                <Link href="#api" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                  API Docs
                </Link>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  Get Started
                </Button>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Meta WhatsApp Cloud API Compliant</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight">
                Enterprise WhatsApp
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Business Platform
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Production-ready SaaS platform with multi-tenant architecture, CRM integration, automation engine, and full Meta compliance. Built with Next.js, PostgreSQL, and TypeScript.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 h-12">
                  View Documentation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-slate-300 dark:border-slate-700 h-12 px-8">
                  Explore API
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">20+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">API Endpoints</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">15</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Database Models</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">100%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Meta Compliant</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="outline" className="mb-4">Core Features</Badge>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Everything You Need for Enterprise Messaging
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Built with production-grade architecture and enterprise security standards
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle>Real-Time Chat Inbox</CardTitle>
                  <CardDescription>
                    WhatsApp-style UI with typing indicators, message status tracking, and media support
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>Multi-Tenant SaaS</CardTitle>
                  <CardDescription>
                    Complete data isolation, custom branding, subscription plans, and usage tracking
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950 rounded-lg flex items-center justify-center mb-4">
                    <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle>Automation Engine</CardTitle>
                  <CardDescription>
                    Visual workflow builder with trigger-based actions and CRM integration
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950 rounded-lg flex items-center justify-center mb-4">
                    <Send className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle>Campaign Engine</CardTitle>
                  <CardDescription>
                    Template-based broadcasting with segmentation, scheduling, and analytics
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-950 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle>Enterprise Security</CardTitle>
                  <CardDescription>
                    JWT auth, RBAC, AES-256 encryption, rate limiting, and audit logging
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <CardTitle>Analytics & Reporting</CardTitle>
                  <CardDescription>
                    Message metrics, agent performance, campaign analytics, and quality monitoring
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-950 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <CardTitle>Integrated CRM</CardTitle>
                  <CardDescription>
                    Contact management, leads pipeline, deals tracking, tasks, and appointments
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-950 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <CardTitle>24-Hour Window</CardTitle>
                  <CardDescription>
                    Automatic enforcement of Meta's 24-hour messaging window with template fallback
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-950 rounded-lg flex items-center justify-center mb-4">
                    <Smartphone className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <CardTitle>Template Management</CardTitle>
                  <CardDescription>
                    Create, submit, and track WhatsApp message templates with Meta approval sync
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section id="compliance" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4">Meta Compliance</Badge>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  100% WhatsApp Policy Compliant
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Built following official Meta WhatsApp Business API guidelines
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                      24-Hour Service Window
                    </CardTitle>
                    <CardDescription className="text-green-600 dark:text-green-500">
                      Automatic enforcement of messaging windows with template fallback outside 24 hours
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                      Template-Based Messaging
                    </CardTitle>
                    <CardDescription className="text-green-600 dark:text-green-500">
                      Support for Marketing, Utility, and Authentication templates with parameter handling
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                      Opt-In Management
                    </CardTitle>
                    <CardDescription className="text-green-600 dark:text-green-500">
                      Track opt-in source, timestamp, and proof with broadcast permission validation
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                      Quality Monitoring
                    </CardTitle>
                    <CardDescription className="text-green-600 dark:text-green-500">
                      Message status tracking, delivery rates, and tier-aware rate limiting
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">Technology Stack</Badge>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Built with Modern Technologies
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-12">
                Production-ready architecture with enterprise-grade tools
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: "Next.js 15", desc: "Pages Router" },
                  { name: "TypeScript", desc: "Type Safety" },
                  { name: "PostgreSQL", desc: "Database" },
                  { name: "Prisma ORM", desc: "Data Layer" },
                  { name: "JWT Auth", desc: "Security" },
                  { name: "Tailwind CSS", desc: "Styling" },
                  { name: "Meta API", desc: "WhatsApp" },
                  { name: "Shadcn/UI", desc: "Components" },
                ].map((tech) => (
                  <Card key={tech.name} className="border-slate-200 dark:border-slate-800">
                    <CardContent className="pt-6 text-center">
                      <div className="font-semibold text-slate-900 dark:text-white mb-1">
                        {tech.name}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {tech.desc}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <CardContent className="py-16 text-center">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  Ready to Build Your WhatsApp Business Platform?
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                  Complete backend infrastructure with 20+ API endpoints, multi-tenant architecture, and full Meta compliance. Start building your frontend now.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 h-12">
                    Read Documentation
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-slate-300 dark:border-slate-700 h-12 px-8">
                    View on GitHub
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  © 2026 WhatsApp Business API Platform
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Documentation
                </Link>
                <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  API Reference
                </Link>
                <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}