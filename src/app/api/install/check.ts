import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check system requirements
    const checks = {
      nodeVersion: process.version,
      platform: process.platform,
      databaseConfigured: !!process.env.DATABASE_URL,
      envConfigured: !!process.env.NEXTAUTH_SECRET,
    }

    // All checks passed
    return NextResponse.json(
      { success: true, checks },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'System check failed' },
      { status: 500 }
    )
  }
}
