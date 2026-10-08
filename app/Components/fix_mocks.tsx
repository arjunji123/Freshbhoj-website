"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import {
  BadgeCheck, Bookmark, Heart, Share2, Star, Clock3, MapPin, Sparkles, Rocket, Repeat, Pause, Leaf, Eye,
} from "lucide-react";

/** Phone shell used by all three fix visuals. */
function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-[236px] sm:w-[250px] h-[470px] sm:h-[490px] rounded-[2.4rem] bg-[#0D1B1E] p-[9px] shadow-[0_40px_70px_-25px_rgba(0,0,0,0.6)] ring-1 ring-white/20">
      <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-black z-30" />
      <div className="relative w-full h-full rounded-[1.9rem] overflow-hidden bg-white">{children}</div>
    </div>
  );
}

/* 1 ── Visual-first feed ───────────────────────────────────────── */
export function FeedMock() {
  const [liked, setLiked] = useState(false);
  return (
    <div className="relative flex flex-col items-center gap-4">
      <Phone>
        <Image src="/food/reel.webp" alt="Shahi paneer reel" fill sizes="250px" className="object-cover object-[40%_50%]" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/90" />
        {/* story-style progress */}
        <div className="absolute top-9 inset-x-4 h-[3px] rounded-full bg-white/30 overflow-hidden">
          <span className="block h-full origin-left bg-white" style={{ animation: "fb-progress 6s linear infinite" }} />
        </div>
        <div className="absolute top-14 inset-x-4 flex items-center justify-center gap-4 text-[11px] font-bold text-white">
          <span className="opacity-60">Following</span>
          <span className="border-b-2 border-[#FFC21A] pb-0.5">For you</span>
        </div>
        {/* action rail */}
        <div className="absolute right-3 bottom-36 flex flex-col items-center gap-4 text-white">
          <button onClick={() => setLiked((v) => !v)} aria-label="Like" className="flex flex-col items-center gap-0.5">
            <span className="w-9 h-9 rounded-full bg-black/35 backdrop-blur flex items-center justify-center">
              <Heart size={18} className={liked ? "fill-[#FF5470] text-[#FF5470]" : ""} />
            </span>
            <span className="text-[9px] font-bold">{liked ? "2.5k" : "2.4k"}</span>
          </button>
          <span className="flex flex-col items-center gap-0.5">
            <span className="w-9 h-9 rounded-full bg-black/35 backdrop-blur flex items-center justify-center"><Bookmark size={18} /></span>
            <span className="text-[9px] font-bold">Save</span>
          </span>
          <span className="w-9 h-9 rounded-full bg-black/35 backdrop-blur flex items-center justify-center"><Share2 size={17} /></span>
        </div>
        {/* info */}
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-2 py-0.5 text-[9px] font-bold"><MapPin size={9} /> 1.2 km</span>
            <span className="rounded-full bg-[#FFC21A] text-[#0D1B1E] px-2 py-0.5 text-[9px] font-extrabold">MUST TRY</span>
          </div>
          <p className="font-extrabold text-lg leading-tight">Shahi Paneer</p>
          <p className="flex items-center gap-1 text-[10px] text-white/80 mb-2">by Sharma Kitchen <BadgeCheck size={11} className="text-[#6FB6FF]" /></p>
          <div className="flex gap-1.5 mb-3 text-[9px] font-bold">
            <span className="rounded-full bg-white/15 px-2 py-0.5">420 kcal</span>
            <span className="rounded-full bg-white/15 px-2 py-0.5">18g protein</span>
            <span className="rounded-full bg-[#1DB9A0]/80 px-2 py-0.5 inline-flex items-center gap-0.5"><Leaf size={9} />Veg</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white/95 text-[#0D1B1E] px-3 py-2">
            <div className="leading-tight">
              <p className="text-sm font-extrabold">₹249</p>
              <p className="text-[9px] text-slate-500 inline-flex items-center gap-1"><Star size={9} className="fill-[#FFC21A] text-[#FFC21A]" />4.8 · <Clock3 size={9} />30 min</p>
            </div>
            <span className="rounded-xl px-4 py-2 text-[11px] font-extrabold text-white" style={{ background: "linear-gradient(135deg,#14ADA0,#0B4F6C)" }}>Order now</span>
          </div>
        </div>
      </Phone>
    </div>
  );
}

/* 2 ── Kitchen growth dashboard ────────────────────────────────── */
export function GrowthMock() {
  const bars = [28, 36, 31, 48, 56, 72, 90];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="relative flex flex-col items-center gap-4">
      <Phone>
        <div className="h-full bg-[#F3F8F8] pt-9 px-3.5 pb-3 flex flex-col gap-2.5 text-[#0D1B1E]">
          <div className="flex items-center gap-2.5">
            <span className="relative w-11 h-11 rounded-full p-[2px] bg-[conic-gradient(from_0deg,#FFC21A,#1DB9A0,#0B4F6C,#FFC21A)]">
              <span className="block w-full h-full rounded-full overflow-hidden bg-white border-2 border-white">
                <Image src="/food/momo.webp" alt="" width={44} height={44} className="w-full h-full object-cover" />
              </span>
            </span>
            <div className="leading-tight">
              <p className="text-xs font-extrabold flex items-center gap-1">Sharma Kitchen <BadgeCheck size={12} className="text-[#1E7BD8]" /></p>
              <p className="text-[9px] text-slate-500">Posted a Story · today&apos;s special</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 inline-flex items-center gap-1"><Eye size={10} /> Reel views · 7 days</p>
              <span className="text-[9px] font-extrabold text-[#087F78] bg-[#087F78]/10 rounded-full px-1.5 py-0.5">▲ 38%</span>
            </div>
            <p className="text-2xl font-extrabold leading-none mb-2">12.4k</p>
            <div className="flex items-end gap-1.5 h-16">
              {bars.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 justify-end h-full">
                  <span
                    className="w-full rounded-md origin-bottom"
                    style={{ height: `${h}%`, background: i === 6 ? "linear-gradient(180deg,#FFC21A,#F59E0B)" : "linear-gradient(180deg,#1DB9A0,#087F78)", animation: `fb-grow 0.7s ${i * 90}ms ease-out both` }}
                  />
                  <span className="text-[8px] text-slate-400 leading-none">{days[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white p-2.5 shadow-sm">
              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">New customers</p>
              <p className="text-lg font-extrabold">+248</p>
              <p className="text-[8px] text-slate-500">found you nearby</p>
            </div>
            <div className="rounded-2xl bg-white p-2.5 shadow-sm">
              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Ad spend</p>
              <p className="text-lg font-extrabold">₹200<span className="text-[9px] text-slate-400 font-bold">/day</span></p>
              <p className="text-[8px] text-slate-500">reach ≈ 3.1k</p>
            </div>
          </div>

          <div className="rounded-2xl p-3 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg,#14ADA0,#0B4F6C)" }}>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#FFC21A] inline-flex items-center gap-1 mb-1"><Sparkles size={10} /> BhojAI suggests</p>
            <p className="text-[11px] font-semibold leading-snug">Post your lunch Reel at 12 pm for about 2x views.</p>
          </div>

          <span className="mt-auto rounded-xl text-center py-2.5 text-[11px] font-extrabold bg-[#FFC21A] text-[#0D1B1E] inline-flex items-center justify-center gap-1.5"><Rocket size={13} /> Boost this Reel</span>
        </div>
      </Phone>
    </div>
  );
}

/* 3 ── Flexible subscriptions ──────────────────────────────────── */
const MEALS = [
  { name: "Veg Thali", img: "/food/rice.webp", kcal: 520, tag: "Veg" },
  { name: "Steamed Momos", img: "/food/momo.webp", kcal: 380, tag: "Veg" },
  { name: "Butter Naan Combo", img: "/food/naan.webp", kcal: 610, tag: "Veg" },
] as const;

export function SubsMock() {
  const [day, setDay] = useState(2);
  const [meal, setMeal] = useState<number[]>([0, 1, 0, 2, 1, 0, 2]);
  const [paused, setPaused] = useState<number | null>(null);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const m = MEALS[meal[day]];
  const isPaused = paused === day;

  return (
    <div className="relative flex flex-col items-center gap-4">
      <Phone>
        <div className="h-full bg-[#F3F8F8] pt-9 px-3.5 pb-3 flex flex-col gap-2.5 text-[#0D1B1E]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">My plan</p>
              <p className="text-sm font-extrabold">Weekly Lunch</p>
            </div>
            <span className="text-[9px] font-extrabold rounded-full bg-[#087F78]/10 text-[#087F78] px-2 py-1">₹1,299 / week</span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => (
              <button
                key={d}
                onClick={() => setDay(i)}
                className={`rounded-xl py-1.5 flex flex-col items-center gap-1 text-[8px] font-bold transition-all ${day === i ? "text-white shadow-md" : "bg-white text-slate-500"}`}
                style={day === i ? { background: "linear-gradient(135deg,#14ADA0,#0B4F6C)" } : undefined}
              >
                {d}
                <span className={`w-5 h-5 rounded-full overflow-hidden ${paused === i ? "opacity-30 grayscale" : ""}`}>
                  <Image src={MEALS[meal[i]].img} alt="" width={20} height={20} className="w-full h-full object-cover" />
                </span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">{days[day]} · delivery 1:00 pm</p>
            <div className={`flex items-center gap-3 transition-opacity ${isPaused ? "opacity-40" : ""}`}>
              <span className="w-16 h-16 rounded-2xl overflow-hidden bg-[#EFFAF8] shrink-0">
                <Image key={m.img} src={m.img} alt={m.name} width={64} height={64} className="w-full h-full object-cover animate-[fadeUp_0.4s_ease-out]" />
              </span>
              <div className="leading-tight min-w-0">
                <p className="text-sm font-extrabold truncate">{isPaused ? "Skipped" : m.name}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">by Sharma Kitchen</p>
                <div className="flex gap-1 mt-1.5 text-[8px] font-bold">
                  <span className="rounded-full bg-[#087F78]/10 text-[#087F78] px-1.5 py-0.5">{m.kcal} kcal</span>
                  <span className="rounded-full bg-[#1DB9A0]/15 text-[#087F78] px-1.5 py-0.5 inline-flex items-center gap-0.5"><Leaf size={8} />{m.tag}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button onClick={() => { setPaused(null); setMeal((a) => a.map((v, i) => (i === day ? (v + 1) % MEALS.length : v))); }} className="rounded-xl py-2 text-[10px] font-extrabold bg-[#FFC21A] text-[#0D1B1E] inline-flex items-center justify-center gap-1 active:scale-95 transition-transform">
                <Repeat size={11} /> Swap meal
              </button>
              <button onClick={() => setPaused(isPaused ? null : day)} className="rounded-xl py-2 text-[10px] font-extrabold bg-[#F3F8F8] text-slate-600 inline-flex items-center justify-center gap-1 active:scale-95 transition-transform">
                <Pause size={11} /> {isPaused ? "Resume" : "Skip day"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl p-3 text-white" style={{ background: "linear-gradient(135deg,#14ADA0,#0B4F6C)" }}>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#FFC21A] inline-flex items-center gap-1 mb-1"><Sparkles size={10} /> Planned for you</p>
            <p className="text-[11px] font-semibold leading-snug">Veg · under 650 kcal · within ₹1,300/week</p>
          </div>

          <p className="mt-auto text-center text-[9px] text-slate-400">Tap a day, swap or skip. Change anytime.</p>
        </div>
      </Phone>
    </div>
  );
}
