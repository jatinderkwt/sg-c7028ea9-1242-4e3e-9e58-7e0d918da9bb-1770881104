#!/usr/bin/env node

/**
 * Generate Secure Secrets for Production Deployment
 * 
 * This script generates cryptographically secure secrets
 * for NEXTAUTH_SECRET and ENCRYPTION_KEY
 * 
 * Usage:
 *   node scripts/generate-secrets.js
 */

const crypto = require('crypto');

console.log('\n🔐 Generating Secure Secrets for Production\n');
console.log('='.repeat(60));

// Generate NEXTAUTH_SECRET (32 bytes, base64 encoded)
const nextAuthSecret = crypto.randomBytes(32).toString('base64');
console.log('\n📌 NEXTAUTH_SECRET (Copy this to your .env.local or Dokploy):');
console.log('─'.repeat(60));
console.log(nextAuthSecret);

// Generate ENCRYPTION_KEY (32 bytes, hex encoded = 64 characters)
const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log('\n🔑 ENCRYPTION_KEY (Copy this to your .env.local or Dokploy):');
console.log('─'.repeat(60));
console.log(encryptionKey);

console.log('\n' + '='.repeat(60));
console.log('\n✅ Secrets Generated Successfully!\n');

console.log('📋 Next Steps:\n');
console.log('1. Copy the secrets above');
console.log('2. Add them to your .env.local file OR Dokploy environment variables');
console.log('3. Format:\n');
console.log(`   NEXTAUTH_SECRET="${nextAuthSecret}"`);
console.log(`   ENCRYPTION_KEY="${encryptionKey}"\n`);
console.log('4. Restart your application');
console.log('5. Visit /installer to complete setup\n');

// Also save to a file for convenience
const fs = require('fs');
const secretsFile = '.secrets-generated.txt';

const content = `
# Generated Secrets - ${new Date().toISOString()}
# ADD THESE TO YOUR .env.local OR DOKPLOY ENVIRONMENT VARIABLES

NEXTAUTH_SECRET="${nextAuthSecret}"
ENCRYPTION_KEY="${encryptionKey}"

# IMPORTANT: 
# - Keep these secrets secure and never commit to git
# - Use different secrets for development and production
# - This file is already in .gitignore
`;

fs.writeFileSync(secretsFile, content);
console.log(`💾 Secrets also saved to: ${secretsFile}`);
console.log('   (This file is git-ignored for security)\n');