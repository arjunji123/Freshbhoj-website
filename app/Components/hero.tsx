"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "./navbar";


const Hero = () => {
  return (
    <section
      className="lg:min-h-screen w-full flex flex-col font-sans overflow-x-hidden relative"
      style={{
        background: "linear-gradient(169.21deg, #1DB9A0 9%, #087F78 77%, #0B4F6C 100%)",
      }}
    >
      <Navbar />

      {/* ── Hero Body ── */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6 pt-32 lg:pt-24 pb-0 lg:flex-1 relative">
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
              Early access is open
            </span>
          </div>

          <div className="relative">
            <h1 className="font-extrabold text-white text-5xl md:text-6xl lg:text-[5.5vw] xl:text-[4.5rem] leading-[1.1] tracking-[-0.02em]">
              India&apos;s First <br className="md:hidden" /> <span className="text-[#FFC21A]">Reel–Based</span> <br />
              Food <br className="md:hidden" /> Discovery
            </h1>
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
              href="/partner/login"
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
