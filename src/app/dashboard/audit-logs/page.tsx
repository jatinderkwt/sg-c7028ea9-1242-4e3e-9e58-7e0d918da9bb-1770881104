import { Search, Filter, Download } from "lucide-react"

export default function AuditLogsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
                <div className="flex gap-2">
                    <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-50 flex items-center gap-2">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
                    <option>All Actions</option>
                    <option>Login</option>
                    <option>Campaign Sent</option>
                    <option>Setting Changed</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
                    <option>All Users</option>
                    <option>John Doe</option>
                    <option>Alice Smith</option>
                </select>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Oct 24, 2024 14:30:22</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">John Doe</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">billing.topup</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Added $20.00 credit</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">192.168.1.45</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Oct 24, 2024 12:15:05</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Alice Smith</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">campaign.create</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Created "Black Friday Sale"</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">10.0.0.5</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Oct 24, 2024 09:00:01</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">System</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">automation.trigger</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Executed "Welcome Flow"</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">-</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
