"use client";

import { useState, type MouseEvent } from "react";
import {
  MapPin, Clapperboard, SlidersHorizontal, Truck, CalendarSync, Wallet, Leaf, BadgeCheck, MessagesSquare,
  ListOrdered, Sparkles, Megaphone, Repeat, Banknote, FileCheck2, Crown, Timer, type LucideIcon,
} from "lucide-react";
import { Eyebrow, Torana } from "./desi";

type Feature = { icon: LucideIcon; title: string; text: string; big?: boolean; chips?: string[] };

const CUSTOMER: Feature[] = [
  { icon: Clapperboard, title: "Reels & Stories", text: "Watch a dish being made, then order exactly what you just saw. Follow your favourite kitchens and get their daily specials right in your feed.", big: true, chips: ["Reels", "Stories", "Follow kitchens"] },
  { icon: MapPin, title: "Nearby & Trending", text: "Kitchens and dishes close to you come first, ranked by real orders and ratings, never by who paid the most." },
  { icon: Leaf, title: "Nutrition on every dish", text: "Calories, protein and a health score, along with Veg / Non-veg / Vegan / Egg and Jain-friendly tags." },
  { icon: BadgeCheck, title: "Verified kitchens", text: "Kitchens our team has personally visited earn a Verified badge and their own dedicated section." },
  { icon: SlidersHorizontal, title: "Smart search", text: "Filter by cuisine, diet or goal, such as “High Protein” or “Low Calorie”." },
  { icon: Truck, title: "Live order tracking", text: "Placed → Accepted → Preparing → Out for Delivery → Delivered. Every step, in real time." },
  { icon: MessagesSquare, title: "Order chat", text: "Talk to the kitchen directly about your order and get real answers." },
  { icon: CalendarSync, title: "Flexible subscriptions", text: "Pick a kitchen's plan or build your own. Swap tomorrow's meal, pause or skip any day.", big: true, chips: ["Kitchen plans", "Custom plans", "Swap meals", "Pause anytime"] },
  { icon: Wallet, title: "Wallet & FreshBhoj Coins", text: "Pay by UPI, card, wallet or cash, and earn coins with Refer & Earn." },
  { icon: Repeat, title: "Favourites & reorder", text: "Save the dishes and kitchens you love, and reorder a past meal in one tap." },
];

const KITCHEN: Feature[] = [
  { icon: ListOrdered, title: "Live order dashboard", text: "Accept, prepare and hand over orders from a single screen. Today's earnings, ratings and followers at a glance.", big: true, chips: ["Placed", "Accepted", "Preparing", "Out for delivery"] },
  { icon: Sparkles, title: "AI nutrition insights", text: "Type a dish name and AI works out calories, protein and a health score, across your entire menu." },
  { icon: Clapperboard, title: "Reels & Stories", text: "Show short videos and today's special to nearby customers. Marketing that costs nothing." },
  { icon: Megaphone, title: "Boost ads + BhojAI", text: "Set a daily budget and reach more people. BhojAI reads your performance and tells you what to do next.", big: true, chips: ["Daily budget", "AI guidance", "Insights"] },
  { icon: Repeat, title: "Subscription plans", text: "Create your own meal plans and turn first-time buyers into regulars." },
  { icon: Banknote, title: "Wallet & payouts", text: "See your earnings instantly and withdraw straight to your bank, with a clean transaction history." },
  { icon: FileCheck2, title: "FSSAI assistance", text: "No licence yet? We'll help you get it filed." },
  { icon: Timer, title: "Timing & pause control", text: "Set your hours and days off, or pause new orders without going offline." },
  { icon: Crown, title: "Premium tools", text: "Optional upgrades for more visibility and deeper insights." },
  { icon: MessagesSquare, title: "Order chat", text: "Talk to customers about their orders, right inside the app." },
];

const COPY = {
  customer: { title: "What you see is what you eat.", sub: "Watch it being made, check the nutrition, trust the kitchen, then order. All in one app." },
  kitchen: { title: "Your whole kitchen, in your pocket.", sub: "Orders, menu, marketing, subscriptions and payouts, all in one place." },
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
          <Eyebrow en="Everything inside FreshBhoj" tone="dark" className="mb-4" />
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4">
            One platform. <span className="inline-block pr-[0.14em] -mr-[0.14em] bg-gradient-to-r from-[#5EE6D0] to-[#FFC21A] bg-clip-text text-transparent"><span className="italic" style={{ fontFamily: "var(--font-instrument), Georgia, serif" }}>Two sides of one thali.</span></span>
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
                {t === "customer" ? "For Customers" : "For Kitchens"}
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
