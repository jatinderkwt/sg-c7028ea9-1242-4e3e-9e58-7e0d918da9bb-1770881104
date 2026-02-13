'use client'

import { useFormStatus } from "react-dom"
import { timezones, currencies } from "@/lib/constants"
import { saveGeneralSettings } from "@/actions/settings"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
            {pending ? 'Saving...' : 'Save Changes'}
        </button>
    )
}

export function GeneralSettingsForm({ initialData }: { initialData: any }) {
    return (
        <form action={saveGeneralSettings} className="bg-white rounded-lg shadow border border-gray-200 divide-y divide-gray-200">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Workspace Details</h3>
                <div className="grid grid-cols-1 gap-6 max-w-2xl">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Workspace Name</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={initialData?.name}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            defaultValue={initialData?.description || ''}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                            <select
                                name="timezone"
                                defaultValue={initialData?.timezone || 'UTC'}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {timezones.map(tz => (
                                    <option key={tz} value={tz}>{tz}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                            <select
                                name="currency"
                                defaultValue={initialData?.currency || 'USD'}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {currencies.map(curr => (
                                    <option key={curr.code} value={curr.code}>
                                        {curr.name} ({curr.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end">
                <SubmitButton />
            </div>
        </form>
    )
}
