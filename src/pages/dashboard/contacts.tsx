import React from "react";
import { SEO } from "@/components/SEO";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Mail, Phone, Calendar } from "lucide-react";

export default function ContactsPage() {
  const contacts = [
    { id: 1, name: "John Doe", phone: "+1 (555) 123-4567", email: "john@example.com", tags: ["VIP"] },
    { id: 2, name: "Jane Smith", phone: "+1 (555) 987-6543", email: "jane@example.com", tags: ["Support"] },
    { id: 3, name: "Mike Johnson", phone: "+1 (555) 456-7890", email: "mike@example.com", tags: [] },
  ];

  return (
    <>
      <SEO title="Contacts - Dashboard" />
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Contacts</h1>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input placeholder="Search contacts..." className="pl-10" />
          </div>

          {/* Contacts Table */}
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Tags</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">{contact.name}</td>
                      <td className="px-6 py-4 flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {contact.phone}
                      </td>
                      <td className="px-6 py-4 flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {contact.email}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {contact.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" className="text-sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}
