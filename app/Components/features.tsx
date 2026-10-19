"use client";

import { useState, type MouseEvent } from "react";
import {
  MapPin, Clapperboard, SlidersHorizontal, Truck, CalendarSync, Wallet, Leaf, BadgeCheck, MessagesSquare,
  ListOrdered, Sparkles, Megaphone, Repeat, Banknote, FileCheck2, Crown, Timer, type LucideIcon,
} from "lucide-react";
import { Deva, Eyebrow, Torana } from "./desi";

type Feature = { icon: LucideIcon; title: string; text: string; big?: boolean; chips?: string[] };

const CUSTOMER: Feature[] = [
  { icon: Clapperboard, title: "Reels & Stories", text: "Dish banti hui dekho, phir wahi dish order karo jo abhi dekhi. Apne favourite kitchens ko follow karo — roz ke specials seedha feed me.", big: true, chips: ["Reels", "Stories", "Kitchen follow karo"] },
  { icon: MapPin, title: "Aas-paas & Trending", text: "Paas ke kitchens aur dishes pehle — real orders aur ratings se rank, paise dekar nahi." },
  { icon: Leaf, title: "Har dish pe nutrition", text: "Calories, protein aur health score — saath me Veg / Non-veg / Vegan / Egg aur Jain-friendly tags." },
  { icon: BadgeCheck, title: "Verified kitchens", text: "Jin kitchens ko hum khud visit kar chuke hain, unhe milta hai Verified badge aur apna alag section." },
  { icon: SlidersHorizontal, title: "Smart search", text: "Cuisine, diet ya goal se filter karo — jaise “High Protein” aur “Low Calorie”." },
  { icon: Truck, title: "Live order tracking", text: "Placed → Accepted → Preparing → Out for Delivery → Delivered — sab kuch live, har waqt." },
  { icon: MessagesSquare, title: "Order chat", text: "Apne order ke baare me kitchen se seedha baat karo, asli jawab pao." },
  { icon: CalendarSync, title: "Flexible subscriptions", text: "Kitchen ka plan lo ya apna banao. Kal ka meal badlo, koi bhi din pause ya skip karo.", big: true, chips: ["Kitchen plans", "Apna plan", "Meal badlo", "Pause"] },
  { icon: Wallet, title: "Wallet & FreshBhoj Coins", text: "UPI, card, wallet ya cash — jaise chahe pay karo, aur Refer & Earn se coins kamao." },
  { icon: Repeat, title: "Favourites & reorder", text: "Pasandida dishes aur kitchens save karo, purana meal ek tap me dobara mangao." },
];

const KITCHEN: Feature[] = [
  { icon: ListOrdered, title: "Live order dashboard", text: "Order accept karo, banao aur handover — sab ek screen se. Aaj ki kamai, ratings aur followers ek nazar me.", big: true, chips: ["Placed", "Accepted", "Ban raha hai", "Out for delivery"] },
  { icon: Sparkles, title: "AI nutrition insights", text: "Dish ka naam likho, AI calories, protein aur health score nikaal deta hai — poore menu ke liye." },
  { icon: Clapperboard, title: "Reels & Stories", text: "Chhoti videos aur aaj ka special aas-paas ke customers ko dikhao — marketing free me." },
  { icon: Megaphone, title: "Boost ads + BhojAI", text: "Daily budget set karo aur zyada logon tak pahucho. BhojAI performance dekhke batata hai aage kya karna hai.", big: true, chips: ["Daily budget", "AI salah", "Insights"] },
  { icon: Repeat, title: "Subscription plans", text: "Apne meal plans banao aur pehli baar wale customer ko pakka grahak bana lo." },
  { icon: Banknote, title: "Wallet & payouts", text: "Kamai turant dekho aur seedha bank me nikalo — ek saaf transaction history ke saath." },
  { icon: FileCheck2, title: "FSSAI assistance", text: "Licence abhi nahi hai? Hum file karwane me madad karenge." },
  { icon: Timer, title: "Timing & pause control", text: "Timings aur chhutti set karo, ya offline hue bina naye orders pause karo." },
  { icon: Crown, title: "Premium tools", text: "Zyada visibility aur gehre insights ke liye optional upgrades." },
  { icon: MessagesSquare, title: "Order chat", text: "Customer se unke order ke baare me baat karo, app ke andar hi." },
];

const COPY = {
  customer: { title: "Jo dikhe, wahi khao.", sub: "Banta hua dekho, nutrition check karo, kitchen pe bharosa karo, phir order — sab ek app me." },
  kitchen: { title: "Poora kitchen, aapki jeb me.", sub: "Orders, menu, marketing, subscriptions aur payouts — jo bhi chahiye, sab ek jagah." },
} as const;

function spotlight(e: MouseEvent<HTMLDivElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
}

export default function Features() {
  const [tab, setTab] = useState<"customer" | "kitchen">("customer");
  const list = tab === "customer" ? CUSTOMER : KITCHEN;

  return (
    <section id="features" className="relative w-full font-sans pt-24 pb-16 lg:pt-32 lg:pb-28 bg-[#0D1B1E] text-white overflow-hidden">
      <Torana />
      <div className="pointer-events-none absolute inset-0 jaali-dark [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#087F78]/30 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#FFC21A]/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 lg:mb-14">
          <Eyebrow en="Everything inside FreshBhoj" hi="सब कुछ यहीं" tone="dark" className="mb-4" />
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4">
            One platform. <span className="inline-block pr-[0.14em] -mr-[0.14em] bg-gradient-to-r from-[#5EE6D0] to-[#FFC21A] bg-clip-text text-transparent"><Deva className="italic">थाली के दोनों side।</Deva></span>
          </h2>
          <p key={tab} className="text-white/60 text-base md:text-lg max-w-xl mx-auto mb-8 animate-[fadeUp_0.4s_ease-out]">
            <span className="text-white font-bold">{COPY[tab].title}</span> {COPY[tab].sub}
          </p>
          <div className="relative inline-grid grid-cols-2 p-1.5 rounded-full bg-white/10 border border-white/10">
            <span
              className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-full bg-white shadow transition-transform duration-300"
              style={{ transform: tab === "customer" ? "translateX(0)" : "translateX(100%)" }}
            />
            {(["customer", "kitchen"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative z-10 px-6 md:px-10 py-3 rounded-full text-sm font-bold transition-colors ${tab === t ? "text-[#0D1B1E]" : "text-white/70 hover:text-white"}`}
              >
                {t === "customer" ? "Customers ke liye" : "Kitchens ke liye"}
              </button>
            ))}
          </div>
        </div>

        <div key={tab} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 lg:auto-rows-fr animate-[fadeUp_0.5s_ease-out]">
          {list.map(({ icon: Icon, title, text, big, chips }) => (
            <div
              key={title}
              onMouseMove={spotlight}
              className={`group relative rounded-3xl p-6 lg:p-7 border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#5EE6D0]/40 ${
                big ? "sm:col-span-2 bg-gradient-to-br from-[#14ADA0]/40 via-[#087F78]/30 to-[#0B4F6C]/40" : "bg-white/[0.04]"
              }`}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "radial-gradient(260px circle at var(--x,50%) var(--y,50%), rgba(94,230,208,0.16), transparent 70%)" }}
              />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-white/10 group-hover:bg-[#FFC21A] group-hover:text-[#0D1B1E] text-[#5EE6D0] flex items-center justify-center mb-5 transition-colors">
                  <Icon size={22} strokeWidth={2.2} />
                </div>
                <h3 className="font-extrabold text-lg lg:text-xl mb-2">{title}</h3>
                <p className="text-white/65 text-sm lg:text-base leading-relaxed">{text}</p>
                {chips ? (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {chips.map((c) => (
                      <span key={c} className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-semibold text-white/85">{c}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
