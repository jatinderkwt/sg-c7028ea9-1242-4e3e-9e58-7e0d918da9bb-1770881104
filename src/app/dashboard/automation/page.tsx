import { GitBranch, MessageSquare, Clock, Plus, MoreHorizontal } from "lucide-react"

export default function AutomationPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Automation Flows</h1>
                    <p className="text-gray-500 mt-1">Manage chatbots and automated responses.</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
                    <Plus size={18} />
                    Create Flow
                </button>
            </div>

            {/* Standard Automations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MessageSquare size={100} />
                    </div>
                    <div className="relative z-10">
                        <div className="bg-white/20 w-fit p-2 rounded-lg mb-4">
                            <MessageSquare size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-1">Welcome Message</h3>
                        <p className="text-purple-100 text-sm mb-4">Reply to first-time customers automatically.</p>
                        <div className="flex items-center gap-2 text-xs font-medium bg-green-500/20 w-fit px-2 py-1 rounded border border-green-400/30">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span> Active
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Clock size={100} />
                    </div>
                    <div className="relative z-10">
                        <div className="bg-white/20 w-fit p-2 rounded-lg mb-4">
                            <Clock size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-1">Away Message</h3>
                        <p className="text-orange-100 text-sm mb-4">Reply outside of business hours.</p>
                        <div className="flex items-center gap-2 text-xs font-medium bg-white/20 w-fit px-2 py-1 rounded">
                            Inactive
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 border-dashed flex flex-col items-center justify-center text-center text-gray-500 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer">
                    <Plus size={48} className="mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900">Custom Trigger</h3>
                    <p className="text-sm">Create a keyword based automation</p>
                </div>
            </div>

            {/* Active Flows List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Active Workflows</h3>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flow Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trigger</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagements</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                        <GitBranch size={20} />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">Lead Qualification</div>
                                        <div className="text-xs text-gray-500">Last edited 2d ago</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                Keyword: <span className="font-mono bg-gray-100 px-1 rounded">PRICING</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,240</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal size={20} />
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                        <GitBranch size={20} />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">Support Routing</div>
                                        <div className="text-xs text-gray-500">Last edited 5d ago</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                Keyword: <span className="font-mono bg-gray-100 px-1 rounded">HELP</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">856</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal size={20} />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
