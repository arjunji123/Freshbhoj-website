"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, X } from "lucide-react";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "How it works", href: "/#problem-fix" },
  { label: "Verified", href: "/#verified" },
  { label: "Features", href: "/#features" },
  { label: "Contact", href: "/contact-us" },
] as const;

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock page scroll while the mobile sheet is open
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  // Transparent-on-teal only on the home hero; every other page (and any scrolled state) uses the light glass bar.
  const onDark = pathname === "/" && !scrolled && !menuOpen;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : !href.includes("#") && pathname === href);

  return (
    <>
      <header className="fixed top-3 md:top-4 inset-x-0 z-[100] px-3 md:px-6 pointer-events-none">
        <div
          className={`pointer-events-auto mx-auto max-w-6xl flex items-center justify-between gap-3 rounded-full pl-5 pr-2 py-2 transition-all duration-300 border ${
            onDark
              ? "bg-white/10 backdrop-blur-xl border-white/25"
              : "bg-white/85 backdrop-blur-xl border-slate-200/70 shadow-[0_10px_40px_-12px_rgba(8,127,120,0.35)]"
          }`}
        >
          <Link href="/" aria-label="FreshBhoj home" className="shrink-0">
            <Image
              src={onDark ? "/FreshBhoj.svg" : "/freshbhoj-red-new.svg"}
              alt="FreshBhoj"
              width={160}
              height={44}
              priority
              className="h-8 md:h-9 w-auto object-contain"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            {LINKS.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                    active
                      ? onDark
                        ? "bg-white text-[#087F78]"
                        : "bg-[#087F78]/10 text-[#087F78]"
                      : onDark
                        ? "text-white/85 hover:text-white hover:bg-white/10"
                        : "text-slate-600 hover:text-[#087F78] hover:bg-[#087F78]/5"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/partner/login"
              className={`hidden md:inline-flex px-5 py-2.5 rounded-full text-sm font-bold border transition-colors ${
                onDark ? "text-white border-white/35 hover:bg-white/10" : "text-[#087F78] border-[#087F78]/25 hover:bg-[#087F78]/5"
              }`}
            >
              Partner Login
            </Link>
            <Link
              href="/pre-register"
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-extrabold bg-[#FFC21A] text-[#0D1B1E] shadow-[0_8px_20px_-8px_rgba(255,194,26,0.9)] hover:scale-105 active:scale-95 transition-transform"
            >
              Pre-register <ArrowUpRight size={15} />
            </Link>
            <button
              className={`lg:hidden w-11 h-11 rounded-full flex items-center justify-center transition-colors ${onDark ? "bg-white/15 text-white" : "bg-[#087F78]/10 text-[#087F78]"}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X size={20} />
              ) : (
                <span className="flex flex-col gap-[5px]">
                  <span className="block w-5 h-[2px] rounded-full bg-current" />
                  <span className="block w-3.5 h-[2px] rounded-full bg-current ml-auto" />
                  <span className="block w-5 h-[2px] rounded-full bg-current" />
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet sheet */}
      <div
        className={`lg:hidden fixed inset-0 z-[90] transition-all duration-300 ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        aria-hidden={!menuOpen}
      >
        <button className="absolute inset-0 bg-[#0D1B1E]/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} aria-label="Close menu" tabIndex={-1} />
        <div
          className={`absolute top-0 inset-x-0 rounded-b-[2.5rem] bg-white pt-24 pb-8 px-6 shadow-2xl transition-transform duration-300 ${menuOpen ? "translate-y-0" : "-translate-y-8"}`}
        >
          <nav className="flex flex-col gap-1 mb-6">
            {LINKS.map((l, i) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-xl font-extrabold transition-colors ${
                  isActive(l.href) ? "bg-[#087F78]/10 text-[#087F78]" : "text-[#0D1B1E] hover:bg-slate-50"
                }`}
                style={{ transitionDelay: menuOpen ? `${i * 30}ms` : "0ms" }}
              >
                {l.label}
                <ArrowUpRight size={18} className="text-slate-300" />
              </Link>
            ))}
          </nav>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/partner/login" onClick={() => setMenuOpen(false)} className="text-center rounded-full border-2 border-[#087F78]/25 text-[#087F78] font-bold py-3.5">
              Partner Login
            </Link>
            <Link href="/pre-register" onClick={() => setMenuOpen(false)} className="text-center rounded-full bg-[#FFC21A] text-[#0D1B1E] font-extrabold py-3.5">
              Pre-register
            </Link>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6 text-xs font-semibold text-slate-400">
            <Link href="/privacy-policy" onClick={() => setMenuOpen(false)} className="hover:text-[#087F78]">Privacy Policy</Link>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <Link href="/terms-of-service" onClick={() => setMenuOpen(false)} className="hover:text-[#087F78]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
