"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Crown, RefreshCw, Sparkles, Video } from "lucide-react";
import { ApiError, premiumApi } from "../../../../lib/kitchenApi";
import type { PremiumSubscription, PremiumTier } from "../../../../lib/types";
import { BackLink, Badge, Button, Card, EmptyState, GRADIENT_BG, PageHeader, Spinner } from "../../components/ui";
import { booleanFeatureLines, reelsLabel } from "../shared";

const TIER_LABEL: Record<PremiumTier, string> = { BASIC: "Basic", PRO: "Pro", ELITE: "Elite" };

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function PremiumSubscriptionPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<PremiumSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      setSubscription(await premiumApi.subscription());
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load your subscription, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="w-8 h-8 text-[#087F78]" />
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div>
        <BackLink href="/partner/premium" label="Back to Premium" />
        <Card>
          <EmptyState title="Something went wrong" description={error ?? undefined} action={<Button onClick={load}>Retry</Button>} />
        </Card>
      </div>
    );
  }

  if (subscription.status === "NONE") {
    return (
      <div>
        <PageHeader title="Subscription Details" subtitle="Your current Kitchen Premium plan" />
        <Card>
          <EmptyState
            icon={<Crown />}
            title="No active subscription"
            description="You haven't purchased a Kitchen Premium plan yet — pick one to unlock advanced analytics, priority boosts and more."
            action={<Button onClick={() => router.push("/partner/premium")}>View plans</Button>}
          />
        </Card>
      </div>
    );
  }

  const tierLabel = subscription.tier ? TIER_LABEL[subscription.tier] : "—";

  return (
    <div>
      <BackLink href="/partner/premium" label="Back to Premium" />

      <div className="relative overflow-hidden rounded-3xl p-6 lg:p-8 mb-6 text-white" style={GRADIENT_BG}>
        <div className="absolute -right-10 -top-16 w-52 h-52 rounded-full bg-white/10" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Crown size={20} />
              <p className="text-sm font-semibold text-white/80">Kitchen Premium</p>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mt-1">{tierLabel}</h1>
          </div>
          <Badge tone={subscription.status === "ACTIVE" ? "success" : "danger"}>{subscription.status}</Badge>
        </div>
      </div>

      {subscription.status === "EXPIRED" ? (
        <Card className="mb-6 !p-4 !bg-amber-50 border-amber-100">
          <p className="text-sm font-bold text-amber-700">Your plan has expired</p>
          <p className="text-xs text-amber-600 mt-1">Renew or upgrade to keep your Premium benefits active.</p>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="!p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Price</p>
          <p className="text-2xl font-extrabold text-slate-900">
            {subscription.priceRs !== null ? `₹${subscription.priceRs.toLocaleString("en-IN")}` : "—"}
          </p>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">per 28-day period</p>
        </Card>
        <Card className="!p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Calendar size={13} /> Current period ends
          </p>
          <p className="text-lg font-extrabold text-slate-900">{formatDate(subscription.currentPeriodEnd)}</p>
        </Card>
        <Card className="!p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <RefreshCw size={13} /> Auto-renewal
          </p>
          <p className="text-lg font-extrabold text-slate-900">{subscription.autoRenew ? "On" : "Off"}</p>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
            {subscription.autoRenew
              ? `Renews automatically from your wallet on ${formatDate(subscription.currentPeriodEnd)}.`
              : "Your plan will not renew automatically."}
          </p>
        </Card>
      </div>

      <Card className="!p-5 lg:!p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Reels</p>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
              <Video size={15} className="text-[#087F78]" /> {reelsLabel(subscription.features)}
            </h3>
          </div>
          {subscription.features.priorityBoostMultiplier > 1 ? (
            <Badge tone="brand">{subscription.features.priorityBoostMultiplier}× Priority Boost</Badge>
          ) : null}
        </div>

        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Features</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {booleanFeatureLines(subscription.features).map((f) => (
            <div key={f.key} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-xs font-bold text-slate-700">{f.label}</span>
              <Badge tone={f.value ? "success" : "neutral"}>{f.value ? "Active" : "Inactive"}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => router.push("/partner/premium")}>
          <Sparkles size={15} /> Upgrade Subscription
        </Button>
      </div>
    </div>
  );
}
