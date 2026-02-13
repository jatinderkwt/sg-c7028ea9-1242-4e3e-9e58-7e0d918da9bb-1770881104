'use server'

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSystemSettings() {
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

        return { success: true, data: settings };
    } catch (error) {
        console.error("Failed to fetch system settings:", error);
        return { success: false, error: "Failed to fetch settings" };
    }
}

export async function updateSystemSettings(data: { customDomain: string; brandColor: string }) {
    try {
        const settings = await db.systemSettings.findFirst();

        if (!settings) {
            await db.systemSettings.create({
                data: {
                    platformName: "WaFiz",
                    customDomain: data.customDomain,
                    brandColor: data.brandColor,
                }
            });
        } else {
            await db.systemSettings.update({
                where: { id: settings.id },
                data: {
                    customDomain: data.customDomain,
                    brandColor: data.brandColor,
                }
            });
        }

        revalidatePath("/admin/governance");
        return { success: true };
    } catch (error) {
        console.error("Failed to update system settings:", error);
        return { success: false, error: "Failed to update settings" };
    }
}

export async function getAuditLogs() {
    try {
        const logs = await db.systemAudit.findMany({
            orderBy: { createdAt: "desc" },
            take: 20
        });

        // If no logs exist, return mock data for now, or empty array
        // But for the purpose of "configurable", we might want to return real data if available.
        // Let's return the real logs.

        return { success: true, data: logs };
    } catch (error) {
        console.error("Failed to fetch audit logs:", error);
        return { success: false, error: "Failed to fetch audit logs", data: [] };
    }
}
