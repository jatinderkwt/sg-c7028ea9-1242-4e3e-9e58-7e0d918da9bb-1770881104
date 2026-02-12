'use client'

import Link from 'next/link'
import { MessageSquare, Users, TrendingUp, Clock, ArrowRight } from 'lucide-react'

export default function DashboardHome() {
  // Sample data - replace with real API calls
  const stats = [
    { label: 'Messages Today', value: '1,234', icon: MessageSquare, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Contacts', value: '5,678', icon: Users, color: 'bg-green-100 text-green-600' },
    { label: 'Avg Response Time', value: '2m 34s', icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Conversation Rate', value: '87%', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your WaFiz workspace</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon size={24} />
                </div>
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Messages */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Conversations</h2>
            <Link href="/dashboard/inbox" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  C{item}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Customer {item}</p>
                  <p className="text-sm text-gray-600">Last message: 2 hours ago</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">5 messages</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>

          <div className="space-y-3">
            <Link
              href="/dashboard/inbox"
              className="block w-full p-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-center"
            >
              Go to Inbox
            </Link>
            <Link
              href="/dashboard/contacts"
              className="block w-full p-3 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition text-center"
            >
              Manage Contacts
            </Link>
            <Link
              href="/dashboard/campaigns"
              className="block w-full p-3 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition text-center"
            >
              Send Campaign
            </Link>
            <Link
              href="/dashboard/automation"
              className="block w-full p-3 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition text-center"
            >
              Create Automation
            </Link>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900 font-medium mb-2">Need Help?</p>
            <p className="text-sm text-blue-800">Check our documentation or contact support.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
