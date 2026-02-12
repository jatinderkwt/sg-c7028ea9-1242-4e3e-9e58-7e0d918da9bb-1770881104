import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, ArrowLeft, CheckCircle2, Terminal, Database, 
  Key, Webhook, Rocket, Settings, Users, FileText 
} from "lucide-react";

export default function GettingStarted() {
  return (
    <>
      <SEO
        title="Getting Started - WhatsApp Business API Platform"
        description="Complete installation and setup guide for the Enterprise WhatsApp Business API Platform"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
        <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <MessageSquare className="w-8 h-8 text-emerald-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                WhatsApp Business API
              </span>
            </Link>
            <Link href="/installer">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Start Installation
              </Button>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="mb-12">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
              Getting Started Guide
            </Badge>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Installation & Setup
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Complete guide to install and configure your Enterprise WhatsApp Business API Platform
            </p>
          </div>

          <Alert className="mb-8 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-800 dark:text-emerald-300">
              This platform includes a <strong>9-step guided installer</strong> that automates most of the setup process.
              Follow this guide for prerequisites and environment configuration.
            </AlertDescription>
          </Alert>

          <div className="space-y-8">
            <Card className="border-emerald-100 dark:border-emerald-900">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 font-bold">
                    1
                  </div>
                  <div>
                    <CardTitle>System Requirements</CardTitle>
                    <CardDescription>Ensure your environment meets these prerequisites</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Node.js 18+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Latest LTS version recommended</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">PostgreSQL 14+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Or compatible database</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">npm or yarn</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Package manager</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Meta Developer Account</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">For WhatsApp API access</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-100 dark:border-emerald-900">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 font-bold">
                    2
                  </div>
                  <div>
                    <CardTitle>Install Dependencies</CardTitle>
                    <CardDescription>Clone and setup the project</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900 dark:bg-black rounded-lg p-4 text-gray-100 font-mono text-sm space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Terminal className="w-4 h-4" />
                    <span>Terminal</span>
                  </div>
                  <div>$ git clone https://github.com/yourusername/whatsapp-platform.git</div>
                  <div>$ cd whatsapp-platform</div>
                  <div>$ npm install</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-100 dark:border-emerald-900">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 font-bold">
                    3
                  </div>
                  <div>
                    <CardTitle>Configure Environment Variables</CardTitle>
                    <CardDescription>Update .env.local with your settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    Update the <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">.env.local</code> file with your actual credentials
                  </AlertDescription>
                </Alert>
                <div className="bg-gray-900 dark:bg-black rounded-lg p-4 text-gray-100 font-mono text-sm space-y-1 overflow-x-auto">
                  <div className="text-gray-400"># Database</div>
                  <div>DATABASE_URL="postgresql://user:password@host:port/dbname"</div>
                  <div className="text-gray-400 mt-3"># JWT Authentication</div>
                  <div>JWT_SECRET="your-super-secure-jwt-secret-key"</div>
                  <div className="text-gray-400 mt-3"># Encryption (32 bytes hex)</div>
                  <div>ENCRYPTION_KEY="your-64-character-hex-key"</div>
                  <div className="text-gray-400 mt-3"># Meta WhatsApp Cloud API</div>
                  <div>META_APP_ID="your-meta-app-id"</div>
                  <div>META_APP_SECRET="your-meta-app-secret"</div>
                  <div>WEBHOOK_VERIFY_TOKEN="your-webhook-verify-token"</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-100 dark:border-emerald-900">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 font-bold">
                    4
                  </div>
                  <div>
                    <CardTitle>Initialize Database</CardTitle>
                    <CardDescription>Run Prisma migrations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900 dark:bg-black rounded-lg p-4 text-gray-100 font-mono text-sm space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Database className="w-4 h-4" />
                    <span>Database Setup</span>
                  </div>
                  <div>$ npx prisma migrate dev --name init</div>
                  <div>$ npx prisma generate</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-100 dark:border-emerald-900">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 font-bold">
                    5
                  </div>
                  <div>
                    <CardTitle>Start Development Server</CardTitle>
                    <CardDescription>Launch the application</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900 dark:bg-black rounded-lg p-4 text-gray-100 font-mono text-sm space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Rocket className="w-4 h-4" />
                    <span>Start Server</span>
                  </div>
                  <div>$ npm run dev</div>
                  <div className="text-gray-400 mt-2"># Server running at http://localhost:3000</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-100 dark:border-emerald-900">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 font-bold">
                    6
                  </div>
                  <div>
                    <CardTitle>Run Installation Wizard</CardTitle>
                    <CardDescription>Complete the 9-step guided setup</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20">
                  <Settings className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-800 dark:text-emerald-300">
                    Navigate to <strong>http://localhost:3000/installer</strong> to begin the guided setup
                  </AlertDescription>
                </Alert>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1" />
                    <div>
                      <div className="font-medium">Step 1-2: System Check & Database</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Verify requirements and initialize database</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-emerald-600 mt-1" />
                    <div>
                      <div className="font-medium">Step 3: Create Super Admin</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Set up your admin account</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Settings className="w-5 h-5 text-emerald-600 mt-1" />
                    <div>
                      <div className="font-medium">Step 4-8: Configuration</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Company, SaaS, email, WhatsApp API, and preferences</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1" />
                    <div>
                      <div className="font-medium">Step 9: Complete Installation</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Review and finalize setup</div>
                    </div>
                  </div>
                </div>
                <Link href="/installer">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Rocket className="w-4 h-4 mr-2" />
                    Start Installation Wizard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-emerald-100 dark:border-emerald-900">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 font-bold">
                    7
                  </div>
                  <div>
                    <CardTitle>Configure Meta WhatsApp</CardTitle>
                    <CardDescription>Set up your WhatsApp Business account</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <div className="font-medium">Create Meta App</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Go to <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Meta for Developers</a> and create a WhatsApp Business app
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <div className="font-medium">Get Access Token</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Generate a permanent access token for your WhatsApp Business Account
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <div className="font-medium">Configure Webhook</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Set webhook URL to: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">https://yourdomain.com/api/webhook/whatsapp</code>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 text-sm font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <div className="font-medium">Test Connection</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Send a test message to verify your setup is working
                      </div>
                    </div>
                  </div>
                </div>
                <Alert>
                  <Webhook className="h-4 w-4" />
                  <AlertDescription>
                    The installer wizard (Step 7) will guide you through this process with validation checks
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="border-emerald-100 dark:border-emerald-900 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  Next Steps
                </CardTitle>
                <CardDescription>After installation is complete</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <Link href="/docs" className="text-emerald-600 hover:underline font-medium">
                    Read the complete API documentation
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>Create user roles and invite team members</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <span>Import contacts and create message templates</span>
                </div>
                <div className="flex items-center gap-3">
                  <Rocket className="w-5 h-5 text-emerald-600" />
                  <span>Launch your first campaign</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 flex items-center justify-between">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex gap-4">
              <Link href="/docs">
                <Button variant="outline">
                  View Documentation
                </Button>
              </Link>
              <Link href="/installer">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Start Installation
                  <Rocket className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}