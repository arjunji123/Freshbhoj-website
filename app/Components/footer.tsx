"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type MouseEvent } from "react";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    ref.current!.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current!.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <footer
      ref={ref}
      onMouseMove={onMove}
      className="group/footer relative w-full overflow-hidden bg-[#0D1B1E]"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#1DB9A0] to-transparent" />
      {/* ambient drifting glows (always on) */}
      <div className="pointer-events-none absolute -top-32 left-[15%] w-[520px] h-[320px] rounded-full bg-[#087F78]/30 blur-[110px] animate-[drift_14s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute top-1/3 -right-20 w-[360px] h-[360px] rounded-full bg-[#FFC21A]/15 blur-[110px] animate-[drift_18s_ease-in-out_infinite_reverse]" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 w-[420px] h-[300px] rounded-full bg-[#0B4F6C]/50 blur-[110px] animate-[drift_16s_ease-in-out_infinite]" />
      {/* cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover/footer:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(29,185,160,0.22), rgba(255,194,26,0.07) 45%, transparent 70%)" }}
      />
      <div className="relative w-full max-w-7xl mx-auto px-6 py-16 lg:py-24 flex flex-col items-center">

        {/* Logo */}
        <div className="mb-12 transition-transform hover:scale-110 duration-500 flex justify-center w-full">
          <div className="relative h-16 lg:h-20 w-64 lg:w-72">
            <Image
              src="/freshbhoj-red-new.svg"
              alt="FreshBhoj"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex flex-row flex-wrap justify-center items-center gap-6 md:gap-12 mb-12">
          {[
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms of Service", href: "/terms-of-service" },
            { label: "Contact Us", href: "/contact-us" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-slate-400 font-medium text-sm lg:text-base hover:text-white transition-all relative group"
            >
              {link.label}
              <span
                className="absolute -bottom-1 left-0 w-0 h-px transition-all group-hover:w-full"
                style={{ background: "linear-gradient(169.21deg, #1DB9A0 9%, #087F78 77%, #0B4F6C 100%)" }}
              />
            </Link>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-12 w-full">
          {[
            { src: "/x.svg", alt: "X", href: "https://x.com/freshbhoj" },
            { src: "/insta.svg", alt: "Insta", href: "https://www.instagram.com/freshbhoj" },
            { src: "/linkedin.svg", alt: "Linkedin", href: "https://www.linkedin.com/company/freshbhoj/" },
            { src: "/whatsapp.svg", alt: "Whatsapp", href: "https://wa.me/918058318556" },
          ].map((social) => (
            <a
              key={social.alt}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.alt}
              className="group/social relative w-12 h-12 rounded-full p-px bg-[linear-gradient(135deg,#5EE6D0,rgba(255,255,255,0.08)_45%,#FFC21A)] shadow-[0_0_18px_-4px_rgba(29,185,160,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_34px_2px_rgba(29,185,160,0.75)]"
            >
              <span className="relative flex w-full h-full items-center justify-center rounded-full bg-[#0D1B1E] overflow-hidden">
                <span className="absolute inset-0 opacity-0 group-hover/social:opacity-100 transition-opacity duration-300 bg-[linear-gradient(135deg,#1DB9A0,#087F78_55%,#0B4F6C)]" />
                <span className="relative z-10 w-5 h-5 brightness-0 invert">
                  <Image src={social.src} alt="" fill className="object-contain" />
                </span>
              </span>
            </a>
          ))}
        </div>

        {/* Visionary Tagline & Copyright */}
        <div className="text-center flex flex-col items-center max-w-4xl">
          <h4
            className="text-white text-2xl md:text-3xl lg:text-5xl mb-12 italic leading-tight opacity-90 transition-all hover:opacity-100 duration-500"
            style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}
          >
            &ldquo;Your Feed is Now{" "}
            <span className="bg-gradient-to-r from-[#5EE6D0] to-[#FFC21A] bg-clip-text text-transparent">Your Menu.</span>&rdquo;
          </h4>

          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-[#1DB9A0] to-transparent mb-10" />

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 opacity-40">
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em]">
              FreshBhoj AI Platforms © 2026
            </p>
            <span className="hidden md:block w-1 h-1 rounded-full bg-white/30" />
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em]">
              Pioneering Visual Discovery
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}

