import { db } from "@/lib/db"
import { PlanManager } from "@/components/admin/plan-manager"

export default async function AdminPlansPage() {
    const plans = await db.plan.findMany({
        orderBy: { displayOrder: 'asc' }
    })

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Subscription Plans</h1>
            <p className="text-gray-500 mb-8 text-lg">Define your pricing strategy and package limits here.</p>

            <PlanManager initialPlans={plans} />
        </div>
    )
}
