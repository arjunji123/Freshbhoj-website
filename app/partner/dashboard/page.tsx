"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Camera,
  Eye,
  Heart,
  IndianRupee,
  ClipboardList,
  Package,
  Phone,
  Plus,
  Star,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";
import { ApiError, kitchenDashboardApi, kitchenOrdersApi, kitchenProfileApi, kitchenStoriesApi } from "../../../lib/kitchenApi";
import type { DashboardSummary, KitchenOrderCard, KitchenProfile, KitchenStory } from "../../../lib/types";
import { Badge, Button, Card, EmptyState, Spinner } from "../components/ui";

const GRADIENT_BG = { background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)" };

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
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toggleError, setToggleError] = useState<string | null>(null);

  const load = async (showSpinner = false) => {
    if (showSpinner) setIsLoading(true);
    try {
      const [summaryRes, profileRes, ordersRes, storiesRes] = await Promise.all([
        kitchenDashboardApi.summary(),
        kitchenProfileApi.get(),
        kitchenOrdersApi.incoming(),
        kitchenStoriesApi.list(),
      ]);
      setSummary(summaryRes);
      setProfile(profileRes);
      setLiveOrders(ordersRes);
      setStories(storiesRes);
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
        <Spinner className="w-8 h-8 text-[#BA2121]" />
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
            <div className="flex items-center gap-2">
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">{profile?.name ?? "your kitchen"}</h1>
              {profile?.isVerified ? <BadgeCheck size={22} className="text-white shrink-0" /> : null}
            </div>
            <p className="text-sm text-white/80 mt-1">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>

          <button
            onClick={handleToggleAccepting}
            disabled={isToggling}
            className="flex items-center gap-3 bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-colors rounded-2xl px-4 py-3 disabled:opacity-60"
          >
            <span className="text-sm font-bold">
              {summary.isAcceptingOrders ? "Taking orders" : "Paused"}
            </span>
            <span
              className={`relative w-11 h-6 rounded-full transition-colors ${summary.isAcceptingOrders ? "bg-white" : "bg-black/25"}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full transition-transform ${
                  summary.isAcceptingOrders ? "translate-x-[22px] bg-[#BA2121]" : "translate-x-0.5 bg-white/90"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

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
        <QuickAction href="/partner/orders" icon={ClipboardList} label="View orders" />
        <QuickAction href="/partner/profile" icon={UserCog} label="Edit profile" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live orders preview */}
        <Card className="lg:col-span-2 !p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h3 className="text-base font-extrabold text-slate-900">Live orders</h3>
            <Link href="/partner/orders" className="inline-flex items-center gap-1 text-xs font-bold text-[#BA2121]">
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
                <div key={order.id} className="flex items-center justify-between gap-4 px-6 py-4">
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
                    <a href={`tel:${order.customer.phone}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 mt-1">
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
              <div className="flex items-center gap-1.5">
                <Users size={13} className="text-slate-400" />
                <p className="text-xl font-extrabold text-slate-900">{summary.allTime.followerCount}</p>
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
              <Link href="/partner/stories" className="text-[11px] font-bold text-[#BA2121]">
                Manage
              </Link>
            </div>
            {stories.length === 0 ? (
              <p className="text-xs text-slate-400">No stories posted yet — show off a dish today.</p>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {stories.slice(0, 6).map((story) => (
                  <div key={story.id} className="shrink-0 w-16">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border-2 border-[#BA2121]/20">
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
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${accent ? "text-white" : "bg-[#BA2121]/10 text-[#BA2121]"}`} style={accent ? GRADIENT_BG : undefined}>
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
      className="flex items-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] px-4 py-3.5 hover:border-[#BA2121]/30 hover:-translate-y-0.5 transition-all"
    >
      <div className="w-8 h-8 rounded-lg bg-[#BA2121]/10 flex items-center justify-center text-[#BA2121] shrink-0">
        <Icon size={15} />
      </div>
      <span className="text-xs font-bold text-slate-700">{label}</span>
    </Link>
  );
}
