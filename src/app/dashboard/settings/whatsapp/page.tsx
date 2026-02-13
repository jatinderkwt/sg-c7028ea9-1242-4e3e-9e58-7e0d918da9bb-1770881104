import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { saveWhatsAppSettings } from "@/actions/whatsapp"
import { WhatsAppSettingsForm } from "./form"

export default async function WhatsAppSettingsPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return null

    // Get current workspace settings
    const membership = await db.workspaceMember.findFirst({
        where: { user: { email: session.user.email } },
        include: { workspace: true }
    })

    if (!membership) return null

    const waSettings = await db.whatsAppNumber.findFirst({
        where: { workspaceId: membership.workspaceId }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">WhatsApp Connection</h1>

            {/* Status Card */}
            <div className={`rounded-lg p-6 border ${waSettings?.isActive ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">
                            {waSettings?.isActive ? 'WhatsApp Business API Connected' : 'Connect to WhatsApp'}
                        </h3>
                        <p className={`text-sm mt-1 ${waSettings?.isActive ? 'text-green-700' : 'text-gray-500'}`}>
                            {waSettings?.isActive
                                ? `Connected: ${waSettings.displayName} (${waSettings.phoneNumber})`
                                : 'Enter your credentials to enable messaging features.'}
                        </p>
                    </div>
                    <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${waSettings?.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {waSettings?.isActive ? 'Active' : 'Disconnected'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Form Component */}
            <WhatsAppSettingsForm initialData={waSettings} />

            {/* Webhook Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Webhook Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Callback URL</label>
                        <div className="flex">
                            <input
                                type="text"
                                readOnly
                                value={`${process.env.NEXTAUTH_URL || 'https://api.wafiz.com'}/api/webhooks/whatsapp/${membership.workspaceId}`}
                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-l-lg text-gray-500 font-mono text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Verify Token</label>
                        <div className="flex">
                            <input
                                type="text"
                                readOnly
                                value={waSettings?.webhookToken || "Generate one in Meta dashboard"}
                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-l-lg text-gray-500 font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
