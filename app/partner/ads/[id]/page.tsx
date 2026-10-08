"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CalendarCheck, CalendarX, IndianRupee, MousePointerClick, Pause, Play, Square, Target, Users, Video } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { adsApi, ApiError } from "../../../../lib/kitchenApi";
import type { Campaign, CampaignDailyStat } from "../../../../lib/types";
import { BackLink, Badge, Button, Card, EmptyState, Spinner } from "../../components/ui";

const STATUS_TONE: Record<Campaign["status"], "success" | "warning" | "neutral"> = {
  ACTIVE: "success",
  PAUSED: "warning",
  ENDED: "neutral",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const campaignId = params.id;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActing, setIsActing] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setCampaign(await adsApi.get(campaignId));
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load this campaign, please try again");
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = async (action: "pause" | "resume" | "stop") => {
    setIsActing(true);
    setError(null);
    try {
      setCampaign(await adsApi[action](campaignId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update this campaign, please try again");
    } finally {
      setIsActing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="w-8 h-8 text-[#087F78]" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div>
        <BackLink href="/partner/ads" label="Back to Ads" />
        <Card>
          <EmptyState title="Couldn't load this campaign" description={error ?? undefined} action={<Button onClick={load}>Retry</Button>} />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <BackLink href="/partner/ads" label="Back to Ads" />

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
            {campaign.reel?.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={campaign.reel.thumbnailUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <Video size={22} />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight">
                {campaign.reel?.caption || "Untitled reel"}
              </h1>
              <Badge tone={STATUS_TONE[campaign.status]}>{campaign.status}</Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              ₹{campaign.dailyBudgetRs}/day · {campaign.endDate ? `ends ${formatDate(campaign.endDate)}` : "runs indefinitely"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {campaign.status === "ACTIVE" ? (
            <Button variant="outline" onClick={() => runAction("pause")} loading={isActing}>
              <Pause size={15} /> Pause
            </Button>
          ) : null}
          {campaign.status === "PAUSED" ? (
            <Button variant="outline" onClick={() => runAction("resume")} loading={isActing}>
              <Play size={15} /> Resume
            </Button>
          ) : null}
          {campaign.status !== "ENDED" ? (
            <Button variant="danger" onClick={() => runAction("stop")} loading={isActing}>
              <Square size={15} /> Stop
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={IndianRupee} label="Spend" value={`₹${campaign.spendRs.toLocaleString("en-IN")}`} />
        <StatCard icon={Users} label="Impressions" value={campaign.impressions.toLocaleString("en-IN")} />
        <StatCard icon={MousePointerClick} label="Clicks" value={campaign.clicks.toLocaleString("en-IN")} sub={`${campaign.ctr.toFixed(2)}% CTR`} />
        <StatCard icon={Target} label="Orders" value={campaign.ordersCount} sub={`₹${campaign.revenueRs.toLocaleString("en-IN")} revenue`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 !p-5 lg:!p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Daily trend</p>
              <h3 className="text-base font-extrabold text-slate-900">Impressions &amp; clicks</h3>
            </div>
          </div>
          <DailyStatsChart dailyStats={campaign.dailyStats ?? []} height={220} />
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="!p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Reach</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-extrabold text-slate-900">{campaign.actualReach.toLocaleString("en-IN")}</p>
                <p className="text-[11px] text-slate-400 font-semibold">actual</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-600">
                  {campaign.estimatedReach.min.toLocaleString("en-IN")}–{campaign.estimatedReach.max.toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-slate-400 font-semibold">estimated</p>
              </div>
            </div>
          </Card>

          <Card className="!p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Return on ad spend</p>
            <p className="text-2xl font-extrabold text-slate-900">{campaign.roi.toFixed(2)}×</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              ₹{campaign.revenueRs.toLocaleString("en-IN")} revenue / ₹{campaign.spendRs.toLocaleString("en-IN")} spend
            </p>
          </Card>

          <Card className="!p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Timeline</p>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <CalendarCheck size={13} className="text-slate-400 shrink-0" />
                Created {formatDate(campaign.createdAt)}
              </div>
              {campaign.pausedAt ? (
                <div className="flex items-center gap-2 text-amber-600">
                  <Pause size={13} className="shrink-0" />
                  Paused {formatDate(campaign.pausedAt)}
                </div>
              ) : null}
              {campaign.endedAt ? (
                <div className="flex items-center gap-2 text-slate-500">
                  <CalendarX size={13} className="shrink-0" />
                  Ended {formatDate(campaign.endedAt)}
                </div>
              ) : null}
            </div>
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
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <Card className="!p-5">
      <div className="w-9 h-9 rounded-xl bg-[#087F78]/10 text-[#087F78] flex items-center justify-center mb-3">
        <Icon size={16} />
      </div>
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs font-semibold text-slate-400 mt-0.5">{label}</p>
      {sub ? <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p> : null}
    </Card>
  );
}

/** `dailyStats` carries no per-day spend field on the wire — only impressions/clicks are chartable per day. */
function DailyStatsChart({ dailyStats, height = 220 }: { dailyStats: CampaignDailyStat[]; height?: number }) {
  const chartData = dailyStats.map((d) => {
    const [y, m, day] = d.date.split("-").map(Number);
    const dt = new Date(y, (m || 1) - 1, day || 1);
    return {
      shortDate: dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      impressions: d.impressions,
      clicks: d.clicks,
    };
  });
  const hasData = dailyStats.some((d) => d.impressions > 0 || d.clicks > 0);

  if (!hasData) {
    return (
      <div style={{ height }} className="flex items-center justify-center text-xs text-slate-400 font-semibold">
        No activity yet
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="#F1F5F9" />
          <XAxis dataKey="shortDate" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: "#94A3B8" }} />
          <YAxis hide />
          <Tooltip
            cursor={{ stroke: "#087F78", strokeWidth: 1, strokeDasharray: "3 3" }}
            contentStyle={{ borderRadius: 12, border: "1px solid #F1F5F9", fontSize: 12 }}
          />
          <Line type="monotone" dataKey="impressions" name="Impressions" stroke="#087F78" strokeWidth={2.5} dot={{ r: 3, fill: "#087F78", strokeWidth: 0 }} />
          <Line type="monotone" dataKey="clicks" name="Clicks" stroke="#94A3B8" strokeWidth={2} dot={{ r: 3, fill: "#94A3B8", strokeWidth: 0 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
