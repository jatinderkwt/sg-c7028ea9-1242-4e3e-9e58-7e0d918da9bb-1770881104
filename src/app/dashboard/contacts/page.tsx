'use client'

import { Plus } from 'lucide-react'

export default function ContactsPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <Plus size={20} />
                    <span>Add Contact</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 text-sm font-medium">
                        <tr>
                            <th className="px-6 py-4 border-b border-gray-200">Name</th>
                            <th className="px-6 py-4 border-b border-gray-200">Phone</th>
                            <th className="px-6 py-4 border-b border-gray-200">Tags</th>
                            <th className="px-6 py-4 border-b border-gray-200">Created At</th>
                            <th className="px-6 py-4 border-b border-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-6 py-8 text-center text-gray-500" colSpan={5}>
                                No contacts found. Add your first contact to get started.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
