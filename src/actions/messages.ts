'use server'

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendWhatsAppMessage } from "@/lib/whatsapp-api"
import { revalidatePath } from "next/cache"

export async function sendMessage(conversationId: string, content: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new Error("Unauthorized")

    const conversation = await db.conversation.findUnique({
        where: { id: conversationId },
        include: {
            contact: true,
            number: true
        }
    })

    if (!conversation) throw new Error("Conversation not found")

    try {
        // 1. Send to Meta API
        const metaResult = await sendWhatsAppMessage(
            conversation.numberId,
            conversation.contact.phone,
            content
        )

        // 2. Create Message in Database
        const message = await db.message.create({
            data: {
                conversationId: conversation.id,
                content: content,
                type: 'TEXT',
                sender: 'USER',
                deliveryStatus: 'SENT',
                metaMessageId: metaResult.messages?.[0]?.id,
                isRead: true
            }
        })

        // 3. Update Conversation timestamp
        await db.conversation.update({
            where: { id: conversation.id },
            data: { lastMessageAt: new Date() }
        })

        revalidatePath(`/dashboard/inbox`)
        return { success: true, message }
    } catch (error: any) {
        console.error('SEND_MESSAGE_ERROR', error)
        return { success: false, error: error.message }
    }
}
