'use server'

import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Users, Timer, BarChart, MessageCircle, AlertTriangle, Send, FileText, UserPlus, Clock, Play } from "lucide-react"
import Link from "next/link"

export default async function TenantDashboard() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-8">
      {/* Row 1: Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/inbox" className="bg-green-50 p-6 rounded-xl border border-green-100 flex flex-col items-center justify-center hover:bg-green-100 transition cursor-pointer group">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3 group-hover:bg-white group-hover:scale-110 transition">
              <MessageCircle size={24} />
            </div>
            <span className="font-semibold text-gray-900">Inbox</span>
            <span className="text-xs text-gray-500">0 unread</span>
          </Link>
          <Link href="/dashboard/contacts" className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col items-center justify-center hover:bg-blue-100 transition cursor-pointer group">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3 group-hover:bg-white group-hover:scale-110 transition">
              <UserPlus size={24} />
            </div>
            <span className="font-semibold text-gray-900">Add Contact</span>
            <span className="text-xs text-gray-500">Import or add</span>
          </Link>
          <Link href="/dashboard/campaigns" className="bg-purple-50 p-6 rounded-xl border border-purple-100 flex flex-col items-center justify-center hover:bg-purple-100 transition cursor-pointer group">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-3 group-hover:bg-white group-hover:scale-110 transition">
              <Send size={24} className="ml-1" />
            </div>
            <span className="font-semibold text-gray-900">Campaign</span>
            <span className="text-xs text-gray-500">Broadcast</span>
          </Link>
          <Link href="/dashboard/templates" className="bg-orange-50 p-6 rounded-xl border border-orange-100 flex flex-col items-center justify-center hover:bg-orange-100 transition cursor-pointer group">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-3 group-hover:bg-white group-hover:scale-110 transition">
              <FileText size={24} />
            </div>
            <span className="font-semibold text-gray-900">Template</span>
            <span className="text-xs text-gray-500">Create new</span>
          </Link>
        </div>
      </div>

      {/* Row 2: Engagement Overview (Original Widget) */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">Active Chats</p>
              <MessageCircle size={20} className="text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">42</h3>
            <p className="text-xs text-green-600 font-medium">+12 since morning</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <Timer size={20} className="text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">7</h3>
            <p className="text-xs text-amber-600 font-medium">Needs attention</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <BarChart size={20} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">128</h3>
            <p className="text-xs text-gray-500 font-medium">Today</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">Issues</p>
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">2</h3>
            <p className="text-xs text-red-600 font-medium">Failed messages</p>
          </div>
        </div>
      </div>

      {/* Row 3: Agent Performance & 24h Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Performance (Expanded Original) */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Agent Performance Leaderboard</h3>
            <span className="text-xs text-gray-500">Today</span>
          </div>
          <div className="p-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolved</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">J</div>
                    Jane Doe
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">45</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-green-600">2m 30s</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">J</div>
                    John Smith
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">32</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-amber-600">5m 12s</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 24h Window Alerts (New) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">24h Window Alerts</h3>
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">0 expiring</span>
          </div>
          <div className="p-8 flex flex-col items-center justify-center text-center h-48">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
            <p className="text-gray-500 text-sm">No urgent alerts</p>
            <p className="text-xs text-gray-400 mt-1">All conversations are within window</p>
          </div>
        </div>
      </div>

      {/* Row 4: Detailed Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Templates Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Templates</h3>
            <Link href="/dashboard/templates" className="text-xs text-blue-600 hover:underline">Manage</Link>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Approved</span>
              </div>
              <span className="font-semibold text-gray-900">12</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Pending</span>
              </div>
              <span className="font-semibold text-gray-900">2</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Rejected</span>
              </div>
              <span className="font-semibold text-gray-900">1</span>
            </div>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Active Campaigns</h3>
            <Link href="/dashboard/campaigns" className="text-xs text-blue-600 hover:underline">Manage</Link>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-900">Welcome Series</span>
                <span className="text-gray-500">78%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
              <p className="text-xs text-gray-500">1,560 / 2,000 sent</p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-900">Product Launch</span>
                <span className="text-gray-500">45%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-gray-500">450 / 1,000 sent</p>
            </div>
          </div>
        </div>

        {/* Contacts Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Contacts</h3>
            <Link href="/dashboard/contacts" className="text-xs text-blue-600 hover:underline">Manage</Link>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Contacts</span>
              <span className="font-bold text-gray-900">5,234</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-sm text-gray-600">Opted-In</span>
              <span className="font-bold text-green-600">4,891</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Added This Week</span>
              <span className="font-bold text-blue-600">156</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 5: Category Breakdown (Original) */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Conversation Categories</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Service</span>
                  <span className="text-gray-500">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Marketing</span>
                  <span className="text-gray-500">25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Utility</span>
                  <span className="text-gray-500">10%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-amber-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
