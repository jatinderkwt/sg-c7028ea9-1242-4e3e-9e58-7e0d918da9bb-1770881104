'use client'

import { createCompany } from "@/actions/admin"
import { useFormStatus } from "react-dom"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
            {pending ? 'Creating...' : 'Create Company'}
        </button>
    )
}

export default function NewCompanyPage() {
    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Company</h1>

            <form action={createCompany} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    />
                </div>

                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">URL Slug (unique)</label>
                    <input
                        type="text"
                        name="slug"
                        id="slug"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        placeholder="e.g. acme-corp"
                    />
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="adminName" className="block text-sm font-medium text-gray-700">Admin Name</label>
                            <input
                                type="text"
                                name="adminName"
                                id="adminName"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">Admin Email</label>
                            <input
                                type="email"
                                name="adminEmail"
                                id="adminEmail"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">Admin Password</label>
                            <input
                                type="password"
                                name="adminPassword"
                                id="adminPassword"
                                required
                                minLength={8}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <SubmitButton />
                </div>
            </form>
        </div>
    )
}
