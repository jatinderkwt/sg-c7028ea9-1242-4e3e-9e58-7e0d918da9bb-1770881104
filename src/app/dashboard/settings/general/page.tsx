'use client'

export default function GeneralSettings() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">General Settings</h1>

            <div className="bg-white rounded-lg shadow border border-gray-200 divide-y divide-gray-200">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Workspace Details</h3>
                    <div className="grid grid-cols-1 gap-6 max-w-2xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Workspace Name</label>
                            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue="Default Workspace" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                <option>UTC</option>
                                <option>Asia/Kolkata</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}
