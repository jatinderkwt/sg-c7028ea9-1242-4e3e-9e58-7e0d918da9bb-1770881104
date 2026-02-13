'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function syncWhatsAppTemplates(whatsappNumberId: string) {
    const waNumber = await db.whatsAppNumber.findUnique({
        where: { id: whatsappNumberId },
        include: { workspace: true }
    })

    if (!waNumber || !waNumber.businessAccountId || !waNumber.accessToken) {
        throw new Error("Invalid WhatsApp configuration for sync")
    }

    const wabaId = waNumber.businessAccountId
    const url = `https://graph.facebook.com/v18.0/${wabaId}/message_templates`

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${waNumber.accessToken}`,
            }
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to fetch templates from Meta")
        }

        const metaTemplates = data.data || []

        for (const metaTpl of metaTemplates) {
            // Find component content
            const bodyComponent = metaTpl.components.find((c: any) => c.type === 'BODY')
            const content = bodyComponent ? bodyComponent.text : ""

            // Map Meta status to internal status
            let status: any = 'DRAFT'
            if (metaTpl.status === 'APPROVED') status = 'APPROVED'
            if (metaTpl.status === 'REJECTED') status = 'REJECTED'
            if (metaTpl.status === 'PENDING') status = 'PENDING_REVIEW'

            await db.whatsAppTemplate.upsert({
                where: {
                    metaTemplateId: metaTpl.id
                },
                update: {
                    status: status,
                    content: content,
                    updatedAt: new Date()
                },
                create: {
                    metaTemplateId: metaTpl.id,
                    name: metaTpl.name,
                    category: metaTpl.category as any,
                    language: metaTpl.language,
                    content: content,
                    status: status,
                    workspaceId: waNumber.workspaceId,
                    numberId: waNumber.id
                }
            })
        }

        revalidatePath('/dashboard/templates')
        return { success: true, count: metaTemplates.length }
    } catch (error: any) {
        console.error('SYNC_TEMPLATES_ERROR', error)
        return { success: false, error: error.message }
    }
}
