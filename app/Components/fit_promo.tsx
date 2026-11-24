import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/** Home-page promo for /fit. The whole band is the link, so the home CTA rule stays intact. */
export default function FitPromo() {
  return (
    <section className="w-full font-sans py-20 md:py-28 bg-[#F3F8F8]">
      <div className="max-w-6xl mx-auto px-6">
        <Link
          href="/fit"
          aria-label="Explore FreshBhoj Fit"
          className="group relative block overflow-hidden rounded-[2.5rem] bg-[#0D1B1E] text-white p-10 md:p-16 shadow-[0_30px_70px_-30px_rgba(11,79,108,0.7)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087F78]"
        >
          <div className="pointer-events-none absolute -top-24 -right-20 w-96 h-96 rounded-full bg-[#087F78]/50 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-[#5EE6D0] mb-5">FreshBhoj Fit</p>
            <h2 className="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight mb-5">
              Eat for your{" "}
              <span className="text-[#FFC21A]" style={{ fontFamily: "var(--font-instrument), Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>goal.</span>
            </h2>
            <p className="text-white/75 text-lg md:text-xl leading-relaxed mb-8">
              Daily calorie and protein targets, with the macros shown on every meal.
            </p>
            <span className="inline-flex items-center gap-2 font-extrabold text-[#FFC21A]">
              Explore Fit <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
