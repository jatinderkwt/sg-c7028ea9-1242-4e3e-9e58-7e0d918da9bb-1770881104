import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password, name, companyName } = body

        if (!email || !password || !name) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
        }

        const existingUser = await db.user.findUnique({
            where: {
                email: email.toLowerCase()
            }
        })

        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await db.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
            }
        })

        // Create a new workspace for the registered user
        const workspace = await db.workspace.create({
            data: {
                name: companyName || `${name}'s Workspace`,
                slug: companyName ? companyName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000) : `workspace-${user.id.slice(0, 8)}`,
            }
        })

        // Add user as SUPER_ADMIN
        await db.workspaceMember.create({
            data: {
                userId: user.id,
                workspaceId: workspace.id,
                role: 'SUPER_ADMIN'
            }
        })

        // Assign Starter Plan
        const starterPlan = await db.plan.findFirst({
            where: { name: 'Starter' }
        })

        if (starterPlan) {
            // Calculate trial end (14 days)
            const trialEnd = new Date()
            trialEnd.setDate(trialEnd.getDate() + 14)

            // Create subscription
            await db.subscription.create({
                data: {
                    workspaceId: workspace.id,
                    planId: starterPlan.id,
                    status: 'TRIALING',
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: trialEnd,
                    // We need unique stripe IDs, using placeholders for now
                    stripeCustomerId: `cus_temp_${workspace.id}`,
                    stripeSubscriptionId: `sub_temp_${workspace.id}`,
                }
            })
        }

        return NextResponse.json({
            user: {
                name: user.name,
                email: user.email,
                id: user.id
            }
        })

    } catch (error) {
        console.error('REGISTRATION_ERROR', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
