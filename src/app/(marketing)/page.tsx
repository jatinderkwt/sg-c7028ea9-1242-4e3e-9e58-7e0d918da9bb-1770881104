import Link from 'next/link'
import { CheckCircle, MessageSquare, Zap, BarChart3, Users, Lock } from 'lucide-react'
import { getLandingHero } from "@/lib/cms"

const features = [
  {
    icon: MessageSquare,
    title: 'Shared Inbox',
    description: 'Manage all WhatsApp conversations in one unified inbox with multi-agent support',
  },
  {
    icon: Zap,
    title: 'Smart Automation',
    description: 'Create automated workflows with keyword triggers and intelligent routing',
  },
  {
    icon: Users,
    title: 'CRM Integration',
    description: 'Full customer relationship management with contact history and analytics',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Real-time dashboards showing response times, resolution rates, and more',
  },
  {
    icon: Zap,
    title: 'Broadcast Campaigns',
    description: 'Send templated messages to thousands of customers instantly',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance with global data protection standards',
  },
]

const plans = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for getting started',
    features: [
      '1 WhatsApp number',
      '2 agents',
      '1,000 contacts',
      'Basic automation',
      'Email support',
    ],
    cta: 'Start Free Trial',
    featured: false,
  },
  {
    name: 'Growth',
    price: '$99',
    period: '/month',
    description: 'For growing teams',
    features: [
      '3 WhatsApp numbers',
      '5 agents',
      '10,000 contacts',
      'Full automation',
      'CRM system',
      'Priority support',
      'Custom templates',
    ],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: [
      'Unlimited numbers',
      'Unlimited agents',
      'Unlimited contacts',
      'Advanced automation',
      'White label options',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
]

export default async function Home() {
  const heroContent = await getLandingHero()

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {heroContent.headline}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {heroContent.subheadline}
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href={heroContent.ctaLink || "/register"}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
              >
                {heroContent.ctaText}
              </Link>
              <Link
                href={heroContent.secondaryCtaLink || "#features"}
                className="px-8 py-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                {heroContent.secondaryCtaText || "Learn More"}
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-6">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage WhatsApp business communications at scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="p-8 bg-gray-50 rounded-lg hover:shadow-lg transition">
                  <Icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Every Industry</h2>
            <p className="text-xl text-gray-600">Trusted by businesses across different sectors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
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
            ].map((solution, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-4xl mb-4">{solution.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{solution.title}</h3>
                <p className="text-gray-600">{solution.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the perfect plan for your business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-lg overflow-hidden transition transform hover:scale-105 ${plan.featured
                  ? 'ring-2 ring-blue-600 shadow-2xl md:scale-105'
                  : 'bg-gray-50 shadow-md'
                  }`}
              >
                <div className={`p-8 ${plan.featured ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' : ''}`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className={plan.featured ? 'text-blue-100' : 'text-gray-600'}>{plan.description}</p>
                </div>

                <div className={`px-8 py-8 ${plan.featured ? 'bg-blue-50' : ''}`}>
                  <div className="mb-8">
                    <span className={`text-5xl font-bold ${plan.featured ? 'text-blue-600' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>

                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition mb-8 ${plan.featured
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                      }`}
                  >
                    {plan.cta}
                  </button>

                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.featured ? 'text-blue-600' : 'text-green-600'
                          }`} />
                        <span className={plan.featured ? 'text-gray-700' : 'text-gray-600'}>
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
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses using WaFiz to communicate with their customers
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
          >
            Start Your Free Trial Today
          </Link>
        </div>
      </section>
    </main>
  )
}
