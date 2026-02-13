'use client'

import { useState } from 'react'
import { saveCmsContent } from '@/actions/cms'
import { Save, Loader2, Globe, Layout, Palette, FileText } from 'lucide-react'
import { toast } from 'sonner'

export function CmsManager({ initialContent }: { initialContent: any[] }) {
    const [loadingKey, setLoadingKey] = useState<string | null>(null)
    const [contentMap, setContentMap] = useState<Record<string, any>>(
        initialContent.reduce((acc, item) => ({ ...acc, [item.key]: item }), {})
    )

    const handleSave = async (key: string, value: string, type: string = 'text') => {
        setLoadingKey(key)
        try {
            await saveCmsContent(key, value, type)
            toast.success(`Updated ${key} successfully`)
        } catch (error) {
            toast.error(`Failed to update ${key}`)
        } finally {
            setLoadingKey(null)
        }
    }

    const updateMap = (key: string, value: string) => {
        setContentMap(prev => ({
            ...prev,
            [key]: { ...(prev[key] || {}), content: value }
        }))
    }

    const renderCard = (title: string, key: string, description: string, type: string = 'text', rows: number = 2) => {
        const item = contentMap[key] || { content: '' }
        const isLoading = loadingKey === key

        return (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            {type === 'json' ? <Layout size={16} className="text-blue-500" /> : <FileText size={16} className="text-emerald-500" />}
                            {title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{description}</p>
                    </div>
                    <button
                        onClick={() => handleSave(key, item.content, type)}
                        disabled={isLoading}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    </button>
                </div>

                {type === 'json' ? (
                    <textarea
                        value={item.content}
                        onChange={e => updateMap(key, e.target.value)}
                        rows={rows}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                ) : (
                    <textarea
                        value={item.content}
                        onChange={e => updateMap(key, e.target.value)}
                        rows={rows}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                )}
            </div>
        )
    }

    return (
        <div className="space-y-12">
            {/* Announcement Banner */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Palette size={20} /></div>
                    <h2 className="text-xl font-extrabold text-gray-900">Announcement Bar (Sale & Offers)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderCard("Banner Active", "landing_banner_active", "Type 'true' to show, 'false' to hide")}
                    {renderCard("Banner Text", "landing_banner_text", "Offer text (e.g. Flash Sale: 20% Off!)")}
                    {renderCard("Banner Link", "landing_banner_link", "URL when clicking the banner")}
                </div>
            </section>

            {/* Landing Page Content */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Globe size={20} /></div>
                    <h2 className="text-xl font-extrabold text-gray-900">Landing Page (Marketing)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderCard("Hero Carousel Slides", "landing_hero_slides", "JSON array of slides {image, title, sub, cta, link}", 'json', 10)}
                    {renderCard("Hero Headline", "landing_hero_headline", "Main catchphrase at the top of the page")}
                    {renderCard("Hero Subheadline", "landing_hero_subheadline", "Supporting text below the main headline", 'text', 4)}
                    {renderCard("Hero CTA Text", "landing_hero_cta_text", "Text on the primary button")}
                    {renderCard("Features Section Title", "landing_features_title", "Header for the features grid")}
                    {renderCard("Features Section Sub", "landing_features_sub", "Supporting text for features")}
                    {renderCard("CTA Section Headline", "landing_footer_cta_headline", "Final call to action before the footer")}
                </div>
            </section>

            {/* Custom JSON Controls */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Palette size={20} /></div>
                    <h2 className="text-xl font-extrabold text-gray-900">Advanced Data Blocks (JSON)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderCard(
                        "Solutions List",
                        "landing_solutions_json",
                        "JSON array of solution items {title, description, icon}",
                        'json',
                        10
                    )}
                    {renderCard(
                        "Features List",
                        "landing_features_json",
                        "JSON array of feature items {title, description, icon}",
                        'json',
                        10
                    )}
                </div>
            </section>
        </div>
    )
}
