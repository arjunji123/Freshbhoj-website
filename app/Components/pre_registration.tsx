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
                background: "linear-gradient(169.21deg, #1DB9A0 9%, #087F78 77%, #0B4F6C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              Limited early spots
            </p>
          </div>
          <h2
            className="text-4xl md:text-5xl lg:text-7xl text-[#0D1B1E] mb-8 leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-instrument), Georgia, serif", fontWeight: 400 }}
          >
            Exclusive <span
              style={{
                background: "linear-gradient(169.21deg, #1DB9A0 9%, #087F78 77%, #0B4F6C 100%)",
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
              <h3 className="text-[#0D1B1E] font-extrabold text-3xl lg:text-5xl mb-8 leading-tight tracking-tight">
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
              className="relative flex items-center justify-center w-full py-5 rounded-2xl bg-[linear-gradient(135deg,#14ADA0,#0B4F6C)] hover:brightness-110 text-white font-extrabold text-lg lg:text-xl transition-all shadow-lg overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-[linear-gradient(169.21deg,#1DB9A0_9%,#087F78_77%,#0B4F6C_100%)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Pre-Register Now →</span>
            </Link>
          </div>

          {/* ─ Right Card: For Kitchens ─ */}
          <div className="relative flex flex-col justify-between rounded-[2.5rem] lg:rounded-[3.5rem] p-10 lg:p-14 overflow-hidden text-white bg-[linear-gradient(169.21deg,#1DB9A0_8.65%,#087F78_77.4%,#0B4F6C_100%)] shadow-[0_20px_50px_-12px_rgba(8,127,120,0.3)] hover:shadow-[0_30px_70px_-10px_rgba(8,127,120,0.5)] transition-all duration-500 hover:-translate-y-2 group">
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
              className="flex items-center justify-center w-full py-5 rounded-2xl bg-white text-[#087F78] font-extrabold text-lg lg:text-xl transition-all shadow-xl hover:bg-slate-50"
            >
              Register Kitchen
            </Link>
          </div>
        </div>

        {/* ── The Future is Cooking ── */}
        <div
          className={`relative overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] px-6 py-14 lg:px-16 lg:py-20 text-center text-white bg-[linear-gradient(135deg,#0B4F6C_0%,#087F78_55%,#14ADA0_100%)] transition-all duration-1000 ease-out delay-300
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="pointer-events-none absolute -top-24 -left-16 w-80 h-80 rounded-full bg-[#5EE6D0]/30 blur-3xl animate-[drift_14s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute -bottom-28 -right-10 w-96 h-96 rounded-full bg-white/20 blur-3xl animate-[drift_18s_ease-in-out_infinite_reverse]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 backdrop-blur px-5 py-2 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] mb-8">
              <span className="w-2 h-2 rounded-full bg-[#FFC21A] animate-pulse" />
              Launching nationally soon
            </span>
            <h3
              className="text-5xl md:text-6xl lg:text-8xl leading-[1.02] mb-6"
              style={{ fontFamily: "var(--font-instrument), Georgia, serif", fontWeight: 400 }}
            >
              The future is <span className="italic text-[#FFC21A]">cooking.</span>
            </h3>
            <p className="text-white/80 text-base md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              We&apos;re rolling out city by city. Pre-register now and you&apos;ll be first in line when we reach yours.
            </p>

            {/* Roadmap */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-12 text-left">
              {[
                { tag: "Live now", title: "Pre-registration", text: "Reserve your spot and your launch rewards.", live: true },
                { tag: "Next", title: "Early access invites", text: "Waitlist members get in before everyone else.", live: false },
                { tag: "Soon", title: "City-by-city launch", text: "Reels, verified kitchens and subscriptions go live.", live: false },
              ].map((s, i) => (
                <div key={s.title} className={`rounded-3xl p-6 border backdrop-blur ${s.live ? "bg-white text-[#0D1B1E] border-white shadow-2xl" : "bg-white/10 border-white/20"}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1 ${s.live ? "bg-[#087F78] text-white" : "bg-white/15 text-white/80"}`}>{s.tag}</span>
                    <span className={`text-3xl font-extrabold leading-none ${s.live ? "text-[#087F78]/25" : "text-white/20"}`}>0{i + 1}</span>
                  </div>
                  <h4 className="font-extrabold text-lg mb-1">{s.title}</h4>
                  <p className={`text-sm leading-relaxed ${s.live ? "text-slate-500" : "text-white/70"}`}>{s.text}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pre-register?type=foodie" className="inline-flex justify-center rounded-full bg-white text-[#0D1B1E] font-bold px-9 py-4 hover:scale-105 transition-transform shadow-xl">
                Pre-register now →
              </Link>
              <Link href="/partner/login" className="inline-flex justify-center rounded-full bg-[#FFC21A] text-[#0D1B1E] font-bold px-9 py-4 hover:scale-105 transition-transform shadow-xl">
                Register your kitchen
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

