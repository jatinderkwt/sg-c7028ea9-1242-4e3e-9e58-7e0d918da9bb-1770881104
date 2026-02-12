import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Zap, BarChart3, Shield, Sparkles, Database, Rocket, CheckCircle2, ArrowRight, Book, Github } from "lucide-react";

export default function Home() {
  return (
    <>
      <SEO
        title="Enterprise WhatsApp Business API Platform - Production-Ready SaaS"
        description="Multi-tenant WhatsApp Business API platform with full Meta Cloud API compliance, CRM, automation, and analytics"
        image="/og-image.png"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
        <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-8 h-8 text-emerald-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                WhatsApp Business API
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/docs" className="text-sm font-medium hover:text-emerald-600 transition-colors">
                Documentation
              </Link>
              <Link href="/getting-started" className="text-sm font-medium hover:text-emerald-600 transition-colors">
                Getting Started
              </Link>
              <Link href="/installer">
                <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                  Install Now
                </Button>
              </Link>
            </nav>
          </div>
        </header>

        <section className="container mx-auto px-4 py-20 text-center">
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Meta WhatsApp Cloud API Certified
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent leading-tight">
            Enterprise WhatsApp
            <br />
            Business Platform
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Production-ready multi-tenant SaaS with full Meta Cloud API compliance.
            <br />
            <span className="font-semibold">20+ API endpoints • Multi-tenant • CRM • Automation • Analytics</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/getting-started">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6">
                <Rocket className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                <Book className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </Link>
            <Link href="/installer">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Database className="w-5 h-5 mr-2" />
                Install Platform
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="border-emerald-100 dark:border-emerald-900">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-emerald-600">40+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">API Endpoints</div>
              </CardContent>
            </Card>
            <Card className="border-emerald-100 dark:border-emerald-900">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-emerald-600">9</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Step Installer</div>
              </CardContent>
            </Card>
            <Card className="border-emerald-100 dark:border-emerald-900">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-emerald-600">15</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Database Models</div>
              </CardContent>
            </Card>
            <Card className="border-emerald-100 dark:border-emerald-900">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-emerald-600">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Type Safe</div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-center mb-12">Core Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-emerald-100 dark:border-emerald-900 hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageSquare className="w-12 h-12 text-emerald-600 mb-4" />
                <CardTitle>Real-Time Messaging</CardTitle>
                <CardDescription>
                  Full WhatsApp Cloud API integration with webhook processing, message status tracking, and media support
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-100 dark:border-emerald-900 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-emerald-600 mb-4" />
                <CardTitle>Multi-Tenant SaaS</CardTitle>
                <CardDescription>
                  Complete tenant isolation with per-tenant settings, branding, subscriptions, and usage tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-100 dark:border-emerald-900 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="w-12 h-12 text-emerald-600 mb-4" />
                <CardTitle>Automation Engine</CardTitle>
                <CardDescription>
                  Workflow automation with triggers, conditions, and actions for intelligent message routing
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-100 dark:border-emerald-900 hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-emerald-600 mb-4" />
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive reporting with message metrics, agent performance, and campaign analytics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-100 dark:border-emerald-900 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="w-12 h-12 text-emerald-600 mb-4" />
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  JWT authentication, AES-256 encryption, RBAC, audit logs, and Meta webhook validation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-100 dark:border-emerald-900 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Sparkles className="w-12 h-12 text-emerald-600 mb-4" />
                <CardTitle>CRM & Campaigns</CardTitle>
                <CardDescription>
                  Full CRM with contacts, deals, tasks, and template-based broadcast campaigns
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl text-white my-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Meta WhatsApp Compliance</h2>
            <p className="text-xl mb-8 text-emerald-50">
              Fully compliant with Meta WhatsApp Business API policies
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">24-Hour Window Enforcement</h3>
                  <p className="text-emerald-50">Automatic blocking of free-form messages outside customer service window</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Template Management</h3>
                  <p className="text-emerald-50">Create, submit, and track approval status for Marketing, Utility, and Authentication templates</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Opt-In Compliance</h3>
                  <p className="text-emerald-50">Track opt-in source, timestamp, and proof for GDPR compliance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Quality Monitoring</h3>
                  <p className="text-emerald-50">Message delivery tracking, failure logging, and rate limiting</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-center mb-12">Technology Stack</h2>
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { name: "Next.js 15", desc: "React Framework" },
              { name: "TypeScript", desc: "Type Safety" },
              { name: "PostgreSQL", desc: "Database" },
              { name: "Prisma ORM", desc: "Database Toolkit" },
              { name: "Tailwind CSS", desc: "Styling" },
              { name: "Shadcn/UI", desc: "Components" },
              { name: "JWT", desc: "Authentication" },
              { name: "AES-256", desc: "Encryption" }
            ].map((tech) => (
              <Card key={tech.name} className="text-center border-emerald-100 dark:border-emerald-900">
                <CardHeader>
                  <CardTitle className="text-lg">{tech.name}</CardTitle>
                  <CardDescription>{tech.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Install the platform in minutes with our guided 9-step installer wizard
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/getting-started">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-6">
                View Installation Guide
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                <Book className="w-5 h-5 mr-2" />
                Read Documentation
              </Button>
            </Link>
          </div>
        </section>

        <footer className="border-t bg-gray-50 dark:bg-gray-900 mt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-6 h-6 text-emerald-600" />
                  <span className="font-bold">WhatsApp Business API</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enterprise-grade WhatsApp Business platform with full Meta compliance
                </p>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Platform</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><Link href="/getting-started" className="hover:text-emerald-600">Getting Started</Link></li>
                  <li><Link href="/docs" className="hover:text-emerald-600">Documentation</Link></li>
                  <li><Link href="/installer" className="hover:text-emerald-600">Installation</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><Link href="/docs#api-reference" className="hover:text-emerald-600">API Reference</Link></li>
                  <li><Link href="/docs#compliance" className="hover:text-emerald-600">Compliance Guide</Link></li>
                  <li><Link href="/docs#deployment" className="hover:text-emerald-600">Deployment</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Connect</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><a href="https://github.com" className="hover:text-emerald-600 flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    GitHub
                  </a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>© 2026 WhatsApp Business API Platform. Built with Next.js, TypeScript & PostgreSQL.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}