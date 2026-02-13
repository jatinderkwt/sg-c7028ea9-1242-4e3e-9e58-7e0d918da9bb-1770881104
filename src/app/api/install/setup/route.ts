import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.adminEmail || !data.adminPassword || !data.adminName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if already installed
    const existingSettings = await db.systemSettings.findFirst()
    if (existingSettings?.isInstalled) {
      return NextResponse.json(
        { error: 'System already installed' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.adminPassword, 10)

    // Create super admin user
    const user = await db.user.create({
      data: {
        name: data.adminName,
        email: data.adminEmail.toLowerCase(),
        password: hashedPassword,
      },
    })

    // Create default workspace
    const workspace = await db.workspace.create({
      data: {
        name: 'Default Workspace',
        slug: 'default-workspace',
        timezone: data.timezone || 'UTC',
        currency: data.currency || 'USD',
      },
    })

    // Add user to workspace as super admin
    await db.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        role: 'SUPER_ADMIN',
      },
    })

    // Create workspace settings
    await db.workspaceSettings.create({
      data: {
        workspaceId: workspace.id,
      },
    })

    // Create system settings
    const systemSettings = await db.systemSettings.upsert({
      where: { id: 'system' },
      create: {
        id: 'system',
        isInstalled: true,
        installationDate: new Date(),
        platformName: data.platformName || 'WaFiz',
        defaultCurrency: data.currency || 'USD',
        defaultTimezone: data.timezone || 'UTC',
        supportEmail: data.supportEmail,
      },
      update: {
        isInstalled: true,
        installationDate: new Date(),
        platformName: data.platformName || 'WaFiz',
        defaultCurrency: data.currency || 'USD',
        defaultTimezone: data.timezone || 'UTC',
        supportEmail: data.supportEmail,
      },
    })

    // Create default plans
    const plans = await Promise.all([
      db.plan.create({
        data: {
          name: 'Starter',
          description: 'Perfect for getting started',
          pricingMonthly: 2999, // $29.99
          pricingYearly: 29990,
          maxNumbers: 1,
          maxAgents: 2,
          maxContacts: 1000,
          features: ['Basic inbox', 'Auto-reply', 'Basic analytics'],
          isFeatured: false,
          displayOrder: 1,
        },
      }),
      db.plan.create({
        data: {
          name: 'Growth',
          description: 'For growing teams',
          pricingMonthly: 9999, // $99.99
          pricingYearly: 99990,
          maxNumbers: 3,
          maxAgents: 5,
          maxContacts: 10000,
          features: ['Full automation', 'CRM', 'Advanced analytics', 'API access'],
          isFeatured: true,
          displayOrder: 2,
        },
      }),
      db.plan.create({
        data: {
          name: 'Enterprise',
          description: 'Unlimited everything',
          pricingMonthly: 29999, // $299.99
          pricingYearly: 299990,
          maxNumbers: 999,
          maxAgents: 999,
          maxContacts: 999999,
          features: ['Everything in Growth', 'White label', 'Dedicated support', 'Custom integrations'],
          isFeatured: true,
          displayOrder: 3,
        },
      }),
    ])

    return NextResponse.json(
      {
        success: true,
        message: 'Installation completed successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        workspace: {
          id: workspace.id,
          name: workspace.name,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Installation error:', error)
    return NextResponse.json(
      { error: 'Installation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
