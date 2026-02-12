# WaFiz - WhatsApp Business SaaS Platform

A complete, production-ready WhatsApp Business API SaaS platform built with Next.js 14, PostgreSQL, and Stripe.

## 🚀 Features

### Core Platform
- **Multi-tenant Architecture**: Separate workspaces for each organization
- **WhatsApp Business Integration**: Full WhatsApp Cloud API integration
- **Shared Inbox**: Real-time messaging with multi-agent support
- **CRM System**: Contact management with custom fields and tags
- **Automation**: Visual flow builder with triggers and actions
- **Broadcast Campaigns**: Template-based message campaigns
- **Analytics Dashboard**: Comprehensive metrics and reporting
- **Templates Management**: WhatsApp template creation and approval tracking

### User Roles
- **Super Admin**: Global system control
- **Manager**: Team and workspace management
- **Agent**: Customer support and messaging

### Advanced Features
- AI-powered auto-replies
- Keyword-based automation
- Lead scoring
- Conversation routing
- Multi-language support
- Voice-to-text capability
- Knowledge base integration
- Campaign analytics

### Monetization
- **Stripe Integration**: Subscription management
- **Multi-tier Plans**: Starter, Growth, Enterprise
- **Usage-based Metrics**: Number limits, agent limits, contact limits
- **Billing Dashboard**: Invoice history and payment methods
- **Admin Analytics**: Revenue, MRR, churn tracking

### Web Installer
- Step-by-step setup wizard
- Database configuration
- Admin user creation
- Platform settings

## 📋 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + NextAuth.js
- **Payment**: Stripe
- **UI Components**: Custom + Tailwind
- **Charts**: Recharts
- **Form Handling**: React Hook Form + Zod

## 🛠️ Prerequisites

- Node.js 18.17.0+
- PostgreSQL 13+
- npm or yarn

## 📦 Installation

### 1. Clone or extract the project

```bash
cd wabiz_new
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Key environment variables to configure:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth (generate: `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your application URL
- `STRIPE_SECRET_KEY`: Stripe secret key (get from dashboard)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- And other integration keys as needed

### 4. Set up PostgreSQL database

Create a PostgreSQL database:

```sql
CREATE DATABASE wabiz_db;
```

### 5. Run database migrations

Generate Prisma client:
```bash
npm run db:generate
```

Run migrations:
```bash
npm run db:migrate
```

### 6. Start the development server

```bash
npm run dev
```

Visit http://localhost:3000 in your browser.

## 🔧 First Time Setup

When you start the application for the first time:

1. You'll be redirected to the Installation Wizard (`/install`)
2. Follow the steps:
   - **System Check**: Verify environment requirements
   - **Database Configuration**: Enter PostgreSQL credentials
   - **Admin User**: Create your super admin account
   - **Platform Settings**: Configure platform name, currency, timezone
   - **Complete**: Installation finished

3. After completion, you'll be redirected to the login page
4. Log in with your admin credentials
5. Access the dashboard at `/dashboard`

## 📁 Project Structure

```
wabiz_new/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication routes
│   │   ├── (installer)/     # Installer wizard
│   │   ├── (dashboard)/     # Main dashboard
│   │   ├── (marketing)/     # Landing pages
│   │   ├── api/             # API routes
│   │   │   ├── auth/        # Authentication endpoints
│   │   │   ├── install/     # Installation endpoints
│   │   │   ├── whatsapp/    # WhatsApp integration
│   │   │   ├── stripe/      # Stripe webhook handlers
│   │   │   ├── contacts/    # Contact management
│   │   │   ├── conversations/ # Messaging
│   │   │   ├── automations/ # Automation flows
│   │   │   ├── campaigns/   # Campaign management
│   │   │   └── templates/   # Template management
│   │   ├── components/      # Reusable React components
│   │   ├── lib/            # Utility functions
│   │   ├── utils/          # Helper functions
│   │   └── globals.css     # Global styles
│   └── ...
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Migration files
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── .env.local             # Environment variables (local)
```

## 🗄️ Database Schema

### Core Tables
- **User**: User accounts
- **Workspace**: Organization workspaces
- **WorkspaceMember**: User-workspace relationship with roles
- **WorkspaceSettings**: Workspace-specific settings

### WhatsApp Integration
- **WhatsAppNumber**: Connected phone numbers
- **Contact**: Customer contacts
- **Conversation**: Chat conversations
- **Message**: Individual messages

### Features
- **Automation**: Automation flows and actions
- **Campaign**: Broadcast campaigns
- **CampaignRecipient**: Campaign delivery tracking
- **WhatsAppTemplate**: Message templates
- **AnalyticsData**: Daily analytics metrics

### Billing
- **Plan**: Subscription plans
- **Subscription**: Active subscriptions
- **Invoice**: Billing invoices

## 🔐 Security Features

- CSRF protection
- Rate limiting
- Input validation
- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Secure Stripe webhook verification

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get current user

### WhatsApp Endpoints
- `GET /api/whatsapp/numbers` - List phone numbers
- `POST /api/whatsapp/send-message` - Send message
- `POST /api/whatsapp/webhook` - Webhook handler

### Contacts Endpoints
- `GET /api/contacts` - List contacts
- `POST /api/contacts` - Create contact
- `GET /api/contacts/:id` - Get contact details
- `PUT /api/contacts/:id` - Update contact

### Campaigns Endpoints
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign
- `POST /api/campaigns/:id/send` - Send campaign

### Stripe Endpoints
- `POST /api/stripe/create-checkout` - Create checkout session
- `POST /api/stripe/webhook` - Webhook handler
- `GET /api/billing/invoices` - Get invoices

## 🚀 Production Deployment

### Environment Setup
1. Set up PostgreSQL on production
2. Configure all environment variables
3. Set `NODE_ENV=production`
4. Generate new `NEXTAUTH_SECRET`

### Build and Deploy
```bash
npm run build
npm start
```

### Deployment Platforms
- **Vercel**: Zero-config deployment
- **AWS**: EC2 or ECS
- **Digital Ocean**: App Platform
- **Heroku**: Traditional apps
- **Self-hosted**: Any Linux server with Node.js

## 🔗 Integrations

- **WhatsApp Cloud API**: Message sending and receiving
- **Stripe**: Payment processing and billing
- **SendGrid/SMTP**: Email notifications
- **Redis** (optional): Caching and sessions
- **S3/Cloud Storage** (optional): Media storage

## 📖 Documentation

Full documentation in `project_prs.md` includes:
- Complete feature specifications
- MultiTenant architecture details
- All API endpoint specifications
- Installer wizard flow
- Marketing pages structure
- Stripe integration details

## 🐛 Troubleshooting

### Database Connection Failed
- Check PostgreSQL is running
- Verify DATABASE_URL in .env.local
- Ensure database exists

### Installation Wizard Not Loading
- Clear browser cache
- Check NODE_ENV is not "production"
- Verify NEXT_PUBLIC variables are set

### API Errors
- Check server logs: `npm run dev` terminal
- Verify environment variables
- Test API endpoints with Postman

## 📞 Support

For issues or questions:
1. Check the project documentation
2. Review the database schema in `prisma/schema.prisma`
3. Check API route implementations
4. Review component implementations

## 📝 License

This project is provided as-is for development and production use.

## 🎯 Next Steps

1. **Configure Database**: Update .env.local with PostgreSQL details
2. **Set up Stripe**: Add Stripe API keys
3. **Configure WhatsApp**: Add WhatsApp Business Account credentials
4. **Run Installation**: Start the app and complete the installation wizard
5. **Test Core Features**: Create a workspace and test messaging
6. **Deploy**: Push to production

## 📊 Roadmap

- [ ] AI chatbot integration
- [ ] Advanced reporting and dashboards
- [ ] Mobile app (React Native)
- [ ] Slack integration
- [ ] Zapier automation
- [ ] SMS gateway support
- [ ] Voice calling capabilities
- [ ] Video message support

---

Built with ❤️ for modern customer communication.
