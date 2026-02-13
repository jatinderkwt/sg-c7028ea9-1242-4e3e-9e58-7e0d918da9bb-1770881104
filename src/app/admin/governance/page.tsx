import { Lock, Eye, Globe } from "lucide-react"

export default function GovernancePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Platform Governance</h1>

            {/* Audit Logs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                        <Eye size={20} className="text-gray-500" />
                        Super Admin Audit Logs
                    </h3>
                    <button className="text-sm text-blue-600 hover:text-blue-800">Export CSV</button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Just now</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">jatinderkwt</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Impersonation Login</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tenant: Acme Corp</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 mins ago</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">jatinderkwt</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Updated Settings</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Company: Alpha Co</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 hour ago</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">System</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Auto-Suspend</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tenant: Bad Actor LLC</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Whitelabel Settings */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <Globe size={20} className="text-blue-500" />
                            Whitelabel Configuration
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Custom Domain CNAME</label>
                            <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2" defaultValue="app.wafiz.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Brand Color</label>
                            <div className="flex gap-2 mt-1">
                                <input type="color" className="h-9 w-9 border-none p-0 rounded-md" defaultValue="#2563EB" />
                                <input type="text" className="block w-full border-gray-300 rounded-md shadow-sm border p-2" defaultValue="#2563EB" />
                            </div>
                        </div>
                        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Save Branding</button>
                    </div>
                </div>

                {/* RBAC */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <Lock size={20} className="text-red-500" />
                            Admin Access Control
                        </h3>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-gray-500 mb-4">Manage permissions for your platform support staff and engineers.</p>
                        <button className="w-full py-2 border border-blue-200 text-blue-600 bg-blue-50 rounded-md text-sm font-medium hover:bg-blue-100">Manage Admin Roles</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
