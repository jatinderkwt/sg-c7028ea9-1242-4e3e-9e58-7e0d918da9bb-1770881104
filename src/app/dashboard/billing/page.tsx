import { CreditCard, Download, TrendingUp, History } from "lucide-react"

export default function TenantBillingPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Billing & Usage</h1>

            {/* Wallet Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700 font-medium">Wallet Balance</h3>
                        <CreditCard size={20} className="text-blue-500" />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">$45.20</div>
                    <p className="text-sm text-gray-500 mb-6">Auto-recharge is <span className="text-green-600 font-medium">Enabled</span> (threshold: $10.00)</p>
                    <div className="flex gap-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                            Top Up Wallet
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
                            Configure Auto-recharge
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700 font-medium">Current Usage (This Month)</h3>
                        <TrendingUp size={20} className="text-purple-500" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Marketing Conversations (245)</span>
                            <span className="font-medium text-gray-900">$14.50</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Utility Conversations (120)</span>
                            <span className="font-medium text-gray-900">$3.60</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Service Conversations (500)</span>
                            <span className="font-medium text-gray-900">$0.00 (Free Tier)</span>
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center font-bold">
                            <span className="text-gray-900">Total Estimated Cost</span>
                            <span className="text-gray-900">$18.10</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoices */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Billing History</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                        <History size={16} /> View All
                    </button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">INV-2024-001</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Oct 1, 2024</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$45.00</td>
                            <td className="px-6 py-4 whitespace-nowrap bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full w-fit">Paid</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-gray-400 hover:text-gray-600">
                                    <Download size={18} />
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">INV-2024-002</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sep 1, 2024</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$32.50</td>
                            <td className="px-6 py-4 whitespace-nowrap bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full w-fit">Paid</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-gray-400 hover:text-gray-600">
                                    <Download size={18} />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
