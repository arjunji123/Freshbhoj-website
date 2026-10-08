"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, TrendingUp, CalendarClock, X, Check } from "lucide-react";

const ITEMS = [
  {
    icon: Eye,
    tab: "Too many choices",
    problem: "Overwhelming choice",
    problemText: "Static photos and long menus don't tell the real story. 70% of people spend 15+ minutes just deciding what to eat.",
    fix: "Visual-first discovery",
    fixText: "Short Reels show the dish being made, so you see exactly what you're ordering before you tap order.",
    points: ["65% faster ordering", "Trust-based browsing", "Real nutrition on every dish"],
    img: "/visual-first.svg",
    portrait: true,
  },
  {
    icon: TrendingUp,
    tab: "Hidden kitchens",
    problem: "Invisible kitchens",
    problemText: "Great food sellers, big and small, get buried under the high advertising costs of big platforms.",
    fix: "Creator-led growth",
    fixText: "Every kitchen becomes a ‘Food Creator’ brand with Reels, Stories and performance data to grow direct customers.",
    points: ["Free Reels & Stories", "Built-in Boost ads + AI tips", "Target 3x growth"],
    img: "/creator-led.svg",
    portrait: false,
  },
  {
    icon: CalendarClock,
    tab: "Rigid subscriptions",
    problem: "Broken subscriptions",
    problemText: "Meal plans today are rigid and uninspiring. People want flexibility, variety and a way to see what's cooking.",
    fix: "AI-smart subscriptions",
    fixText: "Pick a kitchen's plan or build your own. AI-assisted 30-day plans match your diet, days and budget.",
    points: ["Swap tomorrow's meal", "Pause / skip any day", "Diet & budget aware"],
    img: "/tiffin-schdule.svg",
    portrait: false,
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
            Food delivery is broken. <span className="bg-gradient-to-r from-[#1DB9A0] to-[#0B4F6C] bg-clip-text text-transparent">We fixed it.</span>
          </h2>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 lg:gap-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Tabs */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-1 -mx-6 px-6 lg:mx-0 lg:px-0 snap-x">
            {ITEMS.map((it, i) => {
              const Icon = it.icon;
              const on = i === active;
              return (
                <button
                  key={it.tab}
                  onClick={() => setActive(i)}
                  className={`relative snap-start shrink-0 lg:shrink text-left rounded-2xl lg:rounded-3xl px-5 py-4 lg:p-6 border transition-all duration-300 overflow-hidden min-w-[220px] lg:min-w-0 ${
                    on ? "bg-[#0D1B1E] border-[#0D1B1E] text-white shadow-xl" : "bg-[#F3F8F8] border-slate-100 text-[#0D1B1E] hover:bg-white hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${on ? "bg-[#FFC21A] text-[#0D1B1E]" : "bg-white text-[#087F78]"}`}>
                      <Icon size={18} strokeWidth={2.4} />
                    </span>
                    <div>
                      <span className={`block text-[10px] font-bold uppercase tracking-widest ${on ? "text-white/60" : "text-slate-400"}`}>Problem 0{i + 1}</span>
                      <span className="block font-extrabold text-base lg:text-lg leading-tight">{it.tab}</span>
                    </div>
                  </div>
                  {on && !paused && inView ? (
                    <span key={active} className="absolute left-0 bottom-0 h-1 w-full origin-left bg-[#FFC21A]" style={{ animation: `fb-progress ${DURATION}ms linear forwards` }} />
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div key={active} className="relative rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#14ADA0] via-[#087F78] to-[#0B4F6C] text-white p-6 md:p-10 lg:p-12 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-8 items-center min-h-[460px] animate-[fadeUp_0.5s_ease-out]">
            <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#FFC21A]/25 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-start gap-3 rounded-2xl bg-black/20 backdrop-blur px-4 py-3 mb-6">
                <span className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-white/15 flex items-center justify-center"><X size={14} /></span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">The problem</p>
                  <p className="font-bold text-sm md:text-base">{cur.problem}</p>
                  <p className="text-white/70 text-xs md:text-sm leading-relaxed mt-1">{cur.problemText}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-[#FFC21A] text-[#0D1B1E] flex items-center justify-center"><Check size={14} strokeWidth={3} /></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFC21A]">The FreshBhoj fix</span>
              </div>
              <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-3">{cur.fix}</h3>
              <p className="text-white/85 text-base lg:text-lg leading-relaxed mb-6">{cur.fixText}</p>
              <ul className="flex flex-wrap gap-2">
                {cur.points.map((p) => (
                  <li key={p} className="rounded-full bg-white/15 border border-white/20 px-4 py-2 text-xs md:text-sm font-semibold">{p}</li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 flex justify-center">
              <div className={`relative w-full drop-shadow-2xl ${cur.portrait ? "max-w-[190px] aspect-[9/16]" : "max-w-[380px] aspect-[1.3/1]"}`}>
                <Image src={cur.img} alt={cur.fix} fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/pre-register?type=foodie" className="inline-flex items-center gap-2 rounded-full bg-[#0D1B1E] text-white font-bold px-8 py-4 hover:scale-105 transition-transform">
            Get early access →
          </Link>
        </div>
      </div>
    </section>
  );
}
