"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, History, RefreshCw, Sparkles } from "lucide-react";
import { ApiError, suggestionsApi } from "../../../../lib/kitchenApi";
import type { CampaignSuggestion, SuggestionImpact } from "../../../../lib/types";
import { Badge, BackLink, BottomSheet, Button, Card, EmptyState, PageHeader, Spinner } from "../../components/ui";
import { SuggestionCard } from "./SuggestionCard";
import { EFFORT_TONE, formatSignedPct } from "./shared";

function impactSummary(impact: SuggestionImpact): string {
  const parts: string[] = [];
  if (impact.reachDeltaPct !== null) parts.push(`${formatSignedPct(impact.reachDeltaPct)} reach`);
  if (impact.ordersDeltaPct !== null) parts.push(`${formatSignedPct(impact.ordersDeltaPct)} orders`);
  if (impact.roiDeltaPct !== null) parts.push(`${formatSignedPct(impact.roiDeltaPct)} ROI`);
  return parts.length ? parts.join(" · ") : "—";
}

export default function AiInsightsPage() {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<CampaignSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateErrorStatus, setGenerateErrorStatus] = useState<number | null>(null);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(false);
  const [isApplyingSelected, setIsApplyingSelected] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await suggestionsApi.list({ status: "NEW", limit: 50 });
      setSuggestions(res.items);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Could not load suggestions, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    setGenerateErrorStatus(null);
    try {
      await suggestionsApi.generate();
      // Re-fetch from the source of truth (status=NEW) rather than trusting the
      // raw batch — the batch can include items already actioned earlier today.
      await load();
    } catch (err) {
      if (err instanceof ApiError) {
        setGenerateError(err.message);
        setGenerateErrorStatus(err.status);
      } else {
        setGenerateError("Could not generate suggestions, please try again");
      }
    } finally {
      setIsGenerating(false);
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

  const handleApply = async (id: string) => {
    setBusyId(id);
    try {
      await suggestionsApi.apply(id);
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Could not apply this suggestion, please try again");
    } finally {
      setBusyId(null);
    }
  };

  const handleDismiss = async (id: string) => {
    setBusyId(id);
    try {
      await suggestionsApi.dismiss(id);
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Could not dismiss this suggestion, please try again");
    } finally {
      setBusyId(null);
    }
  };

  const handleApplySelected = async () => {
    setIsApplyingSelected(true);
    setCompareError(null);
    try {
      const ids = Array.from(selected);
      await Promise.all(ids.map((id) => suggestionsApi.apply(id)));
      setSuggestions((prev) => prev.filter((s) => !selected.has(s.id)));
      setSelected(new Set());
      setShowCompare(false);
    } catch (err) {
      setCompareError(err instanceof ApiError ? err.message : "Could not apply the selected suggestions, please try again");
    } finally {
      setIsApplyingSelected(false);
    }
  };

  const compareData = suggestions.filter((s) => selected.has(s.id));

  return (
    <div>
      <BackLink href="/partner/ads" label="Back to Ads" />

      <PageHeader
        title="AI Powered Analysis"
        subtitle="Suggestions to improve reach, orders and ROI on your active campaigns"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/partner/ads/insights/history")}>
              <History size={15} /> History
            </Button>
            <Button onClick={handleGenerate} loading={isGenerating}>
              {suggestions.length > 0 ? <RefreshCw size={15} /> : <Sparkles size={15} />}
              {suggestions.length > 0 ? "Refresh" : "Generate"}
            </Button>
          </div>
        }
      />

      {selected.size > 0 ? (
        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={() => setShowCompare(true)} disabled={selected.size < 2}>
            <BarChart3 size={15} /> Compare ({selected.size})
          </Button>
        </div>
      ) : null}

      {generateError ? (
        <Card className="mb-6 !p-4 !bg-amber-50 border-amber-100">
          <p className="text-sm font-bold text-amber-700">
            {generateErrorStatus === 503 ? "AI suggestions are temporarily unavailable" : "Couldn't generate suggestions"}
          </p>
          <p className="text-xs text-amber-600 mt-1 mb-3">{generateError}</p>
          <div className="flex gap-2">
            <Button variant="outline" className="!py-2 !px-3 !text-xs" onClick={handleGenerate} loading={isGenerating}>
              Try again
            </Button>
            {generateErrorStatus === 400 ? (
              <Button variant="ghost" className="!py-2 !px-3 !text-xs" onClick={() => router.push("/partner/ads")}>
                Go to campaigns
              </Button>
            ) : null}
          </div>
        </Card>
      ) : null}

      {loadError ? <p className="text-xs font-semibold text-red-600 mb-4">{loadError}</p> : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-[#0A8068]" />
        </div>
      ) : suggestions.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Sparkles />}
            title="No suggestions yet"
            description="Generate AI-powered suggestions to optimize your budget, delivery radius and creative — based on how your active campaigns are performing."
            action={
              <Button onClick={handleGenerate} loading={isGenerating}>
                <Sparkles size={15} /> Generate suggestions
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {suggestions.map((s) => (
            <SuggestionCard
              key={s.id}
              suggestion={s}
              selected={selected.has(s.id)}
              onToggleSelect={() => toggleSelect(s.id)}
              onApply={() => handleApply(s.id)}
              onDismiss={() => handleDismiss(s.id)}
              isBusy={busyId === s.id}
            />
          ))}
        </div>
      )}

      <BottomSheet isOpen={showCompare} onClose={() => setShowCompare(false)} title="Compare Suggestions">
        <div className="flex flex-col gap-6">
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-xs min-w-[560px]">
              <thead>
                <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  <th className="px-2 py-2">Suggestion</th>
                  <th className="px-2 py-2">Impact</th>
                  <th className="px-2 py-2 text-right">Cost</th>
                  <th className="px-2 py-2">Effort</th>
                  <th className="px-2 py-2 text-right">Exp. Orders</th>
                </tr>
              </thead>
              <tbody>
                {compareData.map((s) => (
                  <tr key={s.id} className="border-t border-slate-50">
                    <td className="px-2 py-2.5 font-bold text-slate-800 max-w-[160px] truncate">{s.title}</td>
                    <td className="px-2 py-2.5 text-slate-500 max-w-[180px]">{impactSummary(s.impact)}</td>
                    <td className="px-2 py-2.5 text-right font-semibold text-slate-700">₹{s.impact.costRs.toLocaleString("en-IN")}</td>
                    <td className="px-2 py-2.5">
                      <Badge tone={EFFORT_TONE[s.impact.effort]}>{s.impact.effort}</Badge>
                    </td>
                    <td className="px-2 py-2.5 text-right font-bold text-slate-800">{s.impact.expectedOrders ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {compareError ? <p className="text-xs font-semibold text-red-600">{compareError}</p> : null}

          <Button className="w-full justify-center" onClick={handleApplySelected} loading={isApplyingSelected}>
            Apply Selected Suggestion
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
