"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  Plus,
  Sparkles,
  Square,
  Target,
  Video,
} from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { adsApi, ApiError, kitchenReelsApi, walletApi } from "../../../lib/kitchenApi";
import type { Campaign, CampaignDailyStat, CampaignStatus, KitchenReel, WalletSummary } from "../../../lib/types";
import { Badge, BottomSheet, Button, Card, EmptyState, Field, PageHeader, RangeSlider, Spinner, TabBar } from "../components/ui";

type Tab = "ALL" | CampaignStatus;

const TAB_META: { key: Tab; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "ACTIVE", label: "Active" },
  { key: "PAUSED", label: "Paused" },
  { key: "ENDED", label: "Ended" },
];

const STATUS_TONE: Record<CampaignStatus, "success" | "warning" | "neutral"> = {
  ACTIVE: "success",
  PAUSED: "warning",
  ENDED: "neutral",
};

export default function AdsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [reels, setReels] = useState<KitchenReel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [compareData, setCompareData] = useState<Campaign[] | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  const [detailById, setDetailById] = useState<Record<string, Campaign>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandLoading, setExpandLoading] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const [campaignsRes, reelsRes] = await Promise.all([adsApi.list(), kitchenReelsApi.list()]);
      setCampaigns([...campaignsRes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      setReels(reelsRes);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load your campaigns, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(
    () => ({
      ALL: campaigns.length,
      ACTIVE: campaigns.filter((c) => c.status === "ACTIVE").length,
      PAUSED: campaigns.filter((c) => c.status === "PAUSED").length,
      ENDED: campaigns.filter((c) => c.status === "ENDED").length,
    }),
    [campaigns],
  );

  const displayed = tab === "ALL" ? campaigns : campaigns.filter((c) => c.status === tab);
  const activeReelIds = useMemo(
    () => new Set(campaigns.filter((c) => c.status === "ACTIVE").map((c) => c.reelId)),
    [campaigns],
  );
  const eligibleReels = reels.filter((r) => r.status === "PUBLISHED" && !r.isPaused && !activeReelIds.has(r.id));

  const runAction = async (id: string, action: "pause" | "resume" | "stop") => {
    setBusyId(id);
    setError(null);
    try {
      const updated = await adsApi[action](id);
      setCampaigns((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setDetailById((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], ...updated } } : prev));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update this campaign, please try again");
    } finally {
      setBusyId(null);
    }
  };

  const toggleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (!detailById[id]) {
      setExpandLoading(id);
      try {
        const detail = await adsApi.get(id);
        setDetailById((prev) => ({ ...prev, [id]: detail }));
      } catch {
        // Leave the row collapsed-ish; the chart area will just show nothing to retry with.
      } finally {
        setExpandLoading(null);
      }
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCompare = async () => {
    if (selected.size < 2) return;
    setIsComparing(true);
    setCompareError(null);
    try {
      setCompareData(await adsApi.analytics(Array.from(selected)));
    } catch (err) {
      setCompareError(err instanceof ApiError ? err.message : "Could not load comparison, please try again");
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Ads"
        subtitle="Promote your reels to reach more customers nearby"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/partner/ads/insights")}>
              <Sparkles size={15} /> AI Insights
            </Button>
            <Button onClick={() => setShowCreate(true)}>
              <Plus size={15} /> New campaign
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <TabBar
          tabs={TAB_META.map(({ key, label }) => ({ key, label, count: counts[key] }))}
          activeKey={tab}
          onChange={setTab}
        />

        {selected.size > 0 ? (
          <Button variant="outline" onClick={handleCompare} disabled={selected.size < 2} loading={isComparing}>
            <BarChart3 size={15} /> Compare ({selected.size})
          </Button>
        ) : null}
      </div>

      {error ? <p className="text-xs font-semibold text-red-600 mb-4">{error}</p> : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-[#0A8068]" />
        </div>
      ) : displayed.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Target />}
            title={tab === "ALL" ? "No campaigns yet" : `No ${tab.toLowerCase()} campaigns`}
            description={tab === "ALL" ? "Turn one of your published reels into a campaign to reach more customers." : undefined}
            action={tab === "ALL" ? <Button onClick={() => setShowCreate(true)}>Create your first campaign</Button> : undefined}
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {displayed.map((campaign) => (
            <CampaignRow
              key={campaign.id}
              campaign={detailById[campaign.id] ?? campaign}
              isBusy={busyId === campaign.id}
              isSelected={selected.has(campaign.id)}
              onToggleSelect={() => toggleSelect(campaign.id)}
              isExpanded={expandedId === campaign.id}
              isExpandLoading={expandLoading === campaign.id}
              onToggleExpand={() => toggleExpand(campaign.id)}
              onAction={(action) => runAction(campaign.id, action)}
            />
          ))}
        </div>
      )}

      <CreateCampaignSheet
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        reels={eligibleReels}
        onCreated={(campaign) => {
          setCampaigns((prev) => [campaign, ...prev]);
          setShowCreate(false);
        }}
      />

      <BottomSheet
        isOpen={Boolean(compareData) || isComparing}
        onClose={() => {
          setCompareData(null);
          setCompareError(null);
        }}
        title="Compare campaigns"
      >
        {isComparing ? (
          <div className="flex items-center justify-center py-10">
            <Spinner className="w-6 h-6 text-[#0A8068]" />
          </div>
        ) : compareError ? (
          <p className="text-sm font-semibold text-red-600">{compareError}</p>
        ) : compareData ? (
          <div className="flex flex-col gap-6">
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-xs min-w-[560px]">
                <thead>
                  <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    <th className="px-2 py-2">Reel</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2 text-right">Spend</th>
                    <th className="px-2 py-2 text-right">Impr.</th>
                    <th className="px-2 py-2 text-right">Clicks</th>
                    <th className="px-2 py-2 text-right">CTR</th>
                    <th className="px-2 py-2 text-right">Orders</th>
                    <th className="px-2 py-2 text-right">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {compareData.map((c) => (
                    <tr key={c.id} className="border-t border-slate-50">
                      <td className="px-2 py-2.5 font-bold text-slate-800 max-w-[140px] truncate">{c.reel?.caption || "Untitled reel"}</td>
                      <td className="px-2 py-2.5">
                        <Badge tone={STATUS_TONE[c.status]}>{c.status}</Badge>
                      </td>
                      <td className="px-2 py-2.5 text-right font-semibold text-slate-700">₹{c.spendRs.toLocaleString("en-IN")}</td>
                      <td className="px-2 py-2.5 text-right text-slate-500">{c.impressions.toLocaleString("en-IN")}</td>
                      <td className="px-2 py-2.5 text-right text-slate-500">{c.clicks.toLocaleString("en-IN")}</td>
                      <td className="px-2 py-2.5 text-right text-slate-500">{c.ctr.toFixed(2)}%</td>
                      <td className="px-2 py-2.5 text-right text-slate-500">{c.ordersCount}</td>
                      <td className="px-2 py-2.5 text-right font-bold text-slate-800">{c.roi.toFixed(2)}×</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4">
              {compareData.map((c) => (
                <div key={c.id}>
                  <p className="text-xs font-bold text-slate-600 mb-2 truncate">{c.reel?.caption || "Untitled reel"}</p>
                  <DailyStatsChart dailyStats={c.dailyStats ?? []} height={120} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </BottomSheet>
    </div>
  );
}

function CampaignRow({
  campaign,
  isBusy,
  isSelected,
  onToggleSelect,
  isExpanded,
  isExpandLoading,
  onToggleExpand,
  onAction,
}: {
  campaign: Campaign;
  isBusy: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
  isExpanded: boolean;
  isExpandLoading: boolean;
  onToggleExpand: () => void;
  onAction: (action: "pause" | "resume" | "stop") => void;
}) {
  return (
    <Card className="!p-4 lg:!p-5">
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={onToggleSelect}
          aria-pressed={isSelected}
          aria-label="Select for comparison"
          className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
            isSelected ? "border-transparent text-white bg-[#0A8068]" : "border-slate-200"
          }`}
        >
          {isSelected ? <Check size={12} /> : null}
        </button>

        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
          {campaign.reel?.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={campaign.reel.thumbnailUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <Video size={20} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="text-sm font-extrabold text-slate-900 truncate max-w-[220px]">
              {campaign.reel?.caption || "Untitled reel"}
            </p>
            <Badge tone={STATUS_TONE[campaign.status]}>{campaign.status}</Badge>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            ₹{campaign.dailyBudgetRs}/day · {campaign.endDate ? `ends ${new Date(campaign.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : "runs indefinitely"}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <Stat label="Spend" value={`₹${campaign.spendRs.toLocaleString("en-IN")}`} />
            <Stat label="Impressions" value={campaign.impressions.toLocaleString("en-IN")} />
            <Stat label="Orders" value={campaign.ordersCount} />
            <Stat label="ROI" value={`${campaign.roi.toFixed(2)}×`} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {campaign.status === "ACTIVE" ? (
              <Button variant="outline" className="!py-2 !px-3 !text-xs" onClick={() => onAction("pause")} loading={isBusy}>
                <Pause size={13} /> Pause
              </Button>
            ) : null}
            {campaign.status === "PAUSED" ? (
              <Button variant="outline" className="!py-2 !px-3 !text-xs" onClick={() => onAction("resume")} loading={isBusy}>
                <Play size={13} /> Resume
              </Button>
            ) : null}
            {campaign.status !== "ENDED" ? (
              <Button variant="danger" className="!py-2 !px-3 !text-xs" onClick={() => onAction("stop")} loading={isBusy}>
                <Square size={13} /> Stop
              </Button>
            ) : null}
            <button
              onClick={onToggleExpand}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#0A8068] transition-colors ml-auto"
            >
              Trend {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            <Link
              href={`/partner/ads/${campaign.id}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0A8068]"
            >
              Deep dive <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {isExpanded ? (
        <div className="mt-4 pt-4 border-t border-slate-100">
          {isExpandLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="w-5 h-5 text-[#0A8068]" />
            </div>
          ) : campaign.dailyStats && campaign.dailyStats.length > 0 ? (
            <DailyStatsChart dailyStats={campaign.dailyStats} height={160} />
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">No daily stats yet.</p>
          )}
        </div>
      ) : null}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-sm font-extrabold text-slate-900">{value}</p>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
    </div>
  );
}

/** Shared by the expand row and the compare sheet — plots impressions/clicks per day. `dailyStats` has no per-day spend field on the wire. */
function DailyStatsChart({ dailyStats, height = 160 }: { dailyStats: CampaignDailyStat[]; height?: number }) {
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
    return <div style={{ height }} className="flex items-center justify-center text-xs text-slate-400 font-semibold">No activity yet</div>;
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="#F1F5F9" />
          <XAxis dataKey="shortDate" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#94A3B8" }} />
          <YAxis hide />
          <Tooltip
            cursor={{ stroke: "#0A8068", strokeWidth: 1, strokeDasharray: "3 3" }}
            contentStyle={{ borderRadius: 12, border: "1px solid #F1F5F9", fontSize: 11 }}
          />
          <Line type="monotone" dataKey="impressions" name="Impressions" stroke="#0A8068" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="clicks" name="Clicks" stroke="#94A3B8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const MIN_DAILY_BUDGET = 50;
const MAX_DAILY_BUDGET = 2000;
const BUDGET_STEP = 50;
const MIN_DURATION_DAYS = 1;
const MAX_DURATION_DAYS = 30;

function CreateCampaignSheet({
  isOpen,
  onClose,
  reels,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  reels: KitchenReel[];
  onCreated: (campaign: Campaign) => void;
}) {
  const router = useRouter();
  const [reelId, setReelId] = useState<string | null>(null);
  const [dailyBudgetRs, setDailyBudgetRs] = useState(200);
  const [durationDays, setDurationDays] = useState(7);
  const [estimate, setEstimate] = useState<{ min: number; max: number } | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalCostRs = dailyBudgetRs * durationDays;
  const hasSufficientBalance = wallet ? wallet.balanceRs >= totalCostRs : true;

  // Reset the form each time the sheet is (re)opened, and fetch the current wallet balance.
  useEffect(() => {
    if (isOpen) {
      setReelId(null);
      setDailyBudgetRs(200);
      setDurationDays(7);
      setEstimate(null);
      setError(null);
      setIsLoadingWallet(true);
      walletApi
        .summary()
        .then(setWallet)
        .catch(() => setWallet(null))
        .finally(() => setIsLoadingWallet(false));
    }
  }, [isOpen]);

  // Live reach estimate as the partner drags the budget slider — debounced.
  useEffect(() => {
    if (!isOpen) return;
    setIsEstimating(true);
    const timer = setTimeout(() => {
      adsApi
        .estimateReach(dailyBudgetRs)
        .then(setEstimate)
        .catch(() => setEstimate(null))
        .finally(() => setIsEstimating(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [dailyBudgetRs, isOpen]);

  const handleCreate = async () => {
    if (!reelId) return;
    setIsCreating(true);
    setError(null);
    try {
      const campaign = await adsApi.create({ reelId, dailyBudgetRs, durationDays });
      onCreated(campaign);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create this campaign, please try again");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="New campaign">
      <div className="flex flex-col gap-5">
        <Field label="Pick a reel">
          {reels.length === 0 ? (
            <p className="text-xs text-slate-400">
              No eligible reels — publish a reel first, or check that it isn&apos;t paused or already running a campaign.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
              {reels.map((reel) => (
                <button
                  key={reel.id}
                  type="button"
                  onClick={() => setReelId(reel.id)}
                  className={`text-left rounded-2xl overflow-hidden border-2 transition-colors ${
                    reelId === reel.id ? "border-[#0A8068]" : "border-slate-100 hover:border-[#0A8068]/30"
                  }`}
                >
                  <div className="aspect-video bg-slate-100">
                    {reel.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={reel.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Video size={18} />
                      </div>
                    )}
                  </div>
                  <div className="px-2 py-1.5">
                    <p className="text-[11px] font-bold text-slate-700 truncate">{reel.caption || "Untitled reel"}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Field>

        <RangeSlider
          label={`Daily budget — ₹${dailyBudgetRs.toLocaleString("en-IN")}`}
          min={MIN_DAILY_BUDGET}
          max={MAX_DAILY_BUDGET}
          step={BUDGET_STEP}
          value={dailyBudgetRs}
          onChange={setDailyBudgetRs}
          minLabel={`₹${MIN_DAILY_BUDGET}`}
          maxLabel={`₹${MAX_DAILY_BUDGET.toLocaleString("en-IN")}`}
        />
        {isEstimating ? (
          <p className="text-xs text-slate-400 -mt-3">Estimating reach…</p>
        ) : estimate ? (
          <p className="text-xs text-slate-500 -mt-3">
            Estimated daily reach: <span className="font-bold text-slate-700">{estimate.min.toLocaleString("en-IN")}–{estimate.max.toLocaleString("en-IN")}</span> people
          </p>
        ) : null}

        <RangeSlider
          label={`Duration — ${durationDays} day${durationDays === 1 ? "" : "s"}`}
          min={MIN_DURATION_DAYS}
          max={MAX_DURATION_DAYS}
          step={1}
          value={durationDays}
          onChange={setDurationDays}
          minLabel="1 day"
          maxLabel="30 days"
        />

        <div className="rounded-2xl bg-slate-50 p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Wallet balance</span>
            <span className="font-bold text-slate-800">
              {isLoadingWallet ? "…" : wallet ? `₹${wallet.balanceRs.toLocaleString("en-IN")}` : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Total promotion cost</span>
            <span className="font-extrabold text-slate-900">₹{totalCostRs.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {!isLoadingWallet && wallet && !hasSufficientBalance ? (
          <div className="rounded-2xl bg-amber-50 p-4 flex items-start gap-3">
            <AlertTriangle className="text-amber-500 mt-0.5 shrink-0" size={16} />
            <div className="flex-1">
              <p className="text-xs font-bold text-amber-700">Not enough wallet balance</p>
              <p className="text-[11px] text-amber-600 mt-0.5 mb-2">
                You need ₹{(totalCostRs - wallet.balanceRs).toLocaleString("en-IN")} more to boost this reel.
              </p>
              <button
                type="button"
                onClick={() => router.push("/partner/wallet")}
                className="text-xs font-bold text-[#0A8068] underline underline-offset-2"
              >
                Add Money
              </button>
            </div>
          </div>
        ) : null}

        {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}

        <Button
          className="w-full justify-center"
          onClick={handleCreate}
          loading={isCreating}
          disabled={!reelId || (!isLoadingWallet && Boolean(wallet) && !hasSufficientBalance)}
        >
          Confirm &amp; Boost Now
        </Button>
      </div>
    </BottomSheet>
  );
}
