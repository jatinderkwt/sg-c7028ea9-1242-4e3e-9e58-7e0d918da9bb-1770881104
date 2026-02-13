'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function saveCmsContent(key: string, content: string, type: string = 'text') {
    await db.cmsContent.upsert({
        where: { key },
        update: {
            content,
            type,
            isPublished: true,
        },
        create: {
            key,
            content,
            type,
            isPublished: true,
        }
    })

    revalidatePath("/")
    revalidatePath("/about")
    revalidatePath("/contact")
    revalidatePath("/features")
    revalidatePath("/pricing")
}

export async function getCmsItem(key: string) {
    return await db.cmsContent.findUnique({
        where: { key }
    })
}
