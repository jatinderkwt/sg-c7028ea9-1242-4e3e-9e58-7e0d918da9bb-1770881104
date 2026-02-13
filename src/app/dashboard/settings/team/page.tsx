import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { inviteMember } from "@/actions/team"

export default async function TeamSettings() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return null

    // Get current members
    const membership = await db.workspaceMember.findFirst({
        where: { user: { email: session.user.email } },
        include: { workspace: { include: { members: { include: { user: true } } } } }
    })

    // workspace might be null if no workspace found or not joined
    const members = membership?.workspace?.members || []

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Team Management</h1>

            {/* List Members */}
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Current Members</h3>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {members.map((member) => (
                            <tr key={member.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            {member.user.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="ml-4 text-sm font-medium text-gray-900">{member.user.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' :
                                            member.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                                                'bg-green-100 text-green-800'
                                        }`}>
                                        {member.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(member.joinedAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Member Form */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add Team Member</h3>
                <form action={inviteMember} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" name="name" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="John Doe" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="john@example.com" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select name="role" className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                            <option value="AGENT">Agent</option>
                            <option value="MANAGER">Manager</option>
                            <option value="SUPER_ADMIN">Admin</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Add Member
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
