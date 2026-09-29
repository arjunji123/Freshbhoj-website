// Shared helpers for the Premium pricing (`page.tsx`) and subscription
// details (`subscription/page.tsx`) screens.

import type { PremiumFeatures } from "../../../lib/types";

export interface BooleanFeatureLine {
  key: keyof PremiumFeatures;
  label: string;
  value: boolean;
}

/** The boolean on/off features — rendered as ACTIVE/INACTIVE badges on the subscription details page. */
export function booleanFeatureLines(features: PremiumFeatures): BooleanFeatureLine[] {
  return [
    { key: "advancedAnalytics", label: "Advanced Analytics", value: features.advancedAnalytics },
    { key: "aiVideoEditing", label: "AI Video Editing Tools", value: features.aiVideoEditing },
    { key: "sponsoredProfile", label: "Sponsored Profile Placement", value: features.sponsoredProfile },
    { key: "aiMenuInsights", label: "AI Menu Insights", value: features.aiMenuInsights },
    { key: "prioritySupport", label: "Priority Support", value: features.prioritySupport },
    { key: "verifiedBadge", label: "Verified Kitchen Badge", value: features.verifiedBadge },
    { key: "dedicatedGrowthManager", label: "Dedicated Growth Manager", value: features.dedicatedGrowthManager },
  ];
}

export function reelsLabel(features: PremiumFeatures): string {
  return features.reelsPerMonth === null ? "Unlimited Reels" : `${features.reelsPerMonth} Reels per month`;
}

/** Every "included" line for a pricing-card checklist, in a fixed, sensible order. */
export function pricingChecklist(features: PremiumFeatures): string[] {
  const lines = [reelsLabel(features)];
  if (features.priorityBoostMultiplier > 1) lines.push(`${features.priorityBoostMultiplier}× Priority Ad Boost`);
  for (const f of booleanFeatureLines(features)) {
    if (f.value) lines.push(f.label);
  }
  return lines;
}
