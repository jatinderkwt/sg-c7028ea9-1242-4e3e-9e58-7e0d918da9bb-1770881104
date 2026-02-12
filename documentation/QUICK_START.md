# Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Clone & Install
```bash
cd c:\xampp\htdocs\sg_whatsappbiz
npm install
```

### Step 2: Environment Setup
```bash
cp .env.example .env.local
```

Edit `.env.local` and set:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/whatsapp_db"
NEXTAUTH_SECRET="generate: openssl rand -base64 32"
ENCRYPTION_KEY="generate: openssl rand -hex 32"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 3: Database
```bash
npx prisma migrate dev
npx prisma db seed  # Optional: seed demo data
```

### Step 4: Run
```bash
npm run dev
```

**Visit**: http://localhost:3000

---

## 📋 Key URLs

| Page | URL | Purpose |
|------|-----|---------|
| Landing | `/` | Home page |
| Pricing | `/pricing` | Subscription plans |
| Features | `/features` | Feature showcase |
| Installation | `/installer` | 9-step setup |
| Login | `/login` | User sign-in |
| Register | `/register` | New account |
| Dashboard | `/dashboard` | Main app |
| Inbox | `/dashboard/inbox` | Messages |
| Contacts | `/dashboard/contacts` | CRM |
| Analytics | `/dashboard/analytics` | Metrics |

---

## 🔐 Testing Accounts

### Demo Super Admin
```
Email: admin@example.com
Password: Admin@123456
```

### Demo Manager
```
Email: manager@example.com
Password: Manager@123
```

### Demo Agent
```
Email: agent@example.com
Password: Agent@123
```

*(Create via installer or API)*

---

## 🛠 Common Tasks

### Create a Tenant
```bash
POST /api/tenants
{
  "name": "My Company",
  "email": "contact@company.com"
}
```

### Send a Message
```bash
POST /api/messages/send
{
  "phoneNumber": "+1234567890",
  "type": "text",
  "content": { "text": "Hello" }
}
```

### Create Contact
```bash
POST /api/contacts
{
  "phoneNumber": "+1234567890",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Get Analytics
```bash
GET /api/analytics/overview
```

---

## 📦 API Structure

All endpoints follow this pattern:

```
POST   /api/[resource]         → Create
GET    /api/[resource]         → List
GET    /api/[resource]/[id]    → Get one
PUT    /api/[resource]/[id]    → Update
DELETE /api/[resource]/[id]    → Delete
```

**Authentication**: All endpoints require JWT token in `Authorization` header
**Tenant Isolation**: All operations scoped to authenticated tenant

---

## 🔑 Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection
- `NEXTAUTH_SECRET` - JWT signing key
- `ENCRYPTION_KEY` - Data encryption

### WhatsApp (Get from Meta)
- `META_APP_ID`
- `META_APP_SECRET`
- `META_VERIFY_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`

### Stripe (Get from Stripe Dashboard)
- `STRIPE_PUBLIC_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

---

## 🧪 Testing Stripe Locally

1. Install Stripe CLI
2. Run: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
3. Get webhook signing secret and add to `.env.local`
4. Use test card: `4242 4242 4242 4242`

---

## 📊 Database Models

### Key Tables
- **User** - Team members
- **Contact** - Customers
- **Conversation** - Chat threads
- **Message** - Individual messages
- **Template** - WhatsApp templates
- **Subscription** - Billing
- **AuditLog** - Activity log

### View Schema
```bash
npx prisma studio
```

Open: http://localhost:5555

---

## 🚨 Troubleshooting

### "Database Connection Failed"
- Check `DATABASE_URL` is correct
- Verify PostgreSQL is running
- Test: `psql $DATABASE_URL -c "SELECT 1"`

### "Unauthorized" on API calls
- Ensure JWT token is sent in headers
- Check token hasn't expired
- Verify user exists in database

### "Webhook signature invalid"
- Confirm `STRIPE_WEBHOOK_SECRET` is correct
- Check request body wasn't modified
- Use Stripe CLI to test locally

### Build errors
- Run `npm install` again
- Delete `.next` folder
- Run `npm run build`

---

## 📚 Documentation

- **API Docs**: [README.md](README.md)
- **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Dokploy**: [DOKPLOY-SETUP.md](DOKPLOY-SETUP.md)
- **Master Spec**: [project_prs.md](project_prs.md)

---

## 🔗 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start              # Start production server
npm run lint           # Run linter

# Database
npx prisma migrate dev # Create migration
npx prisma db push    # Push schema
npx prisma studio    # Open GUI

# Deployment
vercel deploy        # Deploy to Vercel
docker build .      # Build container
```

---

## 🎯 Next Steps

1. ✅ Configure PostgreSQL
2. ✅ Set environment variables
3. ✅ Run database migrations
4. ✅ Test locally (`npm run dev`)
5. ✅ Connect Meta WhatsApp API
6. ✅ Set up Stripe billing
7. ✅ Deploy to production

---

## 💡 Tips

- Use Prisma Studio for database debugging
- Check console logs for API errors
- Use Stripe Dashboard to test webhooks
- Monitor audit logs for security
- Test 24h messaging window logic

---

**Happy Coding! 🚀**
