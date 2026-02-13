'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const planSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    pricingMonthly: z.number().min(0),
    pricingYearly: z.number().min(0).optional(),
    maxNumbers: z.number().int().min(1),
    maxAgents: z.number().int().min(1),
    maxContacts: z.number().int().min(1),
    features: z.array(z.string()),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    displayOrder: z.number().int().default(0),
})

export async function savePlan(data: z.infer<typeof planSchema>) {
    const validated = planSchema.parse(data)

    if (validated.id) {
        await db.plan.update({
            where: { id: validated.id },
            data: {
                name: validated.name,
                description: validated.description,
                pricingMonthly: validated.pricingMonthly,
                pricingYearly: validated.pricingYearly,
                maxNumbers: validated.maxNumbers,
                maxAgents: validated.maxAgents,
                maxContacts: validated.maxContacts,
                features: validated.features,
                isActive: validated.isActive,
                isFeatured: validated.isFeatured,
                displayOrder: validated.displayOrder,
            }
        })
    } else {
        await db.plan.create({
            data: {
                name: validated.name,
                description: validated.description,
                pricingMonthly: validated.pricingMonthly,
                pricingYearly: validated.pricingYearly,
                maxNumbers: validated.maxNumbers,
                maxAgents: validated.maxAgents,
                maxContacts: validated.maxContacts,
                features: validated.features,
                isActive: validated.isActive,
                isFeatured: validated.isFeatured,
                displayOrder: validated.displayOrder,
            }
        })
    }

    revalidatePath("/admin/plans")
    revalidatePath("/pricing")
    revalidatePath("/")
}

export async function deletePlan(id: string) {
    await db.plan.delete({ where: { id } })
    revalidatePath("/admin/plans")
    revalidatePath("/pricing")
    revalidatePath("/")
}
