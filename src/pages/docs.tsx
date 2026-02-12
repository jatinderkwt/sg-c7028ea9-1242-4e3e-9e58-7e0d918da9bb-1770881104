import React, { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MessageSquare, ArrowLeft, Lock, Users, MessageCircle, FileText, 
  Megaphone, Zap, TrendingUp, DollarSign, Building2, CheckCircle2, 
  Webhook, Shield, Copy, Check
} from "lucide-react";

export default function Documentation() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, language = "bash", id }: { code: string; language?: string; id: string }) => (
    <div className="relative">
      <div className="bg-gray-900 dark:bg-black rounded-lg p-4 text-gray-100 font-mono text-sm overflow-x-auto">
        <pre>{code}</pre>
      </div>
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
      >
        {copiedCode === id ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400" />
        )}
      </button>
    </div>
  );

  return (
    <>
      <SEO
        title="API Documentation - WhatsApp Business API Platform"
        description="Complete API reference for the Enterprise WhatsApp Business API Platform with 40+ endpoints"
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

        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="mb-12">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
              API Documentation
            </Badge>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              API Reference
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Complete documentation for all 40+ API endpoints with examples and response formats
            </p>
          </div>

          <Alert className="mb-8 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-800 dark:text-emerald-300">
              All API endpoints require authentication via JWT tokens. Include the token in the Authorization header or use HTTP-only cookies.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="auth" className="space-y-8">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2">
              <TabsTrigger value="auth" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Auth
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Contacts
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="flex items-center gap-2">
                <Megaphone className="w-4 h-4" />
                Campaigns
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="auth" className="space-y-6">
              <Card className="border-emerald-100 dark:border-emerald-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-700">POST</Badge>
                    <CardTitle className="font-mono text-lg">/api/auth/login</CardTitle>
                  </div>
                  <CardDescription>Authenticate a user and receive JWT token</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Request Body</h4>
                    <CodeBlock
                      id="auth-login-req"
                      language="json"
                      code={`{
  "email": "admin@example.com",
  "password": "SecurePassword123"
}`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Response (200 OK)</h4>
                    <CodeBlock
                      id="auth-login-res"
                      language="json"
                      code={`{
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "tenantId": "tenant-uuid"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-100 dark:border-emerald-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-700">GET</Badge>
                    <CardTitle className="font-mono text-lg">/api/auth/me</CardTitle>
                  </div>
                  <CardDescription>Get current authenticated user information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Headers</h4>
                    <CodeBlock
                      id="auth-me-headers"
                      code="Authorization: Bearer <token>"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Response (200 OK)</h4>
                    <CodeBlock
                      id="auth-me-res"
                      language="json"
                      code={`{
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": {
      "id": "role-uuid",
      "name": "admin"
    },
    "tenant": {
      "id": "tenant-uuid",
      "name": "My Company"
    }
  }
}`}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-100 dark:border-emerald-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-700">POST</Badge>
                    <CardTitle className="font-mono text-lg">/api/auth/logout</CardTitle>
                  </div>
                  <CardDescription>Logout user and clear session</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    id="auth-logout"
                    code={`curl -X POST http://localhost:3000/api/auth/logout \\
  -H "Authorization: Bearer <token>"`}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-6">
              <Card className="border-emerald-100 dark:border-emerald-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-700">GET</Badge>
                    <CardTitle className="font-mono text-lg">/api/contacts</CardTitle>
                  </div>
                  <CardDescription>List all contacts with pagination and search</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Query Parameters</h4>
                    <ul className="space-y-2 text-sm">
                      <li><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">search</code> - Search by name or phone</li>
                      <li><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">tags</code> - Filter by tags (comma-separated)</li>
                      <li><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">limit</code> - Results per page (default: 50)</li>
                      <li><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">offset</code> - Pagination offset</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Example Request</h4>
                    <CodeBlock
                      id="contacts-list"
                      code={`curl -X GET "http://localhost:3000/api/contacts?search=john&limit=20" \\
  -H "Authorization: Bearer <token>"`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Response (200 OK)</h4>
                    <CodeBlock
                      id="contacts-list-res"
                      language="json"
                      code={`{
  "contacts": [
    {
      "id": "uuid",
      "phoneNumber": "+1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "tags": ["customer", "vip"],
      "optInStatus": true,
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ],
  "total": 1
}`}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-100 dark:border-emerald-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-700">POST</Badge>
                    <CardTitle className="font-mono text-lg">/api/contacts</CardTitle>
                  </div>
                  <CardDescription>Create a new contact</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Request Body</h4>
                    <CodeBlock
                      id="contacts-create-req"
                      language="json"
                      code={`{
  "phoneNumber": "+1234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "tags": ["lead", "website"],
  "optInStatus": true,
  "optInSource": "website_form",
  "optInProof": "form_submission_12345"
}`}
                    />
                  </div>
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Opt-In Compliance:</strong> Always include opt-in information (status, source, proof) for Meta WhatsApp compliance
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card className="border-emerald-100 dark:border-emerald-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-yellow-100 text-yellow-700">PUT</Badge>
                    <CardTitle className="font-mono text-lg">/api/contacts/:id</CardTitle>
                  </div>
                  <CardDescription>Update an existing contact</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    id="contacts-update"
                    language="json"
                    code={`{
  "name": "John Doe Updated",
  "email": "john.new@example.com",
  "tags": ["customer", "vip", "premium"]
}`}
                  />
                </CardContent>
              </Card>

              <Card className="border-emerald-100 dark:border-emerald-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-red-100 text-red-700">DELETE</Badge>
                    <CardTitle className="font-mono text-lg">/api/contacts/:id</CardTitle>
                  </div>
                  <CardDescription>Delete a contact</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    id="contacts-delete"
                    code={`curl -X DELETE http://localhost:3000/api/contacts/uuid \\
  -H "Authorization: Bearer <token>"`}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <Card className="border-emerald-100 dark:border-emerald-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-700">GET</Badge>
                    <CardTitle className="font-mono text-lg">/api/conversations</CardTitle>
                  </div>
                  <CardDescription>List all conversations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Query Parameters</h4>
                    <ul className="space-y-2 text-sm">
                      <li><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">status</code> - Filter by status (open, closed, pending)</li>
                      <li><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">assignedUserId</code> - Filter by assigned agent</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Response (200 OK)</h4>
                    <CodeBlock
                      id="conversations-list"
                      language="json"
                      code={`{
  "conversations": [
    {
      "id": "uuid",
      "contact": {
        "id": "contact-uuid",
        "name": "John Doe",
        "phoneNumber": "+1234567890"
      },
      "status": "open",
      "unreadCount": 3,
      "lastMessageAt": "2026-02-12T10:30:00Z"
    }
  ]
}`}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-100 dark:border-emerald-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-700">GET</Badge>
                    <CardTitle className="font-mono text-lg">/api/conversations/:id/messages</CardTitle>
                  </div>
                  <CardDescription>Get messages in a conversation</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    id="messages-list"
                    language="json"
                    code={`{
  "messages": [
    {
      "id": "uuid",
      "direction": "inbound",
      "type": "text",
      "content": { "text": "Hello, I need help" },
      "status": "read",
      "createdAt": "2026-02-12T10:00:00Z"
    }
  ]
}`}
                  />
                </CardContent>
              </Card>

              <Card className="border-emerald-100 dark:border-emerald-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-700">POST</Badge>
                    <CardTitle className="font-mono text-lg">/api/messages/send</CardTitle>
                  </div>
                  <CardDescription>Send a message (with 24-hour window validation)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                    <Shield className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800 dark:text-yellow-300">
                      <strong>24-Hour Window:</strong> Free-form messages can only be sent within 24 hours of the last inbound message. Outside this window, use template messages.
                    </AlertDescription>
                  </Alert>
                  <div>
                    <h4 className="font-semibold mb-2">Request Body (Text Message)</h4>
                    <CodeBlock
                      id="messages-send-text"
                      language="json"
                      code={`{
  "contactId": "contact-uuid",
  "type": "text",
  "content": {
    "text": "Hello! How can I help you today?"
  }
}`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Request Body (Template Message)</h4>
                    <CodeBlock
                      id="messages-send-template"
                      language="json"
                      code={`{
  "contactId": "contact-uuid",
  "type": "template",
  "templateId": "template-uuid",
  "parameters": {
    "name": "John",
    "order_number": "12345"
  }
}`}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card className="border-emerald-100 dark:border-emerald-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-700">GET</Badge>
                    <CardTitle className="font-mono text-lg">/api/templates</CardTitle>
                  </div>
                  <CardDescription>List all message templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    id="templates-list"
                    language="json"
                    code={`{
  "templates": [
    {
      "id": "uuid",
      "name": "order_confirmation",
      "category": "UTILITY",
      "language": "en",
      "status": "APPROVED",
      "components": [
        {
          "type": "BODY",
          "text": "Your order {{1}} has been confirmed!"
        }
      ]
    }
  ]
}`}
                  />
                </CardContent>
              </Card>

              <Card className="border-emerald-100 dark:border-emerald-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-700">POST</Badge>
                    <CardTitle className="font-mono text-lg">/api/templates</CardTitle>
                  </div>
                  <CardDescription>Create a new template</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Request Body</h4>
                    <CodeBlock
                      id="templates-create"
                      language="json"
                      code={`{
  "name": "order_confirmation",
  "category": "UTILITY",
  "language": "en",
  "components": [
    {
      "type": "HEADER",
      "format": "TEXT",
      "text": "Order Update"
    },
    {
      "type": "BODY",
      "text": "Hi {{1}}, your order {{2}} has been confirmed and will be delivered by {{3}}."
    },
    {
      "type": "FOOTER",
      "text": "Thank you for shopping with us!"
    }
  ]
}`}
                    />
                  </div>
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      Templates must be submitted to Meta for approval before use. Use <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">/api/templates/submit</code>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card className="border-emerald-100 dark:border-emerald-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-700">POST</Badge>
                    <CardTitle className="font-mono text-lg">/api/templates/submit</CardTitle>
                  </div>
                  <CardDescription>Submit template to Meta for approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    id="templates-submit"
                    language="json"
                    code={`{
  "templateId": "template-uuid"
}`}
                  />
                </CardContent>
              </Card>

              <Card className="border-emerald-100 dark:border-emerald-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-700">GET</Badge>
                    <CardTitle className="font-mono text-lg">/api/templates/status</CardTitle>
                  </div>
                  <CardDescription>Check template approval status</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    id="templates-status"
                    code={`curl -X GET "http://localhost:3000/api/templates/status?templateId=uuid" \\
  -H "Authorization: Bearer <token>"`}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-6">
              <Card className="border-emerald-100 dark:border-emerald-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-700">GET</Badge>
                    <CardTitle className="font-mono text-lg">/api/campaigns</CardTitle>
                  </div>
                  <CardDescription>List all broadcast campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    id="campaigns-list"
                    language="json"
                    code={`{
  "campaigns": [
    {
      "id": "uuid",
      "name": "Summer Sale 2026",
      "template": {
        "id": "template-uuid",
        "name": "summer_sale"
      },
      "status": "completed",
      "scheduleAt": "2026-06-01T09:00:00Z",
      "stats": {
        "sent": 1000,
        "delivered": 980,
        "read": 750,
        "failed": 20
      }
    }
  ]
}`}
                  />
                </CardContent>
              </Card>

              <Card className="border-emerald-100 dark:border-emerald-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-700">POST</Badge>
                    <CardTitle className="font-mono text-lg">/api/campaigns</CardTitle>
                  </div>
                  <CardDescription>Create a new campaign</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Request Body</h4>
                    <CodeBlock
                      id="campaigns-create"
                      language="json"
                      code={`{
  "name": "Summer Sale 2026",
  "templateId": "template-uuid",
  "segment": {
    "tags": ["customer", "active"],
    "optInStatus": true
  },
  "scheduleAt": "2026-06-01T09:00:00Z"
}`}
                    />
                  </div>
                  <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                    <Shield className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800 dark:text-yellow-300">
                      <strong>Compliance:</strong> Campaigns can only be sent to contacts with opt-in status = true
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-emerald-100 dark:border-emerald-900">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-emerald-600" />
                      <CardTitle>User Management</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /api/users</code>
                      <Badge variant="outline">List users</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /api/users</code>
                      <Badge variant="outline">Create user</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">PUT /api/users/:id</code>
                      <Badge variant="outline">Update user</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-100 dark:border-emerald-900">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-emerald-600" />
                      <CardTitle>Roles & Permissions</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /api/roles</code>
                      <Badge variant="outline">List roles</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /api/roles</code>
                      <Badge variant="outline">Create role</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-100 dark:border-emerald-900">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-6 h-6 text-emerald-600" />
                      <CardTitle>Tenant Management</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /api/tenants</code>
                      <Badge variant="outline">List tenants</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /api/tenants</code>
                      <Badge variant="outline">Create tenant</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-100 dark:border-emerald-900">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-6 h-6 text-emerald-600" />
                      <CardTitle>Subscriptions</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /api/subscriptions</code>
                      <Badge variant="outline">List subscriptions</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /api/subscription-plans</code>
                      <Badge variant="outline">List plans</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-100 dark:border-emerald-900">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-emerald-600" />
                      <CardTitle>CRM</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /api/deals</code>
                      <Badge variant="outline">List deals</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /api/tasks</code>
                      <Badge variant="outline">List tasks</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-100 dark:border-emerald-900">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Zap className="w-6 h-6 text-emerald-600" />
                      <CardTitle>Automation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /api/automations</code>
                      <Badge variant="outline">List automations</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /api/automations</code>
                      <Badge variant="outline">Create automation</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-100 dark:border-emerald-900">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-emerald-600" />
                      <CardTitle>Analytics</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /api/analytics/overview</code>
                      <Badge variant="outline">Dashboard metrics</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-100 dark:border-emerald-900">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Webhook className="w-6 h-6 text-emerald-600" />
                      <CardTitle>Webhooks</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GET /api/webhook/whatsapp</code>
                      <Badge variant="outline">Verification</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">POST /api/webhook/whatsapp</code>
                      <Badge variant="outline">Events</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-emerald-100 dark:border-emerald-900 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20">
                <CardHeader>
                  <CardTitle>Audit Logs</CardTitle>
                  <CardDescription>Track all sensitive operations for compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock
                    id="audit-logs"
                    language="json"
                    code={`GET /api/audit-logs?userId=uuid&action=user_created&limit=50

{
  "logs": [
    {
      "id": "uuid",
      "action": "user_created",
      "resourceType": "user",
      "resourceId": "user-uuid",
      "user": {
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "details": { "role": "agent" },
      "ipAddress": "192.168.1.1",
      "createdAt": "2026-02-12T10:00:00Z"
    }
  ],
  "total": 245
}`}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="mt-12 border-emerald-100 dark:border-emerald-900 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                Authentication & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">JWT Token Authentication</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  All API endpoints (except login and webhook verification) require authentication via JWT token.
                </p>
                <CodeBlock
                  id="auth-header"
                  code={`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
                />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Role-Based Access Control</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><strong>Super Admin:</strong> Full system access, tenant management, billing</li>
                  <li><strong>Admin:</strong> Tenant settings, user management, all features</li>
                  <li><strong>Manager:</strong> View analytics, assign conversations, manage agents</li>
                  <li><strong>Agent:</strong> Handle conversations, send messages, update CRM</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Rate Limiting</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  API requests are rate-limited based on subscription plan. Exceeded limits return 429 status.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 flex items-center justify-between">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex gap-4">
              <Link href="/getting-started">
                <Button variant="outline">
                  Getting Started Guide
                </Button>
              </Link>
              <Link href="/installer">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Start Installation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}