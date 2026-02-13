import Link from 'next/link'
import { CheckCircle, MessageSquare, Zap, BarChart3, Users, Lock } from 'lucide-react'
import {
  getLandingHeroHeadline,
  getLandingHeroSubheadline,
  getLandingHeroCtaText,
  getLandingFeaturesTitle,
  getLandingFeaturesSub,
  getLandingFooterCtaHeadline,
  getLandingFeaturesJson,
  getLandingSolutionsJson,
  getLandingBannerText,
  getLandingBannerLink,
  isLandingBannerActive,
  getLandingHeroSlides
} from "@/lib/cms"
import { db } from "@/lib/db"
import { ArrowRight } from 'lucide-react'
import { HeroSlider } from '@/components/marketing/hero-slider'

const iconMap: Record<string, any> = {
  MessageSquare, Zap, Users, BarChart3, Lock
}

const defaultSlides = [
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
]

const defaultFeatures = [
  {
    icon: 'MessageSquare',
    title: 'Shared Inbox',
    description: 'Manage all WhatsApp conversations in one unified inbox with multi-agent support',
  },
  {
    icon: 'Zap',
    title: 'Smart Automation',
    description: 'Create automated workflows with keyword triggers and intelligent routing',
  },
  {
    icon: 'Users',
    title: 'CRM Integration',
    description: 'Full customer relationship management with contact history and analytics',
  },
  {
    icon: 'BarChart3',
    title: 'Advanced Analytics',
    description: 'Real-time dashboards showing response times, resolution rates, and more',
  },
  {
    icon: 'Zap',
    title: 'Broadcast Campaigns',
    description: 'Send templated messages to thousands of customers instantly',
  },
  {
    icon: 'Lock',
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance with global data protection standards',
  },
]

const defaultSolutions = [
  {
    title: 'E-Commerce',
    description: 'Order updates, shipping notifications, and customer support',
    icon: '🛍️',
  },
  {
    title: 'Healthcare',
    description: 'Appointment reminders, prescription updates, and patient communication',
    icon: '⚕️',
  },
  {
    title: 'Education',
    description: 'Student announcements, course updates, and academic support',
    icon: '📚',
  },
  {
    title: 'Real Estate',
    description: 'Property listings, appointment scheduling, and client updates',
    icon: '🏠',
  },
  {
    title: 'Travel & Hospitality',
    description: 'Booking confirmations, itinerary updates, and guest support',
    icon: '✈️',
  },
  {
    title: 'Customer Support',
    description: 'Instant support, ticket tracking, and issue resolution',
    icon: '🎧',
  },
]

export default async function Home() {
  const [
    headline,
    subheadline,
    ctaText,
    featuresTitle,
    featuresSub,
    footerCtaHeadline,
    dynamicFeatures,
    dynamicSolutions,
    dbPlans,
    bannerText,
    bannerLink,
    bannerActive,
    heroSlides
  ] = await Promise.all([
    getLandingHeroHeadline(),
    getLandingHeroSubheadline(),
    getLandingHeroCtaText(),
    getLandingFeaturesTitle(),
    getLandingFeaturesSub(),
    getLandingFooterCtaHeadline(),
    getLandingFeaturesJson(defaultFeatures),
    getLandingSolutionsJson(defaultSolutions),
    db.plan.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } }),
    getLandingBannerText(),
    getLandingBannerLink(),
    isLandingBannerActive(),
    getLandingHeroSlides(defaultSlides)
  ])

  return (
    <main>
      {/* Announcement Banner */}
      {bannerActive && bannerText && (
        <div className="bg-blue-600 text-white py-3 px-4 text-center relative z-20 overflow-hidden group">
          <Link href={bannerLink} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:underline transition">
            <span className="relative">
              {bannerText}
            </span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12"></div>
        </div>
      )}

      {/* Hero Slider Section */}
      <HeroSlider slides={heroSlides} />

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 px-4">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{featuresTitle}</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
              {featuresSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {dynamicFeatures.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Zap
              return (
                <div key={index} className="p-8 bg-white border border-gray-100 rounded-3xl hover:shadow-xl transition-all duration-300 group">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 md:py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 px-4">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Built for Every Industry</h2>
            <p className="text-xl text-gray-500 font-medium">Trusted by businesses across different sectors globally</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {dynamicSolutions.map((solution, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-white hover:border-blue-100 hover:shadow-lg transition-all duration-300">
                <div className="text-5xl mb-6">{solution.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{solution.title}</h3>
                <p className="text-gray-600 leading-relaxed">{solution.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 px-4">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Simple, Growth-Focused Pricing</h2>
            <p className="text-xl text-gray-500 font-medium">Transparent billing, no hidden fees, cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 items-center">
            {dbPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-[2rem] overflow-hidden transition-all duration-500 ${plan.isFeatured
                  ? 'ring-4 ring-blue-500 shadow-[0_30px_60px_-15px_rgba(59,130,246,0.3)] md:scale-105 z-10'
                  : 'bg-gray-50/50 border border-gray-100'
                  }`}
              >
                <div className={`p-10 ${plan.isFeatured ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white' : ''}`}>
                  <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">{plan.name}</h3>
                  <p className={`text-sm font-medium ${plan.isFeatured ? 'text-blue-100' : 'text-gray-500'}`}>{plan.description}</p>
                </div>

                <div className={`px-10 py-10 ${plan.isFeatured ? 'bg-white' : ''}`}>
                  <div className="mb-10 flex items-baseline gap-1">
                    <span className={`text-6xl font-black tracking-tighter ${plan.isFeatured ? 'text-blue-600' : 'text-gray-900'}`}>
                      ${plan.pricingMonthly}
                    </span>
                    <span className="text-gray-400 font-bold">/mo</span>
                  </div>

                  <Link
                    href={`/register?plan=${plan.id}`}
                    className={`block w-full py-4 rounded-2xl font-black text-center transition-all mb-10 ${plan.isFeatured
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                  >
                    Get Started
                  </Link>

                  <ul className="space-y-4">
                    {plan.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.isFeatured ? 'text-blue-600' : 'text-emerald-500'}`} />
                        <span className={`text-sm font-bold ${plan.isFeatured ? 'text-gray-800' : 'text-gray-600'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-40 bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[120px] rounded-full -mr-20"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-emerald-600/10 blur-[120px] rounded-full -ml-20"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
            {footerCtaHeadline}
          </h2>
          <p className="text-xl text-gray-400 mb-12 font-medium">
            Join 2,500+ forward-thinking businesses using WaFiz to dominate customer communication.
          </p>
          <Link
            href="/register"
            className="inline-block px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 hover:shadow-2xl shadow-blue-900/40 transition transform hover:-translate-y-1"
          >
            Start Your Free Trial Now
          </Link>
          <div className="mt-10 flex items-center justify-center gap-8 opacity-30">
            <div className="flex items-center gap-2"><CheckCircle size={16} /> <span className="text-xs font-bold uppercase tracking-widest">ISO Certified</span></div>
            <div className="flex items-center gap-2"><CheckCircle size={16} /> <span className="text-xs font-bold uppercase tracking-widest">GDPR Ready</span></div>
            <div className="flex items-center gap-2"><CheckCircle size={16} /> <span className="text-xs font-bold uppercase tracking-widest">99.9% Uptime</span></div>
          </div>
        </div>
      </section>
    </main>
  )
}
