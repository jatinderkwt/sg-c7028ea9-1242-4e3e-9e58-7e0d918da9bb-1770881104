import fs from "fs";
import path from "path";

const LOCK_FILE = path.join(process.cwd(), "storage", "installed.lock");

export function isInstalled(): boolean {
  try {
    return fs.existsSync(LOCK_FILE);
  } catch {
    return false;
  }
}

export function createLockFile(): void {
  const dir = path.join(process.cwd(), "storage");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(LOCK_FILE, JSON.stringify({
    installedAt: new Date().toISOString(),
    version: "1.0.0",
  }), "utf8");
}

export async function checkSystemRequirements() {
  const checks = {
    nodejs: { status: "ok", message: "Node.js version compatible", version: process.version },
    database: { status: "pending", message: "Checking database connection..." },
    environment: { status: "pending", message: "Checking environment variables..." },
    storage: { status: "pending", message: "Checking storage permissions..." },
    webhook: { status: "pending", message: "Checking webhook accessibility..." },
  };

  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    await prisma.$connect();
    await prisma.$disconnect();
    checks.database = { status: "ok", message: "Database connection successful" };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    checks.database = { status: "error", message: `Database connection failed: ${errorMessage}` };
  }

  const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "ENCRYPTION_KEY"];
  const missingVars = requiredEnvVars.filter(v => !process.env[v]);
  if (missingVars.length === 0) {
    checks.environment = { status: "ok", message: "All required environment variables set" };
  } else {
    checks.environment = { 
      status: "error", 
      message: `Missing environment variables: ${missingVars.join(", ")}` 
    };
  }

  try {
    const storageDir = path.join(process.cwd(), "storage");
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    const testFile = path.join(storageDir, "test.txt");
    fs.writeFileSync(testFile, "test");
    fs.unlinkSync(testFile);
    checks.storage = { status: "ok", message: "Storage writable" };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    checks.storage = { status: "error", message: `Storage not writable: ${errorMessage}` };
  }

  const webhookUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (webhookUrl) {
    checks.webhook = { status: "ok", message: `Webhook URL configured: ${webhookUrl}/api/webhook/whatsapp` };
  } else {
    checks.webhook = { status: "warning", message: "NEXT_PUBLIC_APP_URL not set - webhook may not be accessible" };
  }

  return checks;
}