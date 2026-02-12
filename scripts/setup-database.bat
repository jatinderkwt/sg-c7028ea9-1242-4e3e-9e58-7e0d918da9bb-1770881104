@echo off
REM WhatsApp Business API - Database Setup Script (Windows)
REM This script sets up the database with the correct schema

echo.
echo 🚀 WhatsApp Business API - Database Setup
echo ==========================================
echo.

REM Check if DATABASE_URL is set
if "%DATABASE_URL%"=="" (
  echo ❌ ERROR: DATABASE_URL environment variable is not set
  echo.
  echo Please set DATABASE_URL in your .env.local file:
  echo DATABASE_URL="postgresql://whatsapp:JoalcnpPuVQtqFnq@72.61.249.147:6543/whatsappbizapi?schema=public"
  echo.
  exit /b 1
)

REM Check if DATABASE_URL contains schema parameter
echo %DATABASE_URL% | findstr /C:"?schema=" >nul || echo %DATABASE_URL% | findstr /C:"&schema=" >nul
if errorlevel 1 (
  echo ⚠️  WARNING: DATABASE_URL is missing the schema parameter
  echo.
  echo Current DATABASE_URL: %DATABASE_URL%
  echo.
  echo ❌ This will cause the error: 'no schema has been selected to create in'
  echo.
  echo ✅ Add ?schema=public to the end of your DATABASE_URL
  echo.
  exit /b 1
)

echo ✅ DATABASE_URL is correctly configured with schema parameter
echo.

REM Step 1: Generate Prisma Client
echo 📦 Step 1: Generating Prisma Client...
call npx prisma generate
if errorlevel 1 exit /b 1
echo ✅ Prisma Client generated
echo.

REM Step 2: Push database schema
echo 🗄️  Step 2: Creating database tables...
call npx prisma db push --accept-data-loss
if errorlevel 1 exit /b 1
echo ✅ Database tables created
echo.

echo.
echo ✅ Database setup complete!
echo.
echo 🎉 Next steps:
echo 1. Visit http://localhost:3000/installer
echo 2. Complete the installation wizard
echo 3. Start using your WhatsApp Business API platform!
echo.