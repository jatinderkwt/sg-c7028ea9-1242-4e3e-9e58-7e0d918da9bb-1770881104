import { db } from "@/lib/db"
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default async function PricingPage() {
  const plans = await db.plan.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' }
  })

  return (
    <main className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tight">Investment Tiers</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            Scale your WhatsApp communications with precision. No hidden fees, ever.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20 px-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 ${plan.isFeatured
                  ? 'ring-4 ring-blue-500 shadow-[0_40px_80px_-15px_rgba(59,130,246,0.25)] md:scale-110 z-10'
                  : 'bg-gray-50/50 border border-gray-100 shadow-sm'
                }`}
            >
              <div
                className={`p-10 ${plan.isFeatured
                    ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white'
                    : ''
                  }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black uppercase tracking-tight">{plan.name}</h3>
                  {plan.isFeatured && (
                    <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/30 backdrop-blur-sm">Most Popular</span>
                  )}
                </div>
                <p className={`text-sm font-medium ${plan.isFeatured ? 'text-blue-100' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
              </div>

              <div className={`p-10 ${plan.isFeatured ? 'bg-white' : ''}`}>
                <div className="mb-10">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-6xl font-black tracking-tighter ${plan.isFeatured ? 'text-blue-600' : 'text-gray-900'}`}>
                      ${plan.pricingMonthly}
                    </span>
                    <span className="text-gray-400 font-bold">/mo</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-2 tracking-widest">Billed Monthly</p>
                </div>

                <Link
                  href={`/register?plan=${plan.id}`}
                  className={`block w-full py-5 rounded-2xl font-black text-center transition-all mb-10 shadow-lg ${plan.isFeatured
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                >
                  Join the Program
                </Link>

                <div className="space-y-6">
                  <div className="pt-6 border-t border-gray-100 italic text-[11px] text-gray-400 font-medium">Included in this plan:</div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 ${plan.isFeatured ? 'text-blue-600' : 'text-emerald-500'}`} />
                      <span className="text-sm font-bold text-gray-700">{plan.maxNumbers} Phone Number ID(s)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 ${plan.isFeatured ? 'text-blue-600' : 'text-emerald-500'}`} />
                      <span className="text-sm font-bold text-gray-700">{plan.maxAgents} Team Agents</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 ${plan.isFeatured ? 'text-blue-600' : 'text-emerald-500'}`} />
                      <span className="text-sm font-bold text-gray-700">{plan.maxContacts.toLocaleString()} Contact Capacity</span>
                    </li>
                    {plan.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.isFeatured ? 'text-blue-600' : 'text-emerald-500'}`} />
                        <span className={`text-sm font-bold ${plan.isFeatured ? 'text-gray-900' : 'text-gray-600'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[100px] rounded-full"></div>
          <h2 className="text-4xl font-black mb-12 text-center tracking-tight">Intelligence Briefing (FAQ)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 relative z-10">
            {[
              {
                q: 'What is the commitment period?',
                a: 'All plans are month-to-month by default. You can cancel your subscription at the end of any billing period without further obligation.',
              },
              {
                q: 'Can I upgrade my agent count mid-month?',
                a: 'Yes, scaling happens instantly. Pro-rated adjustments will be applied to your next automated ledger update.',
              },
              {
                q: 'Is my data isolated?',
                a: 'Absolutely. We use strict multi-tenant isolation protocols at the database level and AES-256 bit encryption for all stored identifiers.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes, all new registrations start with a 14-day premium trial to test full platform capabilities before any charge.',
              }
            ].map((item, idx) => (
              <div key={idx} className="border-l-2 border-blue-500 pl-6">
                <h3 className="text-lg font-black mb-3 text-blue-100 uppercase tracking-tighter">{item.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
