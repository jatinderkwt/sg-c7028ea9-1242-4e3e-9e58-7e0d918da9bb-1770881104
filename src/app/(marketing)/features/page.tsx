import { MessageSquare, Zap, Users, BarChart3, Bell, Lock, Globe, Smartphone } from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'Shared Inbox',
    description: 'Centralize all WhatsApp conversations from multiple numbers in one unified inbox. Assign messages to team members and collaborate seamlessly.',
    benefits: ['Multi-number management', 'Team collaboration', 'Conversation threading', 'Quick replies'],
  },
  {
    icon: Zap,
    title: 'Smart Automation',
    description: 'Create powerful automation flows without coding. Trigger actions based on keywords, time, or user behavior.',
    benefits: ['Keyword-based triggers', 'Time-based scheduling', 'Conditional logic', 'Template responses'],
  },
  {
    icon: Users,
    title: 'CRM Integration',
    description: 'Manage customer relationships with contact profiles, history, tags, and custom fields. Build understanding of every customer.',
    benefits: ['Contact profiles', 'Conversation history', 'Custom fields', 'Tagging system'],
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Get real-time insights into your business performance. Track response times, resolution rates, and customer satisfaction.',
    benefits: ['Real-time dashboards', 'Performance metrics', 'Team analytics', 'Export reports'],
  },
  {
    icon: Bell,
    title: 'Broadcast Campaigns',
    description: 'Send targeted messages to thousands of customers instantly. Use templates and track delivery metrics.',
    benefits: ['Template-based', 'Audience targeting', 'Delivery tracking', 'Read receipts'],
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description: 'Reach customers in their preferred language. Automatic translation and localization features.',
    benefits: ['Auto-translation', 'Regional preferences', 'Local formatting', 'Language detection'],
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance with GDPR, CCPA, and other data protection standards.',
    benefits: ['End-to-end encryption', 'GDPR compliant', 'Data backups', 'Audit logs'],
  },
  {
    icon: Smartphone,
    title: 'Mobile App',
    description: 'Stay connected with your customers on the go. Full app functionality for iOS and Android.',
    benefits: ['iOS app', 'Android app', 'Push notifications', 'Offline mode'],
  },
]

export default function FeaturesPage() {
  return (
    <main className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Powerful Features</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage WhatsApp communications at scale. Built for teams that demand more.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition">
                <Icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Additional Features */}
        <div className="mt-20 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Additional Capabilities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'AI-Powered Responses', description: 'Auto-generate intelligent responses based on your knowledge base' },
              { title: 'Conversation Routing', description: 'Automatically route messages to the right team member' },
              { title: 'Lead Scoring', description: 'Identify and prioritize high-value leads automatically' },
              { title: 'Template Management', description: 'Create, manage and approve WhatsApp templates' },
              { title: 'Webhook Integration', description: 'Connect with your existing tools and systems' },
              { title: 'API Access', description: 'Full REST API for custom integrations' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
