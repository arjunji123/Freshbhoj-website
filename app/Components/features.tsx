"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import {
  MapPin, Clapperboard, SlidersHorizontal, Truck, CalendarSync, Wallet, Leaf, BadgeCheck, MessagesSquare,
  UtensilsCrossed, ArrowUpRight, ChefHat, ListOrdered, Sparkles, Megaphone, Repeat, Banknote, FileCheck2, Crown, Timer, type LucideIcon,
} from "lucide-react";

type Feature = { icon: LucideIcon; title: string; text: string; big?: boolean; chips?: string[] };

const CUSTOMER: Feature[] = [
  { icon: Clapperboard, title: "Reels & Stories", text: "Watch real videos of the dish being made, then order the exact thing you just watched. Follow your favourite kitchens for daily specials.", big: true, chips: ["Reels", "Stories", "Follow kitchens"] },
  { icon: MapPin, title: "Nearby & Trending", text: "Kitchens and dishes close to you first, ranked by real orders and ratings — never paid placement." },
  { icon: Leaf, title: "Nutrition on every dish", text: "Calories, protein and a health score, plus Veg / Non-veg / Vegan / Egg and Jain-friendly tags." },
  { icon: BadgeCheck, title: "Verified kitchens", text: "Kitchens we have visited in person carry a Verified badge and get their own section." },
  { icon: SlidersHorizontal, title: "Smart search", text: "Filter by cuisine, diet, or goals like “High Protein” and “Low Calorie”." },
  { icon: Truck, title: "Live order tracking", text: "Placed → Accepted → Preparing → Out for Delivery → Delivered, always visible." },
  { icon: MessagesSquare, title: "Order chat", text: "Message the kitchen about your exact order and get a real answer." },
  { icon: CalendarSync, title: "Flexible subscriptions", text: "Take a kitchen's plan or build your own. Swap tomorrow's meal, pause or skip any day.", big: true, chips: ["Kitchen plans", "Build your own", "Swap meal", "Pause"] },
  { icon: Wallet, title: "Wallet & FreshBhoj Coins", text: "Pay with UPI, cards, wallet or cash, and earn coins with Refer & Earn." },
  { icon: Repeat, title: "Favourites & reorder", text: "Save dishes and kitchens, and reorder any past meal in one tap." },
];

const KITCHEN: Feature[] = [
  { icon: ListOrdered, title: "Live order dashboard", text: "Accept, prepare and hand off orders from one screen. Track today's revenue, ratings and followers at a glance.", big: true, chips: ["Placed", "Accepted", "Preparing", "Out for delivery"] },
  { icon: Sparkles, title: "AI nutrition insights", text: "Type a dish and AI estimates calories, protein and a health score for your menu." },
  { icon: Clapperboard, title: "Reels & Stories", text: "Post short videos and today's special to nearby customers — free marketing." },
  { icon: Megaphone, title: "Boost ads + BhojAI", text: "Set a daily budget to reach more people. BhojAI reviews performance and suggests what to do next.", big: true, chips: ["Daily budget", "AI suggestions", "Insights"] },
  { icon: Repeat, title: "Subscription plans", text: "Design your own meal plans and turn first-time buyers into regulars." },
  { icon: Banknote, title: "Wallet & payouts", text: "See earnings instantly and withdraw to your bank, with one clear transaction history." },
  { icon: FileCheck2, title: "FSSAI assistance", text: "No licence yet? We can help file it for you." },
  { icon: Timer, title: "Hours & pause control", text: "Set timings and holidays, or pause new orders without going offline." },
  { icon: Crown, title: "Premium tools", text: "Optional upgrades for more visibility and deeper insights." },
  { icon: MessagesSquare, title: "Order chat", text: "Talk to a customer about their exact order, right inside the app." },
];

const COPY = {
  customer: { title: "Eat what you can see.", sub: "Watch it being made, check the nutrition, trust the kitchen, then order — all in one app." },
  kitchen: { title: "Run your whole kitchen.", sub: "Orders, menu, marketing, subscriptions and payouts — everything you need, in your pocket." },
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
    <section id="features" className="relative w-full font-sans py-16 lg:py-28 bg-[#0D1B1E] text-white overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#087F78]/30 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#FFC21A]/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 lg:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFC21A] mb-4">Everything inside FreshBhoj</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4">
            One platform. <span className="bg-gradient-to-r from-[#5EE6D0] to-[#FFC21A] bg-clip-text text-transparent">Both sides of the plate.</span>
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

        {/* Join CTA */}
        <div className="mt-14 lg:mt-20 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <Link
            href="/pre-register?type=foodie"
            className="group relative overflow-hidden rounded-[2rem] p-8 lg:p-10 bg-white text-[#0D1B1E] transition-transform hover:-translate-y-1"
          >
            <div className="pointer-events-none absolute -right-10 -bottom-10 w-56 h-56 rounded-full bg-gradient-to-br from-[#1DB9A0] to-[#0B4F6C] opacity-15 group-hover:opacity-30 transition-opacity" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#087F78] mb-4">
                  <UtensilsCrossed size={14} /> For foodies
                </span>
                <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-2">Get early access</h3>
                <p className="text-slate-500 text-sm lg:text-base max-w-sm">Join 2,500+ on the waitlist. ₹500 wallet credit and 30 days free delivery at launch.</p>
              </div>
              <span className="shrink-0 w-12 h-12 rounded-full bg-[#0D1B1E] text-white flex items-center justify-center group-hover:bg-[#087F78] group-hover:rotate-45 transition-all">
                <ArrowUpRight size={22} />
              </span>
            </div>
          </Link>

          <Link
            href="/partner/login"
            className="group relative overflow-hidden rounded-[2rem] p-8 lg:p-10 text-white bg-[linear-gradient(135deg,#14ADA0_0%,#087F78_55%,#0B4F6C_100%)] transition-transform hover:-translate-y-1"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 w-56 h-56 rounded-full bg-[#FFC21A] opacity-25 blur-2xl group-hover:opacity-40 transition-opacity" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#FFC21A] mb-4">
                  <ChefHat size={14} /> For kitchens
                </span>
                <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-2">Register your kitchen</h3>
                <p className="text-white/80 text-sm lg:text-base max-w-sm">Restaurant, dhaba, café or home kitchen — 0% commission for your first 3 months.</p>
              </div>
              <span className="shrink-0 w-12 h-12 rounded-full bg-[#FFC21A] text-[#0D1B1E] flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight size={22} />
              </span>
            </div>
          </Link>
        </div>
        <p className="text-center text-white/40 text-sm mt-6 tracking-wide">Already a partner? <Link href="/partner/login" className="text-white/70 underline underline-offset-4 hover:text-white">Log in</Link> · 1,200+ partners across India</p>
      </div>
    </section>
  );
}
