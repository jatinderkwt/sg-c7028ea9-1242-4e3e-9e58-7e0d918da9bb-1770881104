'use client'

import { useState } from 'react'
import { savePlan, deletePlan } from '@/actions/plans'
import { Plus, Trash2, Edit2, Check, X, MoveUp, MoveDown } from 'lucide-react'
import { toast } from 'sonner'

export function PlanManager({ initialPlans }: { initialPlans: any[] }) {
    const [plans, setPlans] = useState(initialPlans)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [formData, setFormData] = useState<any>({
        name: '',
        description: '',
        pricingMonthly: 0,
        maxNumbers: 1,
        maxAgents: 2,
        maxContacts: 1000,
        features: [''],
        isFeatured: false,
        isActive: true,
        displayOrder: 0
    })

    const handleEdit = (plan: any) => {
        setEditingId(plan.id)
        setFormData({
            ...plan,
            features: plan.features.length > 0 ? plan.features : ['']
        })
    }

    const handleSave = async () => {
        try {
            const dataToSave = {
                ...formData,
                pricingMonthly: Number(formData.pricingMonthly),
                maxNumbers: Number(formData.maxNumbers),
                maxAgents: Number(formData.maxAgents),
                maxContacts: Number(formData.maxContacts),
                features: formData.features.filter((f: string) => f.trim() !== '')
            }
            await savePlan(dataToSave)
            toast.success('Plan saved successfully')
            setEditingId(null)
            setIsAdding(false)
            // Note: In a real app, we'd use useTransition or similar but for now we expect revalidatePath to handle it on reload or we update local state
            window.location.reload()
        } catch (error) {
            toast.error('Failed to save plan')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this plan?')) return
        try {
            await deletePlan(id)
            toast.success('Plan deleted')
            window.location.reload()
        } catch (error) {
            toast.error('Failed to delete plan')
        }
    }

    const addFeature = () => {
        setFormData({ ...formData, features: [...formData.features, ''] })
    }

    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...formData.features]
        newFeatures[index] = value
        setFormData({ ...formData, features: newFeatures })
    }

    const removeFeature = (index: number) => {
        const newFeatures = formData.features.filter((_: any, i: number) => i !== index)
        setFormData({ ...formData, features: newFeatures.length > 0 ? newFeatures : [''] })
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Manage Subscription Plans</h2>
                {!isAdding && !editingId && (
                    <button
                        onClick={() => {
                            setIsAdding(true)
                            setFormData({
                                name: '',
                                description: '',
                                pricingMonthly: 29,
                                maxNumbers: 1,
                                maxAgents: 2,
                                maxContacts: 1000,
                                features: [''],
                                isFeatured: false,
                                isActive: true,
                                displayOrder: plans.length
                            })
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                    >
                        <Plus size={18} /> Add New Plan
                    </button>
                )}
            </div>

            {(isAdding || editingId) && (
                <div className="bg-white p-6 rounded-xl border-2 border-blue-100 shadow-sm space-y-4 animate-fadeIn">
                    <h3 className="text-lg font-bold text-gray-800">{isAdding ? 'Create New Plan' : 'Edit Plan'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Plan Name</label>
                            <input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                                placeholder="e.g. Starter"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Monthly Price ($)</label>
                            <input
                                type="number"
                                value={formData.pricingMonthly}
                                onChange={e => setFormData({ ...formData, pricingMonthly: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                            <input
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                                placeholder="Short catchphrase"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp Numbers</label>
                            <input
                                type="number"
                                value={formData.maxNumbers}
                                onChange={e => setFormData({ ...formData, maxNumbers: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Max Agents</label>
                            <input
                                type="number"
                                value={formData.maxAgents}
                                onChange={e => setFormData({ ...formData, maxAgents: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Max Contacts</label>
                            <input
                                type="number"
                                value={formData.maxContacts}
                                onChange={e => setFormData({ ...formData, maxContacts: e.target.value })}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div className="flex items-center gap-4 pt-6">
                            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                Featured?
                            </label>
                            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-green-600 rounded"
                                />
                                Active
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Features</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {formData.features.map((feature: string, idx: number) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        value={feature}
                                        onChange={e => updateFeature(idx, e.target.value)}
                                        className="flex-1 p-2 border rounded-lg text-sm"
                                        placeholder="Feature description"
                                    />
                                    <button
                                        onClick={() => removeFeature(idx)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addFeature}
                            className="text-sm text-blue-600 font-bold flex items-center gap-1 hover:underline"
                        >
                            <Plus size={14} /> Add Feature
                        </button>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            onClick={() => { setEditingId(null); setIsAdding(false); }}
                            className="px-4 py-2 text-gray-500 font-medium hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md"
                        >
                            Save Plan
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.length === 0 && !isAdding && (
                    <div className="col-span-full p-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-400">No plans created yet. Click "Add New Plan" to start.</p>
                    </div>
                )}
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`bg-white rounded-2xl border-2 transition-all group overflow-hidden ${plan.isFeatured ? 'border-blue-500 shadow-lg scale-105 z-10' : 'border-gray-100 hover:border-gray-200 shadow-sm'}`}
                    >
                        {plan.isFeatured && (
                            <div className="bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest text-center py-1">
                                Most Popular
                            </div>
                        )}
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                    <p className="text-xs text-gray-500">{plan.description}</p>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(plan)} className="p-1.5 text-gray-400 hover:text-blue-600 transition"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(plan.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <div className="mb-6">
                                <span className="text-4xl font-black text-gray-900">${plan.pricingMonthly}</span>
                                <span className="text-gray-500 text-sm ml-1">/mo</span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-xs border-b pb-2">
                                    <span className="text-gray-500 font-medium">WhatsApp Numbers</span>
                                    <span className="font-bold">{plan.maxNumbers}</span>
                                </div>
                                <div className="flex justify-between text-xs border-b pb-2">
                                    <span className="text-gray-500 font-medium">Agents Pool</span>
                                    <span className="font-bold">{plan.maxAgents}</span>
                                </div>
                                <div className="flex justify-between text-xs border-b pb-2">
                                    <span className="text-gray-500 font-medium">Contact Limit</span>
                                    <span className="font-bold">{plan.maxContacts.toLocaleString()}</span>
                                </div>
                            </div>

                            <ul className="space-y-2">
                                {plan.features.slice(0, 4).map((f: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                        <Check size={14} className="text-green-500 shrink-0" />
                                        <span className="truncate">{f}</span>
                                    </li>
                                ))}
                                {plan.features.length > 4 && (
                                    <li className="text-xs text-gray-400 italic">+{plan.features.length - 4} more features</li>
                                )}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
