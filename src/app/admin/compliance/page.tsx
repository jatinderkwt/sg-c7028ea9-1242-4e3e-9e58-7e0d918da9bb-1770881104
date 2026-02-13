import { db } from "@/lib/db"
import { CheckCircle, XCircle, FileText, AlertTriangle } from "lucide-react"

// Force dynamic to ensure fresh data
export const dynamic = 'force-dynamic'

export default async function ComplianceReviewPage() {
    // Fetch pending compliances (users who uploaded docs but not approved)
    // We need to fetch compliances where status is PENDING or have documents PENDING
    // BUT accessing db.compliance requires generated client.
    // I will use `any` cast if needed locally, but code is server side.

    // @ts-ignore
    const pendingCompliances = await db.compliance.findMany({
        where: {
            status: 'PENDING'
        },
        include: {
            workspace: true,
            documents: true
        }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Compliance Review Queue</h1>

            {pendingCompliances.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-lg border border-gray-200 text-gray-500">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                    <p>No pending compliance reviews.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {pendingCompliances.map((comp: any) => (
                        <div key={comp.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{comp.workspace.name}</h3>
                                    <p className="text-sm text-gray-500">Legal Name: {comp.legalName || 'Not set'}</p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                    Pending Review
                                </span>
                            </div>
                            <div className="p-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-4">Submitted Documents</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                    {comp.documents.map((doc: any) => (
                                        <div key={doc.id} className="border border-gray-200 rounded-lg p-4 flex items-start gap-3">
                                            <FileText className="text-blue-500 mt-1" size={20} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 capitalize">{doc.type.replace('_', ' ')}</p>
                                                <p className="text-xs text-gray-500 mb-2">{(doc.fileSize / 1024).toFixed(1)} KB</p>
                                                <a href={doc.url} target="_blank" className="text-xs text-blue-600 hover:underline">View Document</a>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                                    <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md border border-transparent hover:border-red-200 transition">
                                        Reject Application
                                    </button>
                                    <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm transition">
                                        Approve & Verify
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
