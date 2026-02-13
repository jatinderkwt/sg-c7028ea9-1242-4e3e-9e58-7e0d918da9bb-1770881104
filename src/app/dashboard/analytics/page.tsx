import { BarChart2, TrendingUp, Users, MessageSquare } from "lucide-react"

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <div className="flex gap-2">
                    <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>This Month</option>
                    </select>
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded-md text-sm hover:bg-gray-50">
                        Export
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-500">Total Messages</p>
                        <MessageSquare size={20} className="text-blue-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-gray-900">124,592</h3>
                        <span className="text-xs text-green-600 font-medium flex items-center">
                            <TrendingUp size={12} className="mr-1" /> +12.5%
                        </span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-500">Active Contacts</p>
                        <Users size={20} className="text-purple-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-gray-900">14,205</h3>
                        <span className="text-xs text-green-600 font-medium flex items-center">
                            <TrendingUp size={12} className="mr-1" /> +8.2%
                        </span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-500">Delivery Rate</p>
                        <BarChart2 size={20} className="text-green-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-gray-900">98.5%</h3>
                        <span className="text-xs text-gray-500 font-medium">
                            Stable
                        </span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-500">Avg. Response Time</p>
                        <MessageSquare size={20} className="text-amber-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-gray-900">2m 14s</h3>
                        <span className="text-xs text-red-600 font-medium flex items-center">
                            <TrendingUp size={12} className="mr-1" /> +10s
                        </span>
                    </div>
                </div>
            </div>

            {/* Charts Section Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-80 flex flex-col justify-center items-center text-gray-400">
                    <BarChart2 size={48} className="mb-4 opacity-50" />
                    <p>Message Volume Chart Placeholder</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-80 flex flex-col justify-center items-center text-gray-400">
                    <BarChart2 size={48} className="mb-4 opacity-50" />
                    <p>Conversation Categories Chart Placeholder</p>
                </div>
            </div>
        </div>
    )
}
