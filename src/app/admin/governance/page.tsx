import { Lock, Eye } from "lucide-react";
import { db } from "@/lib/db";
import SettingsForm from "./components/settings-form";

// Helper to get settings or create default
async function getSettings() {
    try {
        let settings = await db.systemSettings.findFirst();
        if (!settings) {
            settings = await db.systemSettings.create({
                data: {
                    platformName: "WaFiz",
                    defaultCurrency: "USD",
                    defaultTimezone: "UTC",
                    customDomain: "app.wafiz.com",
                    brandColor: "#2563EB",
                }
            });
        }
        return settings;
    } catch (error) {
        console.error("Database error:", error);
        return null; // Return null if DB fails
    }
}

async function getAuditLogs() {
    try {
        const logs = await db.systemAudit.findMany({
            orderBy: { createdAt: "desc" },
            take: 20
        });
        return logs;
    } catch (error) {
        console.error("Database error:", error);
        return [];
    }
}

export default async function GovernancePage() {
    const settings = await getSettings();
    const logs = await getAuditLogs();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Platform Governance</h1>

            {/* Audit Logs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                        <Eye size={20} className="text-gray-500" />
                        Super Admin Audit Logs
                    </h3>
                    <button className="text-sm text-blue-600 hover:text-blue-800">Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {logs && logs.length > 0 ? (
                                logs.map((log) => (
                                    <tr key={log.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {log.actorName || log.actorId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {log.action}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {log.targetId || "-"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No audit logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Whitelabel Settings - Configurable Form */}
                <SettingsForm initialSettings={settings || {}} />

                {/* RBAC */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <Lock size={20} className="text-red-500" />
                            Admin Access Control
                        </h3>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-gray-500 mb-4">Manage permissions for your platform support staff and engineers.</p>
                        <button className="w-full py-2 border border-blue-200 text-blue-600 bg-blue-50 rounded-md text-sm font-medium hover:bg-blue-100">
                            Manage Admin Roles
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
