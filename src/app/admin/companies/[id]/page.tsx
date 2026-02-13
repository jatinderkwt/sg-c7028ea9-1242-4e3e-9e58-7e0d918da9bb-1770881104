import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { UserRole } from "@prisma/client"
import { revalidatePath } from "next/cache"

async function updateCompany(formData: FormData) {
    'use server'
    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    const isActive = formData.get("isActive") === "on"

    await db.workspace.update({
        where: { id },
        data: { name, slug, isActive }
    })
    revalidatePath(`/admin/companies/${id}`)
    revalidatePath("/admin/companies")
}

export default async function CompanyDetailsPage({ params }: { params: { id: string } }) {
    const workspace = await db.workspace.findUnique({
        where: { id: params.id },
        include: {
            members: {
                include: { user: true }
            },
            subscription: true,
            _count: {
                select: { contacts: true, conversations: true }
            }
        }
    })

    if (!workspace) return notFound()

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Company: {workspace.name}</h1>

            <div className="bg-white shadow rounded-lg border border-gray-200 divide-y divide-gray-200 mb-8">
                {/* General Info Form */}
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Company Details</h2>
                    <form action={updateCompany} className="grid grid-cols-1 gap-6 max-w-2xl">
                        <input type="hidden" name="id" value={workspace.id} />
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company Name</label>
                            <input type="text" name="name" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2" defaultValue={workspace.name} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Slug</label>
                            <input type="text" name="slug" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2" defaultValue={workspace.slug} />
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" name="isActive" id="isActive" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked={workspace.isActive} />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Active Status</label>
                        </div>
                        <div>
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Save Changes</button>
                        </div>
                    </form>
                </div>

                {/* Subscription Info */}
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Subscription</h2>
                    {workspace.subscription ? (
                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-700">Plan: <span className="font-semibold">{workspace.subscription.planId}</span></p>
                            <p className="text-sm text-gray-700">Status: <span className={`font-semibold ${workspace.subscription.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>{workspace.subscription.status}</span></p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No active subscription (Free Tier)</p>
                    )}
                </div>

                {/* Usage Stats */}
                <div className="p-6 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Usage Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded shadow-sm">
                            <div className="text-2xl font-bold text-gray-900">{workspace._count.contacts}</div>
                            <div className="text-sm text-gray-500">Total Contacts</div>
                        </div>
                        <div className="bg-white p-4 rounded shadow-sm">
                            <div className="text-2xl font-bold text-gray-900">{workspace._count.conversations}</div>
                            <div className="text-sm text-gray-500">Total Conversations</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Members List */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">Team Members</h2>
            <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
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
                        {workspace.members.map((member) => (
                            <tr key={member.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(member.joinedAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
