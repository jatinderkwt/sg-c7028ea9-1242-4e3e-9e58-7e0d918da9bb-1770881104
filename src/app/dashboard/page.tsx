'use server'

import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Users, Timer, BarChart, MessageCircle, AlertTriangle } from "lucide-react"

export default async function TenantDashboard() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Engagement Overview</h1>

      {/* Conversation Funnel */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Agent Performance Leaderboard</h3>
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

        {/* Category Breakdown */}
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
