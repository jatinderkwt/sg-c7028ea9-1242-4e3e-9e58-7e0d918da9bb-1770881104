import React from "react";
import { SEO } from "@/components/SEO";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function ConversationsPage() {
  return (
    <>
      <SEO title="Conversations - Dashboard" />
      <DashboardLayout>
        <h1 className="text-3xl font-bold mb-8">Conversations</h1>
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            Conversation management feature coming soon
          </CardContent>
        </Card>
      </DashboardLayout>
    </>
  );
}
