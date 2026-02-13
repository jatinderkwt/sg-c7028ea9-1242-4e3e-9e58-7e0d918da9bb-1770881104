'use server'

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const settingsSchema = z.object({
    name: z.string().min(1, "Workspace name is required"),
    timezone: z.string().min(1, "Timezone is required"),
    description: z.string().optional(),
    currency: z.string().optional(),
})

export async function saveGeneralSettings(formData: FormData) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        throw new Error("Not authenticated")
    }

    const rawData = {
        name: formData.get("name") as string,
        timezone: formData.get("timezone") as string,
        description: formData.get("description") as string | undefined, // Cast to string or undefined
        currency: formData.get("currency") as string | undefined,
    }

    const validatedData = settingsSchema.safeParse(rawData)

    if (!validatedData.success) {
        throw new Error("Invalid data provided")
    }

    // Get current user's workspace membership
    const membership = await db.workspaceMember.findFirst({
        where: { user: { email: session.user.email } },
        include: { workspace: true }
    })

    if (!membership) {
        throw new Error("No workspace found")
    }

    // Check permissions
    if (membership.role !== 'SUPER_ADMIN' && membership.role !== 'MANAGER') {
        throw new Error("Unauthorized: Only admins and managers can update settings")
    }

    // Update workspace
    await db.workspace.update({
        where: { id: membership.workspaceId },
        data: {
            name: validatedData.data.name,
            timezone: validatedData.data.timezone,
            description: validatedData.data.description || null,
            currency: validatedData.data.currency || "USD",
        }
    })

    revalidatePath("/dashboard/settings/general")
}
