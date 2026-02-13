import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { GeneralSettingsForm } from "./form"

export default async function GeneralSettings() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return null

    // Get current workspace
    const membership = await db.workspaceMember.findFirst({
        where: { user: { email: session.user.email } },
        include: { workspace: true }
    })

    if (!membership) return null

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">General Settings</h1>
            <GeneralSettingsForm initialData={membership.workspace} />
        </div>
    )
}
