import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

const FOODIE_PERKS = ["Early access to top-rated Reels", "30 days of free delivery", "First to know when the app launches"];
const KITCHEN_PERKS = ["₹5,000 in sponsored credits", "Priority AI video production", "Free help with your FSSAI licence"];

const CARDS = [
  { label: "For foodies", big: "₹100", sub: "wallet credit, instantly", perks: FOODIE_PERKS, href: "/pre-register?type=foodie", cta: "Pre-register now" },
  { label: "For kitchens", big: "0%", sub: "commission for the first 3 months", perks: KITCHEN_PERKS, href: "/partner/login", cta: "Register your kitchen" },
];

export default function PreRegistration() {
  return (
    <section id="pre-reg" className="relative w-full overflow-hidden font-sans py-20 md:py-28 bg-[linear-gradient(150deg,#14ADA0_0%,#087F78_45%,#0B4F6C_100%)]">
      <div className="pointer-events-none absolute -top-40 -right-32 w-[520px] h-[520px] rounded-full bg-[#5EE6D0]/25 blur-[120px]" />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.05] tracking-tight mb-4">
            Join early.{" "}
            <span className="text-[#FFC21A]" style={{ fontFamily: "var(--font-instrument), Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>Win big.</span>
          </h2>
          <p className="text-white/85 text-lg md:text-xl leading-relaxed">Early members get rewards before the public launch. Spots are limited.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {CARDS.map((c) => (
            <div key={c.label} className="flex flex-col rounded-3xl bg-white border border-slate-100 p-8 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.45)]">
              <p className="text-sm font-bold uppercase tracking-widest text-[#087F78] mb-4">{c.label}</p>
              <p className="text-7xl font-extrabold leading-none tracking-tight text-[#087F78]">{c.big}</p>
              <p className="text-slate-600 font-semibold mt-2 mb-6">{c.sub}</p>
              <ul className="flex flex-col gap-3 mb-8">
                {c.perks.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[#0D1B1E] font-medium">
                    <Check size={18} className="mt-0.5 shrink-0 text-[#087F78]" strokeWidth={3} /> {p}
                  </li>
                ))}
              </ul>
              <Link
                href={c.href}
                className="mt-auto inline-flex items-center justify-center gap-2 h-14 rounded-full bg-[#087F78] text-white font-extrabold text-base hover:bg-[#0B4F6C] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087F78]"
              >
                {c.cta} <ArrowUpRight size={18} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
