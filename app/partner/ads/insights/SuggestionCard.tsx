"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { CampaignSuggestion } from "../../../../lib/types";
import { Badge, Button, Card } from "../../components/ui";
import { applyButtonLabel, EFFORT_TONE, formatSignedPct, TYPE_LABEL } from "./shared";

const STATUS_TONE: Record<CampaignSuggestion["status"], "success" | "warning" | "neutral" | "brand"> = {
  NEW: "brand",
  APPLIED: "success",
  DISMISSED: "neutral",
};

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-sm font-extrabold text-slate-900">{value}</p>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
    </div>
  );
}

export function SuggestionCard({
  suggestion,
  selected,
  onToggleSelect,
  onApply,
  onDismiss,
  isBusy,
  showStatus = false,
}: {
  suggestion: CampaignSuggestion;
  selected?: boolean;
  onToggleSelect?: () => void;
  onApply?: () => void;
  onDismiss?: () => void;
  isBusy?: boolean;
  /** History view: shows a status badge + applied/dismissed timestamp instead of action buttons. */
  showStatus?: boolean;
}) {
  const { impact } = suggestion;

  return (
    <Card className="!p-4 lg:!p-5">
      <div className="flex items-start gap-4">
        {onToggleSelect ? (
          <button
            type="button"
            onClick={onToggleSelect}
            aria-pressed={selected}
            aria-label="Select for comparison"
            className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
              selected ? "border-transparent text-white bg-[#BA2121]" : "border-slate-200"
            }`}
          >
            {selected ? <Check size={12} /> : null}
          </button>
        ) : null}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="text-sm font-extrabold text-slate-900">{suggestion.title}</p>
            <Badge tone="brand">{TYPE_LABEL[suggestion.type]}</Badge>
            <Badge tone="neutral">{suggestion.campaignId ? "Campaign-specific" : "Kitchen-wide"}</Badge>
            {showStatus ? <Badge tone={STATUS_TONE[suggestion.status]}>{suggestion.status}</Badge> : null}
          </div>
          <p className="text-xs text-slate-500 mb-3">{suggestion.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {impact.reachDeltaPct !== null ? <MiniStat label="Reach" value={formatSignedPct(impact.reachDeltaPct)} /> : null}
            {impact.ordersDeltaPct !== null ? <MiniStat label="Orders" value={formatSignedPct(impact.ordersDeltaPct)} /> : null}
            {impact.roiDeltaPct !== null ? <MiniStat label="ROI" value={formatSignedPct(impact.roiDeltaPct)} /> : null}
            {impact.expectedOrders !== null ? <MiniStat label="Exp. Orders" value={impact.expectedOrders} /> : null}
            <MiniStat label="Cost" value={`₹${impact.costRs.toLocaleString("en-IN")}`} />
            <div>
              <Badge tone={EFFORT_TONE[impact.effort]}>{impact.effort} effort</Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {showStatus ? (
              <p className="text-[11px] text-slate-400 font-semibold">
                {suggestion.status === "APPLIED" && suggestion.appliedAt
                  ? `Applied ${new Date(suggestion.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
                  : suggestion.status === "DISMISSED" && suggestion.dismissedAt
                    ? `Dismissed ${new Date(suggestion.dismissedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
                    : null}
              </p>
            ) : (
              <>
                <Button variant="outline" className="!py-2 !px-3 !text-xs" onClick={onApply} loading={isBusy}>
                  {applyButtonLabel(suggestion.type)}
                </Button>
                <Button variant="danger" className="!py-2 !px-3 !text-xs" onClick={onDismiss} loading={isBusy}>
                  Dismiss
                </Button>
              </>
            )}
            <Link
              href={`/partner/ads/insights/${suggestion.id}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#BA2121] ml-auto"
            >
              View details <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
