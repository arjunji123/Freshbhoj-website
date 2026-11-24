"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight, BadgeCheck, Bell, Camera, ClipboardList, Eye, Heart, IndianRupee, LayoutDashboard, Package, Phone, PiggyBank,
  Plus, Star, Store, TrendingUp, UserCog, Users, UtensilsCrossed, Clock, Sparkles, Megaphone, Layers, MessageCircle, Landmark, Wallet, Crown,
  type LucideIcon,
} from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Badge, Card, GRADIENT_BG, Toggle } from "../components/ui";

/* Sample data only — nothing here comes from a real kitchen. */
const WEEK = [
  { label: "Mon", revenue: 3200 }, { label: "Tue", revenue: 4100 }, { label: "Wed", revenue: 3650 }, { label: "Thu", revenue: 5200 },
  { label: "Fri", revenue: 4800 }, { label: "Sat", revenue: 6100 }, { label: "Sun", revenue: 4860 },
];
const ORDERS = [
  { n: 1042, status: "PLACED", who: "Aarav M.", items: "2× Shahi Paneer, 1× Butter Naan", amt: 560 },
  { n: 1041, status: "PREPARING", who: "Priya S.", items: "1× Veg Thali", amt: 240 },
  { n: 1040, status: "OUT FOR DELIVERY", who: "Rohit K.", items: "3× Steamed Momos", amt: 330 },
  { n: 1039, status: "PREPARING", who: "Neha T.", items: "2× Mango Lassi, 1× Chutney Combo", amt: 290 },
];
const STORIES = [
  { img: "/food/momo.webp", v: 214, l: 38 }, { img: "/food/rice.webp", v: 168, l: 25 }, { img: "/food/naan.webp", v: 143, l: 19 }, { img: "/food/mango.webp", v: 97, l: 12 },
];
const NAV: { title: string; items: { label: string; icon: LucideIcon }[] }[] = [
  { title: "Overview", items: [{ label: "Dashboard", icon: LayoutDashboard }] },
  { title: "Operations", items: [{ label: "Orders", icon: ClipboardList }, { label: "Menu", icon: UtensilsCrossed }, { label: "Timings", icon: Clock }] },
  { title: "Grow", items: [{ label: "Stories", icon: Sparkles }, { label: "Ads", icon: Megaphone }, { label: "Subscribers", icon: Users }, { label: "Plans", icon: Layers }] },
  { title: "Account", items: [{ label: "BhojAI", icon: MessageCircle }, { label: "Payouts", icon: Landmark }, { label: "Wallet", icon: Wallet }, { label: "Premium", icon: Crown }, { label: "Kitchen Profile", icon: Store }] },
];

const DESIGN_W = 1120;

function Stat({ icon: Icon, label, value, sub, accent }: { icon: LucideIcon; label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <Card className="!p-5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${accent ? "text-white" : "bg-[#087F78]/10 text-[#087F78]"}`} style={accent ? GRADIENT_BG : undefined}>
        <Icon size={16} />
      </div>
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs font-semibold text-slate-400 mt-0.5">{label}</p>
      {sub ? <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p> : null}
    </Card>
  );
}

function Quick({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] px-4 py-3.5">
      <div className="w-8 h-8 rounded-lg bg-[#087F78]/10 flex items-center justify-center text-[#087F78] shrink-0"><Icon size={15} /></div>
      <span className="text-xs font-bold text-slate-700">{label}</span>
    </div>
  );
}

/** Read-only replica of the real partner dashboard, filled with sample data and scaled to fit its container. */
export default function DashboardPreview({ className = "" }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  const [h, setH] = useState(700);
  const [accepting, setAccepting] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, el.clientWidth / DESIGN_W));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (inner.current) setH(inner.current.offsetHeight);
  }, [scale]);

  return (
    <div ref={wrap} className={`relative w-full ${className}`} style={{ height: h * scale }}>
      <div ref={inner} className="absolute top-0 left-0 origin-top-left rounded-[1.75rem] overflow-hidden bg-[#F3F8F8] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.55)] ring-1 ring-white/30 select-none" style={{ width: DESIGN_W, transform: `scale(${scale})` }} aria-hidden>
        {/* browser chrome */}
        <div className="flex items-center gap-2 bg-white border-b border-slate-100 px-4 py-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6058]" /><span className="w-2.5 h-2.5 rounded-full bg-[#FFC130]" /><span className="w-2.5 h-2.5 rounded-full bg-[#27CA40]" />
          <span className="ml-3 flex-1 max-w-md rounded-full bg-slate-100 text-[11px] font-semibold text-slate-400 px-4 py-1">freshbhoj.com/partner/dashboard</span>
        </div>

        <div className="flex">
          {/* sidebar */}
          <aside className="w-56 shrink-0 bg-white border-r border-slate-100 p-5 flex flex-col">
            <Image src="/freshbhoj-red-new.svg" alt="" width={120} height={32} className="h-7 w-auto object-contain mb-6 self-start" />
            <nav className="flex flex-col gap-3.5">
              {NAV.map((s) => (
                <div key={s.title} className="flex flex-col gap-1">
                  <p className="px-3 text-[10px] font-extrabold text-slate-300 uppercase tracking-wider">{s.title}</p>
                  {s.items.map(({ label, icon: Icon }) => {
                    const active = label === "Dashboard";
                    return (
                      <div key={label} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-bold ${active ? "text-white" : "text-slate-500"}`} style={active ? GRADIENT_BG : undefined}>
                        <Icon size={16} strokeWidth={2.2} /> {label}
                      </div>
                    );
                  })}
                </div>
              ))}
            </nav>
          </aside>

          {/* content */}
          <div className="flex-1 min-w-0 p-7">
            <div className="relative overflow-hidden rounded-3xl p-7 mb-5 text-white" style={GRADIENT_BG}>
              <div className="absolute -right-10 -top-16 w-52 h-52 rounded-full bg-white/10" />
              <div className="absolute -right-4 bottom-[-3rem] w-32 h-32 rounded-full bg-white/10" />
              <div className="relative flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white/80">Good afternoon,</p>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-extrabold tracking-tight">Sharma Family Kitchen</h1>
                    <BadgeCheck size={22} className="text-white" />
                  </div>
                  <p className="text-sm text-white/80 mt-1">Sunday, 12 October</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="relative w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Bell size={18} />
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#087F78] text-[10px] font-extrabold flex items-center justify-center">3</span>
                  </span>
                  <Toggle checked={accepting} onChange={() => setAccepting((v) => !v)} onLabel="Taking orders" offLabel="Paused" className="bg-white/15 rounded-2xl px-4 py-3" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-5">
              <Badge tone="danger">
                <span className="relative flex w-1.5 h-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600" /></span>
                Live
              </Badge>
              <Badge tone="success">Status: Active</Badge>
              <Badge tone="success">Visibility: Public</Badge>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-5">
              <Stat icon={Package} label="Orders today" value={12} />
              <Stat icon={TrendingUp} label="Active now" value={3} accent />
              <Stat icon={IndianRupee} label="Revenue today" value="₹4,860" />
              <Stat icon={Star} label="Rating" value="4.8" sub="126 reviews" />
            </div>

            <div className="grid grid-cols-5 gap-3 mb-6">
              <Quick icon={Plus} label="Add a dish" /><Quick icon={Camera} label="Post a story" /><Quick icon={ClipboardList} label="View orders" /><Quick icon={UserCog} label="Edit profile" /><Quick icon={PiggyBank} label="Wallet" />
            </div>

            <Card className="!p-6 mb-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Last 7 days</p>
                  <h3 className="text-base font-extrabold text-slate-900">Revenue trend</h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#087F78]/10 text-[#087F78] flex items-center justify-center"><TrendingUp size={16} /></div>
              </div>
              <LineChart width={800} height={180} data={WEEK} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="prevLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#1DB9A0" /><stop offset="100%" stopColor="#087F78" /></linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="label" padding={{ left: 24, right: 24 }} axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: "#94A3B8" }} />
                <YAxis hide />
                <Line type="monotone" dataKey="revenue" stroke="url(#prevLine)" strokeWidth={2.5} strokeLinecap="round" dot={{ r: 3, fill: "#087F78", strokeWidth: 0 }} isAnimationActive={false} />
              </LineChart>
            </Card>

            <div className="grid grid-cols-3 gap-5">
              <Card className="col-span-2 !p-0 overflow-hidden">
                <div className="flex items-center justify-between px-6 pt-6 pb-4">
                  <h3 className="text-base font-extrabold text-slate-900">Live orders</h3>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#087F78]">View board <ArrowRight size={13} /></span>
                </div>
                <div className="divide-y divide-slate-50">
                  {ORDERS.map((o) => (
                    <div key={o.n} className="flex items-center justify-between gap-4 px-6 py-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-extrabold text-slate-900">#{o.n}</p>
                          <Badge tone={o.status === "PLACED" ? "warning" : "brand"}>{o.status}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 truncate">{o.who} · {o.items}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-extrabold text-slate-800">₹{o.amt}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 mt-1"><Phone size={10} /> Call</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="flex flex-col gap-4">
                <Card className="!p-5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">All-time</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xl font-extrabold text-slate-900">1,284</p><p className="text-[11px] text-slate-400 font-semibold">orders</p></div>
                    <div><p className="text-xl font-extrabold text-slate-900">₹3.86L</p><p className="text-[11px] text-slate-400 font-semibold">revenue</p></div>
                    <div className="flex items-center gap-1.5"><Users size={13} className="text-slate-400" /><p className="text-xl font-extrabold text-slate-900">842</p></div>
                    <div><p className="text-xl font-extrabold text-slate-900">24</p><p className="text-[11px] text-slate-400 font-semibold">dishes live</p></div>
                  </div>
                </Card>
                <Card className="!p-5 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Your stories</p>
                    <span className="text-[11px] font-bold text-[#087F78]">Manage</span>
                  </div>
                  <div className="flex gap-2">
                    {STORIES.map((s) => (
                      <div key={s.img} className="shrink-0 w-14">
                        <div className="w-14 h-14 rounded-2xl bg-[#EFFAF8] overflow-hidden border-2 border-[#087F78]/20">
                          <Image src={s.img} alt="" width={56} height={56} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] text-slate-400 font-semibold">
                          <span className="inline-flex items-center gap-0.5"><Eye size={9} /> {s.v}</span>
                          <span className="inline-flex items-center gap-0.5"><Heart size={9} /> {s.l}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
