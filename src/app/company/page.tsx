"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { usePageReady } from "@/contexts/LoadingContext";

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

const companyInfo = [
    { label: "会社名", value: "株式会社HINDWILL", subValue: "英文名: HINDWILL Inc." },
    { label: "代表取締役", value: "橋爪 拓海" },
    { label: "設立", value: "2026年" },
    { label: "資本金", value: "500万円" },
    { label: "事業内容", value: "セールスコンサルティング事業" },
    { label: "所在地", value: "東京都" },
    { label: "連絡先", value: "takumi.hashizume@hindwill.com" },
];

export default function CompanyPage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);
    const { isPageReady } = usePageReady();

    useEffect(() => {
        if (isPageReady) {
            setAnimationKey(prev => prev + 1);
            const timer = setTimeout(() => {
                setIsLoaded(true);
            }, 50);
            return () => clearTimeout(timer);
        } else {
            setIsLoaded(false);
        }
    }, [isPageReady]);

    const title = "COMPANY";

    return (
        <>
            <Header />
            <main className="overflow-x-hidden">
                {/* Hero */}
                <section className="h-[35vh] md:h-[40vh] flex items-center relative" data-header-theme="dark">
                    {/* 背景画像 */}
                    <div className="absolute inset-0">
                        <img
                            src="/images/japanese_people/pirate_ship.jpg"
                            alt="絶景"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/70 to-black/60" />
                    </div>
                    <div className="text-left text-white relative z-10 px-6 md:px-16">
                        <h1 key={animationKey} className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 overflow-hidden">
                            {title.split("").map((char, index) => (
                                <span
                                    key={index}
                                    className={`inline-block transition-all duration-500 ${
                                        isLoaded
                                            ? "opacity-100 translate-x-0"
                                            : "opacity-0 translate-x-8"
                                    }`}
                                    style={{
                                        transitionDelay: `${(title.length - 1 - index) * 0.08}s`,
                                    }}
                                >
                                    {char}
                                </span>
                            ))}
                        </h1>
                        <p
                            className={`text-sm md:text-lg text-gray-300 transition-all duration-700 ${
                                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                            style={{ transitionDelay: "0.7s" }}
                        >
                            会社概要
                        </p>
                    </div>
                    {/* Breadcrumb */}
                    <div className="absolute bottom-6 md:bottom-8 left-6 md:left-16 z-10">
                        <div className="flex items-center gap-2 text-[10px] md:text-xs text-white/70">
                            <Link href="/" className="hover:text-white transition-colors">
                                <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                </svg>
                            </Link>
                            <span>&gt;</span>
                            <Link href="/" className="hover:text-white transition-colors">HINDWILL</Link>
                            <span>&gt;</span>
                            <span className="text-white">会社概要</span>
                        </div>
                    </div>
                </section>

                {/* Company Info Table */}
                <section className="py-12 md:py-20 bg-white">
                    <div className="max-w-[900px] mx-auto px-6">
                        <AnimatedSection>
                            <div className="mb-8 md:mb-12">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-8 md:w-12 h-px bg-gray-600" />
                                    <p className="text-xs md:text-sm tracking-[0.2em] text-gray-800 font-medium">COMPANY PROFILE</p>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">会社情報</h2>
                            </div>
                        </AnimatedSection>

                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                            {companyInfo.map((item, index) => (
                                <AnimatedSection key={item.label} delay={index * 50}>
                                    <div className={`flex flex-col md:flex-row ${index !== companyInfo.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                        <div className="bg-gray-100 px-4 md:px-6 py-4 md:py-5 md:w-1/4 flex-shrink-0">
                                            <span className="font-bold text-sm md:text-base text-gray-800">{item.label}</span>
                                        </div>
                                        <div className="px-4 md:px-6 py-3 md:py-5 md:flex-1 bg-white">
                                            <p className="text-gray-700 text-sm md:text-base">{item.value}</p>
                                            {item.subValue && (
                                                <p className="text-gray-600 text-sm md:text-base mt-1">{item.subValue}</p>
                                            )}
                                        </div>
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Philosophy */}
                <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-[900px] mx-auto px-6">
                        <AnimatedSection>
                            <div className="mb-8 md:mb-12 text-center">
                                <div className="flex items-center justify-center gap-4 mb-4">
                                    <div className="w-8 md:w-12 h-px bg-gray-600" />
                                    <p className="text-xs md:text-sm tracking-[0.2em] text-gray-800 font-medium">PHILOSOPHY</p>
                                    <div className="w-8 md:w-12 h-px bg-gray-600" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">企業理念</h2>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection delay={100}>
                            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-gray-100">
                                <div className="text-center mb-6 md:mb-8">
                                    <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">Beyond the Technology.</h3>
                                </div>
                                <div className="max-w-[700px] mx-auto">
                                    <p className="text-gray-700 text-sm md:text-base leading-relaxed md:leading-loose text-center md:text-left">
                                        テクノロジーが届かない、最後の1マイルを。
                                    </p>
                                    <p className="text-gray-700 text-sm md:text-base leading-relaxed md:leading-loose mt-4 text-center md:text-left">
                                        効率や正解は、AIに譲ればいい。これからの時代、最後に価値を持つのは、人の心を震わせる「熱狂」だ。
                                        私たちは、人間だけが持つ熱量（ヒューマン・タッチ）で、AIには埋められない「ラストワンマイル」を繋いでいく。
                                    </p>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>

                {/* CEO */}
                <section className="py-12 md:py-20 bg-white">
                    <div className="max-w-[900px] mx-auto px-6">
                        <AnimatedSection>
                            <div className="mb-8 md:mb-12 text-center">
                                <div className="flex items-center justify-center gap-4 mb-4">
                                    <div className="w-8 md:w-12 h-px bg-gray-600" />
                                    <p className="text-xs md:text-sm tracking-[0.2em] text-gray-800 font-medium">REPRESENTATIVE</p>
                                    <div className="w-8 md:w-12 h-px bg-gray-600" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">代表紹介</h2>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection delay={100}>
                            <div className="bg-gray-50 rounded-xl p-6 md:p-10">
                                <div className="text-center md:text-left">
                                        <p className="text-xs md:text-sm text-gray-800 font-medium mb-1">代表取締役</p>
                                        <h3 className="text-xl md:text-3xl font-bold mb-1 text-gray-900">橋爪 拓海</h3>
                                        <p className="text-gray-500 text-xs md:text-sm mb-4 md:mb-6">Takumi Hashizume</p>
                                        <div className="text-gray-700 text-sm md:text-base leading-relaxed md:leading-loose space-y-3">
                                            <p>1995年生まれ。東京都出身。</p>
                                            <p>
                                                大学在学中にアメリカに留学後、2019年に株式会社日本通信サービス（現:株式会社CONSCIENCE）に新卒で入社。
                                                パラリーガル事業マネージャーに就任し、総勢200名の事業を牽引。
                                            </p>
                                            <p>
                                                その後、数多くの組織変革を主導した経験を経て、株式会社HINDWILLを設立。
                                                人にしかできないことで、ビジネスの勝ち筋をデザインする。
                                            </p>
                                        </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>

                {/* Access / Contact */}
                <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-[900px] mx-auto px-6">
                        <AnimatedSection>
                            <div className="mb-8 md:mb-12 text-center">
                                <div className="flex items-center justify-center gap-4 mb-4">
                                    <div className="w-8 md:w-12 h-px bg-gray-600" />
                                    <p className="text-xs md:text-sm tracking-[0.2em] text-gray-800 font-medium">CONTACT</p>
                                    <div className="w-8 md:w-12 h-px bg-gray-600" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">お問い合わせ</h2>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection delay={100}>
                            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-gray-100">
                                <div className="flex items-start gap-4 justify-center">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm md:text-base mb-1">メール</p>
                                        <a href="mailto:takumi.hashizume@hindwill.com" className="text-gray-600 text-sm md:text-base hover:text-gray-800 transition-colors break-all">
                                            takumi.hashizume@hindwill.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>

                {/* CTA */}
                <section className="pt-4 pb-12 md:pt-5 md:pb-20 bg-white">
                    <div className="max-w-[800px] mx-auto px-6 text-center">
                        <AnimatedSection>
                            <Link
                                href="/contact"
                                className="inline-block border border-gray-800 text-gray-800 px-5 md:px-16 py-3 md:py-5 text-[11px] md:text-sm tracking-wider hover:bg-gray-800 hover:text-white transition-colors duration-300"
                            >
                                お問い合わせフォームへ →
                            </Link>
                        </AnimatedSection>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
