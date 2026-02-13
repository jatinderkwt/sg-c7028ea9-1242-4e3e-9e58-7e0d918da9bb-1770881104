'use server'

import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createCompany(formData: FormData) {
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    const adminEmail = formData.get("adminEmail") as string
    const adminName = formData.get("adminName") as string
    const adminPassword = formData.get("adminPassword") as string

    if (!name || !slug || !adminEmail || !adminName || !adminPassword) {
        throw new Error("Missing required fields")
    }

    // Check if slug exists
    const existingWorkspace = await db.workspace.findUnique({
        where: { slug }
    })

    if (existingWorkspace) {
        throw new Error("Workspace slug already exists")
    }

    // Create Workspace
    const workspace = await db.workspace.create({
        data: {
            name,
            slug,
            timezone: "UTC",
            currency: "USD",
        }
    })

    // Create Workspace Settings
    await db.workspaceSettings.create({
        data: {
            workspaceId: workspace.id
        }
    })

    // Start Transaction ideally, but let's keep it simple for now.

    // Find or Create User
    let user = await db.user.findUnique({ where: { email: adminEmail.toLowerCase() } })

    if (!user) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10)
        user = await db.user.create({
            data: {
                email: adminEmail.toLowerCase(),
                name: adminName,
                password: hashedPassword,
                // New user is just a USER global role by default, unless specified otherwise.
                // But for their company, they will be SUPER_ADMIN (WorkspaceMember role).
            }
        })
    }

    // Add User to Workspace as SUPER_ADMIN
    await db.workspaceMember.create({
        data: {
            workspaceId: workspace.id,
            userId: user.id,
            role: "SUPER_ADMIN"
        }
    })

    revalidatePath("/admin")
    redirect("/admin")
}
