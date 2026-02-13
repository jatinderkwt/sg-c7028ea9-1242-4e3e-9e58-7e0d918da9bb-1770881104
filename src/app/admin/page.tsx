import Link from 'next/link'
import { db } from "@/lib/db"
import { Building, Users, Calendar, DollarSign, TrendingUp } from 'lucide-react'

export default async function AdminDashboard() {
    const [
        companiesCount,
        usersCount,
        activeSubsCount
    ] = await Promise.all([
        db.workspace.count(),
        db.user.count(),
        db.subscription.count({ where: { status: 'ACTIVE' } })
    ])

    const recentCompanies = await db.workspace.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { members: true } } }
    })

    return (
        <div className="space-y-8">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
                    <div className="p-4 rounded-full bg-blue-100 text-blue-600 mr-4">
                        <Building size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Companies</p>
                        <h3 className="text-2xl font-bold text-gray-900">{companiesCount}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
                    <div className="p-4 rounded-full bg-green-100 text-green-600 mr-4">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Users</p>
                        <h3 className="text-2xl font-bold text-gray-900">{usersCount}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
                    <div className="p-4 rounded-full bg-purple-100 text-purple-600 mr-4">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Active Subscriptions</p>
                        <h3 className="text-2xl font-bold text-gray-900">{activeSubsCount}</h3>
                    </div>
                </div>
            </div>

            {/* Recent Companies */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Companies</h2>
                    <Link href="/admin/companies" className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</Link>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentCompanies.map((ws) => (
                                <tr key={ws.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                                {ws.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{ws.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {ws.slug}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(ws.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {ws._count.members}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={`/admin/companies/${ws.id}`} className="text-blue-600 hover:text-blue-900">Manage</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
