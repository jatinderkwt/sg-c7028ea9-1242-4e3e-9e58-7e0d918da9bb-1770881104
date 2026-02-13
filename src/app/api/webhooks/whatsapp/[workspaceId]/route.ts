import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

// GET request for Verification
export async function GET(req: NextRequest, { params }: { params: { workspaceId: string } }) {
    const searchParams = req.nextUrl.searchParams;
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    if (mode === "subscribe" && token) {
        // Fetch the WhatsApp number settings for this workspace
        const waSettings = await db.whatsAppNumber.findFirst({
            where: { workspaceId: params.workspaceId }
        });

        if (waSettings && waSettings.webhookToken === token) {
            console.log("Webhook verified by token!");
            return new NextResponse(challenge, { status: 200 });
        } else {
            console.error("Webhook verification failed. Token mismatch or settings not found.");
            return new NextResponse("Forbidden", { status: 403 });
        }
    }

    return new NextResponse("Bad Request", { status: 400 });
}

// POST request for Event Notifications
export async function POST(req: NextRequest, { params }: { params: { workspaceId: string } }) {
    try {
        const body = await req.json();

        // Optional: Implement signature verification if appSecret is stored
        // const signature = req.headers.get("x-hub-signature-256");
        // ... verify signature logic using waSettings.appSecret ...

        // Log the incoming event
        console.log(`Received webhook for workspace ${params.workspaceId}:`, JSON.stringify(body, null, 2));

        // Basic acknowledgment to Meta
        // In a real implementation, you would queue this for processing
        return NextResponse.json({ status: "success" }, { status: 200 });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
