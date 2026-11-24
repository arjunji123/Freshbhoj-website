import Image from "next/image";
import Link from "next/link";

const LINKS = [
  { label: "Fit", href: "/fit" },
  { label: "Contact", href: "/contact-us" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];

const SOCIALS = [
  { src: "/x.svg", alt: "X", href: "https://x.com/freshbhoj" },
  { src: "/insta.svg", alt: "Instagram", href: "https://www.instagram.com/freshbhoj" },
  { src: "/linkedin.svg", alt: "LinkedIn", href: "https://www.linkedin.com/company/freshbhoj/" },
  { src: "/whatsapp.svg", alt: "WhatsApp", href: "https://wa.me/918058318556" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#0D1B1E] font-sans">
      <div className="max-w-6xl mx-auto px-6 py-14 flex flex-col items-center gap-8">
        <Link href="/" aria-label="FreshBhoj home" className="relative block h-10 w-44">
          <Image src="/freshbhoj-red-new.svg" alt="FreshBhoj" fill className="object-contain" />
        </Link>

        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="text-slate-300 text-sm font-medium hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.alt}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.alt}
              className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <span className="relative w-5 h-5 brightness-0 invert">
                <Image src={s.src} alt="" fill className="object-contain" />
              </span>
            </a>
          ))}
        </div>

        <p className="text-slate-400 text-sm text-center">&copy; 2026 FreshBhoj AI Platforms. Made with <span className="text-[#FFC21A]">&hearts;</span> in India.</p>
      </div>
    </footer>
  );
}
