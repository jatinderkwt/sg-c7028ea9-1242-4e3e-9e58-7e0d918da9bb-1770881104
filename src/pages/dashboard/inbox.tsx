import React from "react";
import { SEO } from "@/components/SEO";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, MoreVertical } from "lucide-react";

export default function InboxPage() {
  const conversations = [
    {
      id: 1,
      name: "John Doe",
      number: "+1 (555) 123-4567",
      lastMessage: "Thanks for the update!",
      timestamp: "5 min ago",
      unread: 2,
    },
    {
      id: 2,
      name: "Jane Smith",
      number: "+1 (555) 987-6543",
      lastMessage: "Can you help with my order?",
      timestamp: "1 hour ago",
      unread: 0,
    },
    {
      id: 3,
      name: "Mike Johnson",
      number: "+1 (555) 456-7890",
      lastMessage: "Perfect, see you tomorrow",
      timestamp: "2 hours ago",
      unread: 1,
    },
  ];

  return (
    <>
      <SEO title="Inbox - Dashboard" />
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Inbox</h1>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              New Conversation
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input placeholder="Search conversations..." className="pl-10" />
          </div>

          {/* Conversations List */}
          <div className="space-y-2">
            {conversations.map((conv) => (
              <Card key={conv.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-emerald-700">{conv.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{conv.name}</p>
                        <p className="text-sm text-gray-500">{conv.number}</p>
                        <p className="text-sm text-gray-700 mt-1">{conv.lastMessage}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{conv.timestamp}</p>
                      {conv.unread > 0 && (
                        <span className="mt-2 inline-block bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
