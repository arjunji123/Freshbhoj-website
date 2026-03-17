"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Check if user has already seen the splash in this session
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    
    if (hasSeenSplash) {
      setIsVisible(false);
      setShouldRender(false);
      return;
    }

    // After animation duration, fade out
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("hasSeenSplash", "true");
    }, 2800);

    // Completely remove from DOM after fade out animation
    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 3500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-700 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative flex flex-col items-center justify-center">
        
        {/* Elegant Backdrop Glow */}
        <div className="absolute w-[300px] h-[300px] bg-gradient-to-r from-[#FF6B6B]/10 via-[#BA2121]/5 to-transparent rounded-full blur-[60px] animate-pulse-slow" />

        {/* Logo Container */}
        <div className="relative mb-14 drop-shadow-[0_10px_30px_rgba(186,33,33,0.15)]">
          <div className="relative z-10 animate-logo-reveal">
            <Image
              src="/freshbhoj-red-new.svg"
              alt="FreshBhoj"
              width={280}
              height={100}
              priority
              className="w-56 md:w-80 h-auto object-contain"
            />
            {/* Shimmer Effect Beam */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
          </div>
        </div>

        {/* Bottom Text/Tagline Reveal */}
        <div className="overflow-hidden mb-10">
          <p className="text-[#333333]/60 font-medium tracking-[0.4em] uppercase text-[9px] md:text-xs animate-text-slide-up">
            India&apos;s First Reel-Based Food Discovery
          </p>
        </div>

        {/* Minimal Progress Loader */}
        <div className="w-40 h-[1.5px] bg-gray-100/80 overflow-hidden rounded-full">
          <div className="h-full bg-gradient-to-r from-[#FF6B6B] to-[#BA2121] animate-progress-load" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
        @keyframes logo-reveal {
          0% { transform: translateY(20px); opacity: 0; filter: blur(8px); }
          100% { transform: translateY(0); opacity: 1; filter: blur(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          50%, 100% { transform: translateX(150%) skewX(-20deg); }
        }
        @keyframes text-slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes progress-load {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }
        .animate-logo-reveal {
          animation: logo-reveal 1.4s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        .animate-shimmer {
          animation: shimmer 3s infinite 1.4s;
        }
        .animate-text-slide-up {
          animation: text-slide-up 1s cubic-bezier(0.19, 1, 0.22, 1) 0.6s forwards;
          opacity: 0;
        }
        .animate-progress-load {
          animation: progress-load 2.5s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
