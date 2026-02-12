'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type InstallerStep = 'check' | 'database' | 'admin' | 'settings' | 'complete'

export default function InstallerPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<InstallerStep>('check')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    // Database
    dbHost: 'localhost',
    dbPort: '5432',
    dbName: 'wabiz_db',
    dbUser: 'postgres',
    dbPassword: '',
    
    // Admin user
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    
    // Platform settings
    platformName: 'WaFiz',
    currency: 'USD',
    timezone: 'UTC',
    supportEmail: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleStepChange = async (step: InstallerStep) => {
    setError(null)
    
    if (step === 'database' && currentStep === 'check') {
      setLoading(true)
      try {
        // Validate system requirements
        const response = await fetch('/api/install/check', { method: 'GET' })
        if (!response.ok) {
          throw new Error('System check failed')
        }
        setCurrentStep(step)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'System check failed')
      } finally {
        setLoading(false)
      }
    } else {
      setCurrentStep(step)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/install/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Installation failed')
      }

      setCurrentStep('complete')
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Installation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">WaFiz Installation Wizard</h1>
          <p className="text-blue-100">Complete WhatsApp Business SaaS Platform</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Step Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {(['check', 'database', 'admin', 'settings', 'complete'] as const).map((step, idx) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      step === currentStep ? 'bg-blue-600 text-white' : step < currentStep === false ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  {idx < 4 && <div className="h-1 w-12 mx-2 bg-gray-200"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium">Error: {error}</p>
            </div>
          )}

          {/* Step 1: System Check */}
          {currentStep === 'check' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">System Requirements Check</h2>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className="text-green-800">Node version compatible</span>
                </div>
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <svg className="w-5 h-5 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  <span className="text-yellow-800">Database pending configuration</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Database Setup */}
          {currentStep === 'database' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Database Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
                  <input
                    type="text"
                    name="dbHost"
                    value={formData.dbHost}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                    <input
                      type="text"
                      name="dbPort"
                      value={formData.dbPort}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
                    <input
                      type="text"
                      name="dbName"
                      value={formData.dbName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    name="dbUser"
                    value={formData.dbUser}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="dbPassword"
                    value={formData.dbPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Admin User */}
          {currentStep === 'admin' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Super Admin Account</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password (min 8 characters)</label>
                  <input
                    type="password"
                    name="adminPassword"
                    value={formData.adminPassword}
                    onChange={handleInputChange}
                    minLength={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Platform Settings */}
          {currentStep === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Platform Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                  <input
                    type="text"
                    name="platformName"
                    value={formData.platformName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                  <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                    <option>INR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Timezone</label>
                  <select name="timezone" value={formData.timezone} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>UTC</option>
                    <option>Asia/Kolkata</option>
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                  <input
                    type="email"
                    name="supportEmail"
                    value={formData.supportEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 'complete' && (
            <div className="text-center">
              <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Installation Complete!</h2>
              <p className="text-gray-600">Your WaFiz platform is ready to use. Redirecting to login...</p>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep !== 'complete' && (
            <div className="flex gap-4 mt-8">
              {currentStep !== 'check' && (
                <button
                  type="button"
                  onClick={() => {
                    const steps: InstallerStep[] = ['check', 'database', 'admin', 'settings', 'complete']
                    const currentIdx = steps.indexOf(currentStep)
                    if (currentIdx > 0) {
                      setCurrentStep(steps[currentIdx - 1])
                    }
                  }}
                  disabled={loading}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Back
                </button>
              )}
              {currentStep !== 'settings' && (
                <button
                  type="button"
                  onClick={() => {
                    const steps: InstallerStep[] = ['check', 'database', 'admin', 'settings', 'complete']
                    const currentIdx = steps.indexOf(currentStep)
                    if (currentIdx < steps.length - 1) {
                      handleStepChange(steps[currentIdx + 1])
                    }
                  }}
                  disabled={loading}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Next'}
                </button>
              )}
              {currentStep === 'settings' && (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Installing...' : 'Complete Installation'}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
