"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ─── Card data ──────────────────────────────────────────────── */
const PROBLEMS = [
  {
    iconSrc: "/overwhelming.svg",
    iconAlt: "Overwhelming choice icon",
    iconTint: "bg-red-50",
    title: "Overwhelming Choice",
    description:
      "Static images and text descriptions don't tell the real story. 70% of users spend 15+ minutes just deciding what to eat.",
    fix: "THE FIX: Visual first discovery",
    fixColor: "text-[#BA2121]",
    fixHref: "#visual-first",
  },
  {
    iconSrc: "/invisible.svg",
    iconAlt: "Invisible kitchens icon",
    iconTint: "bg-amber-50",
    title: "Invisible Kitchens",
    description:
      "Amazing local home-chefs and boutique kitchens are buried under high advertising costs of big platforms.",
    fix: "THE FIX: Creator-led growth",
    fixColor: "text-amber-600",
    fixHref: "#creator-growth",
  },
  {
    iconSrc: "/broken.svg",
    iconAlt: "Broken subscriptions icon",
    iconTint: "bg-blue-50",
    title: "Broken Subscriptions",
    description:
      "Subscription models today are rigid and uninspiring. Users want flexibility, variety, and the ability to see what's cooking.",
    fix: "THE FIX: AI-smart subscriptions",
    fixColor: "text-blue-500",
    fixHref: "#ai-subscriptions",
  },
] as const;

/* ─── Component ──────────────────────────────────────────────── */
export default function WhyFoodDelivery() {
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
      className="w-full relative overflow-hidden bg-white font-sans py-16 lg:py-28"
    >
      <div className="w-full max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <div
          className={`
            text-center mb-16 lg:mb-24
            transition-all duration-1000 ease-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
          `}
        >
          <div className="mb-4">
            <p
              className="inline-block text-xs md:text-sm font-bold tracking-[0.2em] uppercase"
              style={{
                background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              The Reality Check
            </p>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#0F172A] mb-6 leading-tight tracking-tight">
            Why food delivery is <span className="italic font-bold inline-block" style={{ fontFamily: "'Playfair Display', serif" }}>broken</span>
          </h2>

          <p className="font-medium mx-auto text-slate-500 text-base md:text-xl leading-relaxed max-w-2xl lg:max-w-4xl">
            Existing platforms focus on logistics, not taste. We&apos;re solving the fundamental <br className="hidden lg:block" />
            gaps in the modern dining experience.
          </p>
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {PROBLEMS.map(
            ({ iconSrc, iconAlt, iconTint, title, description, fix, fixColor, fixHref }, i) => (
              <div
                key={title}
                onClick={() => {
                  const id = fixHref.replace('#', '');
                  const element = document.getElementById(id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className={`
                  flex flex-col justify-between
                  bg-white border border-slate-100 rounded-[2.5rem]
                  p-10 lg:p-12 cursor-pointer group/card
                  transition-all ease-out duration-700
                  hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}
                `}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div>
                  {/* Icon badge */}
                  <div className="mb-10 transition-transform group-hover/card:scale-110 duration-500">
                    <Image
                      src={iconSrc}
                      alt={iconAlt}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-[#0F172A] font-extrabold mb-5 text-2xl lg:text-3xl tracking-tight">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-500 font-medium text-base lg:text-lg mb-10 leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Bottom elements */}
                <div>
                  <div className="w-12 h-1 bg-slate-100 rounded-full mb-8" />
                  <div
                    className={`group inline-flex items-center gap-2 font-bold text-sm lg:text-base tracking-widest uppercase ${fixColor} transition-all`}
                  >
                    {fix}
                    <span className="transition-transform group-hover/card:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

      </div>
    </section>
  );
}

