import { db } from "@/lib/db"

export async function uploadComplianceDocument(
    workspaceId: string,
    type: string,
    url: string,
    mimeType: string,
    fileSize: number
) {
    // 1. Find or Create Compliance record for workspace
    let compliance = await db.compliance.findUnique({
        where: { workspaceId }
    })

    if (!compliance) {
        compliance = await db.compliance.create({
            data: {
                workspaceId,
                status: 'PENDING'
            }
        })
    }

    // 2. Create Document record
    return await db.complianceDocument.create({
        data: {
            complianceId: compliance.id,
            type,
            url,
            mimeType,
            fileSize,
            status: 'PENDING'
        }
    })
}

export async function getComplianceStatus(workspaceId: string) {
    const compliance = await db.compliance.findUnique({
        where: { workspaceId },
        include: { documents: true }
    })

    if (!compliance) return null

    // Check if we have required docs
    const requiredTypes = ['business_license', 'tax_document', 'id_proof']
    // @ts-ignore
    const uploadedTypes = compliance.documents.map((d: any) => d.type)
    const missingDocs = requiredTypes.filter(t => !uploadedTypes.includes(t))

    return {
        ...compliance,
        missingDocs
    }
}
