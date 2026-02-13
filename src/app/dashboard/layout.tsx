'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Menu, X, LogOut, Settings, Users, LayoutDashboard, MessageSquare, Megaphone, GitBranch, CreditCard, FileText } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Overview', exact: true },
    { href: '/dashboard/inbox', icon: MessageSquare, label: 'Team Inbox' },
    { href: '/dashboard/contacts', icon: Users, label: 'Contacts' },
    { href: '/dashboard/campaigns', icon: Megaphone, label: 'Campaigns' },
    { href: '/dashboard/automation', icon: GitBranch, label: 'Automation' },
    { href: '/dashboard/templates', icon: FileText, label: 'Templates' },
    { href: '/dashboard/billing', icon: CreditCard, label: 'Billing & Usage' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static md:inset-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 bg-gray-800">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-400">
            WaFiz
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white hover:bg-gray-700 p-1 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="mt-8">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition"
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 w-full border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-4 text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>

          <div className="ml-auto flex items-center gap-4">
            {session?.user?.impersonatorId && (
              <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium border border-amber-200">
                <span>Viewing as {session.user.name}</span>
                <button onClick={() => signOut({ callbackUrl: '/admin' })} className="ml-2 hover:underline font-bold">Exit</button>
              </div>
            )}
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {session?.user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
