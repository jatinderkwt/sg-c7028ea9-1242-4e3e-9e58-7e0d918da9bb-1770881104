import { timezones, currencies } from "@/lib/constants"

export default function AdminSettingsPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Global Settings</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Configuration</h3>
                <div className="space-y-4 max-w-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Platform Name</label>
                        <input type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2" defaultValue="WaFiz" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Support Email</label>
                        <input type="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Default Currency</label>
                        <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2">
                            {currencies.map(c => (
                                <option key={c.code} value={c.code}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Default Timezone</label>
                        <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2">
                            {timezones.map(tz => (
                                <option key={tz} value={tz}>{tz}</option>
                            ))}
                        </select>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Save Changes</button>
                </div>
            </div>
        </div>
    )
}
