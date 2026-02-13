import Link from 'next/link'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <nav className="flex space-x-4">
                    <Link href="/dashboard/settings/general" className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">General</Link>
                    <Link href="/dashboard/settings/whatsapp" className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">WhatsApp API</Link>
                    <Link href="/dashboard/settings/team" className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">Team Members</Link>
                </nav>
            </div>
            {children}
        </div>
    )
}
