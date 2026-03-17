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
        className={`w-full fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? "backdrop-blur-xl bg-white/80 py-0 shadow-lg" : "bg-transparent py-2"
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2 md:py-4 lg:py-6 relative">
          {/* Branded Underline - Only show when scrolled */}
          {scrolled && (
            <div
              className="absolute bottom-0 left-0 w-full h-[1px] opacity-10"
              style={{ background: "linear-gradient(90deg, transparent 0%, #BA2121 50%, transparent 100%)" }}
            />
          )}
          {/* Subtle Glow */}

          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src={scrolled ? "/freshbhoj-red-new.svg" : "/FreshBhoj.svg"}
                alt="FreshBhoj Logo"
                width={200}
                height={60}
                priority
                className="h-8 md:h-12 lg:h-14 w-auto object-contain cursor-pointer transition-all duration-300"
              />
            </Link>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-4 ml-auto font-sans">
            <Link
              href="/pre-register"
              className={`font-bold text-sm lg:text-base px-8 py-2.5 rounded-full transition-all duration-300 shadow-lg ${scrolled ? "text-white" : "bg-white text-black hover:bg-opacity-90"
                }`}
              style={scrolled ? gradientBgStyle : {}}
            >
              Pre-Register
            </Link>
            <Link
              href="/contact-us"
              className={`font-bold text-sm lg:text-base px-6 py-2 rounded-full transition-all duration-300 ${scrolled ? "" : "text-white hover:bg-white hover:text-[#BA2121]"
                }`}
              style={scrolled ? gradientTextStyle : {}}
            >
              Contact us
            </Link>
          </div>

          {/* Mobile: hamburger button */}
          <button
            className="md:hidden flex flex-col justify-center gap-[5px] py-0.5 px-2 z-50 relative"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <span
              className={`block w-6 h-0.5 rounded transition-all duration-300 ${scrolled ? "bg-[#BA2121]" : "bg-white"
                } ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 rounded transition-all duration-300 ${scrolled ? "bg-[#BA2121]" : "bg-white"
                } ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 rounded transition-all duration-300 ${scrolled ? "bg-[#BA2121]" : "bg-white"
                } ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden flex flex-col items-center gap-4 px-6 overflow-hidden transition-all duration-500 bg-black/40 backdrop-blur-xl fixed inset-x-0 top-0 pt-24 pb-8 z-40 ${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
      >
        <Link
          href="/pre-register"
          className="bg-white text-[#BA2121] text-lg font-bold px-8 py-3 rounded-full w-full text-center"
        >
          Pre-Register
        </Link>
        <Link
          href="/contact-us"
          className="bg-white text-[#BA2121] text-lg font-bold px-8 py-3 rounded-full w-full text-center"
        >
          Contact us
        </Link>
      </div>

      {/* ── Hero Body ── */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6 pt-20 lg:pt-8 pb-0 lg:flex-1 relative">
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
              href="/pre-register"
              className="flex items-center justify-center bg-white text-black font-bold px-10 py-4 rounded-full hover:bg-opacity-90 transition-all duration-300 whitespace-nowrap text-lg shadow-lg"
            >
              Pre-Register Now →
            </Link>
            <Link
              href="/pre-register"
              className="flex items-center justify-center bg-hero-gradient text-white font-bold px-10 py-4 rounded-full transition-all duration-300 whitespace-nowrap text-lg shadow-lg hover:scale-105 active:scale-95"
            >
              Register Your Kitchen
            </Link>
          </div>

          <div className="flex flex-row items-center gap-4 mt-2">
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
