import { db } from "@/lib/db"

export type CmsHeroContent = {
    headline: string
    subheadline: string
    ctaText: string
    ctaLink: string
    secondaryCtaText?: string
    secondaryCtaLink?: string
}

export type CmsPricingPlan = {
    name: string
    price: string
    period: string
    description: string
    features: string[]
    cta: string
    featured: boolean
}

const DEFAULT_HERO: CmsHeroContent = {
    headline: "WhatsApp Business Made Simple",
    subheadline: "Manage customer conversations, automate responses, and grow your business with our all-in-one WhatsApp SaaS platform.",
    ctaText: "Start Free Trial (14 days)",
    ctaLink: "/register",
    secondaryCtaText: "Learn More",
    secondaryCtaLink: "#features"
}

export async function getCmsContent<T>(key: string, defaultContent: T): Promise<T> {
    try {
        const cmsItem = await db.cmsContent.findUnique({
            where: { key }
        })

        if (cmsItem && cmsItem.isPublished) {
            // Parse JSON if needed, assuming the content field stores JSON string or use metadata
            // The schema has `content` as String and `metadata` as Json.
            // If type is 'json', content might be a stringified JSON.
            if (cmsItem.type === 'json') {
                return JSON.parse(cmsItem.content) as T
            }
            return cmsItem.content as unknown as T
        }
    } catch (error) {
        console.error(`Failed to fetch CMS content for key: ${key}`, error)
    }

    return defaultContent
}

export async function getLandingHero(): Promise<CmsHeroContent> {
    return getCmsContent<CmsHeroContent>("landing_hero", DEFAULT_HERO)
}

export async function getPricingPlans(defaultPlans: CmsPricingPlan[]): Promise<CmsPricingPlan[]> {
    return getCmsContent<CmsPricingPlan[]>("pricing_plans", defaultPlans)
}
