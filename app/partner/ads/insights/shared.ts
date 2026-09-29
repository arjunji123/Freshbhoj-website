// Shared helpers for the AI Optimization Suggestions screens
// (`insights/page.tsx`, `insights/[id]/page.tsx`, `insights/history/page.tsx`).

import type { SuggestionEffort, SuggestionType } from "../../../../lib/types";

export const TYPE_LABEL: Record<SuggestionType, string> = {
  BUDGET_INCREASE: "Budget Increase",
  DELIVERY_RADIUS: "Delivery Radius",
  TARGET_CUISINE: "Target Cuisine",
  CREATIVE_REFRESH: "Creative Refresh",
};

export const EFFORT_TONE: Record<SuggestionEffort, "success" | "warning" | "danger"> = {
  LOW: "success",
  MEDIUM: "warning",
  HIGH: "danger",
};

/** BUDGET_INCREASE / DELIVERY_RADIUS actually mutate a campaign's budget or the kitchen's delivery radius when applied. */
export function isMechanicallyActionable(type: SuggestionType): boolean {
  return type === "BUDGET_INCREASE" || type === "DELIVERY_RADIUS";
}

/** TARGET_CUISINE / CREATIVE_REFRESH just flip to APPLIED with no underlying mutation — label the button accordingly. */
export function applyButtonLabel(type: SuggestionType): string {
  return isMechanicallyActionable(type) ? "Apply Suggestion" : "Acknowledge";
}

export function formatSignedPct(value: number | null): string {
  if (value === null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatFieldName(field: string): string {
  return field
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}
