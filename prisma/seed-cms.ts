import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const defaults = [
        { key: "landing_hero_headline", content: "WhatsApp Business Made Simple", type: "text" },
        {
            key: "landing_hero_slides",
            type: "json",
            content: JSON.stringify([
                {
                    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop',
                    title: 'WhatsApp Business Made Simple',
                    sub: 'Manage customer conversations, automate responses, and grow your business with our all-in-one platform.',
                    cta: 'Start Free Trial',
                    link: '/register'
                },
                {
                    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
                    title: 'Scale Your Team Productivity',
                    sub: 'Empower your sales and support agents with a unified shared inbox and collaborative tools.',
                    cta: 'View Pricing',
                    link: '/pricing'
                }
            ], null, 2)
        },
        { key: "landing_banner_text", content: "🚀 Summer Sale: 20% Off All Annual Plans! Use Code: WABIZ20", type: "text" },
        { key: "landing_banner_link", content: "/pricing", type: "text" },
        { key: "landing_banner_active", content: "true", type: "text" },
        { key: "landing_hero_subheadline", content: "Manage customer conversations, automate responses, and grow your business with our all-in-one WhatsApp SaaS platform.", type: "text" },
        { key: "landing_hero_cta_text", content: "Start Free Trial (14 days)", type: "text" },
        { key: "landing_features_title", content: "Powerful Features", type: "text" },
        { key: "landing_features_sub", content: "Everything you need to manage WhatsApp business communications at scale", type: "text" },
        { key: "landing_footer_cta_headline", content: "Ready to Transform Your Business?", type: "text" },
        {
            key: "landing_features_json",
            type: "json",
            content: JSON.stringify([
                { icon: 'MessageSquare', title: 'Shared Inbox', description: 'Manage all conversations in one unified inbox.' },
                { icon: 'Zap', title: 'Smart Automation', description: 'Create automated workflows with keyword triggers.' },
                { icon: 'Users', title: 'CRM Integration', description: 'Full customer relationship management with analytics.' },
                { icon: 'BarChart3', title: 'Advanced Analytics', description: 'Real-time dashboards showing response times.' },
                { icon: 'Zap', title: 'Broadcast Campaigns', description: 'Send templated messages to thousands instantly.' },
                { icon: 'Lock', title: 'Enterprise Security', description: 'Bank-level encryption and global compliance.' }
            ], null, 2)
        },
        {
            key: "landing_solutions_json",
            type: "json",
            content: JSON.stringify([
                { title: 'E-Commerce', description: 'Order updates and customer support', icon: '🛍️' },
                { title: 'Healthcare', description: 'Appointment reminders and patient updates', icon: '⚕️' },
                { title: 'Education', description: 'Student announcements and academic support', icon: '📚' },
                { title: 'Real Estate', description: 'Property listings and scheduling', icon: '🏠' },
                { title: 'Travel', description: 'Booking confirmations and support', icon: '✈️' },
                { title: 'Support', description: 'Instant ticket tracking and resolution', icon: '🎧' }
            ], null, 2)
        }
    ]

    for (const item of defaults) {
        await prisma.cmsContent.upsert({
            where: { key: item.key },
            update: {},
            create: { ...item, isPublished: true }
        })
    }

    console.log("CMS Defaults Seeded!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
