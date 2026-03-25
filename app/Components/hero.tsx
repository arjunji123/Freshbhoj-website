"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const Hero = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background scroll when mobile menu open
  useEffect(() => {
    if (!menuOpen) return;
    const scrollY = window.scrollY;
    const prev = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };

    // iOS Safari: overflow hidden alone may still allow scroll.
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.width = prev.width;
      window.scrollTo({ top: scrollY, behavior: "auto" });
    };
  }, [menuOpen]);

  const gradientTextStyle = {
    background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
    WebkitBackgroundClip: "text" as const,
    WebkitTextFillColor: "transparent" as const,
    backgroundClip: "text" as const,
  };

  const gradientBgStyle = {
    background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
  };

  return (
    <section
      className="lg:min-h-screen w-full flex flex-col font-sans overflow-x-hidden relative"
      style={{
        background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
      }}
    >
      {/* ── Navbar ── */}
      <nav
        className={`w-full fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? "backdrop-blur-xl bg-white/40 shadow-lg border-b border-white/20" : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-1 md:py-4 lg:py-5 relative">
          <div className="flex-shrink-0 mt-4 md:mt-0">
            <Link href="/">
              <Image
                src={(scrolled || menuOpen) ? "/freshbhoj-red-new.svg" : "/FreshBhoj.svg"}
                alt="FreshBhoj Logo"
                width={200}
                height={60}
                priority
                className="h-8 md:h-10 lg:h-12 w-auto object-contain cursor-pointer transition-all duration-300"
              />
            </Link>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-4 ml-auto font-sans">
            <Link
              href="/"
              className={`font-bold text-sm lg:text-base px-6 py-2.5 rounded-full transition-all duration-300 ${scrolled ? "text-white shadow-lg" : "text-white"}`}
              style={scrolled ? gradientBgStyle : { background: 'white', color: '#BA2121' }}
            >
              Home
            </Link>
            <Link
              href="/pre-register"
              className={`font-bold text-sm lg:text-base px-8 py-2.5 rounded-full transition-all duration-300 ${scrolled ? "text-[#BA2121] bg-white border border-slate-100" : "text-white border border-white/30 hover:bg-white hover:text-[#BA2121]"}`}
              style={scrolled ? {} : {}}
            >
              Pre-Register
            </Link>
            <Link
              href="/contact-us"
              className={`font-bold text-sm lg:text-base px-6 py-2 rounded-full transition-all duration-300 ${scrolled ? "text-slate-600 hover:text-[#BA2121]" : "text-white hover:bg-white hover:text-[#BA2121]"}`}
            >
              Contact us
            </Link>
          </div>

          {/* Mobile: hamburger button */}
          <button
            className={`md:hidden z-50 mt-4 md:mt-0 relative group inline-flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 active:scale-95 focus:outline-none ${scrolled
                ? "bg-white/70 backdrop-blur-xl border border-white/60"
                : "bg-white/10 backdrop-blur-xl border border-white/20"
              }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Menu</span>
            <span className="relative w-6 h-5">
              <span
                className={`absolute left-0 top-0 block w-6 h-[2.5px] rounded-full transition-all duration-300 ${(scrolled || menuOpen) ? "bg-[#BA2121]" : "bg-white"
                  } ${menuOpen ? "translate-y-[9px] rotate-45" : "opacity-95"}`}
              />
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 block w-6 h-[2.5px] rounded-full transition-all duration-300 ${(scrolled || menuOpen) ? "bg-[#BA2121]" : "bg-white"
                  } ${menuOpen ? "opacity-0 scale-90" : "opacity-95"}`}
              />
              <span
                className={`absolute left-0 bottom-0 block w-6 h-[2.5px] rounded-full transition-all duration-300 ${(scrolled || menuOpen) ? "bg-[#BA2121]" : "bg-white"
                  } ${menuOpen ? "-translate-y-[9px] -rotate-45" : "opacity-95"}`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu - Redesigned to match shared Navbar */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full z-[90] transition-all duration-500 overflow-hidden bg-white/95 backdrop-blur-3xl rounded-b-[2.5rem] shadow-2xl border-b border-slate-100 ${menuOpen ? "max-h-[34rem] opacity-100 pb-12 pt-24" : "max-h-0 opacity-0 pointer-events-none pt-24"
          }`}
      >
        <div className="flex flex-col items-center gap-4 px-6">
          <div className="w-full flex flex-col gap-3">
            <Link
              href="/"
              className="text-lg font-bold py-3.5 w-full text-center transition-all active:scale-95 text-white shadow-md shadow-[#BA2121]/20 rounded-full"
              style={gradientBgStyle}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/pre-register"
              className="text-lg font-bold py-3.5 w-full text-center transition-all active:scale-95 rounded-full"
              style={gradientTextStyle}
              onClick={() => setMenuOpen(false)}
            >
              Pre-Register
            </Link>

            <Link
              href="/contact-us"
              className="text-lg font-bold py-3.5 w-full text-center transition-all active:scale-95 rounded-full"
              style={gradientTextStyle}
              onClick={() => setMenuOpen(false)}
            >
              Contact us
            </Link>
          </div>

          {/* Quote */}
          <div className="mt-4 px-6 text-center">
            <p className="text-[#BA2121] italic text-sm font-medium opacity-80">
              &ldquo;India&apos;s first reel-based food discovery — taste the purity.&rdquo;
            </p>
          </div>

          {/* Legal Links */}
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

      {/* ── Hero Body ── */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6 pt-32 lg:pt-8 pb-0 lg:flex-1 relative">
        <div className="absolute top-[22%] lg:top-[20%] left-[60%] lg:left-[38%] -translate-x-1/2 -translate-y-1/2 w-[80%] lg:w-[20%] h-[40%] lg:h-[60%] z-0 opacity-20 pointer-events-none ">
          <Image
            src="/bg-white.svg"
            alt="Background Highlight"
            fill
            className="object-contain"
          />
        </div>

        <div className="flex flex-col gap-3 lg:gap-8 w-full lg:w-[55%] z-10 text-left items-start mb-0 lg:mb-0">
          <div className="flex items-center gap-2 bg-white/10 border border-white/30 rounded-full px-4 py-2 w-fit backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-white font-bold text-[10px] lg:text-xs uppercase tracking-widest">
              JOINING THE REVOLUTION
            </span>
          </div>

          <div className="relative">
            <h1 className="font-extrabold text-white text-5xl md:text-6xl lg:text-[5.5vw] xl:text-[4.5rem] leading-[1.1] tracking-[-0.02em]">
              India&apos;s First <br className="md:hidden" /> <span className="text-[#333333]">Reel–Based</span> <br />
              Food <br className="md:hidden" /> Discovery
            </h1>
            <div className="md:hidden absolute top-[-10%] right-[-16%] w-8 h-8 animate-float drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)] z-20">
              <Image src="/blink_logo_hero.svg" alt="icon" width={32} height={32} className="w-full h-auto" />
            </div>
          </div>

          <p className="text-white/90 font-medium text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl lg:max-w-xl">
            Discover. Watch. Order. Subscribe. Experience <br className="hidden lg:block" />
            food through the eyes of the creator.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 font-sans">
            <Link
              href="/pre-register?type=foodie"
              className="flex items-center justify-center bg-white text-black font-bold px-10 py-4 rounded-full hover:bg-opacity-90 transition-all duration-300 whitespace-nowrap text-lg shadow-lg"
            >
              Pre-Register Now →
            </Link>
            <Link
              href="/pre-register?type=kitchen"
              className="flex items-center justify-center bg-hero-gradient text-white font-bold px-10 py-4 rounded-full transition-all duration-300 whitespace-nowrap text-lg shadow-lg hover:scale-105 active:scale-95"
            >
              Register Your Kitchen
            </Link>
          </div>

          {/* ₹10 UPI Cashback Announcement */}
          <div className="flex flex-col gap-3 mt-2 w-full">
            <Link href="/pre-register" className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 hover:border-white/50 rounded-2xl px-5 py-3.5 w-fit transition-all duration-300 hover:scale-[1.02] active:scale-95">
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/30 animate-pulse">
                <span className="text-base">₹</span>
              </div>
              <div>
                <p className="text-white font-extrabold text-sm leading-tight">
                  Get <span className="text-yellow-300">₹10 FREE</span> on pre-registration via UPI!
                </p>
                <p className="text-white/70 text-[11px] font-medium mt-0.5">
                  Valid for both Foodies &amp; Kitchens · Valid email + mobile required
                </p>
              </div>
              <div className="ml-auto flex-shrink-0 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <div className="flex flex-row items-center gap-4">
              <div className="relative h-10 w-24">
                <Image
                  src="/Social.png"
                  alt="Social proof"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="text-white/80 text-sm font-medium">
                Join <span className="text-white font-bold">2,500+</span> foodies on the waitlist
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end w-full lg:w-[45%]">
          <div className="absolute left-[-5%] top-[15%] w-[8%] z-20 hidden md:block animate-float drop-shadow-xl">
            <Image
              src="/blink_logo_hero.svg"
              alt="Icon"
              width={40}
              height={40}
              className="w-full h-auto"
            />
          </div>

          <div className="absolute left-[-2%] md:left-auto md:right-[-5%] bottom-[10%] md:bottom-[20%] w-[12%] md:w-[8%] z-20 animate-float drop-shadow-xl" style={{ animationDelay: '1.5s' }}>
            <Image
              src="/leaf_blink.svg"
              alt="Leaf Icon"
              width={40}
              height={40}
              className="w-full h-auto"
            />
          </div>

          <div className="relative w-full max-w-[340px] md:max-w-[420px] lg:max-w-[480px] aspect-[9/18.5] drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)]">
            <Image
              src="/phone_image1.png"
              alt="FreshBhoj App Preview"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-col items-center absolute bottom-8 left-1/2 -translate-x-1/2 gap-2 opacity-60">
        <span className="text-white font-semibold text-[10px] tracking-[0.2em] uppercase">
          Scroll to Explore
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
