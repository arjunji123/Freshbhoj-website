"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clapperboard, Megaphone, Percent, ShoppingBag, Sparkles, Truck, UtensilsCrossed, Wallet, Check, type LucideIcon } from "lucide-react";

const accent = { fontFamily: "var(--font-instrument), Georgia, serif", fontStyle: "italic" as const, fontWeight: 400 };

type Perk = { icon: LucideIcon; text: string };

const FOODIE_PERKS: Perk[] = [
  { icon: Wallet, text: "Flat ₹500 Wallet Credit" },
  { icon: Clapperboard, text: "Early Access to Top Rated Reels" },
  { icon: Truck, text: "Exclusive 30-day Free Delivery" },
];

const KITCHEN_PERKS: Perk[] = [
  { icon: Percent, text: "0% Commission for 3 Months" },
  { icon: Megaphone, text: "₹5000 Sponsored Credits" },
  { icon: Sparkles, text: "Priority AI Video Production" },
];

const ROADMAP = [
  { tag: "Live now", title: "Pre-registration", text: "Reserve your spot and your launch rewards.", live: true },
  { tag: "Next", title: "Early access invites", text: "Waitlist members get in before everyone else.", live: false },
  { tag: "Soon", title: "City-by-city launch", text: "Reels, verified kitchens and subscriptions go live.", live: false },
];

export default function PreRegistration() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setVisible(true), { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const reveal = (delay = "") => `transition-all duration-1000 ease-out ${delay} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`;

  return (
    <section id="pre-reg" ref={sectionRef} className="relative w-full overflow-hidden font-sans py-16 lg:py-28 bg-gradient-to-b from-white via-[#EFFAF8] to-white">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#087F78_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_65%)]" />
      <div className="pointer-events-none absolute top-20 -left-24 w-[380px] h-[380px] rounded-full bg-[#1DB9A0]/20 blur-[110px]" />
      <div className="pointer-events-none absolute top-40 -right-24 w-[340px] h-[340px] rounded-full bg-[#FFC21A]/20 blur-[110px]" />

      <div className="relative w-full max-w-7xl mx-auto px-6">
        {/* ── Header ── */}
        <div className={`text-center max-w-3xl mx-auto mb-14 lg:mb-20 ${reveal()}`}>
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#087F78]/15 shadow-sm px-5 py-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#087F78] mb-7">
            <span className="w-2 h-2 rounded-full bg-[#FFC21A] animate-pulse" /> Limited early spots
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#0D1B1E] leading-[1.05] mb-6">
            Join early.{" "}
            <span className="inline-block pr-[0.14em] -mr-[0.14em] bg-gradient-to-r from-[#1DB9A0] via-[#087F78] to-[#0B4F6C] bg-clip-text text-transparent" >
              <span style={accent}>Get rewarded.</span>
            </span>
          </h2>
          <p className="text-slate-500 text-base md:text-xl leading-relaxed">
            Be part of FreshBhoj before the public launch and unlock rewards made for early members. Spots are limited.
          </p>
        </div>

        {/* ── Cards ── */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-16 lg:mb-24 ${reveal("delay-200")}`}>
          {/* Foodies */}
          <div className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 lg:p-12 shadow-[0_30px_70px_-40px_rgba(8,127,120,0.5)] hover:-translate-y-1.5 transition-transform duration-500 flex flex-col">
            <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#1DB9A0]/15 blur-3xl group-hover:bg-[#1DB9A0]/25 transition-colors" />
            <div className="relative flex items-center justify-between mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#087F78]/10 text-[#087F78] px-4 py-2 text-xs font-bold uppercase tracking-widest">
                <ShoppingBag size={14} /> For Foodies
              </span>
            </div>
            <div className="relative mb-8">
              <p className="text-7xl lg:text-8xl font-extrabold leading-none bg-gradient-to-br from-[#1DB9A0] to-[#0B4F6C] bg-clip-text text-transparent">₹500</p>
              <p className="text-slate-500 font-semibold mt-2">wallet credit for early members</p>
            </div>
            <ul className="relative flex flex-col gap-3 mb-10">
              {FOODIE_PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-4 rounded-2xl bg-[#F3F8F8] px-4 py-3.5 group-hover:bg-[#EFFAF8] transition-colors">
                  <span className="w-10 h-10 shrink-0 rounded-xl bg-white text-[#087F78] shadow-sm flex items-center justify-center"><Icon size={18} /></span>
                  <span className="font-bold text-[#0D1B1E]">{text}</span>
                  <Check size={16} className="ml-auto text-[#087F78] shrink-0" strokeWidth={3} />
                </li>
              ))}
            </ul>
            <Link
              href="/pre-register?type=foodie"
              className="relative mt-auto inline-flex items-center justify-center gap-2 w-full h-14 rounded-2xl text-white font-extrabold text-lg shadow-[0_20px_40px_-14px_rgba(8,127,120,0.7)] hover:scale-[1.02] active:scale-[0.99] transition-transform"
              style={{ background: "linear-gradient(135deg,#14ADA0,#087F78 55%,#0B4F6C)" }}
            >
              Pre-Register Now <ArrowUpRight size={20} />
            </Link>
          </div>

          {/* Kitchens */}
          <div className="group relative overflow-hidden rounded-[2.5rem] bg-[#0D1B1E] text-white p-8 lg:p-12 shadow-[0_30px_70px_-30px_rgba(11,79,108,0.7)] hover:-translate-y-1.5 transition-transform duration-500 flex flex-col">
            <div className="pointer-events-none absolute -top-24 -left-20 w-80 h-80 rounded-full bg-[#087F78]/50 blur-3xl animate-[drift_14s_ease-in-out_infinite]" />
            <div className="pointer-events-none absolute -bottom-28 -right-16 w-80 h-80 rounded-full bg-[#0B4F6C]/60 blur-3xl animate-[drift_18s_ease-in-out_infinite_reverse]" />
            <div className="relative flex items-center justify-between mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-widest">
                <UtensilsCrossed size={14} /> For Kitchens
              </span>
              <span className="rounded-full bg-[#FFC21A] text-[#0D1B1E] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest">Premium offer</span>
            </div>
            <div className="relative mb-8">
              <p className="text-7xl lg:text-8xl font-extrabold leading-none bg-gradient-to-br from-[#FFE08A] to-[#FFC21A] bg-clip-text text-transparent">0%</p>
              <p className="text-white/70 font-semibold mt-2">commission for your first 3 months</p>
            </div>
            <ul className="relative flex flex-col gap-3 mb-10">
              {KITCHEN_PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-4 rounded-2xl bg-white/[0.06] border border-white/10 px-4 py-3.5 group-hover:bg-white/10 transition-colors">
                  <span className="w-10 h-10 shrink-0 rounded-xl bg-white/10 text-[#5EE6D0] flex items-center justify-center"><Icon size={18} /></span>
                  <span className="font-bold">{text}</span>
                  <Check size={16} className="ml-auto text-[#FFC21A] shrink-0" strokeWidth={3} />
                </li>
              ))}
            </ul>
            <Link
              href="/partner/login"
              className="relative mt-auto inline-flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-[#FFC21A] text-[#0D1B1E] font-extrabold text-lg shadow-[0_20px_40px_-14px_rgba(255,194,26,0.7)] hover:scale-[1.02] active:scale-[0.99] transition-transform"
            >
              Register Kitchen <ArrowUpRight size={20} />
            </Link>
          </div>
        </div>

        {/* ── Launch roadmap ── */}
        <div className={`relative rounded-[2.5rem] lg:rounded-[3.5rem] border border-[#087F78]/10 bg-white/70 backdrop-blur px-6 py-12 lg:px-16 lg:py-16 text-center shadow-[0_30px_80px_-50px_rgba(8,127,120,0.5)] ${reveal("delay-300")}`}>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#087F78]/10 text-[#087F78] px-5 py-2 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#087F78] animate-pulse" /> Launching nationally soon
          </span>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0D1B1E] leading-[1.05] mb-4">
            The future is{" "}
            <span className="inline-block pr-[0.14em] -mr-[0.14em] bg-gradient-to-r from-[#1DB9A0] to-[#0B4F6C] bg-clip-text text-transparent">
              <span style={accent}>cooking.</span>
            </span>
          </h3>
          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            We&apos;re rolling out city by city. Pre-register now and you&apos;ll be first in line when we reach yours.
          </p>

          <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 max-w-4xl mx-auto text-left">
            <span className="hidden md:block absolute top-5 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-[#087F78] via-[#087F78]/30 to-slate-200" />
            {ROADMAP.map((s, i) => (
              <li key={s.title} className="relative flex md:flex-col md:items-center md:text-center gap-4">
                <span className="relative shrink-0 w-10 h-10">
                  {s.live ? <span className="absolute inset-0 rounded-full bg-[#087F78]/30 animate-ping" /> : null}
                  <span
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold ${s.live ? "text-white" : "bg-white border-2 border-slate-200 text-slate-400"}`}
                    style={s.live ? { background: "linear-gradient(135deg,#14ADA0,#0B4F6C)" } : undefined}
                  >
                    {i + 1}
                  </span>
                </span>
                <div>
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1 mb-2 ${s.live ? "bg-[#087F78] text-white" : "bg-slate-100 text-slate-500"}`}>{s.tag}</span>
                  <h4 className="font-extrabold text-[#0D1B1E] text-lg mb-1">{s.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
