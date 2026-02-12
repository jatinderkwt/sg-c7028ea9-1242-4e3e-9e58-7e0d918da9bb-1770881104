import React from "react";
import { SEO } from "@/components/SEO";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function DealsPage() {
  return (
    <>
      <SEO title="Deals - Dashboard" />
      <DashboardLayout>
        <h1 className="text-3xl font-bold mb-8">Deals</h1>
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            CRM deals feature coming soon
          </CardContent>
        </Card>
      </DashboardLayout>
    </>
  );
}
