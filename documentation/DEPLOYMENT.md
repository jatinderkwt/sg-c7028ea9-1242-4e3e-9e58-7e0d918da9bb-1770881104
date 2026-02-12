# 🚀 Dokploy Deployment Guide

## Prerequisites

Before deploying to Dokploy, ensure you have:

1. **PostgreSQL Database** (accessible from Dokploy)
2. **Environment Variables** configured in Dokploy
3. **Persistent Storage** mounted (for uploads and lock files)

---

## Required Environment Variables

Add these in your Dokploy project settings:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret-min-32-chars"
NEXTAUTH_URL="https://yourdomain.com"

# Encryption
ENCRYPTION_KEY="your-encryption-key-32-chars-hex"

# App Configuration
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"

# WhatsApp API (add during installation wizard)
META_APP_ID=""
META_APP_SECRET=""
META_VERIFY_TOKEN=""
WHATSAPP_PHONE_NUMBER_ID=""
WHATSAPP_ACCESS_TOKEN=""
```

---

## Generate Secure Keys

```bash
# Generate NEXTAUTH_SECRET (32+ characters)
openssl rand -base64 32

# Generate ENCRYPTION_KEY (32 bytes hex)
openssl rand -hex 32
```

---

## Dokploy Configuration

### 1. Create PostgreSQL Database

In Dokploy dashboard:
- Go to **Databases** → **Create Database**
- Select **PostgreSQL**
- Note the connection string for `DATABASE_URL`

### 2. Configure Environment Variables

In your project settings:
- Add all required environment variables
- Use the PostgreSQL connection string from step 1
- Generate and add secure keys

### 3. Set Build Configuration

```dockerfile
# Build Command
npm install && npx prisma generate && npm run build

# Start Command
npx prisma migrate deploy && npm start

# Port
3000
```

### 4. Mount Persistent Storage

Mount these directories for persistent data:
- `/app/storage` - For installation lock and system files
- `/app/public/uploads` - For uploaded media files

---

## First Deployment Steps

### Step 1: Deploy the Application
Deploy your app in Dokploy. It will:
- Install dependencies
- Generate Prisma client
- Build Next.js application
- Run database migrations
- Start the server

### Step 2: Access Installation Wizard
Once deployed, visit:
```
https://yourdomain.com/installer
```

### Step 3: Complete Installation
Follow the 9-step wizard:
1. ✅ System checks (should all pass now)
2. ✅ Initialize database
3. ✅ Create super admin
4. ✅ Configure company
5. ✅ Set up SaaS
6. ✅ Configure email (optional)
7. ✅ Add WhatsApp API credentials
8. ✅ Set system preferences
9. ✅ Complete installation

---

## Troubleshooting

### ❌ Database Connection Failed

**Problem**: Can't connect to PostgreSQL

**Solutions**:
1. Verify `DATABASE_URL` format:
   ```
   postgresql://username:password@host:port/database
   ```
2. Check database is running in Dokploy
3. Verify network connectivity between app and database
4. Check firewall rules
5. Try connection from Dokploy terminal:
   ```bash
   psql "$DATABASE_URL"
   ```

### ❌ Environment Variables Not Set

**Problem**: Missing required environment variables

**Solutions**:
1. Go to Dokploy project → **Environment Variables**
2. Add all required variables (see list above)
3. Redeploy the application
4. Verify variables are loaded:
   ```bash
   # In Dokploy terminal
   echo $DATABASE_URL
   echo $NEXTAUTH_SECRET
   ```

### ❌ File Permissions Error

**Problem**: Can't write to storage directories

**Solutions**:
1. Mount persistent volumes in Dokploy:
   - `/app/storage`
   - `/app/public/uploads`
2. Set correct permissions:
   ```bash
   chmod -R 755 /app/storage
   chmod -R 755 /app/public/uploads
   ```
3. In Dockerfile, add:
   ```dockerfile
   RUN mkdir -p /app/storage /app/public/uploads
   RUN chmod -R 755 /app/storage /app/public/uploads
   ```

### ❌ Node.js Version Error

**Problem**: Incorrect Node.js version

**Solution**:
In your `package.json`, specify:
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

In Dokploy, select Node.js 18+ in build settings.

### ❌ Prisma Client Not Generated

**Problem**: Prisma types not found

**Solution**:
Ensure build command includes:
```bash
npx prisma generate && npm run build
```

If issue persists, add to `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### ❌ Installer Already Completed

**Problem**: Can't access installer after first run

**Solution**:
This is by design - the installer locks after completion. To reset:

```bash
# Option 1: Delete lock file (in Dokploy terminal)
rm /app/storage/installed.lock

# Option 2: Reset entire database
npx prisma migrate reset

# Option 3: Manual cleanup
psql "$DATABASE_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npx prisma migrate deploy
```

---

## Post-Installation

### 1. Configure WhatsApp Webhook

In Meta Business Dashboard:
1. Go to **WhatsApp** → **Configuration**
2. Set webhook URL: `https://yourdomain.com/api/webhook/whatsapp`
3. Set verify token (same as in .env)
4. Subscribe to webhook events:
   - `messages`
   - `message_status`

### 2. Test API Endpoints

```bash
# Health check
curl https://yourdomain.com/api/hello

# Login (after installation)
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"yourpassword"}'
```

### 3. Monitor Logs

In Dokploy:
- Go to **Logs** tab
- Check for any runtime errors
- Monitor webhook events
- Review database queries

---

## Database Migrations

When updating the schema:

```bash
# Create migration
npx prisma migrate dev --name your_migration_name

# Deploy to production (automatic in start command)
npx prisma migrate deploy
```

---

## Backup & Recovery

### Backup Database

```bash
# Manual backup
pg_dump "$DATABASE_URL" > backup.sql

# Restore backup
psql "$DATABASE_URL" < backup.sql
```

### Backup Uploaded Files

Dokploy should handle persistent storage, but you can also:

```bash
# Backup uploads
tar -czf uploads-backup.tar.gz /app/public/uploads

# Restore uploads
tar -xzf uploads-backup.tar.gz -C /app/public
```

---

## Scaling Considerations

### Horizontal Scaling
- Use external file storage (S3, DO Spaces) instead of local uploads
- Configure Redis for session storage
- Set up load balancer in Dokploy

### Performance Optimization
- Enable Next.js caching
- Configure CDN for static assets
- Optimize database queries with indexes
- Set up database connection pooling

---

## Security Checklist

- ✅ All environment variables are set
- ✅ Database has strong password
- ✅ NEXTAUTH_SECRET is 32+ characters
- ✅ ENCRYPTION_KEY is properly generated
- ✅ HTTPS is enabled (Dokploy default)
- ✅ Firewall rules configured
- ✅ Regular database backups scheduled
- ✅ Audit logs enabled
- ✅ Rate limiting configured

---

## Support Resources

- **Dokploy Docs**: https://docs.dokploy.com
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://prisma.io/docs
- **WhatsApp API**: https://developers.facebook.com/docs/whatsapp

---

## Quick Commands Reference

```bash
# View logs
docker logs -f container_name

# Access container shell
docker exec -it container_name sh

# Check environment
env | grep DATABASE_URL

# Test database connection
npx prisma db pull

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Reset database (WARNING: destructive)
npx prisma migrate reset

# Create admin user (if needed)
npx prisma db seed
```

---

## Common Dokploy Issues

### Port Already in Use
Change port in Dokploy settings (default 3000)

### Build Timeout
Increase build timeout in project settings

### Memory Limits
Increase container memory allocation

### Persistent Data Loss
Verify volume mounts are configured correctly

---

**🚀 Your WhatsApp Business API Platform should now be running smoothly on Dokploy!**

For additional help, check the main README.md or open an issue.