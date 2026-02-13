import { db } from "@/lib/db";

export async function sendWhatsAppMessage(
    whatsappNumberId: string,
    to: string,
    content: string,
    type: 'TEXT' | 'TEMPLATE' = 'TEXT',
    templateName?: string,
    languageCode: string = 'en_US'
) {
    const waNumber = await db.whatsAppNumber.findUnique({
        where: { id: whatsappNumberId }
    });

    if (!waNumber) {
        throw new Error("WhatsApp Number not found in database");
    }

    const url = `${process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0'}/${waNumber.phoneNumberId}/messages`;

    const payload: any = {
        messaging_product: "whatsapp",
        to: to,
    };

    if (type === 'TEXT') {
        payload.type = "text";
        payload.text = { body: content };
    } else if (type === 'TEMPLATE' && templateName) {
        payload.type = "template";
        payload.template = {
            name: templateName,
            language: { code: languageCode }
        };
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${waNumber.accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('META_API_ERROR', data);

        // Log error to DB for debugging
        await db.webhookLog.create({
            data: {
                event: 'META_API_ERROR',
                status: response.status,
                data: data,
                response: data.error?.message || "Unknown error"
            }
        });

        throw new Error(data.error?.message || "Failed to send message through Meta API");
    }

    return data;
}

```
