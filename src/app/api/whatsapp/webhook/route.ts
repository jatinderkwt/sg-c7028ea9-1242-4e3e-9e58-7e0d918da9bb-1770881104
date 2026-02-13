import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
        const body = await request.json()

        // Log webhook event
        await db.webhookLog.create({
            data: {
                event: 'whatsapp_message',
                data: body,
                status: 200,
                response: 'OK'
            }
        })

        // Process messages here (simplified)
        // Ideally queue for processing or handle directly

        return new NextResponse('OK', { status: 200 })
    } catch (error) {
        console.error('Webhook error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
