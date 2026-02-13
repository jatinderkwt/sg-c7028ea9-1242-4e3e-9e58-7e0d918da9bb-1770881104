'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn, getSession } from 'next-auth/react'
import { Eye, EyeOff } from 'lucide-react'
import { getSystemSettings } from "@/app/admin/governance/actions"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [branding, setBranding] = useState<{
    platformName: string;
    brandColor: string;
    customDomain: string;
  } | null>(null);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const result = await getSystemSettings();
        if (result.success && result.data) {
          setBranding({
            platformName: result.data.platformName,
            brandColor: result.data.brandColor || '#00a884', // Default to WhatsApp Green if not set
            customDomain: result.data.customDomain || 'WaFiz'
          });
        }
      } catch (e) {
        console.error("Failed to load branding", e);
      }
    };
    fetchBranding();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error('Invalid email or password')
      }

      if (result?.ok) {
        // Check role and redirect
        const session = await getSession()
        if (session?.user?.role === 'SUPER_ADMIN') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  // Use the fetched brand color or default to WhatsApp Green (#00a884)
  const themeColor = branding?.brandColor || '#00a884';

  return (
    <div className="bg-white rounded-lg shadow-2xl overflow-hidden relative border-t-4" style={{ borderColor: themeColor }}>

      {/* Form Content */}
      <div className="p-8 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            To use {branding ? branding.platformName : 'WaFiz'} on your computer:
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            Log in to access your business dashboard.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 border border-red-200 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              style={{ '--tw-ring-color': themeColor } as React.CSSProperties}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent pr-10 transition-all bg-gray-50 focus:bg-white"
                style={{ '--tw-ring-color': themeColor } as React.CSSProperties}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 focus:ring-opacity-50"
                style={{ color: themeColor, borderColor: themeColor }}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                Keep me signed in
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium hover:underline"
                style={{ color: themeColor }}
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-white rounded-full font-semibold hover:opacity-90 disabled:opacity-70 transition shadow-md mt-6 uppercase tracking-wide text-sm"
            style={{
              backgroundColor: themeColor,
              boxShadow: `0 4px 14px 0 ${themeColor}66` // Add a subtle colored shadow
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>

      {/* Footer / QR Code hint (Optional visual element to mimic WhatsApp Web) */}
      <div className="bg-gray-50 p-6 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-500">
          Need an account? <Link href="/register" className="font-semibold hover:underline" style={{ color: themeColor }}>Get started</Link>
        </p>
      </div>
    </div>
  )
}
