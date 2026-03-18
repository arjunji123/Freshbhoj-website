"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="w-full overflow-hidden bg-[#0F172A] border-t border-white/5"
    >
      <div className="w-full max-w-7xl mx-auto px-6 py-16 lg:py-24 flex flex-col items-center">

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
                style={{ background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)" }}
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
              className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 transition-all hover:-translate-y-1 shadow-lg overflow-hidden group/social"
            >
              {/* Gradient Hover Layer */}
              <div
                className="absolute inset-0 opacity-0 group-hover/social:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)" }}
              />

              <div className="relative w-5 h-5 brightness-0 invert z-10">
                <Image
                  src={social.src}
                  alt={social.alt}
                  fill
                  className="object-contain"
                />
              </div>
            </a>
          ))}
        </div>

        {/* Visionary Tagline & Copyright */}
        <div className="text-center flex flex-col items-center max-w-4xl">
          <h4
            className="text-white text-2xl md:text-3xl lg:text-5xl mb-12 italic leading-tight opacity-90 transition-all hover:opacity-100 duration-500"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            "Your Feed is Now Your Menu."
          </h4>

          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-10" />

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

