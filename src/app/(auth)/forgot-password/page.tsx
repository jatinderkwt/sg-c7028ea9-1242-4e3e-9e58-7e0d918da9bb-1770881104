'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSystemSettings } from "@/app/admin/governance/actions"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
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
                        brandColor: result.data.brandColor || '#00a884', // Default to WhatsApp Green
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
        setSuccess(false)

        try {
            // Simulate API call for now
            await new Promise(resolve => setTimeout(resolve, 1500))

            setSuccess(true)
        } catch (err) {
            setError('An error occurred. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    const themeColor = branding?.brandColor || '#00a884';

    return (
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden relative border-t-4" style={{ borderColor: themeColor }}>

            <div className="p-8 space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {branding ? branding.platformName : 'WaFiz'} Recovery
                    </h2>
                    <p className="text-gray-600 mt-2 text-sm">
                        Recover your account password.
                    </p>
                </div>

                {success ? (
                    <div className="rounded-lg bg-green-50 p-6 border border-green-100 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Reset Link Sent</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            We've sent an email to <strong>{email}</strong> with instructions to reset your password.
                        </p>
                        <Link
                            href="/login"
                            className="inline-block w-full py-3 text-white rounded-full font-semibold transition shadow-md uppercase tracking-wide text-sm hover:opacity-90"
                            style={{ backgroundColor: themeColor }}
                        >
                            Return to Sign In
                        </Link>
                    </div>
                ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <p className="text-center text-sm text-gray-600 mb-6 px-4">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                style={{ '--tw-ring-color': themeColor } as React.CSSProperties}
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-100 text-red-700 border border-red-200 rounded text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 text-white rounded-full font-semibold hover:opacity-90 disabled:opacity-70 transition shadow-md uppercase tracking-wide text-sm"
                            style={{
                                backgroundColor: themeColor,
                                boxShadow: `0 4px 14px 0 ${themeColor}66`
                            }}
                        >
                            {loading ? 'Sending Link...' : 'Send Reset Link'}
                        </button>

                        <div className="text-center mt-4">
                            <Link
                                href="/login"
                                className="text-sm font-medium hover:underline"
                                style={{ color: themeColor }}
                            >
                                Back to login
                            </Link>
                        </div>
                    </form>
                )}
            </div>

            {/* Footer */}
            {!success && (
                <div className="bg-gray-50 p-6 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-500">
                        Need help? <a href="#" className="font-semibold hover:underline" style={{ color: themeColor }}>Contact Support</a>
                    </p>
                </div>
            )}
        </div>
    )
}
