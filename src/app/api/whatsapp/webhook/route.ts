import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from "crypto"

export async function GET(request: NextRequest) {
    // Webhook verification for Meta
    const searchParams = request.nextUrl.searchParams
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    // Hardcoded verification token for now, ideally from ENV or DB
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'wabiz_webhook_verify'

    if (mode === 'subscribe' && token === verifyToken) {
        console.log('WEBHOOK_VERIFIED');
        return new Response(challenge, {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
        });
    }

    return new NextResponse('Forbidden', { status: 403 })
}

export async function POST(request: NextRequest) {
    try {
        const bodyText = await request.text()
        const body = JSON.parse(bodyText)

        // --- Security: Validate Meta Signature ---
        const signature = request.headers.get('x-hub-signature-256')
        const appSecret = process.env.META_APP_SECRET

        if (signature && appSecret) {
            const hmac = crypto.createHmac('sha256', appSecret)
            const digest = 'sha256=' + hmac.update(bodyText).digest('hex')
            if (signature !== digest) {
                console.error('WEBHOOK_SIGNATURE_MISMATCH')
                return new NextResponse('Invalid Signature', { status: 401 })
            }
        }

        console.log('WHATSAPP_WEBHOOK_RECEIVED', JSON.stringify(body, null, 2))

        // Log the raw webhook event for debugging
        await db.webhookLog.create({
            data: {
                event: 'whatsapp_payload',
                data: body,
                status: 200,
                response: 'PROCESSED'
            }
        })

        const entry = body.entry?.[0]
        const change = entry?.changes?.[0]?.value

        if (!change) {
            return new NextResponse('OK', { status: 200 })
        }

        const metadata = change.metadata
        const phone_number_id = metadata?.phone_number_id

        // 1. Find the WhatsAppNumber registered in our system
        const waNumber = await db.whatsAppNumber.findUnique({
            where: { phoneNumberId: phone_number_id },
            include: { workspace: true }
        })

        if (!waNumber) {
            console.error('PHONE_NUMBER_ID_NOT_FOUND', phone_number_id)
            return new NextResponse('OK', { status: 200 })
        }

        // --- Handle Template Status Updates ---
        if (change.event === 'message_template_status_update') {
            console.log('TEMPLATE_STATUS_UPDATE_RECEIVED', change)
            const { message_template_id, message_template_name, event } = change

            // Map Meta events to our TemplateStatus
            let internalStatus: any = 'DRAFT'
            if (event === 'APPROVED') internalStatus = 'APPROVED'
            if (event === 'REJECTED') internalStatus = 'REJECTED'
            if (event === 'FLAGGED') internalStatus = 'REJECTED' // Or a FLAGGED status if we had one

            await db.whatsAppTemplate.updateMany({
                where: {
                    OR: [
                        { metaTemplateId: message_template_id.toString() },
                        { name: message_template_name, numberId: waNumber.id }
                    ]
                },
                data: {
                    status: internalStatus,
                    updatedAt: new Date()
                }
            })
            return new NextResponse('OK', { status: 200 })
        }

        // --- Handle Delivery Receipts ---
        if (change.statuses) {
            for (const statusObj of change.statuses) {
                const messageId = statusObj.id
                const status = statusObj.status // delivered, read, failed

                // Update message delivery status in DB
                console.log(`MESSAGE_STATUS_UPDATE: ${messageId} is now ${status}`)

                await db.message.updateMany({
                    where: { metaMessageId: messageId },
                    data: { deliveryStatus: status.toUpperCase() as any }
                })
            }
            return new NextResponse('OK', { status: 200 })
        }

        // --- Handle Incoming Messages ---
        if (change.messages) {
            for (const msg of change.messages) {
                const senderPhone = msg.from
                const messageId = msg.id
                const profileName = change.contacts?.[0]?.profile?.name || senderPhone

                let content = ""
                let type: any = "TEXT"

                if (msg.type === 'text') {
                    content = msg.text.body
                    type = "TEXT"
                } else if (msg.type === 'image') {
                    content = "[Image]"
                    type = "IMAGE"
                } else if (msg.type === 'interactive') {
                    if (msg.interactive?.type === 'button_reply') {
                        content = `Button Clicked: ${msg.interactive.button_reply?.title} (${msg.interactive.button_reply?.id})`
                        type = "TEXT"
                    } else {
                        content = "[Interactive Message]"
                        type = "TEXT"
                    }
                } else {
                    content = `[${msg.type} message]`
                    type = "TEXT"
                }

                // 2. Find or create Contact
                let contact = await db.contact.findFirst({
                    where: {
                        phone: senderPhone,
                        workspaceId: waNumber.workspaceId
                    }
                })

                if (!contact) {
                    contact = await db.contact.create({
                        data: {
                            phone: senderPhone,
                            displayName: profileName,
                            workspaceId: waNumber.workspaceId
                        }
                    })
                }

                // 3. Find or create Conversation
                let conversation = await db.conversation.findFirst({
                    where: {
                        contactId: contact.id,
                        numberId: waNumber.id,
                        workspaceId: waNumber.workspaceId,
                        status: 'OPEN'
                    }
                })

                if (!conversation) {
                    conversation = await db.conversation.create({
                        data: {
                            contactId: contact.id,
                            numberId: waNumber.id,
                            workspaceId: waNumber.workspaceId,
                            status: 'OPEN',
                            lastMessageAt: new Date()
                        }
                    })
                } else {
                    await db.conversation.update({
                        where: { id: conversation.id },
                        data: { lastMessageAt: new Date() }
                    })
                }

                // 4. Create Message
                await db.message.create({
                    data: {
                        conversationId: conversation.id,
                        type: type,
                        content: content,
                        sender: 'CONTACT',
                        deliveryStatus: 'READ', // It's an incoming message, so we've "received" it
                        isRead: false
                    }
                })
            }
            return new NextResponse('OK', { status: 200 })
        }

        return new NextResponse('OK', { status: 200 })
    } catch (error) {
        console.error('WEBHOOK_PROCESS_ERROR', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
