import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from 'next/link'
import { LayoutDashboard, Users, Building, LogOut, Settings, CreditCard, Shield } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions)

    if (session?.user?.role !== "SUPER_ADMIN") {
        redirect("/dashboard")
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar for Admin */}
            <div className="w-64 bg-gray-900 text-white flex flex-col shadow-lg">
                <div className="p-6 font-bold text-xl border-b border-gray-800 flex items-center gap-2">
                    <Shield className="text-blue-500" />
                    WaFiz Admin
                </div>

                <div className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Platform Management
                </div>

                <nav className="flex-1 px-2 space-y-1">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition group">
                        <LayoutDashboard size={20} className="group-hover:text-blue-400" />
                        Overview
                    </Link>
                    <Link href="/admin/companies" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition group">
                        <Building size={20} className="group-hover:text-blue-400" />
                        Companies
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition group">
                        <Users size={20} className="group-hover:text-blue-400" />
                        Global Users
                    </Link>
                    <Link href="/admin/plans" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition group">
                        <CreditCard size={20} className="group-hover:text-blue-400" />
                        Subscription Plans
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition group">
                        <Settings size={20} className="group-hover:text-blue-400" />
                        Global Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                            {session.user.name?.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
                            <p className="text-xs text-gray-400 truncate">Super Admin</p>
                        </div>
                    </div>

                    {/* Logout is handled in client component usually but here just a link back to app or proper logout */}
                    <a href="/api/auth/signout" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition text-sm">
                        <LogOut size={16} />
                        Sign Out
                    </a>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-gray-50">
                {/* Admin Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-8 justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Super Admin Console</h2>
                    <div className="text-sm text-gray-500">
                        System Status: <span className="text-green-600 font-medium">Operational</span>
                    </div>
                </header>
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
