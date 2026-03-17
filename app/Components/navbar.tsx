"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isPreRegisterPage = pathname === "/pre-register";
  const isGlassyGradientHeader = !!pathname && [
    "/contact-us",
    "/pre-register",
    "/privacy-policy",
    "/terms-of-service",
  ].includes(pathname);

  const gradientStyle = {
    background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
    WebkitBackgroundClip: "text" as const,
    WebkitTextFillColor: "transparent" as const,
    backgroundClip: "text" as const,
  };

  return (
    <div
      className={`w-full fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b ${
        isGlassyGradientHeader
          ? "bg-white/20 backdrop-blur-2xl border-white/30 shadow-lg"
          : "bg-white/40 backdrop-blur-xl border-white/20"
      }`}
      style={
        isGlassyGradientHeader
          ? {
              background:
                "linear-gradient(90deg, rgba(255,107,107,0.16) 0%, rgba(186,33,33,0.12) 48%, rgba(103,0,0,0.10) 100%)",
            }
          : undefined
      }
    >
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-1 md:py-4 lg:py-5">

        {/* Logo */}
        <div className="flex-shrink-0 mt-4 md:mt-0">
          <Link href="/">
            <Image
              src="/freshbhoj-red-new.svg"
              alt="FreshBhoj Logo"
              width={180}
              height={50}
              priority
              className="h-8 md:h-10 lg:h-12 w-auto object-contain cursor-pointer"
            />
          </Link>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 ml-auto font-sans">
          <Link
            href="/"
            className="font-bold text-sm lg:text-base px-2 py-2 transition-all duration-300 hover:text-[#BA2121]"
            style={gradientStyle}
          >
            Home
          </Link>
          {/* Pre-Register Button — Gradient */}
          {!isPreRegisterPage && (
            <Link
              href="/pre-register"
              className="text-white font-bold text-sm lg:text-base px-8 py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              style={{
                background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
              }}
            >
              Pre-Register
            </Link>
          )}

          {/* Contact Us — Gradient Text */}
          <Link
            href="/contact-us"
            className="font-bold text-sm lg:text-base px-6 py-2 rounded-full transition-all duration-300 hover:bg-slate-100 inline-block"
            style={gradientStyle}
          >
            Contact us
          </Link>
        </div>

        {/* Mobile: hamburger button */}
        <button
          className={`md:hidden mt-4 md:mt-0 z-50 relative group inline-flex items-center justify-center w-11 h-11 rounded-2xl border transition-all duration-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#BA2121]/10 ${
            isGlassyGradientHeader
              ? "bg-white/20 backdrop-blur-2xl border-white/40 shadow-md shadow-[#BA2121]/10 hover:bg-white/25"
              : "bg-white/70 backdrop-blur-xl border-white/50 shadow-md shadow-slate-900/10 hover:bg-white/80"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
          aria-expanded={menuOpen}
        >
          <span className="sr-only">Menu</span>
          <span className="relative w-6 h-5">
            <span
              className={`absolute left-0 top-0 block w-6 h-[2px] rounded-full bg-[#BA2121] transition-all duration-300 ${
                menuOpen ? "translate-y-[9px] rotate-45" : "opacity-90"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 block w-6 h-[2px] rounded-full bg-[#BA2121] transition-all duration-300 ${
                menuOpen ? "opacity-0 scale-90" : "opacity-90"
              }`}
            />
            <span
              className={`absolute left-0 bottom-0 block w-6 h-[2px] rounded-full bg-[#BA2121] transition-all duration-300 ${
                menuOpen ? "-translate-y-[9px] -rotate-45" : "opacity-90"
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden flex flex-col items-center gap-4 px-6 pb-6 overflow-hidden transition-all duration-500 border-t ${
          isGlassyGradientHeader
            ? "bg-white/25 backdrop-blur-2xl border-white/30"
            : "bg-white border-slate-100"
        } ${menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
      >
        <Link
          href="/"
          className={`text-base font-bold px-8 py-3 rounded-2xl w-full text-center mt-4 border transition-all ${
            isGlassyGradientHeader ? "border-white/40 bg-white/25 backdrop-blur hover:bg-white/30" : "border-slate-100 bg-white hover:bg-slate-50"
          }`}
          style={gradientStyle}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
        {!isPreRegisterPage && (
          <Link
            href="/pre-register"
            className="text-white text-base font-bold px-8 py-3 rounded-2xl w-full text-center mt-1 shadow-lg shadow-[#BA2121]/15 hover:shadow-[#BA2121]/25 transition-all"
            style={{ background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)" }}
          >
            Pre-Register
          </Link>
        )}
        <Link
          href="/contact-us"
          className={`text-base font-bold px-8 py-3 rounded-2xl w-full text-center border transition-all ${
            isGlassyGradientHeader ? "border-white/40 bg-white/25 backdrop-blur hover:bg-white/30" : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
          style={gradientStyle}
        >
          Contact us
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
