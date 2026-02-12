# Setup Guide - WaFiz SaaS Platform

## Quick Start (5 minutes)

### Prerequisites
- **Node.js**: 18.17.0 or higher
- **PostgreSQL**: 13 or higher
- **npm**: Latest version

### Step 1: Install Dependencies
```bash
cd c:\xampp\htdocs\wabiz_new
npm install
```

### Step 2: Configure Environment
Create `.env.local` file with your settings:
```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local and update:
DATABASE_URL="postgresql://user:password@localhost:5432/wabiz_db"
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"
```

### Step 3: Create PostgreSQL Database
```sql
CREATE DATABASE wabiz_db;
```

### Step 4: Setup Database Schema
```bash
npm run db:generate
npm run db:migrate
```

### Step 5: Start Development Server
```bash
npm run dev
```

Visit **http://localhost:3000** in your browser.

---

## Detailed Setup Instructions

### Installation Wizard

When you first visit the application:

1. **Homepage** → Automatically redirects to installer
2. **System Check** → Verifies Node.js and environment
3. **Database Setup** → Configure PostgreSQL connection
4. **Admin User** → Create your first super admin account
5. **Platform Settings** → Set name, currency, timezone
6. **Complete** → Redirects to login

### Creating a PostgreSQL Database

#### On Windows with PostgreSQL Installed:
```bash
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE wabiz_db;

# Verify
\l

# Exit
\q
```

#### Connection String Format:
```
postgresql://username:password@localhost:5432/wabiz_db
```

Example: `postgresql://postgres:mypassword@localhost:5432/wabiz_db`

### Environment Variables

Copy `.env.local` and configure these key variables:

```env
# ===== DATABASE =====
DATABASE_URL="postgresql://postgres:password@localhost:5432/wabiz_db"

# ===== AUTHENTICATION =====
NEXTAUTH_SECRET="generate-random-string-here"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="another-random-string"

# ===== STRIPE (Optional for Payments) =====
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# ===== APPLICATION =====
NODE_ENV="development"
APP_NAME="WaFiz"
APP_URL="http://localhost:3000"
```

### Generating Secure Secrets

For `NEXTAUTH_SECRET` and `JWT_SECRET`:

```bash
# Windows PowerShell
[System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }) | % {[byte]$_}) | Out-String

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Available Scripts

### Development
```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Create and apply migrations
npm run db:seed      # Seed sample data (future)
npm run db:studio    # Open Prisma Studio (visual DB editor)
```

---

## Project Structure

```
wabiz_new/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Auth pages (login, register)
│   │   ├── (installer)/         # Setup wizard
│   │   ├── (dashboard)/         # Main app dashboard
│   │   ├── (marketing)/         # Landing pages
│   │   ├── api/                 # API routes
│   │   │   ├── auth/            # Auth endpoints
│   │   │   ├── install/         # Installation endpoints
│   │   │   ├── whatsapp/        # WhatsApp API
│   │   │   ├── stripe/          # Stripe webhook
│   │   │   ├── contacts/        # Contact management
│   │   │   ├── conversations/   # Messaging
│   │   │   ├── automations/     # Automation flows
│   │   │   ├── campaigns/       # Campaign management
│   │   │   └── templates/       # Template management
│   │   ├── components/          # React components
│   │   ├── lib/                 # Utility functions
│   │   ├── globals.css          # Global styles
│   │   └── layout.tsx           # Root layout
│   └── ...
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Migration files (auto-generated)
├── public/                      # Static files
├── .env.example                 # Example environment variables
├── .env.local                   # Local environment (git-ignored)
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind CSS config
├── next.config.js              # Next.js config
└── README.md                   # Project documentation
```

---

## Accessing the Application

### Local Development
- **Home**: http://localhost:3000
- **Installer**: http://localhost:3000/install (if not installed)
- **Login**: http://localhost:3000/auth/login
- **Register**: http://localhost:3000/auth/register
- **Dashboard**: http://localhost:3000/dashboard (after login)
- **Marketing**: http://localhost:3000 (public pages)

### Default Routes
- **Marketing**: `/`, `/features`, `/pricing`, `/about`, `/contact`
- **Auth**: `/auth/login`, `/auth/register`, `/auth/forgot-password`
- **Installer**: `/install` (new installations)
- **Dashboard**: `/dashboard/*` (all main app pages)

---

## Database Schema Overview

### Core Tables
- **User**: User accounts and login
- **Workspace**: Organization/company workspace
- **WorkspaceMember**: User-workspace relationship with roles
- **WorkspaceSettings**: Workspace configuration

### WhatsApp Integration
- **WhatsAppNumber**: Connected WhatsApp numbers
- **Contact**: Customer contacts
- **Conversation**: Chat conversations
- **Message**: Individual chat messages

### Features
- **Automation**: Automated workflows
- **Campaign**: Broadcast campaigns
- **WhatsAppTemplate**: Message templates
- **AnalyticsData**: Daily metrics

### Billing
- **Plan**: Subscription plans
- **Subscription**: Active subscriptions
- **Invoice**: Billing invoices

---

## Troubleshooting

### Issue: Database Connection Failed
**Solution**:
- Verify PostgreSQL is running
- Check DATABASE_URL in .env.local
- Ensure database exists: `psql -U postgres -l`
- Test connection: `psql -U postgres -d wabiz_db`

### Issue: Port 3000 Already in Use
**Solution**:
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

### Issue: Prisma Errors
**Solution**:
```bash
# Regenerate Prisma client
npm run db:generate

# Check schema validity
npx prisma validate

# Run migrations
npm run db:migrate
```

### Issue: Build Fails
**Solution**:
```bash
# Clear Next.js cache
rm -r .next

# Reinstall dependencies
rm -r node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Issue: Missing Environment Variables
**Solution**:
```bash
# Verify .env.local exists
ls -la .env.local

# Check required variables
NEXTAUTH_SECRET, DATABASE_URL, NEXTAUTH_URL

# Copy from example
cp .env.example .env.local
```

---

## Next Steps

1. **Complete Installation**: Visit http://localhost:3000/install
2. **Create Admin Account**: Follow the wizard steps
3. **Configure Settings**: Set timezone, currency, etc.
4. **Add WhatsApp Numbers**: Connect your WhatsApp Business numbers
5. **Create Contacts**: Import or add customers
6. **Set Up Automations**: Create automated workflows
7. **Send First Campaign**: Test broadcast messaging

---

## Additional Commands

### Development Tools
```bash
# Open Prisma Studio (visual database editor)
npm run db:studio

# Format code
npm run format

# Type check
npm run type-check

# Security audit
npm audit
```

### Database Utilities
```bash
# Reset database
npm run db:reset

# Seed sample data
npm run db:seed

# Check schema
npx prisma validate
```

---

## Production Deployment

### Before Deploying
- [ ] Set `NODE_ENV=production`
- [ ] Generate new `NEXTAUTH_SECRET`
- [ ] Configure production database
- [ ] Set up Stripe keys
- [ ] Configure email service
- [ ] Enable CORS properly
- [ ] Set up SSL certificate
- [ ] Configure backup strategy

### Build for Production
```bash
npm run build
npm start
```

### Deployment Platforms
- **Vercel**: https://vercel.com (recommended for Next.js)
- **AWS EC2/ECS**
- **Digital Ocean App Platform**
- **Heroku**
- **Self-hosted with Docker**

---

## Getting Help

- **Documentation**: See `README.md`
- **Database Schema**: See `prisma/schema.prisma`
- **Project Spec**: See `project_prs.md`
- **Issues**: Check application logs in terminal
- **Support**: Add support email configuration in settings

---

**Happy Coding! 🚀**
