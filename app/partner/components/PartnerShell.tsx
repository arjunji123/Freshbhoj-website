"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  Sparkles,
  Store,
  LogOut,
  Menu,
  X,
  MessageCircle,
  Bell,
  Wallet,
  Clock,
  Megaphone,
  Users,
  Landmark,
  Crown,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { useKitchenAuth } from "../../../lib/KitchenAuthProvider";
import { GRADIENT_BG } from "./ui";

// `requiresActive` mirrors what `PartnerGuard` actually allows: a
// pre-approval kitchen (status !== "ACTIVE") that reaches this shell only got
// here via its Menu/Stories/BhojAI exception — Dashboard/Orders/Ads/Subscribers/
// Profile would bounce it straight back to /partner/onboarding.
const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [{ href: "/partner/dashboard", label: "Dashboard", icon: LayoutDashboard, requiresActive: true }],
  },
  {
    title: "Operations",
    items: [
      { href: "/partner/orders", label: "Orders", icon: ClipboardList, requiresActive: true },
      { href: "/partner/menu", label: "Menu", icon: UtensilsCrossed, requiresActive: false },
      { href: "/partner/timings", label: "Timings", icon: Clock, requiresActive: true },
    ],
  },
  {
    title: "Grow",
    items: [
      { href: "/partner/stories", label: "Stories", icon: Sparkles, requiresActive: false },
      { href: "/partner/ads", label: "Ads", icon: Megaphone, requiresActive: true },
      { href: "/partner/subscriptions", label: "Subscribers", icon: Users, requiresActive: true },
      { href: "/partner/plans", label: "Plans", icon: Layers, requiresActive: true },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/partner/bhojai", label: "BhojAI", icon: MessageCircle, requiresActive: false },
      { href: "/partner/notifications", label: "Notifications", icon: Bell, requiresActive: true },
      { href: "/partner/payouts", label: "Payouts", icon: Landmark, requiresActive: true },
      { href: "/partner/wallet", label: "Wallet", icon: Wallet, requiresActive: true },
      { href: "/partner/premium", label: "Premium", icon: Crown, requiresActive: true },
      { href: "/partner/profile", label: "Kitchen Profile", icon: Store, requiresActive: true },
    ],
  },
];

export default function PartnerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, onboarding } = useKitchenAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isPreApproval = onboarding && onboarding.status !== "ACTIVE";

  const NavLinks = (
    <nav className="flex flex-col gap-4">
      {NAV_SECTIONS.map((section) => (
        <div key={section.title} className="flex flex-col gap-1.5">
          <p className="px-4 text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">{section.title}</p>
          {section.items.map(({ href, label, icon: Icon, requiresActive }) => {
            const isLocked = Boolean(isPreApproval) && requiresActive;
            const isActive = pathname === href || pathname?.startsWith(`${href}/`);

            if (isLocked) {
              return (
                <div
                  key={href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-300 cursor-not-allowed select-none"
                  title="Available after approval"
                >
                  <Icon size={18} strokeWidth={2.2} />
                  <span className="flex-1">{label}</span>
                  <span className="text-[10px] font-semibold normal-case">Locked</span>
                </div>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  isActive ? "text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
                style={isActive ? GRADIENT_BG : undefined}
              >
                <Icon size={18} strokeWidth={2.2} />
                {label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen w-full bg-[#F3F8F8] font-sans flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-slate-100 p-6">
        <Link href="/partner/dashboard" className="mb-8">
          <Image src="/freshbhoj-red-new.svg" alt="FreshBhoj" width={140} height={38} className="h-8 w-auto object-contain" />
        </Link>
        {NavLinks}
        <button
          onClick={logout}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <LogOut size={18} strokeWidth={2.2} />
          Log out
        </button>
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-100 flex items-center justify-between px-5 py-3.5">
        <Image src="/freshbhoj-red-new.svg" alt="FreshBhoj" width={120} height={32} className="h-7 w-auto object-contain" />
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {mobileOpen ? (
        <div className="lg:hidden fixed inset-0 top-[57px] z-30 bg-white p-5 overflow-y-auto">
          {NavLinks}
          <button
            onClick={logout}
            className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 w-full"
          >
            <LogOut size={18} strokeWidth={2.2} />
            Log out
          </button>
        </div>
      ) : null}

      <main className="flex-1 min-w-0 p-6 lg:p-10 pt-20 lg:pt-10">
        <div className="max-w-6xl mx-auto">
          {isPreApproval ? (
            <Link
              href="/partner/onboarding"
              className="flex items-center justify-between gap-3 rounded-2xl bg-amber-50 text-amber-700 text-xs font-bold px-4 py-3 mb-6"
            >
              <span>Your application isn&apos;t approved yet — add your menu now, then continue onboarding to submit.</span>
              <span className="shrink-0">Continue setup →</span>
            </Link>
          ) : null}
          {children}
        </div>
      </main>
    </div>
  );
}
