'use server'

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

export async function inviteMember(formData: FormData) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        throw new Error("Not authenticated")
    }

    const email = formData.get("email") as string
    const role = formData.get("role") as UserRole
    const name = formData.get("name") as string

    if (!email || !role || !name) {
        throw new Error("Missing fields")
    }

    // Get current user's workspace
    // Assuming single workspace for now or first one
    const membership = await db.workspaceMember.findFirst({
        where: { user: { email: session.user.email } },
        include: { workspace: true }
    })

    if (!membership) {
        throw new Error("No workspace found")
    }

    // Check permissions: Only SUPER_ADMIN (Company Admin) or MANAGER can add
    if (membership.role !== 'SUPER_ADMIN' && membership.role !== 'MANAGER') {
        throw new Error("Unauthorized: Only Admins can invited members")
    }

    // Find or create user
    let user = await db.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user) {
        const password = Math.random().toString(36).slice(-8) // Random temp password
        const hashedPassword = await bcrypt.hash(password, 10)
        user = await db.user.create({
            data: {
                email: email.toLowerCase(),
                name: name,
                password: hashedPassword,
                // Role defaults to USER (global), which is fine for staff
            }
        })
        console.log(`Created user ${email} with password ${password}`)
    }

    // Check if already member
    const existingMember = await db.workspaceMember.findUnique({
        where: {
            workspaceId_userId: {
                workspaceId: membership.workspaceId,
                userId: user.id
            }
        }
    })

    if (existingMember) {
        throw new Error("User is already a member of this workspace")
    }

    // Add to workspace
    await db.workspaceMember.create({
        data: {
            userId: user.id,
            workspaceId: membership.workspaceId,
            role: role
        }
    })

    revalidatePath("/dashboard/settings/team")
}
