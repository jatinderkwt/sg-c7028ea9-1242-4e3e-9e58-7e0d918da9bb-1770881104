'use client'

import { useState } from 'react'

export default function WhatsAppSettings() {
    const [loading, setLoading] = useState(false)
    const [connected, setConnected] = useState(false) // In real app, fetch from server

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            setConnected(true)
            setLoading(false)
        }, 1500)
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">WhatsApp Connection</h1>

            {/* Connection Status Card */}
            <div className={`rounded-lg p-6 border ${connected ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">
                            {connected ? 'WhatsApp Business API Connected' : 'Connect to WhatsApp'}
                        </h3>
                        <p className={`text-sm mt-1 ${connected ? 'text-green-700' : 'text-gray-500'}`}>
                            {connected
                                ? 'Your workspace is successfully connected to the Meta WhatsApp Business API.'
                                : 'Enter your credentials to enable messaging features.'}
                        </p>
                    </div>
                    <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${connected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {connected ? 'Active' : 'Disconnected'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Configuration Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">API Credentials</h3>
                    <p className="text-sm text-gray-500 mt-1">Found in your Meta Developer Dashboard › WhatsApp › API Setup</p>
                </div>

                <form onSubmit={handleConnect} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-6 max-w-3xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number ID</label>
                            <input
                                type="text"
                                placeholder="e.g., 108462..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">The ID of the phone number you want to send messages from.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Business Account ID (WABA ID)</label>
                            <input
                                type="text"
                                placeholder="e.g., 192348..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">The ID of your WhatsApp Business Account.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Access Token</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="EAAG..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">A system user token with `whatsapp_business_messaging` and `business_management` permissions.</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Need help? <a href="#" className="text-blue-600 hover:underline">Read the setup guide</a>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || connected}
                            className={`px-6 py-2 rounded-lg font-medium text-white transition ${connected ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {loading ? 'Verifying...' : connected ? 'Update Configuration' : 'Save & Connect'}
                        </button>
                    </div>
                </form>
            </div>

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
                                value="https://api.wafiz.com/api/webhooks/whatsapp"
                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-l-lg text-gray-500 font-mono text-sm"
                            />
                            <button type="button" className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600 hover:bg-gray-200 text-sm font-medium">
                                Copy
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Verify Token</label>
                        <div className="flex">
                            <input
                                type="text"
                                readOnly
                                value="wafiz_verify_token_123"
                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-l-lg text-gray-500 font-mono text-sm"
                            />
                            <button type="button" className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600 hover:bg-gray-200 text-sm font-medium">
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
