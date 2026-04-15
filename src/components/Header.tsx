// src/components/Header.jsx
import { useState } from "react";
import logo from "../assets/white-logo.png";

export default function Header() {
    const [open, setOpen] = useState(false);

    const links = [
        { href: "/home", label: "Home" },
        { href: "/DLM", label: "Late Models" },
        { href: "/NASCAR", label: "NASCAR" },
        { href: "/DSC", label: "Sprint Cars" },
        { href: "/photos", label: "Photos" },
        { href: "/other", label: "Other" },
    ];

    return (
        <>
            <nav className="sticky top-0 z-50 w-full bg-stone-900/95 text-white backdrop-blur">
                <div className="mx-auto max-w-screen-xl px-4">
                    <div className="flex items-center justify-between gap-4 py-3">
                        <a href="/home" className="shrink-0 flex items-center gap-2">
                            <img src={logo} alt="Motorsports Report" className="h-10 md:h-16" />
                        </a>

                        {/* Desktop links */}
                        <div className="hidden md:flex items-center gap-6 text-base">
                            {links.map((l) => (
                                <a
                                    key={l.href}
                                    href={l.href}
                                    className="hover:text-red-400 transition-colors"
                                >
                                    {l.label}
                                </a>
                            ))}
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            type="button"
                            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label="Open menu"
                            aria-expanded={open}
                            onClick={() => setOpen(true)}
                        >
                            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile drawer + overlay */}
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
                onClick={() => setOpen(false)}
                aria-hidden={!open}
            />

            {/* Drawer */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-stone-900 text-white shadow-xl transition-transform md:hidden
        ${open ? "translate-x-0" : "-translate-x-full"}`}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800">
                    <img src={logo} alt="Motorsports Report" className="h-10" />
                    <button
                        type="button"
                        className="rounded-lg p-2 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="Close menu"
                        onClick={() => setOpen(false)}
                    >
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" d="M6 6l12 12M18 6l-12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="px-2 py-2">
                    {links.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            className="block rounded-lg px-4 py-3 text-lg hover:bg-stone-800 hover:text-red-400"
                            onClick={() => setOpen(false)}
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>
            </aside>
        </>
    );
}
