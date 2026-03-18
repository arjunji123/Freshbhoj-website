"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Lock background scroll when mobile menu open
  useEffect(() => {
    if (!menuOpen) return;
    const scrollY = window.scrollY;
    
    // Lock scroll
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo({ top: scrollY, behavior: "auto" });
    };
  }, [menuOpen]);
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

  const activeBgGradient = "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)";

  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;
    if (isActive) {
      return {
        background: activeBgGradient,
        color: "white",
        borderRadius: "9999px",
      };
    }
    return gradientStyle;
  };

  return (
    <div
      className={`w-full fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b ${
        isGlassyGradientHeader
          ? "bg-white/40 backdrop-blur-xl border-white/20 shadow-sm"
          : "bg-white/40 backdrop-blur-xl border-white/20"
      }`}
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
            className={`font-bold text-sm lg:text-base px-6 py-2.5 transition-all duration-300 hover:scale-105 active:scale-95 ${pathname === "/" ? "text-white" : ""}`}
            style={getLinkStyle("/")}
          >
            Home
          </Link>

          <Link
            href="/pre-register"
            className={`font-bold text-sm lg:text-base px-8 py-2.5 transition-all duration-300 hover:scale-105 active:scale-95 ${pathname === "/pre-register" ? "text-white shadow-lg" : ""}`}
            style={getLinkStyle("/pre-register")}
          >
            Pre-Register
          </Link>

          <Link
            href="/contact-us"
            className={`font-bold text-sm lg:text-base px-6 py-2.5 transition-all duration-300 hover:scale-105 active:scale-95 ${pathname === "/contact-us" ? "text-white" : "hover:bg-slate-100"}`}
            style={getLinkStyle("/contact-us")}
          >
            Contact us
          </Link>
        </div>

        {/* Mobile: hamburger button */}
        <button
          className={`md:hidden mt-4 md:mt-0 z-50 relative group inline-flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 active:scale-95 focus:outline-none ${
            isGlassyGradientHeader
              ? "bg-white/10 backdrop-blur-lg border border-white/20"
              : "bg-white/70 backdrop-blur-xl border border-white/50"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
          aria-expanded={menuOpen}
        >
          <span className="sr-only">Menu</span>
          <span className="relative w-6 h-5">
            <span
              className={`absolute left-0 top-0 block w-6 h-[2.5px] rounded-full bg-[#BA2121] transition-all duration-300 ${
                menuOpen ? "translate-y-[9px] rotate-45" : "opacity-90"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 block w-6 h-[2.5px] rounded-full bg-[#BA2121] transition-all duration-300 ${
                menuOpen ? "opacity-0 scale-90" : "opacity-90"
              }`}
            />
            <span
              className={`absolute left-0 bottom-0 block w-6 h-[2.5px] rounded-full bg-[#BA2121] transition-all duration-300 ${
                menuOpen ? "-translate-y-[9px] -rotate-45" : "opacity-90"
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile dropdown menu - Multi-element redesign */}
      <div
        className={`md:hidden flex flex-col items-center gap-4 px-6 overflow-hidden transition-all duration-500 rounded-b-[2.5rem] bg-white/95 backdrop-blur-3xl border-b border-slate-100 shadow-2xl ${
          menuOpen ? "max-h-[32rem] opacity-100 pb-12 mt-0" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-full flex flex-col gap-3 mt-6">
          <Link
            href="/"
            className={`text-lg font-bold py-3.5 w-full text-center transition-all active:scale-95 ${pathname === "/" ? "text-white shadow-md shadow-[#BA2121]/20" : ""}`}
            style={getLinkStyle("/")}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          
          <Link
            href="/pre-register"
            className={`text-lg font-bold py-3.5 w-full text-center transition-all active:scale-95 ${pathname === "/pre-register" ? "text-white shadow-md shadow-[#BA2121]/20" : ""}`}
            style={getLinkStyle("/pre-register")}
            onClick={() => setMenuOpen(false)}
          >
            Pre-Register
          </Link>
          
          <Link
            href="/contact-us"
            className={`text-lg font-bold py-3.5 w-full text-center transition-all active:scale-95 ${pathname === "/contact-us" ? "text-white shadow-md shadow-[#BA2121]/20" : ""}`}
            style={getLinkStyle("/contact-us")}
            onClick={() => setMenuOpen(false)}
          >
            Contact us
          </Link>
        </div>

        {/* Distinguishing Fact/Quote */}
        <div className="mt-4 px-6 text-center">
            <p className="text-[#BA2121] italic text-sm font-medium opacity-80">
                &ldquo;India&apos;s first reel-based food discovery — taste the purity.&rdquo;
            </p>
        </div>

        {/* Single row for Privacy & Terms */}
        <div className="flex items-center gap-4 mt-2">
            <Link 
                href="/privacy-policy" 
                className="text-gray-500 text-xs font-semibold hover:text-[#BA2121] transition-colors"
                onClick={() => setMenuOpen(false)}
            >
                Privacy Policy
            </Link>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            <Link 
                href="/terms-of-service" 
                className="text-gray-500 text-xs font-semibold hover:text-[#BA2121] transition-colors"
                onClick={() => setMenuOpen(false)}
            >
                Terms of Service
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
