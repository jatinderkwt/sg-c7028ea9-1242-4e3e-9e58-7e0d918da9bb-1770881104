'use client'

import { Plus } from 'lucide-react'

export default function AutomationPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Automation Flows</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <Plus size={20} />
                    <span>New Flow</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No automations active</h3>
                <p className="text-gray-500 mb-6">Set up auto-replies or complex workflows.</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Create Flow
                </button>
            </div>
        </div>
    )
}
