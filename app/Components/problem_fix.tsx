"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, TrendingUp, CalendarClock, Check } from "lucide-react";

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
                      ? "bg-[#0D1B1E] border-[#0D1B1E] text-white shadow-2xl lg:scale-[1.02]"
                      : "bg-[#F3F8F8] border-slate-200/70 text-[#0D1B1E] hover:bg-white hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${on ? "text-[#FFC21A]" : "text-slate-400"}`}>
                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${on ? "bg-[#FFC21A] text-[#0D1B1E]" : "bg-white text-[#087F78] shadow-sm"}`}>
                        <Icon size={18} strokeWidth={2.4} />
                      </span>
                      Problem 0{i + 1}
                    </span>
                    <span className={`text-4xl font-extrabold leading-none transition-colors ${on ? "text-white/15" : "text-slate-200"}`}>0{i + 1}</span>
                  </div>
                  <span className="block font-extrabold text-xl lg:text-2xl leading-tight mb-2">{it.problem}</span>
                  <span className={`block text-sm leading-relaxed ${on ? "text-white/65" : "text-slate-500"}`}>{it.problemText}</span>
                  {on && !paused && inView ? (
                    <span key={active} className="absolute left-0 bottom-0 h-1 w-full origin-left bg-[#FFC21A]" style={{ animation: `fb-progress ${DURATION}ms linear forwards` }} />
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Right: the fix */}
          <div key={active} className="relative rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#14ADA0] via-[#087F78] to-[#0B4F6C] text-white p-6 md:p-10 lg:p-12 flex flex-col animate-[fadeUp_0.5s_ease-out]">
            <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#FFC21A]/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-[#5EE6D0]/20 blur-3xl" />

            <div className="relative z-10 flex flex-wrap items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#FFC21A] text-[#0D1B1E] px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest">
                <Check size={12} strokeWidth={3} /> The FreshBhoj fix
              </span>
              <span className="text-white/70 text-xs md:text-sm font-medium">for “{cur.problem}”</span>
            </div>

            <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
              <div>
                <h3 className="text-3xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">{cur.fix}</h3>
                <p className="text-white/85 text-base lg:text-lg leading-relaxed mb-8">{cur.fixText}</p>
                <ul className="flex flex-col gap-3">
                  {cur.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 font-semibold text-sm md:text-base">
                      <span className="w-6 h-6 shrink-0 rounded-full bg-white/20 flex items-center justify-center"><Check size={14} strokeWidth={3} /></span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center">
                <div className={`relative w-full drop-shadow-2xl ${cur.portrait ? "max-w-[200px] aspect-[9/16]" : "max-w-[400px] aspect-[1.3/1]"}`}>
                  <Image src={cur.img} alt={cur.fix} fill className="object-contain" />
                </div>
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
