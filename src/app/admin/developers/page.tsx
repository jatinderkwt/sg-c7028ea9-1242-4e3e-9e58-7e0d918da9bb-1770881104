import { Shield, Key, FileText, Activity } from "lucide-react"

export default function DevelopersPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Developer Tools</h1>

            {/* Webhook Firehose */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                        <Activity size={20} className="text-orange-500" />
                        Webhook Firehose
                    </h3>
                    <span className="text-xs text-gray-500">Last 60 minutes</span>
                </div>
                <div className="p-0">
                    <div className="bg-gray-900 text-green-400 font-mono text-xs p-4 h-64 overflow-y-auto">
                        <p className="mb-1"><span className="text-gray-500">[14:24:01]</span> POST /webhooks/meta payload size=2.4kb from 192.168.1.1</p>
                        <p className="mb-1"><span className="text-gray-500">[14:24:05]</span> EVENT messages.received id=wamid.HBgLM... status=delivered</p>
                        <p className="mb-1"><span className="text-gray-500">[14:24:08]</span> POST /webhooks/meta payload size=1.2kb from 192.168.1.1</p>
                        <p className="mb-1"><span className="text-gray-500">[14:24:12]</span> WARN invalid_signature tenant_id=cmlk... from 10.0.0.5</p>
                        <p className="mb-1"><span className="text-gray-500">[14:24:15]</span> EVENT conversation.started category=marketing</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* API Keys */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <Key size={20} className="text-blue-500" />
                            Tenant API Keys
                        </h3>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-gray-500 mb-4">Manage and revoke platform API keys for custom integrations.</p>
                        <button className="w-full py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">View Key Registry</button>
                    </div>
                </div>

                {/* Rate Limits */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <Shield size={20} className="text-purple-500" />
                            Rate Limit Governor
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">Tier 1 Tenants</span>
                                    <span className="text-gray-500">85% Capacity</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">Tier 2 Tenants</span>
                                    <span className="text-gray-500">42% Capacity</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
