import { Clapperboard, BadgeCheck, Leaf, CalendarSync, Beef, Percent, Megaphone, FileCheck2, ListOrdered, UtensilsCrossed, ShoppingBag, type LucideIcon } from "lucide-react";
import { Torana } from "./desi";

type Row = { icon: LucideIcon; title: string; text: string };

const CUSTOMER: Row[] = [
  { icon: Clapperboard, title: "Watch meals being made", text: "Short reels and stories show the dish before you order it." },
  { icon: BadgeCheck, title: "Verified kitchens with FSSAI", text: "Kitchens our team has visited in person earn a Verified badge." },
  { icon: Leaf, title: "Calories and protein on every dish", text: "Know what you are eating before you order." },
  { icon: CalendarSync, title: "Daily tiffin subscriptions", text: "Pick a plan, swap a meal, pause or skip any day." },
  { icon: Beef, title: "BhojFit healthy meals", text: "Daily calorie and protein targets for your goal." },
];

const KITCHEN: Row[] = [
  { icon: Percent, title: "Free listing, 0% commission at launch", text: "For tiffin services, cloud kitchens, restaurants and cafés." },
  { icon: Clapperboard, title: "Reels and stories to get discovered", text: "Show your food to nearby customers at no cost." },
  { icon: FileCheck2, title: "FSSAI help", text: "No licence yet? We will help you get it filed." },
  { icon: ListOrdered, title: "Orders and payouts dashboard", text: "Accept orders, track earnings and withdraw to your bank." },
  { icon: Megaphone, title: "Grow with ads and subscriptions", text: "Boost your kitchen and turn first-time buyers into regulars." },
];

function Column({ title, icon: Icon, rows, dark }: { title: string; icon: LucideIcon; rows: Row[]; dark?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2.5rem] p-7 lg:p-10 ${
        dark ? "bg-[#0D1B1E] text-white shadow-[0_30px_70px_-30px_rgba(11,79,108,0.7)]" : "bg-white border border-slate-100 shadow-[0_30px_70px_-40px_rgba(8,127,120,0.5)]"
      }`}
    >
      <div className={`pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl ${dark ? "bg-[#087F78]/40" : "bg-[#1DB9A0]/15"}`} />
      <div className="relative flex items-center gap-3 mb-6">
        <span className={`w-11 h-11 rounded-2xl flex items-center justify-center ${dark ? "bg-white/10 text-[#FFC21A]" : "bg-[#087F78]/10 text-[#087F78]"}`}><Icon size={22} /></span>
        <h3 className="text-2xl lg:text-3xl font-extrabold">{title}</h3>
      </div>
      <ul className="relative flex flex-col gap-3">
        {rows.map(({ icon: RowIcon, title: t, text }) => (
          <li key={t} className={`flex items-start gap-4 rounded-2xl px-4 py-3.5 ${dark ? "bg-white/[0.06] border border-white/10" : "bg-[#F3F8F8]"}`}>
            <span className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${dark ? "bg-white/10 text-[#5EE6D0]" : "bg-white text-[#087F78] shadow-sm"}`}><RowIcon size={18} /></span>
            <div>
              <p className="font-extrabold leading-snug">{t}</p>
              <p className={`text-sm leading-relaxed ${dark ? "text-white/65" : "text-slate-500"}`}>{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative w-full font-sans pt-20 pb-16 lg:pt-28 lg:pb-24 bg-gradient-to-b from-white via-[#EFFAF8] to-white overflow-hidden">
      <Torana />
      <div className="pointer-events-none absolute top-10 -left-24 w-[380px] h-[380px] rounded-full bg-[#1DB9A0]/15 blur-[110px]" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0D1B1E] leading-[1.05] mb-4">
            What you{" "}
            <span className="inline-block pr-[0.14em] -mr-[0.14em] bg-gradient-to-r from-[#1DB9A0] via-[#087F78] to-[#0B4F6C] bg-clip-text text-transparent">
              <span className="italic" style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}>get.</span>
            </span>
          </h2>
          <p className="text-slate-500 text-base md:text-lg">Watch it being made, check the nutrition, trust the kitchen, then order.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <Column title="For customers" icon={ShoppingBag} rows={CUSTOMER} />
          <Column title="For kitchens" icon={UtensilsCrossed} rows={KITCHEN} dark />
        </div>
      </div>
    </section>
  );
}
