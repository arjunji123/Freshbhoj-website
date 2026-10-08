"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, IndianRupee, MapPin, MessageSquareText, Target, TrendingUp, Users } from "lucide-react";
import { ApiError, suggestionsApi } from "../../../../../lib/kitchenApi";
import type { CampaignSuggestion } from "../../../../../lib/types";
import { BackLink, Badge, Button, Card, EmptyState, Spinner } from "../../../components/ui";
import { applyButtonLabel, EFFORT_TONE, formatFieldName, formatSignedPct, TYPE_LABEL } from "../shared";

const STATUS_TONE: Record<CampaignSuggestion["status"], "success" | "warning" | "neutral" | "brand"> = {
  NEW: "brand",
  APPLIED: "success",
  DISMISSED: "neutral",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function SuggestionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const suggestionId = params.id;

  const [suggestion, setSuggestion] = useState<CampaignSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActing, setIsActing] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setSuggestion(await suggestionsApi.get(suggestionId));
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load this suggestion, please try again");
    } finally {
      setIsLoading(false);
    }
  }, [suggestionId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleApply = async () => {
    setIsActing(true);
    setError(null);
    try {
      setSuggestion(await suggestionsApi.apply(suggestionId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not apply this suggestion, please try again");
    } finally {
      setIsActing(false);
    }
  };

  const handleDismiss = async () => {
    setIsActing(true);
    setError(null);
    try {
      setSuggestion(await suggestionsApi.dismiss(suggestionId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not dismiss this suggestion, please try again");
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

  if (!suggestion) {
    return (
      <div>
        <BackLink href="/partner/ads/insights" label="Back to AI Insights" />
        <Card>
          <EmptyState title="Couldn't load this suggestion" description={error ?? undefined} action={<Button onClick={load}>Retry</Button>} />
        </Card>
      </div>
    );
  }

  const { impact } = suggestion;

  return (
    <div>
      <BackLink href="/partner/ads/insights" label="Back to AI Insights" />

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight">{suggestion.title}</h1>
            <Badge tone={STATUS_TONE[suggestion.status]}>{suggestion.status}</Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone="brand">{TYPE_LABEL[suggestion.type]}</Badge>
            <Badge tone="neutral">{suggestion.campaignId ? "Campaign-specific" : "Kitchen-wide"}</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-2 max-w-xl">{suggestion.description}</p>
        </div>

        {suggestion.status === "NEW" ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleApply} loading={isActing}>
              {applyButtonLabel(suggestion.type)}
            </Button>
            <Button variant="danger" onClick={handleDismiss} loading={isActing}>
              Dismiss
            </Button>
          </div>
        ) : null}
      </div>

      {error ? <p className="text-xs font-semibold text-red-600 mb-4">{error}</p> : null}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Reach change" value={formatSignedPct(impact.reachDeltaPct)} />
        <StatCard icon={Target} label="Orders change" value={formatSignedPct(impact.ordersDeltaPct)} />
        <StatCard icon={TrendingUp} label="ROI change" value={formatSignedPct(impact.roiDeltaPct)} />
        <StatCard icon={IndianRupee} label="Cost" value={`₹${impact.costRs.toLocaleString("en-IN")}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 !p-5 lg:!p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <MessageSquareText size={13} /> AI Reasoning
          </p>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{suggestion.reasoning}</p>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="!p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Recommendation</p>
            <div className="flex flex-col gap-2 text-xs">
              {impact.expectedOrders !== null ? (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Expected orders</span>
                  <span className="font-bold text-slate-800">{impact.expectedOrders}</span>
                </div>
              ) : null}
              {impact.suggestedDailyBudgetRs !== null ? (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Suggested daily budget</span>
                  <span className="font-bold text-slate-800">₹{impact.suggestedDailyBudgetRs.toLocaleString("en-IN")}</span>
                </div>
              ) : null}
              {impact.suggestedRadiusKm !== null ? (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1"><MapPin size={11} /> Suggested radius</span>
                  <span className="font-bold text-slate-800">{impact.suggestedRadiusKm} km</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Effort</span>
                <Badge tone={EFFORT_TONE[impact.effort]}>{impact.effort}</Badge>
              </div>
            </div>
          </Card>

          {suggestion.appliedChanges ? (
            <Card className="!p-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Applied change</p>
              <p className="text-xs text-slate-500 mb-2">{formatFieldName(suggestion.appliedChanges.field)}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-400">{suggestion.appliedChanges.before}</span>
                <ArrowRight size={13} className="text-slate-300" />
                <span className="text-sm font-extrabold text-emerald-600">{suggestion.appliedChanges.after}</span>
              </div>
            </Card>
          ) : null}

          <Card className="!p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Timeline</p>
            <div className="flex flex-col gap-2 text-xs text-slate-600">
              <div>Generated {formatDate(suggestion.createdAt)}</div>
              {suggestion.appliedAt ? <div className="text-emerald-600 font-semibold">Applied {formatDate(suggestion.appliedAt)}</div> : null}
              {suggestion.dismissedAt ? <div className="text-slate-400 font-semibold">Dismissed {formatDate(suggestion.dismissedAt)}</div> : null}
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" onClick={() => router.push("/partner/ads/insights/history")}>
          View history
        </Button>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="!p-5">
      <div className="w-9 h-9 rounded-xl bg-[#087F78]/10 text-[#087F78] flex items-center justify-center mb-3">
        <Icon size={16} />
      </div>
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs font-semibold text-slate-400 mt-0.5">{label}</p>
    </Card>
  );
}
