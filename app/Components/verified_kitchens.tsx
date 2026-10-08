"use client";

import { useEffect, useRef, useState } from "react";
import { BadgeCheck, MapPinned, ClipboardCheck, Star } from "lucide-react";

const STEPS = [
  {
    icon: MapPinned,
    title: "We visit in person",
    description: "A FreshBhoj team member physically visits the kitchen — no paperwork-only approvals.",
  },
  {
    icon: ClipboardCheck,
    title: "Hygiene & quality check",
    description: "Cleanliness, storage, ingredients and licences are checked against our checklist.",
  },
  {
    icon: BadgeCheck,
    title: "Badge & priority listing",
    description: "Passing kitchens get a Verified badge and appear in their own Verified section in the app.",
  },
] as const;

const SAMPLE = [
  { name: "Sharma Family Kitchen", meta: "North Indian · 1.2 km", rating: "4.8", verified: true },
  { name: "Highway Dhaba Express", meta: "Punjabi · 2.4 km", rating: "4.5", verified: true },
  { name: "Night Owl Café", meta: "Snacks · 3.1 km", rating: "4.3", verified: false },
] as const;

export default function VerifiedKitchens() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="verified" className="w-full font-sans py-16 lg:py-28 bg-white overflow-hidden">
      <div
        className={`w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center transition-all duration-1000 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div>
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 mb-8 bg-[#1E7BD8]/10 border border-[#1E7BD8]/20">
            <BadgeCheck size={16} className="text-[#1E7BD8]" />
            <span className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] text-[#1E7BD8]">
              FreshBhoj Verified
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0D1B1E] mb-6 leading-tight tracking-tight">
            Trust you can <span className="text-[#087F78]">see</span>
          </h2>
          <p className="text-slate-500 text-base md:text-xl leading-relaxed mb-10 max-w-xl">
            Every kitchen is welcome to sell. The ones we visit and verify in person get a Verified badge and are
            shown separately — so you always know where your food is coming from.
          </p>
          <div className="flex flex-col gap-6">
            {STEPS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 rounded-2xl bg-[#087F78]/10 flex items-center justify-center">
                  <Icon size={20} className="text-[#087F78]" strokeWidth={2.2} />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#0D1B1E] text-lg mb-1">{title}</h3>
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-[#F3F8F8] border border-slate-100 p-6 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-5">Near you</p>
          <div className="flex flex-col gap-4">
            {SAMPLE.map((k) => (
              <div
                key={k.name}
                className={`flex items-center justify-between gap-4 rounded-3xl bg-white p-5 border ${
                  k.verified ? "border-[#1E7BD8]/30 shadow-[0_10px_30px_-15px_rgba(30,123,216,0.4)]" : "border-slate-100"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-[#0D1B1E] truncate">{k.name}</h4>
                    {k.verified ? <BadgeCheck size={18} className="text-[#1E7BD8] shrink-0" aria-label="Verified" /> : null}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{k.meta}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-[#0D1B1E]">
                    <Star size={14} className="fill-[#FFC21A] text-[#FFC21A]" /> {k.rating}
                  </span>
                  {k.verified ? (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#1E7BD8] bg-[#1E7BD8]/10 rounded-full px-3 py-1">
                      Verified
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
