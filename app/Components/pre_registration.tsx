"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Torana } from "./desi";
import { ArrowUpRight, Clapperboard, Megaphone, Percent, Sparkles, Truck, Wallet, Check, BellRing, type LucideIcon } from "lucide-react";

type Perk = { icon: LucideIcon; text: string };

const FOODIE_PERKS: Perk[] = [
  { icon: Wallet, text: "₹100 wallet credit, instantly" },
  { icon: Clapperboard, text: "Early access to top-rated Reels" },
  { icon: Truck, text: "30 days of free delivery" },
  { icon: BellRing, text: "First to know when the app launches" },
];

const KITCHEN_PERKS: Perk[] = [
  { icon: Percent, text: "0% commission for 3 months" },
  { icon: Megaphone, text: "₹5,000 in sponsored credits" },
  { icon: Sparkles, text: "Priority AI Video Production" },
];

const ROADMAP = [
  { title: "Pre-registration", text: "Secure your spot and your launch rewards today.", live: true },
  { title: "Early access invites", text: "Waitlist members get in first.", live: false },
  { title: "City-by-city launch", text: "Reels, verified kitchens and subscriptions go live as we expand.", live: false },
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
    <section id="pre-reg" ref={sectionRef} className="relative w-full overflow-hidden font-sans pt-24 pb-16 lg:pt-32 lg:pb-28 bg-gradient-to-b from-white via-[#EEFBF4] to-white">
      <Torana />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#12865F_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_65%)]" />
      <div className="pointer-events-none absolute top-20 -left-24 w-[380px] h-[380px] rounded-full bg-[#34C98A]/20 blur-[110px]" />
      <div className="pointer-events-none absolute top-40 -right-24 w-[340px] h-[340px] rounded-full bg-[#FFC21A]/20 blur-[110px]" />

      <div className="relative w-full max-w-7xl mx-auto px-6">
        {/* ── Header ── */}
        <div className={`text-center max-w-3xl mx-auto mb-14 lg:mb-20 ${reveal()}`}>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#0D1B1E] leading-[1.05] mb-6">
            Join early.{" "}
            <span className="inline-block pr-[0.14em] -mr-[0.14em] bg-gradient-to-r from-[#34C98A] via-[#12865F] to-[#0C4A38] bg-clip-text text-transparent" >
              <span className="italic" style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}>Win big.</span>
            </span>
          </h2>
          <p className="text-slate-500 text-base md:text-xl leading-relaxed">
            Pre-register before launch and unlock rewards reserved for early members.
          </p>
        </div>

        {/* ── Cards ── */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-16 lg:mb-24 ${reveal("delay-200")}`}>
          {/* Foodies */}
          <div className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 lg:p-12 shadow-[0_30px_70px_-40px_rgba(18, 134, 95,0.5)] hover:-translate-y-1.5 transition-transform duration-500 flex flex-col">
            <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#34C98A]/15 blur-3xl group-hover:bg-[#34C98A]/25 transition-colors" />
            <h3 className="relative text-xl font-extrabold text-[#12865F] mb-4">For foodies</h3>
            <div className="relative mb-8">
              <p className="text-7xl lg:text-8xl font-extrabold leading-none bg-gradient-to-br from-[#34C98A] to-[#0C4A38] bg-clip-text text-transparent">₹100</p>
              <p className="text-slate-500 font-semibold mt-2">wallet credit for early members</p>
            </div>
            <ul className="relative flex flex-col gap-3 mb-10">
              {FOODIE_PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-4 rounded-2xl bg-[#F3F8F8] px-4 py-3.5 group-hover:bg-[#EEFBF4] transition-colors">
                  <span className="w-10 h-10 shrink-0 rounded-xl bg-white text-[#12865F] shadow-sm flex items-center justify-center"><Icon size={18} /></span>
                  <span className="font-bold text-[#0D1B1E]">{text}</span>
                  <Check size={16} className="ml-auto text-[#12865F] shrink-0" strokeWidth={3} />
                </li>
              ))}
            </ul>
            <Link
              href="/pre-register?type=foodie"
              className="relative mt-auto inline-flex items-center justify-center gap-2 w-full h-14 rounded-2xl text-white font-extrabold text-lg shadow-[0_20px_40px_-14px_rgba(18, 134, 95,0.7)] hover:scale-[1.02] active:scale-[0.99] transition-transform"
              style={{ background: "linear-gradient(135deg,#2BBE82,#12865F 55%,#0C4A38)" }}
            >
              Pre-Register Now <ArrowUpRight size={20} />
            </Link>
          </div>

          {/* Kitchens */}
          <div className="group relative overflow-hidden rounded-[2.5rem] bg-[#0D1B1E] text-white p-8 lg:p-12 shadow-[0_30px_70px_-30px_rgba(11,79,108,0.7)] hover:-translate-y-1.5 transition-transform duration-500 flex flex-col">
            <div className="pointer-events-none absolute -top-24 -left-20 w-80 h-80 rounded-full bg-[#12865F]/50 blur-3xl animate-[drift_14s_ease-in-out_infinite]" />
            <div className="pointer-events-none absolute -bottom-28 -right-16 w-80 h-80 rounded-full bg-[#0C4A38]/60 blur-3xl animate-[drift_18s_ease-in-out_infinite_reverse]" />
            <h3 className="relative text-xl font-extrabold text-[#FFC21A] mb-4">For kitchens</h3>
            <div className="relative mb-8">
              <p className="text-7xl lg:text-8xl font-extrabold leading-none bg-gradient-to-br from-[#FFE08A] to-[#FFC21A] bg-clip-text text-transparent">0%</p>
              <p className="text-white/70 font-semibold mt-2">commission for the first 3 months</p>
              <p className="text-white/50 text-sm mt-1">For tiffin services, cloud kitchens, restaurants and cafés</p>
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
              Register Your Kitchen <ArrowUpRight size={20} />
            </Link>
          </div>
        </div>

        {/* ── Launch roadmap ── */}
        <div className={`relative rounded-[2.5rem] lg:rounded-[3.5rem] border border-[#12865F]/10 bg-white/70 backdrop-blur px-6 py-12 lg:px-16 lg:py-16 text-center shadow-[0_30px_80px_-50px_rgba(18, 134, 95,0.5)] ${reveal("delay-300")}`}>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0D1B1E] leading-[1.05] mb-4">
            Tomorrow is{" "}
            <span className="inline-block pr-[0.14em] -mr-[0.14em] bg-gradient-to-r from-[#34C98A] to-[#0C4A38] bg-clip-text text-transparent">
              <span className="italic" style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}>cooking.</span>
            </span>
          </h3>
          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Pre-register now and be the first to know when we arrive in your city.
          </p>

          <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 max-w-4xl mx-auto text-left">
            <span className="hidden md:block absolute top-5 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-[#12865F] via-[#12865F]/30 to-slate-200" />
            {ROADMAP.map((s, i) => (
              <li key={s.title} className="relative flex md:flex-col md:items-center md:text-center gap-4">
                <span className="relative shrink-0 w-10 h-10">
                  {s.live ? <span className="absolute inset-0 rounded-full bg-[#12865F]/30 animate-ping" /> : null}
                  <span
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold ${s.live ? "text-white" : "bg-white border-2 border-slate-200 text-slate-400"}`}
                    style={s.live ? { background: "linear-gradient(135deg,#2BBE82,#0C4A38)" } : undefined}
                  >
                    {i + 1}
                  </span>
                </span>
                <div>
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
