"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Eye, TrendingUp, CalendarClock, Check, ArrowRight, X } from "lucide-react";
import { FeedMock, GrowthMock, SubsMock } from "./fix_mocks";

const ITEMS = [
  {
    icon: Eye,
    tab: "Too many choices",
    problem: "Overwhelming choice",
    problemText: "Static photos and long menus don't tell the real story. 70% of people spend 15+ minutes just deciding what to eat.",
    fix: "Visual-first discovery",
    fixText: "Short Reels show the dish being made, so you see exactly what you're ordering before you tap order.",
    points: ["65% faster ordering", "Trust-based browsing", "Real nutrition on every dish"],
    before: "Scroll long menus, guess from photos, 15+ minutes to decide.",
    after: "Watch a short reel, see the nutrition, order in one tap.",
    Mock: FeedMock,
  },
  {
    icon: TrendingUp,
    tab: "Hidden kitchens",
    problem: "Invisible kitchens",
    problemText: "Great food sellers, big and small, get buried under the high advertising costs of big platforms.",
    fix: "Creator-led growth",
    fixText: "Every kitchen becomes a ‘Food Creator’ brand with Reels, Stories and performance data to grow direct customers.",
    points: ["Free Reels & Stories", "Built-in Boost ads + AI tips", "Target 3x growth"],
    before: "Buried under big-platform ads. Nobody finds a small kitchen.",
    after: "Free Reels & Stories plus AI tips put you in front of nearby customers.",
    Mock: GrowthMock,
  },
  {
    icon: CalendarClock,
    tab: "Rigid subscriptions",
    problem: "Broken subscriptions",
    problemText: "Meal plans today are rigid and uninspiring. People want flexibility, variety and a way to see what's cooking.",
    fix: "AI-smart subscriptions",
    fixText: "Pick a kitchen's plan or build your own. AI-assisted 30-day plans match your diet, days and budget.",
    points: ["Swap tomorrow's meal", "Pause / skip any day", "Diet & budget aware"],
    before: "Fixed plans. Can't change a dish, can't skip a day.",
    after: "Swap tomorrow's meal, skip or pause any day, AI plans the rest.",
    Mock: SubsMock,
  },
] as const;

const DURATION = 7000;

export default function ProblemFix() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !inView) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % ITEMS.length), DURATION);
    return () => clearTimeout(t);
  }, [active, paused, inView]);

  const cur = ITEMS[active];

  return (
    <section ref={ref} id="problem-fix" className="w-full font-sans py-16 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 lg:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087F78] mb-4">The reality check</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0D1B1E] tracking-tight leading-tight">
            Food delivery is broken. <span className="inline-block pr-[0.14em] -mr-[0.14em] bg-gradient-to-r from-[#1DB9A0] to-[#0B4F6C] bg-clip-text text-transparent"><span style={{ fontFamily: "var(--font-instrument), Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>We fixed it.</span></span>
          </h2>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4 lg:gap-6 items-stretch"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Left: the problems — stretches to the full height of the fix panel */}
          <div className="flex lg:flex-col gap-3 lg:gap-4 overflow-x-auto lg:overflow-visible pb-1 -mx-6 px-6 lg:mx-0 lg:px-0 snap-x">
            {ITEMS.map((it, i) => {
              const Icon = it.icon;
              const on = i === active;
              return (
                <button
                  key={it.tab}
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className={`group relative snap-start shrink-0 lg:shrink lg:flex-1 text-left rounded-3xl p-5 lg:p-7 border transition-all duration-300 overflow-hidden w-[280px] lg:w-auto flex flex-col justify-center ${
                    on
                      ? "bg-white border-[#087F78]/30 text-[#0D1B1E] shadow-[0_24px_50px_-20px_rgba(8,127,120,0.55)] lg:translate-x-2"
                      : "bg-[#EAF6F4]/70 border-[#087F78]/10 text-[#0D1B1E] hover:bg-white hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${on ? "text-[#087F78]" : "text-slate-400"}`}>
                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${on ? "bg-gradient-to-br from-[#1DB9A0] to-[#0B4F6C] text-white" : "bg-white text-[#087F78] shadow-sm"}`}>
                        <Icon size={18} strokeWidth={2.4} />
                      </span>
                      Problem 0{i + 1}
                    </span>
                    <span className={`text-4xl font-extrabold leading-none transition-colors ${on ? "text-[#087F78]/20" : "text-slate-300/70"}`}>0{i + 1}</span>
                  </div>
                  <span className="block font-extrabold text-xl lg:text-2xl leading-tight mb-2">{it.problem}</span>
                  <span className={`block text-sm leading-relaxed text-slate-500`}>{it.problemText}</span>
                  {on && !paused && inView ? (
                    <span key={active} className="absolute left-0 bottom-0 h-1 w-full origin-left bg-gradient-to-r from-[#1DB9A0] to-[#FFC21A]" style={{ animation: `fb-progress ${DURATION}ms linear forwards` }} />
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Right: the fix */}
          <div key={active} className="relative rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#14ADA0] via-[#087F78] to-[#0B4F6C] text-white p-6 md:p-10 lg:p-12 flex flex-col animate-[fadeUp_0.5s_ease-out]">
            <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-[#5EE6D0]/20 blur-3xl" />

            <div className="relative z-10 flex flex-wrap items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#FFC21A] text-[#0D1B1E] px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest">
                <Check size={12} strokeWidth={3} /> The FreshBhoj fix
              </span>
              <span className="text-white/70 text-xs md:text-sm font-medium">for “{cur.problem}”</span>
            </div>

            <div className="relative z-10 flex-1 grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-10 items-center">
              <div className="max-w-xl">
                <h3 className="text-3xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">{cur.fix}</h3>
                <p className="text-white/85 text-base lg:text-lg leading-relaxed mb-6">{cur.fixText}</p>

                <div className="grid grid-cols-1 gap-2 mb-6">
                  <div className="rounded-2xl bg-black/20 border border-white/10 p-4">
                    <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1.5"><X size={12} /> Before</p>
                    <p className="text-sm text-white/80 leading-snug">{cur.before}</p>
                  </div>
                  <span className="flex items-center justify-center text-[#FFC21A] -my-0.5"><ArrowRight size={18} className="rotate-90" /></span>
                  <div className="rounded-2xl bg-white text-[#0D1B1E] p-4 shadow-xl">
                    <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#087F78] mb-1.5"><Check size={12} strokeWidth={3} /> With FreshBhoj</p>
                    <p className="text-sm font-semibold leading-snug">{cur.after}</p>
                  </div>
                </div>

                <ul className="flex flex-wrap gap-2">
                  {cur.points.map((p) => (
                    <li key={p} className="rounded-full bg-white/15 border border-white/20 px-3.5 py-1.5 text-xs md:text-sm font-semibold">{p}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center xl:pl-6">
                <cur.Mock />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/pre-register?type=foodie" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#14ADA0] to-[#0B4F6C] text-white font-bold px-8 py-4 shadow-[0_18px_40px_-14px_rgba(8,127,120,0.7)] hover:scale-105 transition-transform">
            Get early access →
          </Link>
        </div>
      </div>
    </section>
  );
}
