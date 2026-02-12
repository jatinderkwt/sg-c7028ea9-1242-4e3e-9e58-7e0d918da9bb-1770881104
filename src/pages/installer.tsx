import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Check, X, AlertCircle, Loader2, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SEO } from "@/components/SEO";

type SystemCheck = {
  name: string;
  status: "checking" | "success" | "warning" | "error";
  message?: string;
};

type InstallStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export default function InstallerPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<InstallStep>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [systemChecks, setSystemChecks] = useState<SystemCheck[]>([
    { name: "Node.js Version", status: "checking" },
    { name: "Database Connection", status: "checking" },
    { name: "Environment Variables", status: "checking" },
    { name: "File Permissions", status: "checking" },
    { name: "Storage Availability", status: "checking" },
  ]);

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
      runSystemChecks();
    }
  }, [currentStep]);

  const runSystemChecks = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/installer/check-system");
      const data = await response.json();
      
      const updatedChecks = systemChecks.map(check => {
        const result = data.checks[check.name.toLowerCase().replace(/\s+/g, "_")];
        return {
          ...check,
          status: result?.status || "error",
          message: result?.message,
        };
      });
      
      setSystemChecks(updatedChecks);
    } catch (err) {
      setError("Failed to run system checks");
    } finally {
      setLoading(false);
    }
  };

  const initializeDatabase = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/installer/init-database", {
        method: "POST",
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to initialize database");
      }
      
      setDbInitialized(true);
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message);
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: System Environment Check</CardTitle>
              <CardDescription>Verifying system requirements and configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemChecks.map((check, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <p className="font-medium">{check.name}</p>
                      {check.message && (
                        <p className="text-sm text-muted-foreground">{check.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end gap-3 mt-6">
                <Button onClick={runSystemChecks} variant="outline" disabled={loading}>
                  Re-check
                </Button>
                <Button 
                  onClick={() => setCurrentStep(2)} 
                  disabled={systemChecks.some(c => c.status === "error")}
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Database Initialization</CardTitle>
              <CardDescription>Create database tables and seed default data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {!dbInitialized && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Click the button below to initialize the database. This will create all necessary tables and seed default data.
                  </p>
                  <Button onClick={initializeDatabase} disabled={loading} size="lg">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Initialize Database
                  </Button>
                </div>
              )}
              
              <div className="flex justify-between gap-3 mt-6">
                <Button onClick={() => setCurrentStep(1)} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              </div>
            </CardContent>
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
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
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
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New York</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
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
                    placeholder="https://yourdomain.com/api/webhook/whatsapp"
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