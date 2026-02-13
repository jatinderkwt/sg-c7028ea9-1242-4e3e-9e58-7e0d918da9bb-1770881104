import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { uploadComplianceDocument } from "@/lib/compliance"
// In a real app, use S3 or similar. Here we mock saving to disk logic or just store metadata.

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string

    if (!file || !type) {
        return NextResponse.json({ error: "Missing file or type" }, { status: 400 })
    }

    // Mock upload: usually save file to disk/S3 and get URL.
    // We will generate a fake URL for now.
    const fakeUrl = `/uploads/compliance/${Date.now()}-${file.name}`

    // Determine workspaceId. session.user usually has it? 
    // Wait, user is linked to workspaces. We need to know which workspace they are uploading for.
    // For now, assume single workspace or passed in params. 
    // Let's assume passed in formData or derived from context.
    const workspaceId = formData.get("workspaceId") as string

    if (!workspaceId) {
        return NextResponse.json({ error: "Missing workspaceId" }, { status: 400 })
    }

    try {
        const doc = await uploadComplianceDocument(
            workspaceId,
            type,
            fakeUrl,
            file.type,
            file.size
        )
        return NextResponse.json(doc)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}
