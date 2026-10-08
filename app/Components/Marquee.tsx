const ITEMS = ["Restaurants", "Dhabas", "Cafés", "Bakeries & Sweets", "Home Kitchens", "Cloud Kitchens", "Thali Houses", "Street Food Stalls", "Tiffin Services", "Juice Bars"];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="w-full bg-[#0D1B1E] py-5 overflow-hidden border-y border-white/5" aria-label="Every kind of food business sells on FreshBhoj">
      <div className="marquee-track flex w-max gap-10 items-center">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 text-white/80 font-bold uppercase tracking-[0.2em] text-xs md:text-sm whitespace-nowrap">
            {t}
            <span className="w-2 h-2 rounded-full bg-[#FFC21A]" />
          </span>
        ))}
      </div>
    </div>
  );
}
