"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin, Clapperboard, SlidersHorizontal, Truck, CalendarSync, Wallet, Leaf, BadgeCheck, MessagesSquare,
  ChefHat, ListOrdered, Sparkles, Megaphone, Repeat, Banknote, FileCheck2, Crown, Timer, type LucideIcon,
} from "lucide-react";

type Feature = { icon: LucideIcon; title: string; text: string; big?: boolean };

const CUSTOMER: Feature[] = [
  { icon: Clapperboard, title: "Reels & Stories", text: "Watch real videos of the dish being made, then order the exact thing you just watched. Follow your favourite kitchens for daily specials.", big: true },
  { icon: MapPin, title: "Nearby & Trending", text: "Kitchens and dishes close to you first, ranked by real orders and ratings — never paid placement." },
  { icon: Leaf, title: "Nutrition on every dish", text: "Calories, protein and a health score, plus Veg / Non-veg / Vegan / Egg and Jain-friendly tags." },
  { icon: BadgeCheck, title: "Verified kitchens", text: "Kitchens we have visited in person carry a Verified badge and get their own section." },
  { icon: SlidersHorizontal, title: "Smart search", text: "Filter by cuisine, diet, or goals like “High Protein” and “Low Calorie”." },
  { icon: Truck, title: "Live order tracking", text: "Placed → Accepted → Preparing → Out for Delivery → Delivered, always visible." },
  { icon: MessagesSquare, title: "Order chat", text: "Message the kitchen about your exact order and get a real answer." },
  { icon: CalendarSync, title: "Flexible subscriptions", text: "Take a kitchen's plan or build your own. Swap tomorrow's meal, pause or skip any day.", big: true },
  { icon: Wallet, title: "Wallet & FreshBhoj Coins", text: "Pay with UPI, cards, wallet or cash, and earn coins with Refer & Earn." },
  { icon: Repeat, title: "Favourites & reorder", text: "Save dishes and kitchens, and reorder any past meal in one tap." },
];

const KITCHEN: Feature[] = [
  { icon: ListOrdered, title: "Live order dashboard", text: "Accept, prepare and hand off orders from one screen. Track today's revenue, ratings and followers at a glance.", big: true },
  { icon: Sparkles, title: "AI nutrition insights", text: "Type a dish and AI estimates calories, protein and a health score for your menu." },
  { icon: Clapperboard, title: "Reels & Stories", text: "Post short videos and today's special to nearby customers — free marketing." },
  { icon: Megaphone, title: "Boost ads + BhojAI", text: "Set a daily budget to reach more people. BhojAI reviews performance and suggests what to do next.", big: true },
  { icon: Repeat, title: "Subscription plans", text: "Design your own meal plans and turn first-time buyers into regulars." },
  { icon: Banknote, title: "Wallet & payouts", text: "See earnings instantly and withdraw to your bank, with one clear transaction history." },
  { icon: FileCheck2, title: "FSSAI assistance", text: "No licence yet? We can help file it for you." },
  { icon: Timer, title: "Hours & pause control", text: "Set timings and holidays, or pause new orders without going offline." },
  { icon: Crown, title: "Premium tools", text: "Optional upgrades for more visibility and deeper insights." },
  { icon: MessagesSquare, title: "Order chat", text: "Talk to a customer about their exact order, right inside the app." },
];

export default function Features() {
  const [tab, setTab] = useState<"customer" | "kitchen">("customer");
  const list = tab === "customer" ? CUSTOMER : KITCHEN;

  return (
    <section id="features" className="relative w-full font-sans py-16 lg:py-28 bg-[#0D1B1E] text-white overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#087F78]/30 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#FFC21A]/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 lg:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFC21A] mb-4">Everything inside</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            One platform. <span className="bg-gradient-to-r from-[#5EE6D0] to-[#FFC21A] bg-clip-text text-transparent">Both sides of the plate.</span>
          </h2>
          <div className="inline-flex p-1.5 rounded-full bg-white/10 border border-white/10">
            {(["customer", "kitchen"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 md:px-8 py-3 rounded-full text-sm font-bold transition-all ${tab === t ? "bg-white text-[#0D1B1E] shadow" : "text-white/70 hover:text-white"}`}
              >
                {t === "customer" ? "For Customers" : "For Kitchens"}
              </button>
            ))}
          </div>
        </div>

        <div key={tab} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 auto-rows-fr animate-[fadeUp_0.5s_ease-out]">
          {list.map(({ icon: Icon, title, text, big }) => (
            <div
              key={title}
              className={`group relative rounded-3xl p-6 lg:p-7 border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#5EE6D0]/50 ${
                big ? "sm:col-span-2 bg-gradient-to-br from-[#14ADA0]/40 via-[#087F78]/30 to-[#0B4F6C]/40" : "bg-white/[0.04] hover:bg-white/[0.07]"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 group-hover:bg-[#FFC21A] group-hover:text-[#0D1B1E] text-[#5EE6D0] flex items-center justify-center mb-5 transition-colors">
                <Icon size={22} strokeWidth={2.2} />
              </div>
              <h3 className="font-extrabold text-lg lg:text-xl mb-2">{title}</h3>
              <p className="text-white/65 text-sm lg:text-base leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/pre-register?type=foodie" className="inline-flex justify-center rounded-full bg-white text-[#0D1B1E] font-bold px-8 py-4 hover:scale-105 transition-transform">
            Pre-register as a foodie
          </Link>
          <Link href="/partner/login" className="inline-flex justify-center rounded-full bg-[#FFC21A] text-[#0D1B1E] font-bold px-8 py-4 hover:scale-105 transition-transform">
            Register your kitchen
          </Link>
        </div>
      </div>
    </section>
  );
}
