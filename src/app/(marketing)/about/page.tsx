import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">About WaFiz</h1>
          <p className="text-xl text-gray-600">
            Revolutionizing business communication through WhatsApp
          </p>
        </div>

        {/* Mission */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We believe every business deserves access to powerful communication tools. WaFiz makes WhatsApp Business 
            management accessible, affordable, and easy for teams of all sizes. We're building the platform for modern 
            customer communication.
          </p>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Simplicity',
                description: 'We make complex things simple. Our interface is intuitive and our features are easy to use.',
              },
              {
                title: 'Reliability',
                description: 'Your business depends on us. We maintain 99.9% uptime and 24/7 support.',
              },
              {
                title: 'Security',
                description: 'Your data is precious. We use enterprise-grade encryption and compliance standards.',
              },
              {
                title: 'Innovation',
                description: 'We continuously innovate to bring you the latest communication features and capabilities.',
              },
            ].map((value, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16 bg-blue-50 p-12 rounded-lg border border-blue-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose WaFiz?</h2>
          <ul className="space-y-4">
            {[
              'Purpose-built for WhatsApp Business management',
              'No complex setup or technical knowledge required',
              'Affordable pricing that scales with your business',
              'Trusted by thousands of businesses worldwide',
              'Dedicated support team available 24/7',
              'Regular updates with new features',
            ].map((reason, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  ✓
                </span>
                <span className="text-lg text-gray-700">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Team</h2>
          <p className="text-lg text-gray-600 mb-8">
            We're a team of passionate developers, designers, and customer success professionals dedicated to helping 
            businesses communicate better with their customers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: 'John Smith', role: 'Co-Founder & CEO', avatar: '👨‍💼' },
              { name: 'Sarah Johnson', role: 'Co-Founder & CTO', avatar: '👩‍💻' },
              { name: 'Mike Chen', role: 'Head of Product', avatar: '👨‍🔬' },
              { name: 'Lisa Brown', role: 'VP of Customer Success', avatar: '👩‍💼' },
            ].map((member, idx) => (
              <div key={idx} className="text-center">
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Us?</h2>
          <p className="text-lg text-blue-100 mb-8">Start managing your WhatsApp business communications today</p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </main>
  )
}
