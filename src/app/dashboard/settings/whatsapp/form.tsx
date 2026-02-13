'use client'

import { saveWhatsAppSettings } from "@/actions/whatsapp"
import { useFormStatus } from "react-dom"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
            {pending ? 'Saving...' : 'Save Configuration'}
        </button>
    )
}

export function WhatsAppSettingsForm({ initialData }: { initialData: any }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">API Credentials</h3>
                <p className="text-sm text-gray-500 mt-1">Found in your Meta Developer Dashboard › WhatsApp › API Setup</p>
            </div>

            <form action={saveWhatsAppSettings} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta App ID</label>
                        <input
                            type="text"
                            name="appId"
                            defaultValue={initialData?.appId}
                            placeholder="Meta App ID"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta App Secret</label>
                        <input
                            type="password"
                            name="appSecret"
                            defaultValue={initialData?.appSecret}
                            placeholder="Meta App Secret"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Version</label>
                        <input
                            type="text"
                            name="apiVersion"
                            defaultValue={initialData?.apiVersion || "v18.0"}
                            placeholder="v18.0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                        <input
                            type="text"
                            name="displayName"
                            defaultValue={initialData?.displayName}
                            placeholder="My Business"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            defaultValue={initialData?.phoneNumber}
                            placeholder="+1 234 567 890"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number ID</label>
                        <input
                            type="text"
                            name="phoneNumberId"
                            defaultValue={initialData?.phoneNumberId}
                            placeholder="e.g., 108462..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">WABA ID</label>
                        <input
                            type="text"
                            name="wabaId"
                            defaultValue={initialData?.businessAccountId}
                            placeholder="e.g., 192348..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                        <input
                            type="password"
                            name="accessToken"
                            defaultValue={initialData?.accessToken}
                            placeholder="EAAG..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
                    <SubmitButton />
                </div>
            </form>
        </div>
    )
}
