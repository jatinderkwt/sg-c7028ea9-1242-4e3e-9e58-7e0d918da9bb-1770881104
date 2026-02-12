'use client'

import { useState } from 'react'
import { CheckCircle, X } from 'lucide-react'
import Link from 'next/link'

const pricingData = [
  {
    name: 'Starter',
    price: 29.99,
    yearlyPrice: 299.90,
    description: 'Perfect for getting started',
    highlighted: false,
    features: [
      { name: '1 WhatsApp Number', included: true },
      { name: '2 Agents', included: true },
      { name: '1,000 Contacts', included: true },
      { name: 'Basic Automation', included: true },
      { name: 'Shared Inbox', included: true },
      { name: 'Basic Analytics', included: true },
      { name: 'Email Support', included: true },
      { name: 'CRM Integration', included: false },
      { name: 'Advanced Automation', included: false },
      { name: 'Custom Templates', included: false },
    ],
  },
  {
    name: 'Growth',
    price: 99.99,
    yearlyPrice: 999.90,
    description: 'For growing teams',
    highlighted: true,
    features: [
      { name: '3 WhatsApp Numbers', included: true },
      { name: '5 Agents', included: true },
      { name: '10,000 Contacts', included: true },
      { name: 'Full Automation', included: true },
      { name: 'Shared Inbox', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Priority Support', included: true },
      { name: 'CRM Integration', included: true },
      { name: 'Advanced Automation', included: true },
      { name: 'Custom Templates', included: true },
    ],
  },
  {
    name: 'Enterprise',
    price: null,
    yearlyPrice: null,
    description: 'For large organizations',
    highlighted: false,
    features: [
      { name: 'Unlimited Numbers', included: true },
      { name: 'Unlimited Agents', included: true },
      { name: 'Unlimited Contacts', included: true },
      { name: 'Advanced Automation', included: true },
      { name: 'Shared Inbox', included: true },
      { name: 'Analytics Suite', included: true },
      { name: 'Dedicated Support', included: true },
      { name: 'CRM Integration', included: true },
      { name: 'White Label', included: true },
      { name: 'Custom Integrations', included: true },
    ],
  },
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <main className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Pricing Plans</h1>
          <p className="text-xl text-gray-600 mb-8">Choose the perfect plan for your business</p>

          {/* Billing Toggle */}
          <div className="inline-flex bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded transition ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded transition ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600'
              }`}
            >
              Yearly <span className="text-green-600 text-xs ml-1">(Save 20%)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingData.map((plan, index) => (
            <div
              key={index}
              className={`rounded-lg overflow-hidden transition transform ${
                plan.highlighted
                  ? 'ring-2 ring-blue-600 shadow-2xl md:scale-105'
                  : 'shadow-lg'
              }`}
            >
              <div
                className={`p-8 ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : 'bg-gray-50'
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p
                  className={`mb-6 ${
                    plan.highlighted ? 'text-blue-100' : 'text-gray-600'
                  }`}
                >
                  {plan.description}
                </p>

                {plan.price ? (
                  <div className="mb-6">
                    <span className="text-5xl font-bold">
                      ${billingPeriod === 'monthly' ? plan.price.toFixed(2) : (plan.yearlyPrice! / 12).toFixed(2)}
                    </span>
                    <span className={`ml-2 ${
                      plan.highlighted ? 'text-blue-100' : 'text-gray-600'
                    }`}>
                      /month{billingPeriod === 'yearly' ? ' billed yearly' : ''}
                    </span>
                  </div>
                ) : (
                  <div className="mb-6">
                    <span className="text-3xl font-bold">Custom Pricing</span>
                  </div>
                )}

                <Link
                  href="/auth/register"
                  className={`block w-full py-3 rounded-lg font-semibold transition text-center ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:shadow-lg'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Get Started
                </Link>
              </div>

              {/* Features */}
              <div className="p-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={
                          feature.included
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-gray-50 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: 'Do all plans include 24/7 support?',
                a: 'Starter includes email support with 24-hour response time. Growth and Enterprise include priority support with faster response times.',
              },
              {
                q: 'Can I change my plan anytime?',
                a: 'Yes, you can upgrade or downgrade your plan anytime. Changes take effect on your next billing cycle.',
              },
              {
                q: 'Is there a setup fee?',
                a: 'No, there are no setup fees. You only pay for your chosen plan.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, bank transfers, and digital payment methods through Stripe.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes, all plans come with a 14-day free trial. No credit card required to start.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, you can cancel your subscription anytime. No questions asked.',
              },
            ].map((item, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
