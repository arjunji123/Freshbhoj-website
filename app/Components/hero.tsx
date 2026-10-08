"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type PointerEvent } from "react";
import { ArrowUpRight, BadgeCheck, Leaf, Truck, ShieldCheck, Flame, CalendarSync } from "lucide-react";
import Navbar from "./navbar";

const serif = { fontFamily: "var(--font-instrument), Georgia, serif", fontStyle: "italic" as const, fontWeight: 400 };

const Hero = () => {
  const stage = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = stage.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${x * 8}deg`);
    el.style.setProperty("--rx", `${-y * 6}deg`);
  };
  const onLeave = () => {
    stage.current?.style.setProperty("--ry", "0deg");
    stage.current?.style.setProperty("--rx", "0deg");
  };

  return (
    <section
      className="relative w-full flex flex-col font-sans overflow-hidden lg:min-h-screen bg-[linear-gradient(150deg,#14ADA0_0%,#087F78_42%,#0B4F6C_100%)]"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {/* ── Background layers ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 w-[620px] h-[620px] rounded-full bg-[#5EE6D0]/35 blur-[120px] animate-[drift_16s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 right-[12%] w-[460px] h-[460px] rounded-full bg-[#FFC21A]/25 blur-[130px] animate-[drift_20s_ease-in-out_infinite_reverse]" />
        <div className="absolute -bottom-48 -right-24 w-[620px] h-[620px] rounded-full bg-[#0B4F6C]/70 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />
        {/* concentric rings behind the phone */}
        <div className="hidden lg:block absolute right-[6%] top-1/2 -translate-y-1/2 w-[760px] h-[760px]">
          <span className="absolute inset-0 rounded-full border border-white/15" />
          <span className="absolute inset-[90px] rounded-full border border-white/15" />
          <span className="absolute inset-[180px] rounded-full border border-white/20" />
          <span className="absolute inset-[250px] rounded-full bg-white/5 blur-2xl" />
        </div>
      </div>

      <Navbar />

      {/* ── Body ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-6 px-6 pt-32 lg:pt-28 pb-16 lg:pb-16 lg:flex-1">
        {/* Copy */}
        <div className="w-full lg:w-[52%] flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/12 border border-white/25 backdrop-blur-md pl-2 pr-4 py-1.5 mb-7">
            <span className="rounded-full bg-[#FFC21A] text-[#0D1B1E] px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest">New</span>
            <span className="text-white text-xs lg:text-sm font-bold">Early access is open</span>
          </div>

          <h1 className="font-extrabold text-white text-[2.9rem] sm:text-6xl lg:text-[3.9vw] xl:text-[4.7rem] leading-[1.02] tracking-[-0.03em] mb-5">
            India&apos;s First
            <br />
            <span className="relative inline-block pr-[0.1em] text-[#FFC21A] text-[1.12em]" style={serif}>
              Reel–Based
              <svg className="absolute left-0 -bottom-2 w-full h-3 text-[#FFC21A]/80" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden>
                <path d="M2 8 C 40 2, 70 12, 110 6 S 170 2, 198 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
            <br />
            Food Discovery
          </h1>

          <p className="text-white/85 text-base md:text-lg lg:text-xl leading-relaxed max-w-xl mb-7">
            Watch it being made, check the nutrition, order in one tap. Fresh food from kitchens we verify in person.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto mb-7">
            <Link
              href="/pre-register?type=foodie"
              className="group inline-flex items-center justify-center gap-3 h-14 pl-8 pr-2 rounded-full bg-white text-[#0D1B1E] font-extrabold text-base lg:text-lg shadow-[0_20px_50px_-15px_rgba(0,0,0,0.45)] hover:scale-[1.03] active:scale-95 transition-transform"
            >
              Pre-Register Now
              <span className="w-10 h-10 rounded-full flex items-center justify-center text-white group-hover:rotate-45 transition-transform" style={{ background: "linear-gradient(135deg,#14ADA0,#0B4F6C)" }}>
                <ArrowUpRight size={20} />
              </span>
            </Link>
            <Link
              href="/partner/login"
              className="inline-flex items-center justify-center h-14 px-8 rounded-full border border-white/40 bg-white/10 backdrop-blur-md text-white font-bold text-base lg:text-lg hover:bg-white/20 hover:scale-[1.03] active:scale-95 transition-all"
            >
              Register Your Kitchen
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-24">
                <Image src="/Social.png" alt="" fill className="object-contain object-left" />
              </div>
              <p className="text-white/85 text-sm font-medium leading-tight">
                <span className="block text-white font-extrabold text-base">2,500+</span>
                foodies on the waitlist
              </p>
            </div>
            <span className="hidden sm:block w-px h-10 bg-white/25" />
            <ul className="flex flex-wrap gap-2">
              {[
                { icon: ShieldCheck, t: "Verified kitchens" },
                { icon: Leaf, t: "Real nutrition" },
                { icon: CalendarSync, t: "Flexible plans" },
              ].map(({ icon: Icon, t }) => (
                <li key={t} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/90">
                  <Icon size={13} className="text-[#FFC21A]" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Visual */}
        <div className="relative w-full lg:w-[44%] flex justify-center lg:justify-end [perspective:1200px]">
          <div
            ref={stage}
            className="relative w-full max-w-[330px] md:max-w-[400px] lg:w-auto lg:max-w-none lg:h-[min(84vh,880px)] aspect-[9/18.5] transition-transform duration-200 ease-out [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]"
          >
            <div className="absolute inset-0 drop-shadow-[0_45px_45px_rgba(0,0,0,0.35)]">
              <Image src="/phone_image1.png" alt="FreshBhoj app preview" fill priority sizes="(max-width: 1024px) 400px, 450px" className="object-contain scale-[1.18]" />
            </div>

            {/* floating glass cards */}
            <div className="absolute -left-2 sm:-left-8 lg:-left-14 top-[18%] animate-float">
              <div className="flex items-center gap-3 rounded-2xl bg-white/90 backdrop-blur-xl pl-3 pr-5 py-3 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]">
                <span className="w-10 h-10 rounded-xl bg-[#1E7BD8]/10 text-[#1E7BD8] flex items-center justify-center"><BadgeCheck size={20} /></span>
                <span className="leading-tight">
                  <span className="block text-xs font-extrabold text-[#0D1B1E]">Verified kitchen</span>
                  <span className="block text-[10px] text-slate-500">Inspected in person</span>
                </span>
              </div>
            </div>

            <div className="absolute -right-2 sm:-right-6 lg:-right-10 top-[46%] animate-float [animation-delay:1.2s]">
              <div className="flex items-center gap-3 rounded-2xl bg-white/90 backdrop-blur-xl pl-3 pr-5 py-3 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]">
                <span className="w-10 h-10 rounded-xl bg-[#FFC21A]/20 text-[#F59E0B] flex items-center justify-center"><Flame size={20} /></span>
                <span className="leading-tight">
                  <span className="block text-xs font-extrabold text-[#0D1B1E]">420 kcal · 18g protein</span>
                  <span className="block text-[10px] text-slate-500">On every dish</span>
                </span>
              </div>
            </div>

            <div className="hidden sm:block absolute -left-4 lg:-left-12 bottom-[12%] animate-float [animation-delay:2.2s]">
              <div className="rounded-2xl bg-white/90 backdrop-blur-xl px-4 py-3 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] w-[190px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-lg bg-[#087F78]/10 text-[#087F78] flex items-center justify-center"><Truck size={16} /></span>
                  <span className="text-xs font-extrabold text-[#0D1B1E]">Out for delivery</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <span className="block h-full w-[72%] rounded-full" style={{ background: "linear-gradient(90deg,#1DB9A0,#FFC21A)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
