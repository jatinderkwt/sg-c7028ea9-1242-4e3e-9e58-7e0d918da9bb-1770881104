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
        console.warn(`Failed to fetch CMS content for key: ${key}. Using default content.`, error)
    }

    return defaultContent
}

// Banner Helpers
export async function getLandingBannerText(): Promise<string> {
    return getCmsContent<string>("landing_banner_text", "")
}

export async function getLandingBannerLink(): Promise<string> {
    return getCmsContent<string>("landing_banner_link", "/pricing")
}

export async function isLandingBannerActive(): Promise<boolean> {
    const content = await getCmsContent<string>("landing_banner_active", "false")
    return content === "true"
}

// Hero Helpers
export async function getLandingHeroSlides(defaults: any[]): Promise<any[]> {
    return getCmsContent<any[]>("landing_hero_slides", defaults)
}

export async function getLandingHeroHeadline(): Promise<string> {
    return getCmsContent<string>("landing_hero_headline", "WhatsApp Business Made Simple")
}

export async function getLandingHeroSubheadline(): Promise<string> {
    return getCmsContent<string>("landing_hero_subheadline", "Manage customer conversations, automate responses, and grow your business with our all-in-one WhatsApp SaaS platform.")
}

export async function getLandingHeroCtaText(): Promise<string> {
    return getCmsContent<string>("landing_hero_cta_text", "Start Free Trial (14 days)")
}

// Section Headers
export async function getLandingFeaturesTitle(): Promise<string> {
    return getCmsContent<string>("landing_features_title", "Powerful Features")
}

export async function getLandingFeaturesSub(): Promise<string> {
    return getCmsContent<string>("landing_features_sub", "Everything you need to manage WhatsApp business communications at scale")
}

export async function getLandingFooterCtaHeadline(): Promise<string> {
    return getCmsContent<string>("landing_footer_cta_headline", "Ready to Transform Your Business?")
}

// JSON Blocks
export async function getLandingFeaturesJson(defaults: any[]): Promise<any[]> {
    return getCmsContent<any[]>("landing_features_json", defaults)
}

export async function getLandingSolutionsJson(defaults: any[]): Promise<any[]> {
    return getCmsContent<any[]>("landing_solutions_json", defaults)
}

// Deprecated or Legacy (kept for compatibility if needed)
export async function getLandingHero(): Promise<CmsHeroContent> {
    return {
        headline: await getLandingHeroHeadline(),
        subheadline: await getLandingHeroSubheadline(),
        ctaText: await getLandingHeroCtaText(),
        ctaLink: "/register",
    }
}
