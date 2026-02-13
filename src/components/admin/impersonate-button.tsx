'use client'

import { signIn } from "next-auth/react"
import { useState } from "react"
import { LogIn } from "lucide-react"

export function ImpersonateButton({ adminId, targetUserId }: { adminId: string, targetUserId: string }) {
    const [loading, setLoading] = useState(false)

    const handleImpersonate = async () => {
        try {
            setLoading(true)
            const result = await signIn("impersonation", {
                adminId,
                targetUserId,
                redirect: true,
                callbackUrl: "/dashboard"
            })
        } catch (error) {
            console.error("Impersonation failed", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleImpersonate}
            disabled={loading}
            className="text-blue-600 hover:text-blue-900 flex items-center gap-1 text-sm font-medium disabled:opacity-50"
        >
            <LogIn size={14} />
            {loading ? 'Switching...' : 'Log in as'}
        </button>
    )
}
