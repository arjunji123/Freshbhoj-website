"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isPreRegisterPage = pathname === "/pre-register";

  const gradientStyle = {
    background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
    WebkitBackgroundClip: "text" as const,
    WebkitTextFillColor: "transparent" as const,
    backgroundClip: "text" as const,
  };

  return (
    <div className="w-full bg-white/40 backdrop-blur-xl fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b border-white/20">
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
          className="md:hidden flex flex-col justify-center gap-[5px] py-0.5 px-2 mt-4 md:mt-0 z-50 relative"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <span
            className={`block w-6 h-0.5 bg-[#BA2121] rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-[#BA2121] rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-[#BA2121] rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden flex flex-col items-center gap-4 px-6 pb-6 overflow-hidden transition-all duration-500 bg-white border-t border-slate-100 ${menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
      >
        <Link
          href="/"
          className="text-base font-bold px-8 py-3 rounded-full w-full text-center mt-4 border border-slate-100"
          style={gradientStyle}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
        {!isPreRegisterPage && (
          <Link
            href="/pre-register"
            className="text-white text-base font-bold px-8 py-3 rounded-full w-full text-center mt-4"
            style={{ background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)" }}
          >
            Pre-Register
          </Link>
        )}
        <Link
          href="/contact-us"
          className="text-base font-bold px-8 py-3 rounded-full w-full text-center border border-slate-200"
          style={gradientStyle}
        >
          Contact us
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
