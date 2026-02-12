# Database Initialization Troubleshooting Guide

## Step 2: Database Initialization - Error Fixes

The "Database initialization failed" error during Step 2 of the installer has been improved with better diagnostics.

## Common Issues & Solutions

### Issue 1: "Database schema not found - Prisma migrations have not been run yet"

**What This Means:**
Database tables don't exist in your PostgreSQL database.

**Solution:**
Before running the installer, you must initialize your database schema:

```bash
# In your project terminal, run:
npx prisma migrate deploy
```

If this command succeeds, the database tables will be created. Then:
1. Go back to installer Step 2
2. Click "Initialize Database" again
3. It should now succeed

### Issue 2: "Could not connect to the database server" (P1000)

**What This Means:**
The application can't reach your PostgreSQL database.

**Solutions:**
1. **Check PostgreSQL is Running:**
   ```bash
   # Windows (if using XAMPP)
   # Start XAMPP and ensure "MySQL" or "PostgreSQL" is running
   
   # Mac/Linux
   brew services start postgresql
   # or
   sudo service postgresql start
   ```

2. **Verify DATABASE_URL is Correct:**
   - Open `.env` file in project root
   - Check the `DATABASE_URL` line
   - Should be formatted like: `postgresql://user:password@localhost:5432/whatsapp_biz`
   - Verify hostname, port, username, password, and database name

3. **Test Connection:**
   ```bash
   # Try connecting with psql
   psql -h localhost -U your_user -d whatsapp_biz
   # Enter password when prompted
   ```

### Issue 3: "Could not reach the database server" (P1001)

**What This Means:**
The hostname/IP address or port is incorrect, or the database server isn't accessible.

**Solutions:**
1. **If localhost doesn't work:**
   - Try `127.0.0.1` instead of `localhost`
   - Check if your PostgreSQL is listening on the expected port (usually 5432)

2. **Check Firewall:**
   - Ensure your firewall allows connections to PostgreSQL port 5432
   - On Windows, PostgreSQL might need an exception

### Issue 4: "The database server timed out" (P1002)

**What This Means:**
The database server is taking too long to respond.

**Solutions:**
1. Check database server status
2. Try initializing again in a moment
3. Check database server logs for errors
4. Restart the database service:
   ```bash
   # Windows (XAMPP): Stop and restart PostgreSQL in Control Panel
   # Mac/Linux:
   sudo service postgresql restart
   ```

### Issue 5: "Operations timed out" (P1008)

**What This Means:**
The database query is taking too long (database might be slow or under load).

**Solutions:**
1. Wait and try again
2. Check database server resources (disk space, memory, CPU)
3. Restart PostgreSQL service
4. Check for long-running queries

### Issue 6: "Database permission denied"

**What This Means:**
The database user doesn't have permission to create tables.

**Solutions:**
1. **Grant Permissions:**
   ```sql
   -- Connect as admin user, then:
   ALTER ROLE your_user WITH CREATEDB SUPERUSER;
   ```

2. **Or use admin user:** Update `.env` to use PostgreSQL admin credentials temporarily

### Issue 7: "Network Error: Failed to communicate with server"

**What This Means:**
The Next.js server isn't responding (development server crashed or not running).

**Solutions:**
1. Ensure Next.js dev server is running:
   ```bash
   npm run dev
   ```

2. Check terminal for errors

3. Refresh the installer page

## Pre-Installation Checklist

Before running the installer, verify:

- [ ] PostgreSQL is installed and running
- [ ] Database `whatsapp_biz` exists
- [ ] `.env` file has correct `DATABASE_URL`
- [ ] Can connect to database: `psql -h localhost -U your_user -d whatsapp_biz`
- [ ] Next.js server is running: `npm run dev`
- [ ] Visiting `http://localhost:3000` works

## Setup PostgreSQL from Scratch

If PostgreSQL isn't set up:

### On Windows:
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer
3. Remember the password you set for `postgres` user
4. Keep default port 5432

### On Mac:
```bash
brew install postgresql@15
brew services start postgresql@15
createdb whatsapp_biz
```

### On Linux:
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb whatsapp_biz
```

### Create .env file:

```bash
# Copy the example
cp .env.example .env

# Edit .env and set:
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/whatsapp_biz
```

Replace:
- `postgres` - your PostgreSQL username
- `your_password` - your PostgreSQL password
- `localhost` - your PostgreSQL host (usually localhost)
- `5432` - your PostgreSQL port (usually 5432)
- `whatsapp_biz` - your database name

## Initialize Database

Once PostgreSQL is set up and .env is configured:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional - installer does this)
npx prisma db seed
```

Then visit `http://localhost:3000/installer` and try Step 2 again.

## Error Messages Now Provide:

- 🔴 **Error Type**: What went wrong
- ⚠️ **User Message**: Plain language explanation
- 📋 **Details**: Technical error message
- 💡 **Suggestions**: How to fix it
- 📍 **Next Steps**: Ordered list of actions

## Getting Help

If you still see the error after trying above:

1. **Check the error message carefully** - it now provides specific guidance
2. **Look at server logs** - Terminal where `npm run dev` is running
3. **Check `.env` file** - Is DATABASE_URL correct?
4. **Verify PostgreSQL** - Is it actually running and accessible?
5. **Try database connection directly:**
   ```bash
   psql postgresql://user:password@localhost:5432/whatsapp_biz
   ```

## Build Status

✅ **Build Successful**: Compiled in 3.2s (0 errors)  
✅ **Installer**: Enhanced error messages  
✅ **Database Init**: Improved diagnostics  
✅ **Error Handling**: Clear next steps provided
