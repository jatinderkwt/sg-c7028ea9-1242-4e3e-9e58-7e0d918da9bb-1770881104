#!/bin/bash

# WhatsApp Business API - Database Setup Script
# This script sets up the database with the correct schema

set -e

echo "🚀 WhatsApp Business API - Database Setup"
echo "=========================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set"
  echo ""
  echo "Please set DATABASE_URL in your .env.local file:"
  echo "DATABASE_URL=\"postgresql://whatsapp:JoalcnpPuVQtqFnq@72.61.249.147:6543/whatsappbizapi?schema=public\""
  echo ""
  exit 1
fi

# Check if DATABASE_URL contains schema parameter
if [[ ! "$DATABASE_URL" == *"?schema="* ]] && [[ ! "$DATABASE_URL" == *"&schema="* ]]; then
  echo "⚠️  WARNING: DATABASE_URL is missing the schema parameter"
  echo ""
  echo "Current DATABASE_URL: $DATABASE_URL"
  echo ""
  echo "❌ This will cause the error: 'no schema has been selected to create in'"
  echo ""
  echo "✅ Add ?schema=public to the end of your DATABASE_URL:"
  echo "DATABASE_URL=\"$DATABASE_URL?schema=public\""
  echo ""
  exit 1
fi

echo "✅ DATABASE_URL is correctly configured with schema parameter"
echo ""

# Step 1: Generate Prisma Client
echo "📦 Step 1: Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated"
echo ""

# Step 2: Push database schema
echo "🗄️  Step 2: Creating database tables..."
npx prisma db push --accept-data-loss
echo "✅ Database tables created"
echo ""

# Step 3: Verify tables
echo "🔍 Step 3: Verifying database tables..."
npx prisma db execute --stdin <<EOF
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
EOF
echo ""
echo "✅ Database setup complete!"
echo ""
echo "🎉 Next steps:"
echo "1. Visit http://localhost:3000/installer"
echo "2. Complete the installation wizard"
echo "3. Start using your WhatsApp Business API platform!"
echo ""