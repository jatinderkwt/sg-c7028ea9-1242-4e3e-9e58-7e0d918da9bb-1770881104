export const metadata = {
  title: 'Installation Wizard - WaFiz',
  description: 'Set up your WaFiz SaaS platform',
}

export default function InstallerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </div>
    </div>
  )
}
