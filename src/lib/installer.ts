import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

const LOCK_FILE = path.join(process.cwd(), "storage", "installed.lock");

export function isInstalled(): boolean {
  try {
    return fs.existsSync(LOCK_FILE);
  } catch {
    return false;
  }
}

export function createLockFile(): void {
  const storageDir = path.join(process.cwd(), "storage");
  
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }
  
  fs.writeFileSync(
    LOCK_FILE,
    JSON.stringify({
      installedAt: new Date().toISOString(),
      version: "1.0.0",
    })
  );
}

export type SystemCheck = {
  name: string;
  status: "success" | "warning" | "error";
  message: string;
  details?: string;
};

export async function checkSystemRequirements(): Promise<SystemCheck[]> {
  const checks: SystemCheck[] = [];

  // 1. Node.js Version Check
  try {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);
    
    if (majorVersion >= 18) {
      checks.push({
        name: "Node.js Version",
        status: "success",
        message: `Node.js ${nodeVersion} detected`,
        details: "Minimum version 18.x required"
      });
    } else {
      checks.push({
        name: "Node.js Version",
        status: "error",
        message: `Node.js ${nodeVersion} is too old`,
        details: "Please upgrade to Node.js 18.x or higher"
      });
    }
  } catch (error) {
    checks.push({
      name: "Node.js Version",
      status: "error",
      message: "Could not determine Node.js version",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }

  // 2. Database Connection Check
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.push({
      name: "Database Connection",
      status: "success",
      message: "PostgreSQL connected successfully",
      details: "Database is reachable and responding"
    });
  } catch (error) {
    checks.push({
      name: "Database Connection",
      status: "error",
      message: "Failed to connect to PostgreSQL",
      details: error instanceof Error ? error.message : "Check DATABASE_URL in environment variables"
    });
  }

  // 3. Environment Variables Check
  const requiredEnvVars = [
    { key: "DATABASE_URL", description: "PostgreSQL connection string" },
    { key: "NEXTAUTH_SECRET", description: "JWT signing secret" },
    { key: "ENCRYPTION_KEY", description: "Data encryption key" }
  ];

  const missingEnvVars = requiredEnvVars.filter(env => !process.env[env.key]);
  
  if (missingEnvVars.length === 0) {
    checks.push({
      name: "Environment Variables",
      status: "success",
      message: "All required environment variables are set",
      details: requiredEnvVars.map(e => e.key).join(", ")
    });
  } else {
    checks.push({
      name: "Environment Variables",
      status: "error",
      message: `Missing ${missingEnvVars.length} required variable(s)`,
      details: `Missing: ${missingEnvVars.map(e => e.key).join(", ")}`
    });
  }

  // 4. File System Permissions Check
  try {
    const storageDir = path.join(process.cwd(), "storage");
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    
    // Try to create directories
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Test write permissions
    const testFile = path.join(storageDir, ".write-test");
    fs.writeFileSync(testFile, "test");
    fs.unlinkSync(testFile);
    
    checks.push({
      name: "File Permissions",
      status: "success",
      message: "File system is writable",
      details: "Can create directories and files"
    });
  } catch (error) {
    checks.push({
      name: "File Permissions",
      status: "warning",
      message: "Limited file system access",
      details: "May affect file uploads and logs. Consider mounting persistent volumes."
    });
  }

  // 5. Storage Availability Check
  try {
    const storageDir = path.join(process.cwd(), "storage");
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    
    const storageExists = fs.existsSync(storageDir);
    const uploadsExists = fs.existsSync(uploadsDir);
    
    if (storageExists && uploadsExists) {
      checks.push({
        name: "Storage Availability",
        status: "success",
        message: "Storage directories are available",
        details: "storage/ and public/uploads/ directories exist"
      });
    } else {
      checks.push({
        name: "Storage Availability",
        status: "warning",
        message: "Storage directories created",
        details: "Directories were just created. Consider persistent volume mounting for production."
      });
    }
  } catch (error) {
    checks.push({
      name: "Storage Availability",
      status: "error",
      message: "Cannot access storage directories",
      details: error instanceof Error ? error.message : "Check file system permissions"
    });
  }

  // 6. Optional: Webhook URL Check
  if (process.env.NEXT_PUBLIC_APP_URL) {
    checks.push({
      name: "Webhook URL",
      status: "success",
      message: "App URL configured",
      details: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/whatsapp`
    });
  } else {
    checks.push({
      name: "Webhook URL",
      status: "warning",
      message: "NEXT_PUBLIC_APP_URL not set",
      details: "Set this to your production domain for webhook functionality"
    });
  }

  return checks;
}