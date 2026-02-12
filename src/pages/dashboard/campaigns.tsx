import React from "react";
import { SEO } from "@/components/SEO";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CampaignsPage() {
  return (
    <>
      <SEO title="Campaigns - Dashboard" />
      <DashboardLayout>
        <h1 className="text-3xl font-bold mb-8">Campaigns</h1>
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            Campaign management feature coming soon
          </CardContent>
        </Card>
      </DashboardLayout>
    </>
  );
}
