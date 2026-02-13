export const metadata = {
  title: 'Login - WaFiz',
  description: 'Login to your WaFiz account',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#d1d7db] flex items-center justify-center relative overflow-hidden">
      {/* WhatsApp Web-style top green strip */}
      <div className="absolute top-0 left-0 w-full h-[220px] bg-[#00a884] z-0"></div>

      {/* Content Container */}
      <div className="w-full max-w-md px-4 z-10 relative">
        <div className="mb-8 text-center flex items-center justify-center gap-3">
          {/* Optional: Add a logo here if available, for now just text or icon */}
          <div className="flex items-center gap-2 text-white font-semibold tracking-wide text-sm uppercase">
            {/* WhatsApp Logo SVG placeholder or similar context */}
            <svg viewBox="0 0 33 33" width="33" height="33" className="" fill="currentColor">
              <path d="M16.6 0C7.4 0 0 7.4 0 16.5c0 2.9.8 5.7 2.2 8.2L.6 33l8.5-2.2c2.4 1.3 5.1 2 7.9 2 9.2 0 16.6-7.4 16.6-16.5S25.8 0 16.6 0zm0 29.8c-2.5 0-4.9-.7-7.1-1.9l-.5-.3-5.3 1.4 1.4-5.1-.3-.5C3.7 21.2 3 18.9 3 16.5c0-7.5 6.1-13.6 13.6-13.6s13.6 6.1 13.6 13.6-6.1 13.3-13.6 13.3zm7.3-10c-.4-.2-2.3-1.1-2.7-1.2-.4-.1-.6-.2-.9.2-.2.4-1.1 1.2-1.3 1.5-.2.2-.5.3-.9.1-1.7-.8-2.8-1.5-3.9-3.4-.3-.5 0-.7.2-1 .2-.2.4-.5.6-.7.2-.2.3-.4.4-.6.1-.2.1-.5 0-.6-.1-.2-.9-2.2-1.3-2.9-.3-.8-.7-.6-.9-.6h-.8c-.3 0-.7.1-1.1.5-.4.4-1.5 1.5-1.5 3.6s1.6 4.2 1.8 4.5c.2.3 3.1 4.7 7.6 6.6 2.7 1.1 3.8 1.1 5.2.9 1.6-.2 3.6-1.5 4.1-2.9.5-1.4.5-2.6.4-2.9-.2-.3-.5-.4-.9-.6z"></path>
            </svg>
            <span>WhatsApp Business SaaS</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
