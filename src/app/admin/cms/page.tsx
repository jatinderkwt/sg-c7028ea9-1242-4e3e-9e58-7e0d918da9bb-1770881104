import { db } from "@/lib/db"
import { CmsManager } from "@/components/admin/cms-manager"

export default async function AdminCmsPage() {
    const content = await db.cmsContent.findMany()

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Website Content Manager</h1>
            <p className="text-gray-500 mb-8 text-lg">Manage all front-facing text, solutions, and marketing assets.</p>

            <CmsManager initialContent={content} />
        </div>
    )
}
