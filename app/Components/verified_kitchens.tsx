"use client";

import { useEffect, useRef, useState } from "react";
import { BadgeCheck, MapPinned, ClipboardCheck, Star, ShieldCheck, Clock3, Search } from "lucide-react";

const STEPS = [
  {
    icon: MapPinned,
    title: "We visit in person",
    description: "A FreshBhoj team member physically visits the kitchen. No paperwork-only approvals.",
  },
  {
    icon: ClipboardCheck,
    title: "Hygiene & quality check",
    description: "Cleanliness, storage, ingredients and licences are checked against our checklist.",
  },
  {
    icon: BadgeCheck,
    title: "Badge & own section",
    description: "Passing kitchens get a Verified badge and appear in their own Verified section in the app.",
  },
] as const;

const KITCHENS = [
  { name: "Sharma Family Kitchen", meta: "North Indian · 1.2 km", rating: "4.8", time: "25 min", verified: true, tone: "from-[#1DB9A0] to-[#0B4F6C]" },
  { name: "Night Owl Café", meta: "Snacks · 3.1 km", rating: "4.3", time: "30 min", verified: false, tone: "from-[#FFC21A] to-[#F59E0B]" },
  { name: "Highway Dhaba Express", meta: "Punjabi · 2.4 km", rating: "4.5", time: "35 min", verified: true, tone: "from-[#5EE6D0] to-[#087F78]" },
  { name: "Mithai Corner", meta: "Sweets · 1.9 km", rating: "4.4", time: "20 min", verified: false, tone: "from-[#8BD3FF] to-[#1E7BD8]" },
] as const;

export default function VerifiedKitchens() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setVisible(true), { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // highlight the steps one after another once visible
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 2600);
    return () => clearInterval(t);
  }, [visible]);

  const list = KITCHENS.filter((k) => !onlyVerified || k.verified);

  return (
    <section ref={ref} id="verified" className="relative w-full font-sans py-16 lg:py-28 bg-gradient-to-b from-white via-[#EFFAF8] to-white overflow-hidden">
      {/* dotted grid + glows */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:radial-gradient(#087F78_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="pointer-events-none absolute top-10 -left-24 w-[420px] h-[420px] rounded-full bg-[#1DB9A0]/20 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[380px] h-[380px] rounded-full bg-[#1E7BD8]/15 blur-[110px]" />

      <div
        className={`relative w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center transition-all duration-1000 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Left: story + timeline */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full pl-2 pr-5 py-2 mb-8 bg-white border border-[#1E7BD8]/20 shadow-sm">
            <span className="w-7 h-7 rounded-full bg-[#1E7BD8] text-white flex items-center justify-center"><BadgeCheck size={16} /></span>
            <span className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] text-[#1E7BD8]">FreshBhoj Verified</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0D1B1E] mb-6 leading-[1.05] tracking-tight">
            Trust you can{" "}
            <span className="bg-gradient-to-r from-[#1DB9A0] via-[#087F78] to-[#0B4F6C] bg-clip-text text-transparent"><span style={{ fontFamily: "var(--font-instrument), Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>see</span></span>
          </h2>
          <p className="text-slate-500 text-base md:text-xl leading-relaxed mb-10 max-w-xl">
            Every kitchen is welcome to sell. The ones we visit and verify in person get a Verified badge and are shown
            separately, so you always know where your food is coming from.
          </p>

          <ol className="relative flex flex-col gap-3">
            <span className="absolute left-[27px] top-8 bottom-8 w-px bg-gradient-to-b from-[#1DB9A0] via-[#087F78]/40 to-transparent" />
            {STEPS.map(({ icon: Icon, title, description }, i) => {
              const on = i === step;
              return (
                <li
                  key={title}
                  onMouseEnter={() => setStep(i)}
                  className={`relative flex items-start gap-4 rounded-3xl p-4 pr-5 border transition-all duration-500 cursor-default ${
                    on ? "bg-white border-[#087F78]/20 shadow-[0_20px_40px_-20px_rgba(8,127,120,0.45)] translate-x-1" : "bg-transparent border-transparent"
                  }`}
                >
                  <span
                    className={`relative z-10 w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      on ? "bg-gradient-to-br from-[#1DB9A0] to-[#0B4F6C] text-white scale-105" : "bg-white text-[#087F78] border border-slate-200"
                    }`}
                  >
                    <Icon size={20} strokeWidth={2.2} />
                  </span>
                  <div className="pt-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Step 0{i + 1}</p>
                    <h3 className="font-extrabold text-[#0D1B1E] text-lg mb-1">{title}</h3>
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed">{description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Right: seal + app mock */}
        <div className="relative flex justify-center py-10">
          {/* rotating seal */}
          <svg viewBox="0 0 200 200" className="absolute -top-2 -right-2 md:right-4 w-28 md:w-36 z-20 animate-[spin_26s_linear_infinite] drop-shadow-lg" aria-hidden>
            <defs>
              <path id="seal-path" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
              <linearGradient id="seal-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#1DB9A0" />
                <stop offset="1" stopColor="#0B4F6C" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="98" fill="url(#seal-g)" />
            <circle cx="100" cy="100" r="62" fill="none" stroke="#fff" strokeOpacity=".35" strokeDasharray="3 5" />
            <text fill="#fff" fontSize="14" fontWeight="800">
              <textPath href="#seal-path" textLength="446" lengthAdjust="spacing">FRESHBHOJ VERIFIED • IN PERSON • </textPath>
            </text>
          </svg>
          <span className="absolute -top-2 -right-2 md:right-4 w-28 md:w-36 aspect-square z-30 flex items-center justify-center pointer-events-none">
            <BadgeCheck className="text-white w-10 md:w-12 h-10 md:h-12" strokeWidth={2.2} />
          </span>

          {/* glow behind card */}
          <div className="absolute inset-x-10 top-16 bottom-0 rounded-[3rem] bg-gradient-to-br from-[#1DB9A0]/40 via-[#1E7BD8]/20 to-[#FFC21A]/30 blur-3xl" />

          {/* phone-like card */}
          <div className="relative w-full max-w-[420px] rounded-[2.5rem] bg-[#0D1B1E] p-3 shadow-[0_40px_80px_-30px_rgba(11,79,108,0.6)] ring-1 ring-white/10 mt-10">
            <div className="rounded-[2rem] bg-[#F3F8F8] p-5 min-h-[470px]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Near you</p>
                  <p className="font-extrabold text-[#0D1B1E] text-lg">Kitchens</p>
                </div>
                <span className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500"><Search size={16} /></span>
              </div>

              {/* segmented */}
              <div className="relative grid grid-cols-2 p-1 rounded-full bg-white border border-slate-200 mb-4">
                <span
                  className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-[#0D1B1E] transition-transform duration-300"
                  style={{ transform: onlyVerified ? "translateX(100%)" : "translateX(0)" }}
                />
                {[
                  { label: "All", v: false },
                  { label: "Verified", v: true },
                ].map((o) => (
                  <button
                    key={o.label}
                    onClick={() => setOnlyVerified(o.v)}
                    className={`relative z-10 py-2 text-sm font-bold rounded-full transition-colors flex items-center justify-center gap-1.5 ${onlyVerified === o.v ? "text-white" : "text-slate-500"}`}
                  >
                    {o.v ? <BadgeCheck size={14} className={onlyVerified === o.v ? "text-[#5EE6D0]" : ""} /> : null}
                    {o.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {list.map((k) => (
                  <div
                    key={k.name}
                    className={`flex items-center gap-3 rounded-2xl bg-white p-3 border transition-all animate-[fadeUp_0.4s_ease-out] ${
                      k.verified ? "border-[#1E7BD8]/25 shadow-[0_12px_24px_-16px_rgba(30,123,216,0.6)]" : "border-slate-100"
                    }`}
                  >
                    <div className={`w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br ${k.tone}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-[#0D1B1E] text-sm truncate">{k.name}</h4>
                        {k.verified ? <BadgeCheck size={16} className="text-[#1E7BD8] shrink-0" aria-label="Verified" /> : null}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{k.meta}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs font-semibold text-[#0D1B1E]">
                        <span className="inline-flex items-center gap-1"><Star size={12} className="fill-[#FFC21A] text-[#FFC21A]" />{k.rating}</span>
                        <span className="inline-flex items-center gap-1 text-slate-500"><Clock3 size={12} />{k.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* floating chips */}
          <div className="hidden sm:flex absolute -left-2 lg:-left-14 top-[34%] z-20 items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-xl border border-slate-100 animate-[float_4s_ease-in-out_infinite]">
            <span className="w-8 h-8 rounded-full bg-[#1E7BD8]/10 text-[#1E7BD8] flex items-center justify-center"><ShieldCheck size={16} /></span>
            <div>
              <p className="text-[11px] font-extrabold text-[#0D1B1E] leading-tight">Inspected in person</p>
              <p className="text-[10px] text-slate-500">By the FreshBhoj team</p>
            </div>
          </div>
          <div className="hidden sm:flex absolute right-2 lg:right-0 bottom-12 z-20 items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-xl border border-slate-100 animate-[float_5s_ease-in-out_infinite]" style={{ animationDelay: "1s" }}>
            <span className="w-8 h-8 rounded-full bg-[#087F78]/10 text-[#087F78] flex items-center justify-center"><ClipboardCheck size={16} /></span>
            <div>
              <p className="text-[11px] font-extrabold text-[#0D1B1E] leading-tight">Hygiene checked</p>
              <p className="text-[10px] text-slate-500">Licence &amp; storage</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
