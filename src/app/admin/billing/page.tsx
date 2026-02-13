import { DollarSign, CreditCard, TrendingUp } from "lucide-react"

export default function BillingPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Billing & Ledgers</h1>

            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700">Total Revenue</h3>
                        <DollarSign size={20} className="text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">$12,450</div>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                        <TrendingUp size={14} /> +12% vs last month
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700">Meta Credit Balance</h3>
                        <CreditCard size={20} className="text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">$2,100</div>
                    <p className="text-sm text-gray-500">Pre-paid balance with Meta</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700">Unpaid Invoices</h3>
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">Attention</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">$450</div>
                    <p className="text-sm text-gray-500">3 Overdue Accounts</p>
                </div>
            </div>

            {/* Rate Cards */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Conversation Rate Cards</h3>
                </div>
                <div className="p-6">
                    <div className="text-sm text-gray-500 mb-4">
                        These are the markup rates charged to tenants on top of Meta's base conversation pricing.
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meta Cost (Avg)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Markup</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Marketing</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$0.06</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">20%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$0.072</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Utility</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$0.03</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$0.0345</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Authentication</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$0.03</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$0.033</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Service</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Free (Tiered)</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$0.005 / msg</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$0.005</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
