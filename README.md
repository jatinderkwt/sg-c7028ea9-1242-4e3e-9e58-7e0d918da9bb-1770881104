# 🚀 Enterprise WhatsApp Business API Platform

**Production-Ready Multi-Tenant SaaS with Full Meta Cloud API Compliance**

A comprehensive enterprise-grade WhatsApp Business API platform built with Next.js 15, PostgreSQL, and full Meta WhatsApp Cloud API integration. This platform includes a complete installation wizard, multi-tenant architecture, CRM, automation engine, and advanced analytics.

---

## ✨ **Key Features**

### 🎯 **Core Platform**
- ✅ **Multi-Tenant SaaS Architecture** - Complete tenant isolation with per-tenant data, settings, and branding
- ✅ **First-Access Installation Wizard** - 9-step guided setup for system initialization
- ✅ **Role-Based Access Control** - Super Admin, Admin, Manager, Agent roles with granular permissions
- ✅ **Enterprise Authentication** - JWT-based auth with secure HTTP-only cookies
- ✅ **Multi-Theme System** - Light/dark mode with custom branding per tenant

### 💬 **WhatsApp Integration**
- ✅ **Meta Cloud API Integration** - Official WhatsApp Business API with full compliance
- ✅ **24-Hour Messaging Window Enforcement** - Automatic validation and blocking
- ✅ **Template Management** - Create, submit, and track approval status
- ✅ **Real-Time Webhooks** - Instant message delivery and status updates
- ✅ **Media Support** - Text, images, audio, video, documents
- ✅ **Message Status Tracking** - Sent, delivered, read, failed states

### 📊 **CRM & Business Tools**
- ✅ **Contact Management** - Full contact lifecycle with custom fields and segmentation
- ✅ **Deal Pipeline** - Track sales opportunities through customizable stages
- ✅ **Task Management** - Assign and track follow-ups with due dates
- ✅ **Conversation Inbox** - Unified inbox with assignment and routing
- ✅ **Opt-In Compliance** - Track consent source, timestamp, and proof

### 🤖 **Automation & Campaigns**
- ✅ **Campaign Engine** - Schedule and send template-based broadcasts
- ✅ **Automation Workflows** - Trigger-based actions (keyword detection, status changes)
- ✅ **Audience Segmentation** - Target contacts by tags, CRM stage, custom filters
- ✅ **Batch Sending** - Queue-based message delivery with retry logic

### 📈 **Analytics & Reporting**
- ✅ **Message Analytics** - Delivery rates, read rates, volume metrics
- ✅ **Agent Performance** - Response times, resolution metrics, SLA tracking
- ✅ **Campaign Reports** - Delivery success, engagement tracking
- ✅ **Business Intelligence** - Deal pipeline, revenue tracking, contact growth

### 🔐 **Security & Compliance**
- ✅ **AES-256-GCM Encryption** - Secure credential storage
- ✅ **Webhook Signature Validation** - Verify Meta webhook authenticity
- ✅ **Audit Logging** - Track all sensitive operations
- ✅ **Meta Policy Compliance** - 24h window, opt-in tracking, quality monitoring
- ✅ **RBAC Middleware** - Endpoint-level permission enforcement

### 💰 **Subscription & Billing**
- ✅ **Subscription Plans** - Feature-based plan management
- ✅ **Usage Tracking** - Monitor message quotas and limits
- ✅ **Trial Management** - Automated trial periods
- ✅ **Billing Cycles** - Monthly/yearly subscriptions

---

## 🏗 **Architecture**

```
/src
  /pages
    /api
      /auth              # Authentication endpoints
      /installer         # 9-step installation wizard
      /contacts          # Contact CRUD operations
      /conversations     # Conversation management
      /messages          # Message sending & retrieval
      /templates         # Template lifecycle management
      /campaigns         # Campaign creation & execution
      /automations       # Workflow automation
      /deals             # CRM deal pipeline
      /tasks             # Task management
      /users             # User management
      /roles             # Role & permission management
      /tenants           # Tenant administration
      /subscriptions     # Subscription management
      /analytics         # Reporting endpoints
      /audit-logs        # Audit trail
      /webhook           # WhatsApp webhook handler
    /installer.tsx       # Installation wizard UI
    /index.tsx           # Landing page
  /lib
    /services
      /meta-api.service.ts      # WhatsApp Cloud API wrapper
      /message.service.ts       # Message business logic
      /conversation.service.ts  # Conversation management
      /contact.service.ts       # Contact operations
      /subscription.service.ts  # Subscription management
      /theme.service.ts         # Theme customization
    /auth.ts             # JWT authentication utilities
    /encryption.ts       # AES-256-GCM encryption
    /prisma.ts           # Prisma client singleton
    /installer.ts        # Installation utilities
  /components
    /ui                  # Shadcn/UI components
    /SEO.tsx            # SEO meta tags
    /ThemeSwitch.tsx    # Theme toggle
  /contexts
    /ThemeProvider.tsx  # Theme context
  /styles
    /globals.css        # Global styles + Tailwind
/prisma
  /schema.prisma        # Complete database schema
```

---

## 📦 **Database Schema**

### **Core Models**
- **Tenant** - Multi-tenant isolation root
- **User** - System users with role assignments
- **Role** - Role definitions with permissions
- **Permission** - Granular access control
- **WhatsAppAccount** - Encrypted WhatsApp credentials
- **SubscriptionPlan** - Pricing tiers
- **Subscription** - Tenant subscriptions

### **Messaging Models**
- **Contact** - Customer database with opt-in tracking
- **Conversation** - Chat threads with 24h window tracking
- **Message** - Individual messages with status
- **Template** - WhatsApp message templates
- **Campaign** - Broadcast campaigns

### **CRM Models**
- **Deal** - Sales pipeline opportunities
- **Task** - Follow-up tasks and reminders

### **System Models**
- **Automation** - Workflow definitions
- **AuditLog** - Security audit trail

---

## 🚀 **Installation Wizard**

### **Step-by-Step Setup**

#### **Step 1: System Requirements Check**
- ✅ Node.js version validation
- ✅ PostgreSQL connectivity test
- ✅ Environment variables verification
- ✅ File permissions check
- ✅ Storage availability

#### **Step 2: Database Initialization**
- ✅ Auto-create all tables (Prisma migrations)
- ✅ Seed default roles and permissions
- ✅ Create default subscription plans

#### **Step 3: Super Admin Creation**
- 👤 Admin credentials setup
- 🔐 Secure password hashing (bcrypt)
- 🌍 Timezone & language preferences

#### **Step 4: Company Setup**
- 🏢 Company profile configuration
- 📧 Contact information
- 💱 Currency & timezone settings
- 🎨 Logo upload

#### **Step 5: SaaS Configuration**
- 📊 Enable/disable multi-tenancy
- 🆓 Set trial duration
- 💳 Configure payment gateways

#### **Step 6: Email & Notifications**
- 📧 SMTP configuration
- ✉️ Email template setup
- ✅ Test email delivery

#### **Step 7: WhatsApp API Setup**
- 📱 Meta App credentials
- 🔑 Access token configuration
- 🔗 Webhook URL setup
- ✅ API connectivity test

#### **Step 8: System Preferences**
- 🎨 Default theme selection
- 📅 Date/time format
- ⏱️ Auto-logout settings
- 📁 File upload limits

#### **Step 9: Final Summary**
- 📋 Configuration review
- ✅ Complete installation
- 🔒 Lock installer
- 🚀 Redirect to login

---

## 🔧 **Environment Setup**

### **1. Install Dependencies**

```bash
npm install
```

### **2. Configure Environment Variables**

Update `.env.local`:

```env
# Database
DATABASE_URL="postgresql://whatsapp:JoalcnpPuVQtqFnq@72.61.249.147:6543/whatsappbizapi"

# JWT Authentication
JWT_SECRET="your-super-secure-jwt-secret-key-change-this"

# Encryption (32 bytes hex)
ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"

# Meta WhatsApp Cloud API
META_APP_ID="your-meta-app-id"
META_APP_SECRET="your-meta-app-secret"
META_API_VERSION="v21.0"
WEBHOOK_VERIFY_TOKEN="your-webhook-verify-token"
WEBHOOK_APP_SECRET="your-webhook-app-secret"

# Application
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### **3. Run Database Migrations**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### **4. Start Development Server**

```bash
npm run dev
```

### **5. Access Installation Wizard**

Navigate to: `http://localhost:3000/installer`

---

## 📡 **API Endpoints**

### **Authentication**
```
POST   /api/auth/login       # User login
POST   /api/auth/logout      # User logout
GET    /api/auth/me          # Get current user
```

### **Contacts**
```
GET    /api/contacts         # List contacts (paginated, searchable)
POST   /api/contacts         # Create contact
GET    /api/contacts/:id     # Get contact details
PUT    /api/contacts/:id     # Update contact
DELETE /api/contacts/:id     # Delete contact
```

### **Conversations**
```
GET    /api/conversations              # List conversations
GET    /api/conversations/:id/messages # Get messages in conversation
```

### **Messages**
```
POST   /api/messages/send    # Send message (auto 24h validation)
```

### **Templates**
```
GET    /api/templates        # List templates
POST   /api/templates        # Create template
POST   /api/templates/submit # Submit to Meta for approval
POST   /api/templates/status # Check approval status
```

### **Campaigns**
```
GET    /api/campaigns        # List campaigns
POST   /api/campaigns        # Create campaign
```

### **CRM**
```
GET    /api/deals            # List deals
POST   /api/deals            # Create deal
GET    /api/tasks            # List tasks
POST   /api/tasks            # Create task
```

### **Administration**
```
GET    /api/users            # List users (RBAC)
POST   /api/users            # Create user (Admin+)
GET    /api/roles            # List roles
POST   /api/roles            # Create role (Admin+)
GET    /api/tenants          # List tenants (Super Admin)
POST   /api/tenants          # Create tenant (Super Admin)
GET    /api/subscriptions    # Subscription management
```

### **Analytics**
```
GET    /api/analytics/overview # Get dashboard metrics
```

### **System**
```
GET    /api/audit-logs       # Audit trail (Admin+)
```

### **Webhooks**
```
GET    /api/webhook/whatsapp # Webhook verification
POST   /api/webhook/whatsapp # Receive WhatsApp events
```

---

## 🔐 **Security Features**

### **Authentication & Authorization**
- JWT tokens with 7-day expiration
- HTTP-only secure cookies
- Role-based middleware on all protected endpoints
- Session validation on every request

### **Data Protection**
- AES-256-GCM encryption for sensitive credentials
- Bcrypt password hashing (10 rounds)
- Webhook signature validation (HMAC-SHA256)
- SQL injection prevention (Prisma ORM)

### **Compliance**
- GDPR-ready audit logging
- Opt-in consent tracking with proof
- Data retention policies
- Secure credential storage

---

## 🎨 **Customization**

### **Theme System**
Each tenant can customize:
- Primary & secondary colors
- Light/dark mode preference
- Font family
- Border radius
- Logo & branding assets

### **Access via API**
```typescript
// Get tenant theme
GET /api/theme

// Update theme
PUT /api/theme
{
  "mode": "dark",
  "primaryColor": "#10b981",
  "secondaryColor": "#3b82f6",
  "fontFamily": "Inter",
  "borderRadius": "0.5rem"
}
```

---

## 📊 **Meta WhatsApp Compliance**

### **✅ 24-Hour Customer Service Window**
- Automatic window tracking on inbound messages
- Free-form messaging only within 24 hours
- Template-only messaging outside window
- API returns error if window expired

### **✅ Template-Based Messaging**
- Support for Marketing, Utility, Authentication categories
- Parameter substitution
- Multi-language support
- Approval status sync with Meta

### **✅ Opt-In Compliance**
- Store opt-in source (web form, phone, in-person)
- Record opt-in timestamp
- Store proof reference (message ID, form submission ID)
- Block messaging to contacts without opt-in

### **✅ Quality Monitoring**
- Message delivery rate tracking
- Failure reason logging
- Quality score monitoring
- Rate limiting support

---

## 🚀 **Deployment**

### **Vercel (Recommended)**

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### **Docker**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **VPS**

```bash
# Install Node.js 20+
# Install PostgreSQL 14+
# Clone repository
git clone <your-repo>
cd whatsapp-platform

# Install dependencies
npm ci

# Setup environment
cp .env.example .env
nano .env

# Run migrations
npx prisma migrate deploy

# Build
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
```

---

## 📚 **Tech Stack**

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with Pages Router |
| **TypeScript** | Type safety |
| **PostgreSQL** | Relational database |
| **Prisma ORM** | Database toolkit |
| **Tailwind CSS** | Styling |
| **Shadcn/UI** | Component library |
| **JWT** | Authentication |
| **Bcrypt** | Password hashing |
| **Crypto (Node.js)** | AES-256-GCM encryption |

---

## 🎯 **Roadmap**

### **Phase 1: Core Platform** ✅
- Multi-tenant architecture
- Installation wizard
- Authentication & RBAC
- WhatsApp integration
- Basic messaging

### **Phase 2: Advanced Features** ✅
- CRM (Contacts, Deals, Tasks)
- Campaign engine
- Automation workflows
- Analytics dashboard
- Subscription management

### **Phase 3: Enterprise (Next)**
- Redis queue integration
- WebSocket real-time updates
- AI-powered features (sentiment analysis, auto-replies)
- Advanced reporting
- Payment gateway integration (Stripe, PayPal)

---

## 📖 **Documentation**

### **Getting Started**
1. Complete installation wizard at `/installer`
2. Configure WhatsApp API credentials in settings
3. Create your first template
4. Import contacts with opt-in data
5. Send your first campaign

### **Best Practices**
- Always verify 24-hour window before sending messages
- Store opt-in proof for compliance
- Monitor message quality scores
- Use templates for marketing outside 24h window
- Implement proper error handling for webhook events

---

## 🤝 **Support**

- **Documentation**: This README + inline code comments
- **Issues**: GitHub Issues
- **API Reference**: See "API Endpoints" section above

---

## 📄 **License**

MIT License - feel free to use this for commercial projects.

---

## 🙏 **Credits**

Built with ❤️ using:
- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/UI](https://ui.shadcn.com)
- [Meta WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)

---

## 🔗 **Quick Links**

- **Landing Page**: `/`
- **Installation Wizard**: `/installer`
- **API Documentation**: See "API Endpoints" section
- **Database Schema**: `prisma/schema.prisma`

---

**🚀 Ready to revolutionize WhatsApp Business communication!**