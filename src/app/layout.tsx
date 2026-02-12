import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'WaFiz - WhatsApp Business SaaS',
  description: 'Complete WhatsApp Business API SaaS platform for teams',
  keywords: 'WhatsApp, Business API, SaaS, CRM, Marketing',
  openGraph: {
    title: 'WaFiz - WhatsApp Business SaaS',
    description: 'Complete WhatsApp Business API SaaS platform for teams',
    type: 'website',
  },
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
