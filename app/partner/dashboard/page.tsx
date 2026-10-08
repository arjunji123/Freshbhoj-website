"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Bell,
  Camera,
  Clapperboard,
  Eye,
  Heart,
  IndianRupee,
  Megaphone,
  ClipboardList,
  Package,
  Phone,
  PiggyBank,
  Plus,
  Star,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  ApiError,
  kitchenDashboardApi,
  kitchenOrdersApi,
  kitchenProfileApi,
  kitchenStoriesApi,
  notificationsApi,
} from "../../../lib/kitchenApi";
import type { DashboardSummary, KitchenOrderCard, KitchenProfile, KitchenStory } from "../../../lib/types";
import { Badge, Button, Card, EmptyState, GRADIENT_BG, Spinner, Toggle } from "../components/ui";

const KITCHEN_STATUS_LABEL: Record<KitchenProfile["status"], string> = {
  PENDING: "Pending",
  ACTIVE: "Active",
  PAUSED: "Paused",
  SUSPENDED: "Suspended",
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [profile, setProfile] = useState<KitchenProfile | null>(null);
  const [liveOrders, setLiveOrders] = useState<KitchenOrderCard[]>([]);
  const [stories, setStories] = useState<KitchenStory[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toggleError, setToggleError] = useState<string | null>(null);

  const load = async (showSpinner = false) => {
    if (showSpinner) setIsLoading(true);
    try {
      const [summaryRes, profileRes, ordersRes, storiesRes, notifRes] = await Promise.all([
        kitchenDashboardApi.summary(),
        kitchenProfileApi.get(),
        kitchenOrdersApi.incoming(),
        kitchenStoriesApi.list(),
        notificationsApi.list({ limit: 1 }).catch(() => null),
      ]);
      setSummary(summaryRes);
      setProfile(profileRes);
      setLiveOrders(ordersRes);
      setStories(storiesRes);
      if (notifRes) setUnreadCount(notifRes.unreadCount);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Something went wrong, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(true);
  }, []);

  const handleToggleAccepting = async () => {
    if (!summary) return;
    setIsToggling(true);
    setToggleError(null);
    try {
      await kitchenProfileApi.setAcceptingOrders(!summary.isAcceptingOrders);
      await load(false);
    } catch (err) {
      setToggleError(err instanceof ApiError ? err.message : "Could not update, please try again");
    } finally {
      setIsToggling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="w-8 h-8 text-[#087F78]" />
      </div>
    );
  }

  if (loadError || !summary) {
    return (
      <Card>
        <EmptyState
          title="Something went wrong"
          description={loadError ?? "Could not load your dashboard, please try again"}
          action={<Button onClick={() => load(true)}>Retry</Button>}
        />
      </Card>
    );
  }

  return (
    <div>
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 lg:p-8 mb-6 text-white" style={GRADIENT_BG}>
        <div className="absolute -right-10 -top-16 w-52 h-52 rounded-full bg-white/10" />
        <div className="absolute -right-4 bottom-[-3rem] w-32 h-32 rounded-full bg-white/10" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white/80">{greeting()},</p>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">{profile?.name ?? "your kitchen"}</h1>
              {profile?.isVerified ? <BadgeCheck size={22} className="text-white shrink-0" /> : null}
            </div>
            <p className="text-sm text-white/80 mt-1">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/partner/notifications"
              className="relative w-11 h-11 shrink-0 rounded-2xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-colors flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#087F78] text-[10px] font-extrabold flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </Link>

            <Toggle
              checked={summary.isAcceptingOrders}
              onChange={handleToggleAccepting}
              onLabel="Taking orders"
              offLabel="Paused"
              disabled={isToggling}
              className="bg-white/15 backdrop-blur-sm hover:bg-white/25 rounded-2xl px-4 py-3"
            />
          </div>
        </div>
      </div>

      {profile ? (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {summary.isAcceptingOrders && summary.accountStatus === "ACTIVE" ? (
            <Badge tone="success">
              <span className="relative flex w-1.5 h-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-600 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600" />
              </span>
              Live
            </Badge>
          ) : null}
          <Badge tone={profile.status === "ACTIVE" ? "success" : "warning"}>
            Status: {KITCHEN_STATUS_LABEL[profile.status]}
          </Badge>
          <Badge tone={profile.status === "ACTIVE" ? "success" : "neutral"}>
            Visibility: {profile.status === "ACTIVE" ? "Public" : "Private"}
          </Badge>
        </div>
      ) : null}

      {toggleError ? <p className="text-xs font-semibold text-red-600 mb-4">{toggleError}</p> : null}

      {summary.actionNeeded ? (
        <Card className="mb-6 !p-4 !bg-amber-50 border-amber-100">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-500 mt-0.5 shrink-0" size={18} />
            <p className="text-sm font-semibold text-amber-700">{summary.actionNeeded}</p>
          </div>
        </Card>
      ) : null}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Package} label="Orders today" value={summary.today.orderCount} />
        <StatCard icon={TrendingUp} label="Active now" value={summary.today.activeOrderCount} accent />
        <StatCard icon={IndianRupee} label="Revenue today" value={`₹${summary.today.revenue.toLocaleString("en-IN")}`} />
        <StatCard
          icon={Star}
          label="Rating"
          value={summary.allTime.rating ? summary.allTime.rating.toFixed(1) : "—"}
          sub={`${summary.allTime.ratingCount} reviews`}
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <QuickAction href="/partner/menu/new" icon={Plus} label="Add a dish" />
        <QuickAction href="/partner/stories" icon={Camera} label="Post a story" />
        <QuickAction href="/partner/reels" icon={Clapperboard} label="Create a reel" />
        <QuickAction href="/partner/ads" icon={Megaphone} label="Promote a reel" />
        <QuickAction href="/partner/subscriptions" icon={Users} label="Subscribers" />
        <QuickAction href="/partner/orders" icon={ClipboardList} label="View orders" />
        <QuickAction href="/partner/profile" icon={UserCog} label="Edit profile" />
        <QuickAction href="/partner/wallet" icon={PiggyBank} label="Wallet" />
      </div>

      <RevenueTrendChart data={summary.weeklyRevenue} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live orders preview */}
        <Card className="lg:col-span-2 !p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h3 className="text-base font-extrabold text-slate-900">Live orders</h3>
            <Link href="/partner/orders" className="inline-flex items-center gap-1 text-xs font-bold text-[#087F78]">
              View board <ArrowRight size={13} />
            </Link>
          </div>
          {liveOrders.length === 0 ? (
            <div className="px-6">
              <EmptyState title="No live orders" description="New orders will land here the moment they come in." />
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {liveOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="relative flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors">
                  {/* Whole row opens the orders board; the Call link below sits above this overlay. */}
                  <Link href="/partner/orders" aria-label={`Open order #${order.orderNumber}`} className="absolute inset-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-extrabold text-slate-900">#{order.orderNumber}</p>
                      <Badge tone={order.status === "PLACED" ? "warning" : "brand"}>{order.status.replace(/_/g, " ")}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {order.customer.name} · {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold text-slate-800">₹{order.totalAmount}</p>
                    <a href={`tel:${order.customer.phone}`} className="relative z-10 inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-[#087F78] mt-1">
                      <Phone size={10} /> Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* All-time + followers */}
        <div className="flex flex-col gap-4">
          <Card className="!p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">All-time</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xl font-extrabold text-slate-900">{summary.allTime.orderCount}</p>
                <p className="text-[11px] text-slate-400 font-semibold">orders</p>
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-900">₹{summary.allTime.revenue.toLocaleString("en-IN")}</p>
                <p className="text-[11px] text-slate-400 font-semibold">revenue</p>
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-900">{summary.allTime.followerCount}</p>
                <p className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
                  <Users size={11} /> followers
                </p>
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-900">{summary.allTime.activeMealCount}</p>
                <p className="text-[11px] text-slate-400 font-semibold">dishes live</p>
              </div>
            </div>
          </Card>

          <Card className="!p-5 flex-1">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Your stories</p>
              <Link href="/partner/stories" className="text-[11px] font-bold text-[#087F78]">
                Manage
              </Link>
            </div>
            {stories.length === 0 ? (
              <p className="text-xs text-slate-400">No stories posted yet — show off a dish today.</p>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {stories.slice(0, 6).map((story) => (
                  <div key={story.id} className="shrink-0 w-16">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border-2 border-[#087F78]/20">
                      {story.thumbnailUrl || story.mediaType === "IMAGE" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={story.thumbnailUrl ?? story.mediaUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Camera size={18} />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] text-slate-400 font-semibold">
                      <span className="inline-flex items-center gap-0.5">
                        <Eye size={9} /> {story.viewCount}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <Heart size={9} /> {story.likeCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function RevenueTrendChart({ data }: { data: DashboardSummary["weeklyRevenue"] }) {
  const chartData = data.map((d) => {
    const [y, m, day] = d.date.split("-").map(Number);
    const dt = new Date(y, (m || 1) - 1, day || 1);
    return {
      label: dt.toLocaleDateString("en-IN", { weekday: "short" }),
      shortDate: dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      revenue: d.revenue,
    };
  });
  const hasRevenue = data.some((d) => d.revenue > 0);

  return (
    <Card className="!p-5 lg:!p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Last 7 days</p>
          <h3 className="text-base font-extrabold text-slate-900">Revenue trend</h3>
        </div>
        <div className="w-9 h-9 rounded-xl bg-[#087F78]/10 text-[#087F78] flex items-center justify-center">
          <TrendingUp size={16} />
        </div>
      </div>
      {!hasRevenue ? (
        <div className="h-[180px] flex items-center justify-center text-xs text-slate-400 font-semibold">
          No revenue yet this week
        </div>
      ) : (
        <div className="h-[180px] -ml-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revenueLineStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1DB9A0" />
                  <stop offset="100%" stopColor="#087F78" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: "#94A3B8" }} />
              <YAxis hide />
              <Tooltip cursor={{ stroke: "#087F78", strokeWidth: 1, strokeDasharray: "3 3" }} content={<RevenueTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="url(#revenueLineStroke)"
                strokeWidth={2.5}
                strokeLinecap="round"
                dot={{ r: 3, fill: "#087F78", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#087F78", stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

function RevenueTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { shortDate: string; revenue: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-lg px-3 py-2">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{point.shortDate}</p>
      <p className="text-sm font-extrabold text-slate-900">₹{point.revenue.toLocaleString("en-IN")}</p>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
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

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] px-4 py-3.5 hover:border-[#087F78]/30 hover:-translate-y-0.5 transition-all"
    >
      <div className="w-8 h-8 rounded-lg bg-[#087F78]/10 flex items-center justify-center text-[#087F78] shrink-0">
        <Icon size={15} />
      </div>
      <span className="text-xs font-bold text-slate-700">{label}</span>
    </Link>
  );
}
