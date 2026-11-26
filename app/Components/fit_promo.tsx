import Link from "next/link";
import { ArrowUpRight, Droplets, Gauge, SlidersHorizontal, Target } from "lucide-react";
import BhojFitIcon from "./BhojFitIcon";

const PERKS = [
  { icon: Target, text: "Goal-based daily targets" },
  { icon: SlidersHorizontal, text: "High protein and low kcal filters" },
  { icon: Gauge, text: "Live cart nutrition meter" },
  { icon: Droplets, text: "Hydration tracker" },
] as const;

/** Home-page promo for /bhojfit. The whole card is the link (no separate button), so the home CTA rule stays intact. */
export default function FitPromo() {
  return (
    <section className="relative w-full font-sans py-16 lg:py-24 bg-[#F3F8F8]">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          href="/bhojfit"
          aria-label="Explore Bhoj Fit"
          className="group relative block overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] bg-[#0D1B1E] text-white p-8 lg:p-14 shadow-[0_30px_70px_-30px_rgba(11,79,108,0.7)] hover:-translate-y-1 transition-transform duration-500"
        >
          <div className="pointer-events-none absolute -top-24 -left-20 w-80 h-80 rounded-full bg-[#12865F]/50 blur-3xl animate-[drift_14s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute -bottom-28 -right-16 w-80 h-80 rounded-full bg-[#FFC21A]/15 blur-3xl" />
          <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <BhojFitIcon size={56} />
                <span className="text-2xl font-extrabold">Bhoj <span className="text-[#C6F432] italic">Fit</span></span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-4">
                Eat for your{" "}
                <span className="inline-block pr-[0.14em] -mr-[0.14em] bg-gradient-to-r from-[#5EE6D0] to-[#FFC21A] bg-clip-text text-transparent">
                  <span className="italic" style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}>goal.</span>
                </span>
              </h2>
              <p className="text-white/70 text-base lg:text-lg leading-relaxed max-w-xl mb-6">
                A daily calorie and protein target, with macros on every meal.
              </p>
              <span className="inline-flex items-center gap-2 font-extrabold text-[#FFC21A]">
                Explore Bhoj Fit <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
            </div>
            <ul className="grid gap-3">
              {PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-4 rounded-2xl bg-white/[0.06] border border-white/10 px-4 py-3.5 group-hover:bg-white/10 transition-colors">
                  <span className="w-10 h-10 shrink-0 rounded-xl bg-white/10 text-[#5EE6D0] flex items-center justify-center"><Icon size={18} /></span>
                  <span className="font-bold">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </Link>
      </div>
    </section>
  );
}
