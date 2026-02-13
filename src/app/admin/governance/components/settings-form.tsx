"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateSystemSettings } from "../actions";
import { Globe } from "lucide-react";
import { useState } from "react";

interface SettingsFormProps {
    initialSettings: {
        customDomain?: string | null;
        brandColor?: string | null;
    };
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            customDomain: initialSettings.customDomain || "app.wafiz.com",
            brandColor: initialSettings.brandColor || "#2563EB",
        },
    });

    const brandColor = watch("brandColor");

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const result = await updateSystemSettings(data);
            if (result.success) {
                toast.success("Settings updated successfully");
            } else {
                toast.error("Failed to update settings");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Globe size={20} className="text-blue-500" />
                    Whitelabel Configuration
                </h3>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Custom Domain CNAME</label>
                    <input
                        {...register("customDomain")}
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2"
                        placeholder="app.wafiz.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Brand Color</label>
                    <div className="flex gap-2 mt-1">
                        <input
                            type="color"
                            {...register("brandColor")}
                            className="h-10 w-10 border-none p-0 rounded-md cursor-pointer"
                        />
                        <input
                            type="text"
                            {...register("brandColor")}
                            className="block w-full border-gray-300 rounded-md shadow-sm border p-2"
                            placeholder="#2563EB"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Branding"}
                </button>
            </div>
        </form>
    );
}
