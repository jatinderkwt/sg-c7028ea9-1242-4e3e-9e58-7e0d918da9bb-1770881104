import { Activity, Shield, RefreshCw } from "lucide-react"

export default function WabaPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">WABA Infrastructure</h1>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700">Meta API Status</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Operational</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">99.9%</div>
                    <p className="text-sm text-gray-500">Uptime (Last 30 days)</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700">Message Throughput</h3>
                        <Activity size={20} className="text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">124</div>
                    <p className="text-sm text-gray-500">Messages / Second</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700">Queue Depth</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Normal</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">42</div>
                    <p className="text-sm text-gray-500">Pending Webhooks</p>
                </div>
            </div>

            {/* System Token Management */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">System Access Tokens</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2">
                        <RefreshCw size={16} />
                        Refresh Tokens
                    </button>
                </div>
                <div className="p-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
                        <p className="text-sm text-amber-800">
                            <strong>Warning:</strong> Rotating system tokens will require re-authentication for the connected System Users.
                        </p>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">App ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Primary Graph API</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1829384756</td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Never</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Template Monitor */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Template Rejection Monitor</h3>
                </div>
                <div className="p-12 text-center text-gray-500">
                    No rejected templates in the last 24 hours.
                </div>
            </div>
        </div>
    )
}
