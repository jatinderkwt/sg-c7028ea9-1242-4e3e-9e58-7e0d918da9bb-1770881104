'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if system is installed
    const checkInstallation = async () => {
      try {
        const response = await fetch('/api/system/check-installation')
        const data = await response.json()
        
        if (!data.isInstalled) {
          router.push('/install')
        } else {
          router.push('/auth/login')
        }
      } catch (error) {
        router.push('/install')
      }
    }

    checkInstallation()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center">
        <div className="text-white mb-4">
          <svg
            className="animate-spin mx-auto h-12 w-12"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">WaFiz</h1>
        <p className="text-slate-400 mt-2">Initializing...</p>
      </div>
    </div>
  )
}
