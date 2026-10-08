"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ─── Card data ──────────────────────────────────────────────── */
const KITCHEN_TYPES = [
  {
    iconSrc: "/cloud-kitchen.svg",
    iconAlt: "Open to every food business icon",
    title: "Open to Every\nFood Business",
    description: "Restaurants, dhabas, cafés, bakeries, cloud kitchens, home kitchens — if you cook great food, you can sell on FreshBhoj.",
  },
  {
    iconSrc: "/shield-check.svg",
    iconAlt: "Verified by FreshBhoj icon",
    title: "Verified\nin Person",
    description: "Our team visits and inspects kitchens in person. Verified kitchens earn a badge and are shown separately to customers.",
  },
  {
    iconSrc: "/street-vendor.svg",
    iconAlt: "Reels icon",
    title: "Food Reels\nThat Sell",
    description: "Show your dishes in short videos and stories so customers can see exactly what they are ordering.",
  },
  {
    iconSrc: "/homestyle-thalis.svg",
    iconAlt: "Subscriptions icon",
    title: "Subscriptions &\nRepeat Orders",
    description: "Offer daily and weekly plans so happy customers keep coming back, without paying for ads every time.",
  },
] as const;

export default function EmpoweringKitchen() {
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
      className="w-full relative overflow-hidden font-sans py-16 lg:py-28 bg-[#F3F8F8]"
    >
      <div className="w-full max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <div
          className={`
            text-center mb-16 lg:mb-24
            transition-all duration-1000 ease-out flex flex-col items-center
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
          `}
        >
          {/* Pill Label */}
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 mb-8 bg-[#087F78]/10 border border-[#087F78]/20">
            <div className="relative w-4 h-4">
              <Image
                src="/star-circle.svg"
                fill
                className="object-contain"
                alt="location"
              />
            </div>
            <span className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] text-[#087F78]" style={{
              background: "linear-gradient(169.21deg, #1DB9A0 9%, #087F78 77%, #0B4F6C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Food Marketplace
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#0D1B1E] mb-8 leading-tight lg:max-w-none tracking-tight">
            Built for Every <span className="text-[#087F78]" style={{
              background: "linear-gradient(169.21deg, #1DB9A0 9%, #087F78 77%, #0B4F6C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>Food Business</span>
          </h2>

          <p className="font-medium text-center text-slate-500 text-base md:text-xl leading-relaxed max-w-2xl lg:max-w-4xl">
            Anyone who makes good food can sell on FreshBhoj. <br className="hidden lg:block" />
            Kitchens that we verify in person get a Verified badge and are shown separately, so customers always know who they can trust.
          </p>
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
          {KITCHEN_TYPES.map(({ iconSrc, title, description }, i) => (
            <div
              key={i}
              className={`
                flex flex-col group
                bg-white border border-slate-100 rounded-[2.5rem]
                p-10 lg:p-10
                transition-all ease-out duration-700
                hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}
              `}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Icon badge */}
              <div className="mb-8">
                <div className="relative w-10 h-10">
                  <Image
                    src={iconSrc}
                    alt="icon"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Header & Paragraph Group */}
              <div>
                <h3 className="text-[#0D1B1E] font-extrabold text-2xl lg:text-2xl mb-4 leading-tight tracking-tight whitespace-pre-line group-hover:text-[#087F78] transition-colors">
                  {title}
                </h3>
                <p className="text-slate-500 font-medium text-sm lg:text-base leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div
          className={`
            flex flex-col items-center justify-center transition-all duration-1000 ease-out delay-500
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
          `}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/partner/login"
              className="group relative inline-flex items-center justify-center gap-4 px-12 py-5 bg-hero-gradient text-white font-semibold text-lg lg:text-xl rounded-3xl shadow-[0_15px_30px_-5px_rgba(8,127,120,0.3)] transition-all hover:scale-105"
            >
              <span>Register Your Kitchen</span>
              <div className="relative w-6 h-6">
                <Image
                  src="/rocket.svg"
                  alt="Register Icon"
                  fill
                  className="object-contain transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>
            <Link
              href="/partner/login"
              className="inline-flex items-center justify-center px-10 py-5 border-2 border-[#087F78]/20 text-[#087F78] font-semibold text-lg lg:text-xl rounded-3xl transition-all hover:bg-[#087F78]/5 hover:scale-105"
            >
              Already a partner? Log in
            </Link>
          </div>

          <p className="mt-8 text-[#64748B] text-sm lg:text-base tracking-widest">
            Join over 1,200+  partners across India
          </p>
        </div>

      </div>
    </section>
  );
}

