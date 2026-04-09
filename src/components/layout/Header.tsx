"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { X, Mail } from "lucide-react";
import { Logo } from "@/components/common/Logo";

const MENU_ITEMS = [
    { en: "TOP", jp: "トップページ", href: "/" },
    { en: "WE ARE", jp: "何者？", href: "/weare" },
    { en: "BUSINESS", jp: "ビジネス", href: "/service" },
    { en: "COMPANY", jp: "会社概要", href: "/company" },
    { en: "FAQ", jp: "よくある質問", href: "/faq" },
    { en: "NEWS", jp: "お知らせ", href: "/news" },
];

export function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isOverDark, setIsOverDark] = useState(true);
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
    const menuVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const checkBackground = () => {
            // Get element at center of header position
            const headerY = 35; // half of header height (70px)
            const headerX = window.innerWidth / 2;

            // Temporarily hide header to get element behind it
            const header = document.querySelector('header');
            if (header) {
                const originalPointerEvents = header.style.pointerEvents;
                header.style.pointerEvents = 'none';

                const elementBehind = document.elementFromPoint(headerX, headerY);
                header.style.pointerEvents = originalPointerEvents;

                if (elementBehind) {
                    // Method 1: Use closest() to find ancestor with data-header-theme
                    const themedElement = elementBehind.closest('[data-header-theme]');
                    if (themedElement) {
                        const theme = themedElement.getAttribute('data-header-theme');
                        setIsOverDark(theme === 'dark');
                        return;
                    }

                    // Method 2: Check if inside a section with dark background image/video
                    const section = elementBehind.closest('section');
                    if (section) {
                        // Check for video
                        if (section.querySelector('video')) {
                            setIsOverDark(true);
                            return;
                        }
                        // Check for dark overlay divs (common pattern)
                        const overlay = section.querySelector('[class*="bg-gradient"]') ||
                            section.querySelector('[class*="bg-black"]') ||
                            section.querySelector('[class*="bg-gray-950"]');
                        if (overlay && section.querySelector('img')) {
                            setIsOverDark(true);
                            return;
                        }
                    }

                    // Method 3: Check computed styles going up the tree
                    let el: Element | null = elementBehind;
                    while (el && el !== document.body) {
                        const style = window.getComputedStyle(el);
                        const bg = style.backgroundColor;

                        // Check for backgrounds
                        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                            const match = bg.match(/\d+/g);
                            if (match) {
                                const [r, g, b] = match.map(Number);

                                // Check for orange backgrounds (use black text)
                                // Orange typically has high R, medium G, low B
                                if (r > 180 && g > 80 && g < 180 && b < 100) {
                                    setIsOverDark(false);
                                    return;
                                }

                                const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
                                if (luminance < 128) {
                                    setIsOverDark(true);
                                    return;
                                } else if (luminance > 200) {
                                    setIsOverDark(false);
                                    return;
                                }
                            }
                        }
                        el = el.parentElement;
                    }

                    // Fallback: Get computed background color
                    el = elementBehind;
                    let bgColor = 'rgb(255, 255, 255)';

                    while (el) {
                        const style = window.getComputedStyle(el);
                        const bg = style.backgroundColor;
                        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                            bgColor = bg;
                            break;
                        }
                        el = el.parentElement;
                    }

                    // Parse RGB values
                    const match = bgColor.match(/\d+/g);
                    if (match) {
                        const [r, g, b] = match.map(Number);
                        // Calculate luminance - dark if luminance is low
                        const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
                        setIsOverDark(luminance < 128);
                    }
                }
            }
        };

        checkBackground();
        const interval = setInterval(checkBackground, 100);
        window.addEventListener('scroll', checkBackground, { passive: true });

        return () => {
            clearInterval(interval);
            window.removeEventListener('scroll', checkBackground);
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    // Force-play menu background video when menu opens, matching FV (0.8x speed, muted)
    useEffect(() => {
        const video = menuVideoRef.current;
        if (!video) return;
        if (menuOpen) {
            video.muted = true;
            video.playbackRate = 0.8;
            video.play().catch(() => {
                // Retry on next frame in case the element was hidden
                requestAnimationFrame(() => {
                    video.play().catch(() => {});
                });
            });
        }
    }, [menuOpen]);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 h-[70px] flex items-center justify-between px-6 md:px-10">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 z-50">
                    <Logo variant={menuOpen || !isOverDark ? "dark" : "light"} />
                </Link>

                {/* Desktop Navigation */}
                <nav className={`hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 transition-opacity duration-300 ${menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    {[
                        { label: 'WE ARE', href: '/weare' },
                        { label: 'BUSINESS', href: '/service' },
                        { label: 'COMPANY', href: '/company' },
                        { label: 'FAQ', href: '/faq' },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`text-[15px] font-bold tracking-[0.1em] ${isOverDark ? 'text-white' : 'text-black'}`}
                            style={{
                                textDecoration: hoveredLink === item.label ? 'underline' : 'none',
                                textUnderlineOffset: '4px',
                            }}
                            onMouseEnter={() => setHoveredLink(item.label)}
                            onMouseLeave={() => setHoveredLink(null)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-3 z-50"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                >
                    {!menuOpen && (
                        <span className={`hidden md:block text-[15px] font-bold tracking-[0.1em] transition-colors duration-300 ${isOverDark ? 'text-white' : 'text-black'}`}>
                            MENU
                        </span>
                    )}
                    <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${menuOpen ? 'border-gray-400 hover:bg-gray-100' : isOverDark ? 'border-white/70 hover:bg-white/10' : 'border-black/70 hover:bg-black/10'}`}>
                        {menuOpen ? (
                            <X className="w-5 h-5 text-black" />
                        ) : (
                            <div className="flex flex-col gap-1.5">
                                <span className={`w-5 h-[1.5px] transition-colors duration-300 ${isOverDark ? 'bg-white' : 'bg-black'}`}></span>
                                <span className={`w-5 h-[1.5px] transition-colors duration-300 ${isOverDark ? 'bg-white' : 'bg-black'}`}></span>
                                <span className={`w-5 h-[1.5px] transition-colors duration-300 ${isOverDark ? 'bg-white' : 'bg-black'}`}></span>
                            </div>
                        )}
                    </div>
                </button>
            </header>

            {/* Full-screen Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-[#FAFAFA] flex flex-col md:flex-row transition-all duration-500 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            >
                {/* Video panel: top on mobile, left on desktop */}
                <div className="block w-full h-[40vh] md:w-1/2 md:h-full relative overflow-hidden flex-shrink-0">
                    <video
                        ref={menuVideoRef}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        disablePictureInPicture
                        disableRemotePlayback
                        controls={false}
                        tabIndex={-1}
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none select-none"
                        style={{
                            animation: "slowZoom 20s ease-in-out infinite alternate",
                        }}
                    >
                        <source src="/videos/hero-3.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                    {/* Wave divider — vertical on desktop only */}
                    <svg
                        className="hidden md:block absolute top-0 right-0 h-full w-48"
                        viewBox="0 0 150 1000"
                        preserveAspectRatio="none"
                    >
                        <path fill="#FAFAFA">
                            <animate
                                attributeName="d"
                                dur="5s"
                                repeatCount="indefinite"
                                values="
                                    M150,0 L150,1000 L80,1000 Q0,750 80,500 Q150,250 80,0 Z;
                                    M150,0 L150,1000 L80,1000 Q150,750 80,500 Q0,250 80,0 Z;
                                    M150,0 L150,1000 L80,1000 Q0,750 80,500 Q150,250 80,0 Z
                                "
                            />
                        </path>
                    </svg>
                </div>

                {/* Menu Content: bottom on mobile, right on desktop */}
                <div className="w-full flex-1 md:w-1/2 md:h-full md:flex-none flex flex-col min-h-0 overflow-y-auto">
                    <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-8 md:py-24">
                        {/* Main Navigation */}
                        <nav className="w-full">
                            <ul className="grid grid-cols-2 gap-x-8 gap-y-6">
                                {MENU_ITEMS.map((item, index) => (
                                    <li
                                        key={item.en}
                                        className={`transform transition-all duration-500 ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
                                        style={{ transitionDelay: menuOpen ? `${index * 60 + 150}ms` : '0ms' }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setMenuOpen(false)}
                                            className="group flex flex-col"
                                        >
                                            <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight group-hover:text-gray-800 transition-colors duration-300">
                                                {item.en}
                                            </span>
                                            <span className="text-xs text-gray-500 group-hover:text-gray-800 transition-colors duration-300">
                                                {item.jp}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Contact Button */}
                        <div
                            className={`mt-6 md:mt-12 transform transition-all duration-500 ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
                            style={{ transitionDelay: menuOpen ? '650ms' : '0ms' }}
                        >
                            <Link
                                href="/contact"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2 px-4 py-3 md:px-10 md:py-6 bg-white text-black border border-black hover:bg-black hover:text-white transition-colors duration-300 group"
                            >
                                <Mail className="w-3.5 h-3.5 md:w-5 md:h-5" />
                                <span className="text-xs md:text-base font-bold tracking-wider">お問い合わせはこちら</span>
                                <span className="ml-auto text-sm md:text-xl group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        className={`px-8 md:px-16 pb-8 flex justify-between items-end transform transition-all duration-500 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                        style={{ transitionDelay: menuOpen ? '750ms' : '0ms' }}
                    >
                        <span className="text-gray-400 text-xs">© HINDWILL Inc.</span>
                        <div className="flex gap-4">
                            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center group">
                                <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center group">
                                <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center group">
                                <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
