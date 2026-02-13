'use server'

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import crypto from "crypto"

export async function saveWhatsAppSettings(formData: FormData) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        throw new Error("Not authenticated")
    }

    const phoneNumberId = formData.get("phoneNumberId") as string
    const wabaId = formData.get("wabaId") as string
    const accessToken = formData.get("accessToken") as string
    const phoneNumber = formData.get("phoneNumber") as string // Added this field
    const displayName = formData.get("displayName") as string || "Main Contact"

    if (!phoneNumberId || !wabaId || !accessToken) {
        throw new Error("Missing required fields")
    }

    // Get current user's workspace
    const membership = await db.workspaceMember.findFirst({
        where: { user: { email: session.user.email } },
        include: { workspace: true }
    })

    if (!membership) {
        throw new Error("No workspace found")
    }

    // Check permissions
    if (membership.role !== 'SUPER_ADMIN' && membership.role !== 'MANAGER') {
        throw new Error("Unauthorized")
    }

    // Check if a number already exists for this workspace
    // For now, we assume managing the primary number
    const existingNumber = await db.whatsAppNumber.findFirst({
        where: { workspaceId: membership.workspaceId }
    })

    if (existingNumber) {
        const currentToken = existingNumber.webhookToken || crypto.randomBytes(24).toString('hex')
        await db.whatsAppNumber.update({
            where: { id: existingNumber.id },
            data: {
                phoneNumberId,
                businessAccountId: wabaId,
                accessToken,
                phoneNumber: phoneNumber || existingNumber.phoneNumber,
                displayName,
                webhookToken: currentToken,
                isVerified: true,
                isActive: true,
                appId: formData.get("appId") as string,
                appSecret: formData.get("appSecret") as string,
                apiVersion: formData.get("apiVersion") as string || "v18.0"
            }
        })
    } else {
        await db.whatsAppNumber.create({
            data: {
                workspaceId: membership.workspaceId,
                phoneNumberId,
                businessAccountId: wabaId,
                accessToken,
                phoneNumber: phoneNumber || "",
                displayName,
                webhookToken: crypto.randomBytes(24).toString('hex'), // Generate new token
                isVerified: true,
                isActive: true,
                appId: formData.get("appId") as string,
                appSecret: formData.get("appSecret") as string,
                apiVersion: formData.get("apiVersion") as string || "v18.0"
            }
        })
    }

    revalidatePath("/dashboard/settings/whatsapp")
}
