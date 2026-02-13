'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  UserPlus,
  Building2,
  FileCheck,
  FlaskConical,
  ChevronRight,
  ChevronLeft,
  Upload,
  Info,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

const steps = [
  { id: 1, name: 'Account Setup', icon: UserPlus },
  { id: 2, name: 'Business Identity', icon: Building2 },
  { id: 3, name: 'Compliance Vault', icon: FileCheck },
  { id: 4, name: 'Trial & Activation', icon: FlaskConical },
]

export default function RegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    // Step 1: Account
    adminName: '',
    email: '',
    password: '',

    // Step 2: Business
    businessName: '',
    country: '',
    website: '',
    address: '',

    // Step 3: Compliance
    taxId: '',
    registrationNumber: '',
    // Files are handled via input change

    // Step 4: Logic
    byoaEnabled: false,
    phoneNumberId: '',
    wabaId: '',
    accessToken: '',
    agreeToTerms: false
  })

  // Mock file states
  const [businessLicense, setBusinessLicense] = useState<File | null>(null)
  const [taxCertificate, setTaxCertificate] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep < 4) {
      nextStep()
      return
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // In a real app, we'd use FormData to send files
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.adminName,
          email: formData.email,
          password: formData.password,
          companyName: formData.businessName,
          // Extra metadata for compliance section
          compliance: {
            country: formData.country,
            website: formData.website,
            address: formData.address,
            taxId: formData.taxId,
            registrationNumber: formData.registrationNumber
          },
          whatsapp: formData.byoaEnabled ? {
            phoneNumberId: formData.phoneNumberId,
            wabaId: formData.wabaId,
            accessToken: formData.accessToken
          } : null
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Registration failed')
      }

      toast.success('Registration successful! Redirecting...')
      router.push('/login?registered=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
      toast.error(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Company Registration</h1>
        <p className="text-blue-100 mt-2 text-lg">Complete your business verification for Meta WABA access.</p>
      </div>

      {/* Progress Stepper */}
      <div className="mb-10 px-4">
        <div className="flex justify-between mb-4">
          <span className="text-sm font-semibold text-blue-100 uppercase tracking-wider">
            Step {currentStep}: {steps[currentStep - 1].name}
          </span>
          <span className="text-sm font-medium text-blue-200">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-blue-900/30 backdrop-blur-sm rounded-full h-2.5 overflow-hidden border border-blue-400/20">
          <div
            className="bg-gradient-to-r from-blue-400 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(52,211,153,0.5)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Desktop Step Icons */}
        <div className="hidden sm:flex justify-between mt-6">
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isActive ? 'bg-blue-500 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' :
                    isCompleted ? 'bg-emerald-500 border-emerald-400 text-white' :
                      'bg-blue-900/40 border-blue-700/50 text-blue-300'}
                `}>
                  {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                </div>
                <span className={`text-[10px] uppercase font-bold mt-2 tracking-tighter ${isActive ? 'text-white' : 'text-blue-300/60'}`}>
                  {step.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 sm:p-12">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-shake">
              <AlertCircle className="text-red-500 shrink-0" />
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* STEP 1: Account Setup */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <UserPlus size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Account Details</h2>
              </div>
              <p className="text-gray-500 text-sm">Let's start with your administrative account setup.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Admin Full Name</label>
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                    required
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Work Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="john@company.com"
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <p className="text-[11px] text-gray-400 italic">Minimum 8 characters with a mix of letters and numbers.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Business Identity */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <Building2 size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Business Identity</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Legal Business Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="Acme Corp Intl."
                  />
                  <p className="text-[11px] text-gray-400">Must exactly match your tax registration documents for Meta verification.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Registered Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all appearance-none"
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="IN">India</option>
                    <option value="KW">Kuwait</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Business Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    required
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="https://www.acme.com"
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Full Registered Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all resize-none"
                    placeholder="Street name, Building, City, State, Zip"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Compliance Vault */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <FileCheck size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Compliance Vault</h2>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-4">
                <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                <p className="text-[13px] text-emerald-800 leading-relaxed">
                  Meta requires official documentation to verify your Business Account (WABA). Uploading clear, high-resolution scans speeds up approval.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group relative border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 p-8 rounded-2xl text-center transition-all cursor-pointer">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => setBusinessLicense(e.target.files?.[0] || null)}
                  />
                  <div className="relative z-0">
                    <div className="mx-auto w-12 h-12 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors mb-4">
                      {businessLicense ? <CheckCircle2 size={24} className="text-emerald-500" /> : <Upload size={24} />}
                    </div>
                    <label className="block text-sm font-bold text-gray-700">Business License</label>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {businessLicense ? businessLicense.name : 'PDF, JPG, PNG (Max 5MB)'}
                    </p>
                  </div>
                </div>

                <div className="group relative border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 p-8 rounded-2xl text-center transition-all cursor-pointer">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => setTaxCertificate(e.target.files?.[0] || null)}
                  />
                  <div className="relative z-0">
                    <div className="mx-auto w-12 h-12 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors mb-4">
                      {taxCertificate ? <CheckCircle2 size={24} className="text-emerald-500" /> : <Upload size={24} />}
                    </div>
                    <label className="block text-sm font-bold text-gray-700">Tax ID / VAT Certificate</label>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {taxCertificate ? taxCertificate.name : 'Official government document'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Tax ID / EIN Number</label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    required
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="e.g. 12-345678"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Legal Registration #</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    required
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="e.g. CR-8234-X"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Trial & Activation */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <FlaskConical size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Trial & Activation</h2>
              </div>

              <div className={`p-6 rounded-2xl border transition-all duration-500 ${formData.byoaEnabled ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-100' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${formData.byoaEnabled ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                      <Info size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Bring Your Own API (BYOA)</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Skip our provisioning and connect your Meta account directly.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="byoaEnabled"
                      checked={formData.byoaEnabled}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6.5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {formData.byoaEnabled && (
                  <div className="space-y-4 pt-4 border-t border-blue-200/50 animate-fadeInSlide">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-blue-800 uppercase tracking-tighter ml-1">Meta Phone Number ID</label>
                      <input
                        type="text"
                        name="phoneNumberId"
                        value={formData.phoneNumberId}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="1058293xxxxxx"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-blue-800 uppercase tracking-tighter ml-1">Meta WABA ID (Business Account ID)</label>
                      <input
                        type="text"
                        name="wabaId"
                        value={formData.wabaId}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="192348..."
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-blue-800 uppercase tracking-tighter ml-1">Permanent Access Token</label>
                      <input
                        type="password"
                        name="accessToken"
                        value={formData.accessToken}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="EAAG..."
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                    className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded-lg focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed cursor-pointer select-none">
                    I agree to the <Link href="/terms" className="text-blue-600 font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 font-bold hover:underline">Data Processing Agreement</Link>. I certify all company data is legally accurate according to local regulations.
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
            <button
              type="button"
              onClick={prevStep}
              className={`flex items-center gap-2 px-6 py-3 text-gray-500 font-bold hover:text-blue-600 transition-colors ${currentStep === 1 ? 'invisible' : 'visible'}`}
            >
              <ChevronLeft size={20} />
              <span>Back</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-extrabold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{currentStep === 4 ? 'Complete Registration' : 'Continue'}</span>
                  {currentStep !== 4 && <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer Branding */}
      <div className="mt-12 text-center pb-12">
        <div className="inline-flex items-center gap-2 py-2 px-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 text-white/60 text-xs font-medium uppercase tracking-widest shadow-sm">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>AES-256 Bit Encryption Secured</span>
        </div>
        <p className="mt-6 text-blue-200/50 text-xs">
          &copy; {new Date().getFullYear()} WaFiz Platform. All rights reserved. Data processed according to ISO 27001 standards.
        </p>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-fadeInSlide {
          animation: fadeInSlide 0.3s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  )
}
