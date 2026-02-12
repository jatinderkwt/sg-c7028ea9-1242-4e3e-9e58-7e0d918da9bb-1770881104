import React from "react";
import { SEO } from "@/components/SEO";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, MessageSquare } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <>
      <SEO title="Analytics - Dashboard" />
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Analytics</h1>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: "Total Messages", value: "12,345", icon: MessageSquare, color: "text-blue-600" },
              { label: "Delivery Rate", value: "98.5%", icon: TrendingUp, color: "text-green-600" },
              { label: "Avg Response Time", value: "2.3 min", icon: BarChart3, color: "text-purple-600" },
              { label: "Customer Satisfaction", value: "4.8/5", icon: TrendingUp, color: "text-emerald-600" },
            ].map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <Card key={idx}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.label}</p>
                        <p className="text-2xl font-bold mt-2">{metric.value}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${metric.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Message Volume Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-500">
                Chart will be displayed here
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agent Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Agent 1", "Agent 2", "Agent 3"].map((agent) => (
                  <div key={agent}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{agent}</span>
                      <span className="text-sm font-bold">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}
