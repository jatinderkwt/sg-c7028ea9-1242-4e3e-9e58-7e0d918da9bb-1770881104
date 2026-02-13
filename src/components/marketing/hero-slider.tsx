'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Slide {
    image: string
    title: string
    sub: string
    cta: string
    link: string
}

export function HeroSlider({ slides }: { slides: Slide[] }) {
    const [current, setCurrent] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)

    const nextSlide = useCallback(() => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
        setTimeout(() => setIsTransitioning(false), 500)
    }, [isTransitioning, slides.length])

    const prevSlide = () => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
        setTimeout(() => setIsTransitioning(false), 500)
    }

    useEffect(() => {
        const timer = setInterval(nextSlide, 6000)
        return () => clearInterval(timer)
    }, [nextSlide])

    if (!slides || slides.length === 0) return null

    return (
        <section className="relative h-[600px] md:h-[750px] overflow-hidden bg-gray-900">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Image with Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                        <div className={`max-w-2xl transition-all duration-700 delay-300 transform ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}>
                            <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                                {slide.title}
                            </h1>
                            <p className="text-lg md:text-2xl text-gray-200 mb-10 leading-relaxed font-medium">
                                {slide.sub}
                            </p>
                            <div className="flex gap-4">
                                <Link
                                    href={slide.link}
                                    className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-2xl transition transform hover:-translate-y-1 shadow-lg shadow-blue-600/20"
                                >
                                    {slide.cta}
                                </Link>
                                <Link
                                    href="#features"
                                    className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold hover:bg-white/20 transition"
                                >
                                    Explore More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/5 hover:bg-white/20 text-white backdrop-blur-sm transition-all border border-white/10"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/5 hover:bg-white/20 text-white backdrop-blur-sm transition-all border border-white/10"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {slides.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`h-1.5 transition-all duration-300 rounded-full ${index === current ? 'w-8 bg-blue-500' : 'w-2 bg-white/30 hover:bg-white/50'
                                }`}
                        ></button>
                    ))}
                </div>
            )}
        </section>
    )
}
