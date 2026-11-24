import Image from "next/image";
import { BadgeCheck, Clock3, Star } from "lucide-react";

const KITCHENS = [
  { name: "Sharma Family Kitchen", meta: "North Indian · 1.2 km", rating: "4.8", time: "25 min", tone: "from-[#FFE7A8] to-[#FFC21A]", img: "/food/rice.webp" },
  { name: "Highway Dhaba Express", meta: "Punjabi · 2.4 km", rating: "4.5", time: "35 min", tone: "from-[#FFD9B0] to-[#F59E0B]", img: "/food/naan.webp" },
  { name: "Momo Junction", meta: "Snacks · 3.1 km", rating: "4.6", time: "30 min", tone: "from-[#D3F1EE] to-[#5EE6D0]", img: "/food/momo.webp" },
] as const;

export default function VerifiedKitchens() {
  return (
    <section id="verified" className="w-full font-sans py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <h2 className="text-4xl md:text-6xl font-extrabold text-[#0D1B1E] leading-[1.05] tracking-tight mb-4">
            Kitchens we{" "}
            <span className="text-[#087F78]" style={{ fontFamily: "var(--font-instrument), Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>visit ourselves.</span>
          </h2>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
            Our team checks hygiene, storage and licences in person. Kitchens that pass earn a Verified badge.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {KITCHENS.map((k) => (
            <article key={k.name} className="rounded-3xl bg-white border border-slate-100 overflow-hidden shadow-[0_20px_50px_-30px_rgba(11,79,108,0.45)]">
              <div className={`relative h-48 bg-gradient-to-br ${k.tone}`}>
                <Image src={k.img} alt="" fill sizes="(max-width: 768px) 100vw, 360px" className="object-cover" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#087F78] shadow-sm">
                  <BadgeCheck size={14} /> Verified
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-extrabold text-[#0D1B1E] tracking-tight">{k.name}</h3>
                <p className="text-sm text-slate-500 mt-1 mb-4">{k.meta}</p>
                <div className="flex items-center gap-4 text-sm font-semibold text-[#0D1B1E]">
                  <span className="inline-flex items-center gap-1"><Star size={14} className="fill-[#FFC21A] text-[#FFC21A]" />{k.rating}</span>
                  <span className="inline-flex items-center gap-1 text-slate-500"><Clock3 size={14} />{k.time}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
