"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PreRegistration() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ── Countdown Timer ── */
  const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 8, mins: 45, secs: 12 });

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 14);
    target.setHours(target.getHours() + 8);

    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, target.getTime() - now.getTime());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full overflow-hidden bg-white pt-10 lg:pt-8 pb-16 lg:pb-28 font-sans"
    >
      <div className="w-full max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <div
          className={`text-center mb-16 lg:mb-24 flex flex-col items-center transition-all duration-1000 ease-out
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="mb-4">
            <p
              className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase inline-block"
              style={{
                background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              JOIN THE REVOLUTION
            </p>
          </div>
          <h2
            className="text-4xl md:text-5xl lg:text-7xl text-[#0F172A] mb-8 leading-tight tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            Exclusive <span
              style={{
                background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >Pre-Registration</span> <br className="hidden lg:block" /> Benefits
          </h2>
          <p className="text-center font-medium text-slate-500 text-base md:text-xl leading-relaxed max-w-2xl md:max-w-none">
            Join the movement before the public launch and unlock massive rewards. Limited spots available for the early community.
          </p>
        </div>

        {/* ── Cards Grid ── */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-20 lg:mb-32 transition-all duration-1000 ease-out delay-200
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
        >
          {/* ─ Left Card: For Foodies ─ */}
          <div className="flex flex-col justify-between bg-white rounded-[2.5rem] lg:rounded-[3.5rem] border border-slate-100 p-10 lg:p-14 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_70px_-10px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 group">
            <div>
              <div className="mb-10">
                <div className="relative w-16 h-16">
                  <Image src="/for-foodie.svg" alt="Foodies" fill className="object-contain" />
                </div>
              </div>
              <h3 className="text-[#0F172A] font-extrabold text-3xl lg:text-5xl mb-8 leading-tight tracking-tight">
                For Foodies
              </h3>
              <div className="flex flex-col gap-5 mb-12">
                {[
                  "Flat ₹500 Wallet Credit",
                  "Early Access to Top Rated Reels",
                  "Exclusive 30-day Free Delivery",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-4 text-slate-700 font-bold text-base lg:text-xl">
                    <div className="relative w-6 h-6 flex-shrink-0">
                      <Image src="/green-right.svg" alt="✓" fill className="object-contain" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <Link
              href="/pre-register?type=foodie"
              className="relative flex items-center justify-center w-full py-5 rounded-2xl bg-[#0F172A] text-white font-extrabold text-lg lg:text-xl transition-all shadow-lg overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-[linear-gradient(169.21deg,#FF6B6B_9%,#BA2121_77%,#670000_100%)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Pre-Register Now →</span>
            </Link>
          </div>

          {/* ─ Right Card: For Kitchens ─ */}
          <div className="relative flex flex-col justify-between rounded-[2.5rem] lg:rounded-[3.5rem] p-10 lg:p-14 overflow-hidden text-white bg-[linear-gradient(169.21deg,#FF6B6B_8.65%,#BA2121_77.4%,#670000_100%)] shadow-[0_20px_50px_-12px_rgba(186,33,33,0.3)] hover:shadow-[0_30px_70px_-10px_rgba(186,33,33,0.5)] transition-all duration-500 hover:-translate-y-2 group">
            <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-md text-white text-[10px] lg:text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full">
              Premium Offer
            </div>
            <div>
              <div className="mb-10">
                <div className="relative w-16 h-16">
                  <Image src="/Overlay.svg" alt="Kitchens" fill className="object-contain" />
                </div>
              </div>
              <h3 className="font-extrabold text-3xl lg:text-5xl mb-8 leading-tight tracking-tight">
                For Kitchens
              </h3>
              <div className="flex flex-col gap-5 mb-12">
                {[
                  "0% Commission for 3 Months",
                  "₹5000 Sponsored Credits",
                  "Priority AI Video Production",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-4 font-bold text-base lg:text-xl">
                    <div className="relative w-6 h-6 flex-shrink-0">
                      <Image src="/white-right.svg" alt="✓" fill className="object-contain" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <Link
              href="/pre-register?type=kitchen"
              className="flex items-center justify-center w-full py-5 rounded-2xl bg-white text-[#BA2121] font-extrabold text-lg lg:text-xl transition-all shadow-xl hover:bg-slate-50"
            >
              Register Kitchen
            </Link>
          </div>
        </div>

        {/* ── The Future is Cooking ── */}
        <div
          className={`text-center flex flex-col items-center transition-all duration-1000 ease-out delay-400
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h3
            className="text-4xl md:text-5xl lg:text-6xl text-[#0F172A] mb-12 leading-tight tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            The Future is Cooking.
          </h3>

          {/* Countdown */}
          <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-8 mb-16">
            {[
              { value: timeLeft.days, label: "DAYS" },
              { value: timeLeft.hours, label: "HOURS" },
              { value: timeLeft.mins, label: "MINS" },
              { value: timeLeft.secs, label: "SECS" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center w-[120px] h-[120px] lg:w-[160px] lg:h-[160px] rounded-[2rem] border border-slate-100 bg-[#F1F5F9] transition-all duration-500 hover:bg-white hover:scale-105 hover:shadow-2xl hover:shadow-slate-200 group"
              >
                <span
                  className="text-4xl lg:text-6xl font-extrabold tabular-nums transition-transform duration-500 group-hover:scale-110"
                  style={{
                    background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  {String(value).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-3 transition-colors duration-500">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Launching badge */}
          <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-[#EF4444]/5">
            <span
              className="w-3 h-3 rounded-full animate-pulse"
              style={{
                background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
                boxShadow: "0 0 10px rgba(186, 33, 33, 0.4)"
              }}
            />
            <span
              className="text-sm font-extrabold uppercase tracking-[0.2em] inline-block"
              style={{
                background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              Launching Nationally Soon
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

