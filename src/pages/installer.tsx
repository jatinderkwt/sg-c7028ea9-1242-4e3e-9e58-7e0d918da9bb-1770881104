import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Check, X, AlertCircle, Loader2, ArrowRight, ArrowLeft, CheckCircle, RefreshCw, CheckCircle2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SEO } from "@/components/SEO";
import Link from "next/link";

type SystemCheck = {
  name: string;
  status: "checking" | "success" | "warning" | "error";
  message?: string;
  details?: string;
};

type InstallStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const TIMEZONES = [
  // Americas
  { value: "America/New_York", label: "America/New York (EST/EDT)" },
  { value: "America/Chicago", label: "America/Chicago (CST/CDT)" },
  { value: "America/Denver", label: "America/Denver (MST/MDT)" },
  { value: "America/Los_Angeles", label: "America/Los Angeles (PST/PDT)" },
  { value: "America/Anchorage", label: "America/Anchorage (AKST/AKDT)" },
  { value: "America/Phoenix", label: "America/Phoenix (MST)" },
  { value: "America/Toronto", label: "America/Toronto (EST/EDT)" },
  { value: "America/Vancouver", label: "America/Vancouver (PST/PDT)" },
  { value: "America/Mexico_City", label: "America/Mexico City (CST/CDT)" },
  { value: "America/Bogota", label: "America/Bogota (COT)" },
  { value: "America/Lima", label: "America/Lima (PET)" },
  { value: "America/Santiago", label: "America/Santiago (CLT/CLST)" },
  { value: "America/Sao_Paulo", label: "America/Sao Paulo (BRT/BRST)" },
  { value: "America/Argentina/Buenos_Aires", label: "America/Buenos Aires (ART)" },
  { value: "America/Caracas", label: "America/Caracas (VET)" },
  
  // Europe
  { value: "Europe/London", label: "Europe/London (GMT/BST)" },
  { value: "Europe/Paris", label: "Europe/Paris (CET/CEST)" },
  { value: "Europe/Berlin", label: "Europe/Berlin (CET/CEST)" },
  { value: "Europe/Rome", label: "Europe/Rome (CET/CEST)" },
  { value: "Europe/Madrid", label: "Europe/Madrid (CET/CEST)" },
  { value: "Europe/Amsterdam", label: "Europe/Amsterdam (CET/CEST)" },
  { value: "Europe/Brussels", label: "Europe/Brussels (CET/CEST)" },
  { value: "Europe/Vienna", label: "Europe/Vienna (CET/CEST)" },
  { value: "Europe/Warsaw", label: "Europe/Warsaw (CET/CEST)" },
  { value: "Europe/Stockholm", label: "Europe/Stockholm (CET/CEST)" },
  { value: "Europe/Athens", label: "Europe/Athens (EET/EEST)" },
  { value: "Europe/Istanbul", label: "Europe/Istanbul (TRT)" },
  { value: "Europe/Moscow", label: "Europe/Moscow (MSK)" },
  { value: "Europe/Dublin", label: "Europe/Dublin (GMT/IST)" },
  { value: "Europe/Lisbon", label: "Europe/Lisbon (WET/WEST)" },
  
  // Asia
  { value: "Asia/Dubai", label: "Asia/Dubai (GST)" },
  { value: "Asia/Karachi", label: "Asia/Karachi (PKT)" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
  { value: "Asia/Mumbai", label: "Asia/Mumbai (IST)" },
  { value: "Asia/Dhaka", label: "Asia/Dhaka (BST)" },
  { value: "Asia/Bangkok", label: "Asia/Bangkok (ICT)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (SGT)" },
  { value: "Asia/Hong_Kong", label: "Asia/Hong Kong (HKT)" },
  { value: "Asia/Shanghai", label: "Asia/Shanghai (CST)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" },
  { value: "Asia/Seoul", label: "Asia/Seoul (KST)" },
  { value: "Asia/Manila", label: "Asia/Manila (PHT)" },
  { value: "Asia/Jakarta", label: "Asia/Jakarta (WIB)" },
  { value: "Asia/Kuala_Lumpur", label: "Asia/Kuala Lumpur (MYT)" },
  { value: "Asia/Taipei", label: "Asia/Taipei (CST)" },
  { value: "Asia/Tehran", label: "Asia/Tehran (IRST/IRDT)" },
  { value: "Asia/Jerusalem", label: "Asia/Jerusalem (IST/IDT)" },
  { value: "Asia/Riyadh", label: "Asia/Riyadh (AST)" },
  
  // Pacific
  { value: "Australia/Sydney", label: "Australia/Sydney (AEST/AEDT)" },
  { value: "Australia/Melbourne", label: "Australia/Melbourne (AEST/AEDT)" },
  { value: "Australia/Brisbane", label: "Australia/Brisbane (AEST)" },
  { value: "Australia/Perth", label: "Australia/Perth (AWST)" },
  { value: "Australia/Adelaide", label: "Australia/Adelaide (ACST/ACDT)" },
  { value: "Pacific/Auckland", label: "Pacific/Auckland (NZST/NZDT)" },
  { value: "Pacific/Fiji", label: "Pacific/Fiji (FJT/FJST)" },
  { value: "Pacific/Honolulu", label: "Pacific/Honolulu (HST)" },
  
  // Africa
  { value: "Africa/Cairo", label: "Africa/Cairo (EET)" },
  { value: "Africa/Johannesburg", label: "Africa/Johannesburg (SAST)" },
  { value: "Africa/Lagos", label: "Africa/Lagos (WAT)" },
  { value: "Africa/Nairobi", label: "Africa/Nairobi (EAT)" },
  { value: "Africa/Casablanca", label: "Africa/Casablanca (WET/WEST)" },
  
  // UTC
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
];

export default function InstallerPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<InstallStep>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [systemChecks, setSystemChecks] = useState<SystemCheck[]>([]);
  const [installed, setInstalled] = useState(false);
  
  const [dbInitialized, setDbInitialized] = useState(false);
  
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    timezone: "UTC",
    language: "en",
  });

  const [companyData, setCompanyData] = useState({
    name: "",
    website: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    currency: "USD",
    timezone: "UTC",
    language: "en",
  });

  const [saasConfig, setSaasConfig] = useState({
    enabled: true,
    freeTrialDays: 14,
    defaultPlan: "starter",
  });

  const [emailConfig, setEmailConfig] = useState({
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    senderEmail: "",
    senderName: "",
  });

  const [whatsappConfig, setWhatsappConfig] = useState({
    appId: "",
    appSecret: "",
    verifyToken: "",
    webhookUrl: "",
    systemAccessToken: "",
  });

  const [systemPreferences, setSystemPreferences] = useState({
    defaultTheme: "light",
    dateFormat: "YYYY-MM-DD",
    timeFormat: "24h",
    autoLogoutMinutes: 30,
    maxUploadMB: 10,
    messageRetentionDays: 365,
  });

  useEffect(() => {
    if (currentStep === 1) {
      checkSystem();
    }
  }, [currentStep]);

  const checkSystem = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/installer/check-system");
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || "Failed to check system requirements");
        setSystemChecks([]);
        return;
      }
      
      // Ensure checks is always an array with valid structure
      const checks = Array.isArray(data.checks) ? data.checks : [];
      const validChecks = checks.map(check => ({
        name: check?.name || "Unknown Check",
        status: check?.status || "error",
        message: check?.message || "No message provided",
        details: check?.details || undefined
      }));
      
      setSystemChecks(validChecks);
      setInstalled(data.installed || false);
      
      const allPassed = validChecks.every((check) => check.status === "success");
      if (allPassed && validChecks.length > 0) {
        setTimeout(() => setCurrentStep(2), 1500);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Network error checking system";
      setError(errorMessage);
      setSystemChecks([]);
    } finally {
      setLoading(false);
    }
  };

  const initializeDatabase = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/installer/init-database", {
        method: "POST"
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Show detailed error with instructions if available
        if (data.instructions) {
          const instructionsText = Array.isArray(data.instructions) 
            ? data.instructions.join('\n') 
            : data.instructions;
          setError(`${data.error}\n\n${data.details}\n\nFIX:\n${instructionsText}\n\n${data.fix || ''}`);
        } else {
          setError(data.error || data.details || "Failed to initialize database");
        }
        return;
      }
      
      setDbInitialized(true);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to initialize database");
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async () => {
    if (adminData.password !== adminData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (adminData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/installer/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create admin");
      }
      
      setCurrentStep(4);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const completeInstallation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/installer/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: companyData,
          saas: saasConfig,
          email: emailConfig,
          whatsapp: whatsappConfig,
          preferences: systemPreferences,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to complete installation");
      }
      
      setCurrentStep(9);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: SystemCheck["status"]) => {
    switch (status) {
      case "checking":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <X className="h-5 w-5 text-red-500" />;
    }
  };

  const renderSystemChecks = () => (
    <div className="space-y-4">
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      )}

      {!loading && error && (
        <Alert variant="destructive">
          <AlertDescription className="space-y-2">
            <p className="font-semibold">System Check Failed</p>
            <p>{error}</p>
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 rounded-md text-sm">
              <p className="font-semibold mb-2">🔧 Dokploy Users: Common Fix</p>
              <p className="mb-2">If deploying on Dokploy, ensure these environment variables are set:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><code className="bg-red-100 dark:bg-red-900 px-1 rounded">NEXTAUTH_SECRET</code> - Generate with: <code className="bg-red-100 dark:bg-red-900 px-1 rounded">openssl rand -base64 32</code></li>
                <li><code className="bg-red-100 dark:bg-red-900 px-1 rounded">NEXTAUTH_URL</code> - Your production domain</li>
                <li><code className="bg-red-100 dark:bg-red-900 px-1 rounded">ENCRYPTION_KEY</code> - Generate with: <code className="bg-red-100 dark:bg-red-900 px-1 rounded">openssl rand -hex 32</code></li>
                <li><code className="bg-red-100 dark:bg-red-900 px-1 rounded">NEXT_PUBLIC_APP_URL</code> - Your production domain</li>
                <li><code className="bg-red-100 dark:bg-red-900 px-1 rounded">DATABASE_URL</code> - PostgreSQL connection string</li>
              </ul>
              <p className="mt-2">After adding these in Dokploy dashboard, redeploy and refresh this page.</p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {!loading && !error && systemChecks.length > 0 && (
        <>
          {systemChecks.some(check => check?.status === "error") && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription className="space-y-2">
                <p className="font-semibold">⚠️ Some checks failed</p>
                <p>Please resolve the issues below before proceeding.</p>
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-950 rounded text-sm">
                  <p className="font-semibold mb-2">Quick Fix for Dokploy:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to your Dokploy project dashboard</li>
                    <li>Click on "Environment Variables"</li>
                    <li>Add the missing variables shown below</li>
                    <li>Click "Save" and redeploy</li>
                    <li>Refresh this page</li>
                  </ol>
                  <p className="mt-2 text-xs">See <Link href="/docs#environment-setup" className="underline">full documentation</Link> or <a href="https://github.com/yourusername/yourproject/blob/main/DEPLOYMENT.md" target="_blank" rel="noopener noreferrer" className="underline">DEPLOYMENT.md</a> for details.</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            {systemChecks.map((check, index) => {
              // Safety check - ensure check object exists
              if (!check || typeof check !== 'object') return null;
              
              const checkName = check.name || "Unknown Check";
              const checkStatus = check.status || "error";
              const checkMessage = check.message || "No message provided";
              const checkDetails = check.details;
              
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    checkStatus === "success"
                      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950"
                      : checkStatus === "warning"
                      ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
                      : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {checkStatus === "success" && (
                          <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        )}
                        {checkStatus === "warning" && (
                          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        )}
                        {checkStatus === "error" && (
                          <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                        <h3 className="font-semibold">{checkName}</h3>
                      </div>
                      <p className={`text-sm ${
                        checkStatus === "success" ? "text-emerald-700 dark:text-emerald-300" :
                        checkStatus === "warning" ? "text-yellow-700 dark:text-yellow-300" :
                        "text-red-700 dark:text-red-300"
                      }`}>
                        {checkMessage}
                      </p>
                      {checkDetails && (
                        <p className="text-xs mt-2 text-muted-foreground font-mono bg-white/50 dark:bg-black/20 p-2 rounded">
                          {checkDetails}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!loading && systemChecks.length > 0 && (
        <div className="flex gap-3 mt-6">
          <Button
            onClick={checkSystem}
            variant="outline"
            className="flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Recheck System
          </Button>
          <Button
            onClick={() => setCurrentStep(2)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            disabled={systemChecks.some(c => c.status === "error")}
          >
            Continue Setup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {systemChecks.some(c => c?.status === "error") && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Critical Issues Detected</AlertTitle>
          <AlertDescription>
            Please resolve the errors above before proceeding. Check your environment variables and database connection.
          </AlertDescription>
        </Alert>
      )}

      {systemChecks.some(c => c?.status === "warning") && !systemChecks.some(c => c?.status === "error") && (
        <Alert className="mt-4 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-200">Warnings Detected</AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            The system will work, but some features may be limited. Review the warnings above.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: System Environment Check</CardTitle>
              <CardDescription>Verifying system requirements and configuration</CardDescription>
            </CardHeader>
            <CardContent>
              {renderSystemChecks()}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Database Initialization</CardTitle>
              <CardDescription>
                Create database tables and seed default data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription className="whitespace-pre-wrap font-mono text-xs">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              {dbInitialized ? (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-800 dark:text-green-200">Success</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    Database initialized successfully. All tables created and default data seeded.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This will create all necessary database tables and seed default data including:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>System tenant for global data</li>
                    <li>4 default roles (Super Admin, Admin, Manager, Agent)</li>
                    <li>22 permissions across all resources</li>
                    <li>4 subscription plans (Free, Starter, Professional, Enterprise)</li>
                  </ul>
                </div>
              )}
              
              <div className="flex justify-between gap-3 mt-6">
                <Button onClick={() => setCurrentStep(1)} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={() => setCurrentStep(3)}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Create Super Admin</CardTitle>
              <CardDescription>Set up your administrator account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={adminData.name}
                    onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={adminData.email}
                    onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                    placeholder="admin@company.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={adminData.password}
                    onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                    placeholder="Min 8 characters"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={adminData.confirmPassword}
                    onChange={(e) => setAdminData({ ...adminData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={adminData.timezone} onValueChange={(v) => setAdminData({ ...adminData, timezone: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={adminData.language} onValueChange={(v) => setAdminData({ ...adminData, language: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between gap-3 mt-6">
                <Button onClick={() => setCurrentStep(2)} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={createAdmin} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Admin <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Company Setup</CardTitle>
              <CardDescription>Configure your company information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={companyData.name}
                    onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                    placeholder="Acme Inc"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={companyData.website}
                    onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Email *</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={companyData.email}
                    onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                    placeholder="contact@company.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                    placeholder="+1234567890"
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={companyData.address}
                    onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                    placeholder="123 Main St, City, Country"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={companyData.country}
                    onChange={(e) => setCompanyData({ ...companyData, country: e.target.value })}
                    placeholder="United States"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={companyData.currency} onValueChange={(v) => setCompanyData({ ...companyData, currency: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between gap-3 mt-6">
                <Button onClick={() => setCurrentStep(3)} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setCurrentStep(5)}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 5: SaaS Configuration</CardTitle>
              <CardDescription>Configure multi-tenant SaaS settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="saasEnabled">Enable SaaS Mode</Label>
                  <p className="text-sm text-muted-foreground">Allow multiple tenants to use the platform</p>
                </div>
                <Switch
                  id="saasEnabled"
                  checked={saasConfig.enabled}
                  onCheckedChange={(checked) => setSaasConfig({ ...saasConfig, enabled: checked })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="freeTrialDays">Free Trial Duration (days)</Label>
                <Input
                  id="freeTrialDays"
                  type="number"
                  value={saasConfig.freeTrialDays}
                  onChange={(e) => setSaasConfig({ ...saasConfig, freeTrialDays: parseInt(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultPlan">Default Plan</Label>
                <Select value={saasConfig.defaultPlan} onValueChange={(v) => setSaasConfig({ ...saasConfig, defaultPlan: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-between gap-3 mt-6">
                <Button onClick={() => setCurrentStep(4)} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setCurrentStep(6)}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 6: Email & Notifications</CardTitle>
              <CardDescription>Configure SMTP settings for email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={emailConfig.smtpHost}
                    onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={emailConfig.smtpPort}
                    onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: e.target.value })}
                    placeholder="587"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={emailConfig.smtpUser}
                    onChange={(e) => setEmailConfig({ ...emailConfig, smtpUser: e.target.value })}
                    placeholder="user@gmail.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailConfig.smtpPassword}
                    onChange={(e) => setEmailConfig({ ...emailConfig, smtpPassword: e.target.value })}
                    placeholder="App password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Sender Email</Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    value={emailConfig.senderEmail}
                    onChange={(e) => setEmailConfig({ ...emailConfig, senderEmail: e.target.value })}
                    placeholder="noreply@company.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderName">Sender Name</Label>
                  <Input
                    id="senderName"
                    value={emailConfig.senderName}
                    onChange={(e) => setEmailConfig({ ...emailConfig, senderName: e.target.value })}
                    placeholder="Company Name"
                  />
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You can configure WhatsApp credentials later from the admin dashboard if needed.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-between gap-3 mt-6">
                <Button onClick={() => setCurrentStep(5)} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setCurrentStep(7)}>
                  Skip <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 7:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 7: WhatsApp API Setup</CardTitle>
              <CardDescription>Configure Meta WhatsApp Business API credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appId">Meta App ID</Label>
                  <Input
                    id="appId"
                    value={whatsappConfig.appId}
                    onChange={(e) => setWhatsappConfig({ ...whatsappConfig, appId: e.target.value })}
                    placeholder="123456789012345"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="appSecret">Meta App Secret</Label>
                  <Input
                    id="appSecret"
                    type="password"
                    value={whatsappConfig.appSecret}
                    onChange={(e) => setWhatsappConfig({ ...whatsappConfig, appSecret: e.target.value })}
                    placeholder="Your app secret"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="verifyToken">Webhook Verify Token</Label>
                  <Input
                    id="verifyToken"
                    value={whatsappConfig.verifyToken}
                    onChange={(e) => setWhatsappConfig({ ...whatsappConfig, verifyToken: e.target.value })}
                    placeholder="Your custom token"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value={whatsappConfig.webhookUrl}
                    onChange={(e) => setWhatsappConfig({ ...whatsappConfig, webhookUrl: e.target.value })}
                    placeholder="https://yourdomain.com/api/auth/login"
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="systemAccessToken">System Access Token</Label>
                  <Input
                    id="systemAccessToken"
                    type="password"
                    value={whatsappConfig.systemAccessToken}
                    onChange={(e) => setWhatsappConfig({ ...whatsappConfig, systemAccessToken: e.target.value })}
                    placeholder="Your system access token"
                  />
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You can configure WhatsApp credentials later from the admin dashboard if needed.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-between gap-3 mt-6">
                <Button onClick={() => setCurrentStep(6)} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setCurrentStep(8)}>
                  Skip <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 8:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 8: System Preferences</CardTitle>
              <CardDescription>Configure default system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultTheme">Default Theme</Label>
                  <Select value={systemPreferences.defaultTheme} onValueChange={(v) => setSystemPreferences({ ...systemPreferences, defaultTheme: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={systemPreferences.dateFormat} onValueChange={(v) => setSystemPreferences({ ...systemPreferences, dateFormat: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select value={systemPreferences.timeFormat} onValueChange={(v) => setSystemPreferences({ ...systemPreferences, timeFormat: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24 Hour</SelectItem>
                      <SelectItem value="12h">12 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="autoLogout">Auto Logout (minutes)</Label>
                  <Input
                    id="autoLogout"
                    type="number"
                    value={systemPreferences.autoLogoutMinutes}
                    onChange={(e) => setSystemPreferences({ ...systemPreferences, autoLogoutMinutes: parseInt(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxUpload">Max Upload Size (MB)</Label>
                  <Input
                    id="maxUpload"
                    type="number"
                    value={systemPreferences.maxUploadMB}
                    onChange={(e) => setSystemPreferences({ ...systemPreferences, maxUploadMB: parseInt(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="retention">Message Retention (days)</Label>
                  <Input
                    id="retention"
                    type="number"
                    value={systemPreferences.messageRetentionDays}
                    onChange={(e) => setSystemPreferences({ ...systemPreferences, messageRetentionDays: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="flex justify-between gap-3 mt-6">
                <Button onClick={() => setCurrentStep(7)} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={completeInstallation} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Complete Installation <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 9:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">Installation Complete! 🎉</CardTitle>
              <CardDescription className="text-center">Your WhatsApp Business API Platform is ready to use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Admin Email</p>
                  <p className="font-medium">{adminData.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Company</p>
                  <p className="font-medium">{companyData.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SaaS Mode</p>
                  <p className="font-medium">{saasConfig.enabled ? "Enabled" : "Disabled"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Free Trial</p>
                  <p className="font-medium">{saasConfig.freeTrialDays} days</p>
                </div>
              </div>
              
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  System has been configured successfully. A backup has been created automatically.
                </AlertDescription>
              </Alert>
              
              <div className="text-center">
                <Button onClick={() => router.push("/api/auth/login")} size="lg">
                  Go to Login <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <>
      <SEO title="Installation Wizard - WhatsApp Business API" />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              WhatsApp Business API Platform
            </h1>
            <p className="text-muted-foreground">Installation Wizard</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((step) => (
                <div
                  key={step}
                  className={`h-2 flex-1 mx-1 rounded-full transition-colors ${
                    step <= currentStep
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Step {currentStep} of 9
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {renderStep()}
        </div>
      </div>
    </>
  );
}