import { Torana } from "./desi";

const ITEMS = [
  ["Dhabas", "ढाबा"], ["Home Kitchens", "घर का खाना"], ["Tiffin Services", "टिफिन"], ["Mithai & Bakeries", "मिठाई"],
  ["Cafés", "कैफ़े"], ["Thali Houses", "थाली"], ["Cloud Kitchens", "क्लाउड किचन"], ["Street Food", "चाट-पकौड़ी"],
  ["Restaurants", "रेस्टोरेंट"], ["Juice Bars", "जूस"],
] as const;

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative w-full bg-[#0D1B1E] pt-10 pb-5 overflow-hidden border-y border-white/5 jaali-dark" aria-label="Every kind of food business sells on FreshBhoj">
      <Torana />
      <div className="marquee-track flex w-max gap-10 items-center">
        {row.map(([en, hi], i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span className="flex items-baseline gap-3">
              <span className="text-white/85 font-bold uppercase tracking-[0.2em] text-xs md:text-sm">{en}</span>
              <span className="font-deva text-[#FFC21A] text-lg md:text-xl">{hi}</span>
            </span>
            <span className="w-2 h-2 rotate-45 bg-[#1DB9A0]" />
          </span>
        ))}
      </div>
    </div>
  );
}
