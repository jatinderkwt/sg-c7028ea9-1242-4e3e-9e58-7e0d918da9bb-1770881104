import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient | undefined

async function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}

export async function GET(request: NextRequest) {
  try {
    const client = await getPrisma()
    
    // Try to query the SystemSettings to check if installed
    const settings = await client.systemSettings.findFirst()
    
    const isInstalled = settings?.isInstalled ?? false

    return NextResponse.json(
      { isInstalled },
      { status: 200 }
    )
  } catch (error) {
    // If database connection fails, it's not installed yet
    return NextResponse.json(
      { isInstalled: false },
      { status: 200 }
    )
  }
}
