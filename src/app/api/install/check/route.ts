import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Check system requirements
    const checks: any = {
      nodeVersion: process.version,
      platform: process.platform,
      databaseConfigured: false,
      envConfigured: !!process.env.NEXTAUTH_SECRET,
    }

    // Try to verify database connection
    if (process.env.DATABASE_URL) {
      try {
        await db.$queryRaw`SELECT 1`
        checks.databaseConfigured = true
      } catch (dbError) {
        checks.databaseConfigured = false
        checks.databaseError = dbError instanceof Error ? dbError.message : 'Connection failed'
      }
    }

    // All checks passed
    return NextResponse.json(
      { success: true, checks },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'System check failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
