# 🚀 Dokploy Setup Guide - WhatsApp Business API Platform

## ⚡ CRITICAL FIX FOR "no schema has been selected" ERROR

### **The Problem**
```
ERROR: no schema has been selected to create in
```

### **The Solution**
Add `?schema=public` to your DATABASE_URL in Dokploy!

---

## 🎯 Quick Fix (2 Minutes)

### Step 1: Update DATABASE_URL in Dokploy

**OLD (Incorrect):**
```bash
DATABASE_URL="postgresql://whatsapp:JoalcnpPuVQtqFnq@72.61.249.147:6543/whatsappbizapi"
```

**NEW (Correct):**
```bash
DATABASE_URL="postgresql://whatsapp:JoalcnpPuVQtqFnq@72.61.249.147:6543/whatsappbizapi?schema=public"
```

**How to Update:**
1. Open your **Dokploy Dashboard**
2. Select your WhatsApp project
3. Go to **Settings** → **Environment Variables**
4. Find `DATABASE_URL`
5. Click **Edit**
6. Add `?schema=public` to the end
7. Click **Save**
8. Click **Redeploy**

---

## 📋 Complete Environment Variables for Dokploy

Copy and paste these into your Dokploy Environment Variables:

```bash
# Database (CRITICAL - Note the ?schema=public at the end!)
DATABASE_URL="postgresql://whatsapp:JoalcnpPuVQtqFnq@72.61.249.147:6543/whatsappbizapi?schema=public"

# Authentication & Security (Generate these first!)
NEXTAUTH_SECRET="your-generated-32-char-secret-here"
NEXTAUTH_URL="https://your-dokploy-domain.com"
ENCRYPTION_KEY="your-generated-64-char-hex-key-here"

# App Configuration
NEXT_PUBLIC_APP_URL="https://your-dokploy-domain.com"
NODE_ENV="production"

# WhatsApp (Optional - can configure later via installer UI)
WHATSAPP_APP_ID=""
WHATSAPP_APP_SECRET=""
WHATSAPP_VERIFY_TOKEN=""
WHATSAPP_PHONE_NUMBER_ID=""
WHATSAPP_ACCESS_TOKEN=""
```

### Generate Secure Secrets

Run these commands **on your local machine** to generate the required secrets:

```bash
# Generate NEXTAUTH_SECRET (copy the output)
openssl rand -base64 32

# Generate ENCRYPTION_KEY (copy the output)
openssl rand -hex 32
```

---

## ✅ What Happens After You Redeploy

Once you update the DATABASE_URL and redeploy:

1. **System Check (Step 1)** will show all green:
   - ✅ Node.js Version
   - ✅ Database Connection
   - ✅ Environment Variables
   - ✅ File Permissions
   - ✅ Storage Availability

2. **Database Initialization (Step 2)** will work:
   - Click "Initialize Database"
   - System will create all tables using `prisma db push`
   - Fallback to `prisma migrate deploy` if needed
   - Seeds default data (roles, permissions, subscription plans)

3. **Continue through remaining steps (3-9)**

---

## 🚀 Complete Installation Wizard Steps

### **Step 1: ✅ System Environment Check**
All checks pass with green indicators

### **Step 2: Database Initialization**
- Creates all database tables
- Seeds default roles, permissions, and subscription plans
- One-click setup

### **Step 3: Super Admin Creation**
- Full Name
- Email
- Password (min 8 characters)
- Timezone & Language

### **Step 4: Company Setup**
- Company Name
- Contact Information
- Address & Country
- Currency & Timezone

### **Step 5: SaaS Configuration**
- Enable/Disable Multi-Tenant Mode
- Free Trial Duration (default: 14 days)
- Default Subscription Plan

### **Step 6: Email & Notifications**
- SMTP Settings (optional - can configure later)
- Test Email Functionality

### **Step 7: WhatsApp API Setup**
- Meta App ID & Secret
- Webhook Verify Token
- System Access Token
- Webhook URL Configuration

### **Step 8: System Preferences**
- Default Theme (Light/Dark)
- Date & Time Format
- Auto Logout Settings
- File Upload Limits
- Message Retention Policy

### **Step 9: Complete Installation**
- Review all settings
- Lock installer
- Create system backup
- Redirect to login

---

## 🔍 Troubleshooting

### Issue: "no schema has been selected" error

**Solution:** Add `?schema=public` to DATABASE_URL (see above)

---

### Issue: Database initialization still fails after URL update

**Check these:**

1. **Redeploy completed successfully**
   - Verify in Dokploy logs
   - Wait for "Running" status

2. **Environment variable saved correctly**
   - No typos in `?schema=public`
   - No extra spaces
   - Proper URL encoding

3. **Database accessible**
   ```bash
   # Test connection (from local machine)
   psql "postgresql://whatsapp:JoalcnpPuVQtqFnq@72.61.249.147:6543/whatsappbizapi?schema=public"
   ```

4. **PostgreSQL version supported**
   - PostgreSQL 12+ required
   - Check: `SELECT version();`

---

### Issue: Prisma generate fails

**Solution:**
- Usually means Prisma schema syntax error
- Check `prisma/schema.prisma` for issues
- Verify all models are properly defined

---

### Issue: Tables created but seeding fails

**Check:**
- Role creation error → Tenant must exist first
- Permission creation error → Role must exist first
- SubscriptionPlan error → Check field names match schema

---

## 📊 Database Schema Overview

After initialization, you'll have **15 tables**:

### **Core Tables**
- ✅ Tenant - Multi-tenant isolation
- ✅ User - System users
- ✅ Role - Permission groups
- ✅ Permission - Access control
- ✅ SubscriptionPlan - Pricing tiers
- ✅ Subscription - Active subscriptions

### **WhatsApp Tables**
- ✅ WhatsAppAccount - API credentials
- ✅ Contact - Customer database
- ✅ Conversation - Chat threads
- ✅ Message - Individual messages
- ✅ Template - Message templates

### **CRM Tables**
- ✅ Deal - Sales pipeline
- ✅ Task - Follow-ups

### **Automation Tables**
- ✅ Automation - Workflow rules
- ✅ Campaign - Broadcast campaigns

### **System Tables**
- ✅ UsageLog - Quota tracking
- ✅ AuditLog - Security trail

---

## 🎯 What Gets Seeded

### **1 System Tenant**
- Name: "System"
- Domain: "system.local"
- For global data

### **4 Default Roles**

**Super Admin** (22 permissions):
- Full system access
- Tenant management
- All features

**Admin** (11 permissions):
- Company administration
- User management
- Full messaging

**Manager** (5 permissions):
- Team oversight
- Contact management
- Campaign viewing

**Agent** (3 permissions):
- Customer conversations
- Message sending
- Contact viewing

### **4 Subscription Plans**

**Free** - $0/month:
- 500 messages/month
- 100 contacts
- 1 WhatsApp account

**Starter** - $49/month:
- 5,000 messages/month
- 1,000 contacts
- 2 WhatsApp accounts
- Campaigns

**Professional** - $149/month:
- 25,000 messages/month
- 10,000 contacts
- 5 WhatsApp accounts
- Automation + CRM

**Enterprise** - $499/month:
- Unlimited everything
- API access
- White-label
- Dedicated support

---

## 🚀 Post-Installation

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

## 🔐 Security Checklist

✅ NEXTAUTH_SECRET is unique and never committed to git  
✅ ENCRYPTION_KEY is 64 characters (hex) and secure  
✅ DATABASE_URL credentials are strong  
✅ HTTPS is enabled (required for webhooks)  
✅ Firewall allows Meta webhook IPs  
✅ Auto-logout is enabled (30 min default)  
✅ Audit logging is active  
✅ Regular backups are scheduled  

---

## 📈 Performance Optimization

1. **Database Indexing**: Already configured in schema
2. **Redis Caching**: Add Redis for rate limiting (optional)
3. **CDN**: Use Vercel or Cloudflare for static assets
4. **Horizontal Scaling**: Run multiple Dokploy instances
5. **Queue Workers**: Add Bull/BullMQ for message processing

---

## 📊 Monitoring

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

## 💾 Backup & Recovery

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

## 📞 Support

- **Documentation**: https://your-domain.com/docs
- **Getting Started**: https://your-domain.com/getting-started
- **API Reference**: https://your-domain.com/docs#api-reference
- **GitHub**: Your repository link

---

## ✨ Summary

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