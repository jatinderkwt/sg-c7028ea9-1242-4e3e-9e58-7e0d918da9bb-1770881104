# 🚀 Dokploy Setup Guide - WhatsApp Business API Platform

## Quick Start (5 Minutes)

### Step 1: Add Environment Variables in Dokploy

Open your Dokploy dashboard and add these environment variables:

```bash
# Generate these secrets first (run locally):
# openssl rand -base64 32  → use for NEXTAUTH_SECRET
# openssl rand -hex 32     → use for ENCRYPTION_KEY

# Authentication & Security (REQUIRED)
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="https://your-dokploy-domain.com"
ENCRYPTION_KEY="your-generated-key-here"

# App Configuration (REQUIRED)
NEXT_PUBLIC_APP_URL="https://your-dokploy-domain.com"
NODE_ENV="production"

# Database (REQUIRED - You already have this)
DATABASE_URL="postgresql://whatsapp:JoalcnpPuVQtqFnq@72.61.249.147:6543/whatsappbizapi"

# WhatsApp (Optional - can configure later via UI)
WHATSAPP_APP_ID=""
WHATSAPP_APP_SECRET=""
WHATSAPP_VERIFY_TOKEN=""
WHATSAPP_PHONE_NUMBER_ID=""
WHATSAPP_ACCESS_TOKEN=""
```

**Save** and **Redeploy** your application.

---

### Step 2: Access the Installer

Visit: `https://your-dokploy-domain.com/installer`

You should now see **Step 1: System Environment Check** with all checks passing:
- ✅ Node.js Version
- ✅ Database Connection
- ✅ Environment Variables
- ✅ File Permissions
- ✅ Storage Availability

Click **"Continue Setup"**

---

### Step 3: Initialize Database

**Step 2: Database Initialization**

When you click **"Initialize Database"**, the system will:

1. ✅ **Generate Prisma Client** (TypeScript types for database)
2. ✅ **Run Database Migration** (`prisma/migrations/20260212_init/migration.sql`)
   - Creates 15 tables:
     - Tenant
     - User
     - Role
     - Permission
     - WhatsAppAccount
     - Contact
     - Conversation
     - Message
     - Template
     - Campaign
     - Automation
     - Deal
     - Task
     - Subscription
     - SubscriptionPlan
     - UsageLog
     - AuditLog
     - Theme

3. ✅ **Seed Default Data**:
   - **System Tenant** (for global data)
   - **4 Default Roles**:
     - Super Admin (52 permissions)
     - Admin (35 permissions)
     - Manager (20 permissions)
     - Agent (10 permissions)
   - **4 Subscription Plans**:
     - Free ($0/month - 500 messages)
     - Starter ($49/month - 5,000 messages)
     - Professional ($149/month - 25,000 messages)
     - Enterprise ($499/month - unlimited messages)

**This process takes 1-2 minutes.** Do not close the window.

After completion, you'll see:
> ✅ Database Initialized
> All database tables have been created successfully. Default roles, permissions, and subscription plans have been seeded.

Click **"Continue"**

---

### Step 4: Create Super Admin Account

**Step 3: Create Super Admin**

Fill in your administrator details:
- Full Name (e.g., "John Doe")
- Email (e.g., "admin@yourcompany.com")
- Password (minimum 8 characters)
- Confirm Password
- Timezone (e.g., "America/New_York")
- Language (e.g., "English")

Click **"Create Admin"**

---

### Step 5: Configure Company Settings

**Step 4: Company Setup**

Enter your company information:
- Company Name (e.g., "Acme Inc")
- Website (e.g., "https://acme.com")
- Email (e.g., "contact@acme.com")
- Phone (e.g., "+1234567890")
- Address (e.g., "123 Main St, New York, NY")
- Country (e.g., "United States")
- Currency (e.g., "USD - US Dollar")

Click **"Continue"**

---

### Step 6: SaaS Configuration

**Step 5: SaaS Configuration**

Configure multi-tenant settings:
- **Enable SaaS Mode**: Toggle ON if you want multiple tenants
- **Free Trial Duration**: 14 days (default)
- **Default Plan**: Starter (recommended)

Click **"Continue"**

---

### Step 7: Email & Notifications (Optional)

**Step 6: Email & Notifications**

You can skip this step and configure SMTP later:
- Click **"Skip"** to proceed

Or configure now:
- SMTP Host (e.g., "smtp.gmail.com")
- SMTP Port (e.g., "587")
- SMTP Username
- SMTP Password (App Password)
- Sender Email
- Sender Name

---

### Step 8: WhatsApp API Setup (Optional)

**Step 7: WhatsApp API Setup**

You can skip this step and add credentials later via the dashboard:
- Click **"Skip"** to proceed

Or configure now:
- Meta App ID
- Meta App Secret
- Webhook Verify Token
- Webhook URL (auto-populated)
- System Access Token

**To get these credentials:**
1. Go to: https://developers.facebook.com
2. Create a new app or use existing
3. Add WhatsApp product
4. Go to "API Setup" section
5. Copy the credentials

---

### Step 9: System Preferences

**Step 8: System Preferences**

Configure default system settings:
- Default Theme: Light/Dark/System
- Date Format: YYYY-MM-DD (recommended)
- Time Format: 24 Hour (recommended)
- Auto Logout: 30 minutes (default)
- Max Upload Size: 10 MB (default)
- Message Retention: 365 days (default)

Click **"Complete Installation"**

---

### Step 10: Installation Complete! 🎉

**Step 9: Complete Installation**

You'll see a summary of your configuration:
- Admin Email
- Company Name
- SaaS Mode Status
- Free Trial Duration

Click **"Go to Login"**

---

## Post-Installation

### 1. Login to Your Platform

Visit: `https://your-dokploy-domain.com/api/auth/login`

Or use the API:
```bash
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-admin-email@company.com",
    "password": "your-password"
  }'
```

### 2. Configure WhatsApp Account

**Via API:**
```bash
curl -X POST https://your-domain.com/api/whatsapp/accounts \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_JWT_TOKEN" \
  -d '{
    "phoneNumberId": "123456789012345",
    "phoneNumber": "+1234567890",
    "displayName": "My Business",
    "businessAccountId": "987654321098765",
    "accessToken": "your-meta-access-token",
    "webhookVerifyToken": "your-verify-token"
  }'
```

### 3. Set Up Meta Webhook

In your Meta Business Dashboard:

1. Go to: **WhatsApp > Configuration > Webhooks**
2. Click **"Edit"**
3. Set **Callback URL**: `https://your-domain.com/api/webhook/whatsapp`
4. Set **Verify Token**: (same as `WHATSAPP_VERIFY_TOKEN` in env)
5. Subscribe to fields:
   - `messages`
   - `message_status`
6. Click **"Verify and Save"**

### 4. Create Message Templates

**Via API:**
```bash
curl -X POST https://your-domain.com/api/templates \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_JWT_TOKEN" \
  -d '{
    "name": "welcome_message",
    "language": "en",
    "category": "UTILITY",
    "body": "Welcome {{1}}! Thanks for contacting us.",
    "whatsappAccountId": "your-account-id"
  }'
```

### 5. Import Contacts

**Via API:**
```bash
curl -X POST https://your-domain.com/api/contacts \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_JWT_TOKEN" \
  -d '{
    "phoneNumber": "+1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "optInStatus": true,
    "optInSource": "website_form",
    "optInDate": "2024-01-15T10:00:00Z"
  }'
```

### 6. Launch Your First Campaign

**Via API:**
```bash
curl -X POST https://your-domain.com/api/campaigns \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_JWT_TOKEN" \
  -d '{
    "name": "Welcome Campaign",
    "templateId": "template-id-here",
    "whatsappAccountId": "account-id-here",
    "targetSegment": {
      "tags": ["new_customer"]
    },
    "scheduleAt": "2024-01-20T09:00:00Z"
  }'
```

---

## Troubleshooting

### Issue: Database initialization fails

**Error:** "Invalid `prisma.subscriptionPlan.findFirst()` invocation: The table `public.SubscriptionPlan` does not exist"

**Solution:**
This is expected before initialization. Just click **"Initialize Database"** and wait for completion.

---

### Issue: Environment variables not loading

**Solution:**
1. Verify variables are saved in Dokploy dashboard
2. Click **"Redeploy"** (not just restart)
3. Wait for deployment to complete
4. Clear browser cache and refresh

---

### Issue: Database connection fails

**Error:** "Database connection failed"

**Check:**
1. DATABASE_URL is correct
2. PostgreSQL is running and accessible
3. Port 6543 is open
4. Database "whatsappbizapi" exists

**Test connection:**
```bash
psql "postgresql://whatsapp:JoalcnpPuVQtqFnq@72.61.249.147:6543/whatsappbizapi"
```

---

### Issue: Webhook verification fails

**Error:** "Webhook signature validation failed"

**Solution:**
1. Verify `WHATSAPP_APP_SECRET` matches Meta dashboard
2. Check webhook URL is correct
3. Ensure HTTPS is enabled
4. Test with Meta's webhook tester

---

## Security Checklist

✅ NEXTAUTH_SECRET is unique and never committed to git  
✅ ENCRYPTION_KEY is 64 characters (hex) and secure  
✅ DATABASE_URL credentials are strong  
✅ HTTPS is enabled (required for webhooks)  
✅ Firewall allows Meta webhook IPs  
✅ Auto-logout is enabled (30 min default)  
✅ Audit logging is active  
✅ Regular backups are scheduled  

---

## Performance Optimization

1. **Database Indexing**: Already configured in schema
2. **Redis Caching**: Add Redis for rate limiting (optional)
3. **CDN**: Use Vercel or Cloudflare for static assets
4. **Horizontal Scaling**: Run multiple Dokploy instances
5. **Queue Workers**: Add Bull/BullMQ for message processing

---

## Monitoring

### Health Check Endpoint

```bash
curl https://your-domain.com/api/health
```

### Database Stats

```bash
curl https://your-domain.com/api/analytics/overview \
  -H "Cookie: auth-token=YOUR_JWT_TOKEN"
```

### Logs

View logs in Dokploy dashboard:
- Application logs
- Database logs
- Webhook events

---

## Backup & Recovery

### Manual Backup

```bash
# Dump database
pg_dump "postgresql://whatsapp:JoalcnpPuVQtqFnq@72.61.249.147:6543/whatsappbizapi" > backup.sql

# Restore database
psql "postgresql://whatsapp:JoalcnpPuVQtqFnq@72.61.249.147:6543/whatsappbizapi" < backup.sql
```

### Automated Backups

Set up in Dokploy:
1. Go to your database service
2. Enable automated backups
3. Set retention period (7-30 days recommended)
4. Test restore procedure

---

## Support

- **Documentation**: https://your-domain.com/docs
- **Getting Started**: https://your-domain.com/getting-started
- **API Reference**: https://your-domain.com/docs#api-reference
- **GitHub**: Your repository link

---

## Summary

You now have:

✅ **Complete SaaS Platform** running on Dokploy  
✅ **Multi-tenant architecture** with data isolation  
✅ **WhatsApp Business API** integration (Meta compliant)  
✅ **CRM System** (contacts, deals, tasks)  
✅ **Campaign Engine** (template-based broadcasts)  
✅ **Automation** (workflow builder)  
✅ **Analytics** (message & agent metrics)  
✅ **Subscription Billing** (4 plans with quotas)  
✅ **Role-Based Access** (4 permission levels)  
✅ **Security** (JWT, encryption, audit logs)  

**🎉 Your Enterprise WhatsApp Business Platform is ready!**