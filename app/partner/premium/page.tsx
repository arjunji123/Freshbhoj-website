"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Crown, Sparkles } from "lucide-react";
import { ApiError, premiumApi } from "../../../lib/kitchenApi";
import type { PremiumSubscription, PremiumTier, PremiumTierCatalog } from "../../../lib/types";
import { Badge, Button, Card, ConfirmDialog, EmptyState, GRADIENT_BG, PageHeader, Spinner } from "../components/ui";
import { pricingChecklist } from "./shared";

const TIER_LABEL: Record<PremiumTier, string> = { BASIC: "Basic", PRO: "Pro", ELITE: "Elite" };
const TIER_ORDER: PremiumTier[] = ["BASIC", "PRO", "ELITE"];

/** "Upgrade" / "Switch" (a downgrade, which is also immediate and charged) / "Choose" for a first purchase. */
function changeKind(current: PremiumTier | null, target: PremiumTier): "choose" | "upgrade" | "switch" {
  if (!current) return "choose";
  return TIER_ORDER.indexOf(target) < TIER_ORDER.indexOf(current) ? "switch" : "upgrade";
}

export default function PremiumPricingPage() {
  const router = useRouter();
  const [tiers, setTiers] = useState<PremiumTierCatalog[]>([]);
  const [subscription, setSubscription] = useState<PremiumSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [confirmTier, setConfirmTier] = useState<PremiumTierCatalog | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const [tiersRes, subRes] = await Promise.all([premiumApi.listTiers(), premiumApi.subscription()]);
      setTiers(tiersRes);
      setSubscription(subRes);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load plans, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handlePurchase = async () => {
    if (!confirmTier) return;
    setIsPurchasing(true);
    setPurchaseError(null);
    try {
      await premiumApi.purchase(confirmTier.tier);
      setConfirmTier(null);
      router.push("/partner/premium/subscription");
    } catch (err) {
      setPurchaseError(err instanceof ApiError ? err.message : "Could not complete purchase, please try again");
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="w-8 h-8 text-[#087F78]" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <EmptyState title="Something went wrong" description={error} action={<Button onClick={load}>Retry</Button>} />
      </Card>
    );
  }

  const isActive = subscription?.status === "ACTIVE";
  const currentTier = isActive ? subscription?.tier ?? null : null;
  const confirmKind = confirmTier ? changeKind(currentTier, confirmTier.tier) : "choose";
  const insufficientBalance = Boolean(purchaseError && /insufficient/i.test(purchaseError));

  return (
    <div>
      <PageHeader
        title="Kitchen Premium"
        subtitle="Unlock advanced analytics, priority boosts and more for your kitchen"
        action={
          isActive ? (
            <Button variant="outline" onClick={() => router.push("/partner/premium/subscription")}>
              <Crown size={15} /> My Subscription
            </Button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((catalogTier) => {
          const isCurrent = isActive && subscription?.tier === catalogTier.tier;
          const checklist = pricingChecklist(catalogTier.features);

          return (
            <div key={catalogTier.tier} className="relative">
              {catalogTier.isMostPopular ? (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 text-white text-[10px] font-extrabold uppercase tracking-wide px-4 py-1.5 rounded-full shadow-[0_10px_25px_-8px_rgba(8,127,120,0.5)]"
                  style={GRADIENT_BG}
                >
                  Most Popular
                </div>
              ) : null}
              <Card
                className={`!p-6 h-full flex flex-col ${catalogTier.isMostPopular ? "border-2 !border-[#087F78]" : ""}`}
              >
                <div className="mb-4">
                  <p className="text-sm font-extrabold text-slate-900">{TIER_LABEL[catalogTier.tier]}</p>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-extrabold text-slate-900">₹{catalogTier.priceRs.toLocaleString("en-IN")}</span>
                    <span className="text-xs font-semibold text-slate-400">/ 28 days</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 mb-6 flex-1">
                  {checklist.map((line) => (
                    <div key={line} className="flex items-start gap-2">
                      <Check size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                      <span className="text-xs font-semibold text-slate-600">{line}</span>
                    </div>
                  ))}
                </div>

                {isCurrent ? (
                  <Badge tone="success">Current Plan</Badge>
                ) : (
                  <Button className="w-full justify-center" variant={catalogTier.isMostPopular ? "primary" : "outline"} onClick={() => setConfirmTier(catalogTier)}>
                    <Sparkles size={14} />{" "}
                    {{ choose: "Choose plan", upgrade: `Upgrade to ${TIER_LABEL[catalogTier.tier]}`, switch: `Switch to ${TIER_LABEL[catalogTier.tier]}` }[changeKind(currentTier, catalogTier.tier)]}
                  </Button>
                )}
              </Card>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={Boolean(confirmTier)}
        title={
          confirmTier
            ? `${{ choose: "Choose the", upgrade: "Upgrade to", switch: "Switch to" }[confirmKind]} ${TIER_LABEL[confirmTier.tier]}${confirmKind === "choose" ? " plan" : ""}?`
            : ""
        }
        description={
          confirmTier
            ? `₹${confirmTier.priceRs.toLocaleString("en-IN")} will be charged from your wallet balance immediately and starts a new 28-day period.`
            : undefined
        }
        extra={
          purchaseError ? (
            <div>
              <p className="text-xs font-semibold text-red-600">{purchaseError}</p>
              {insufficientBalance ? (
                <Link href="/partner/wallet" className="inline-block mt-2 text-xs font-bold text-[#087F78]">
                  Add money to your wallet →
                </Link>
              ) : null}
            </div>
          ) : undefined
        }
        confirmLabel={{ choose: "Confirm", upgrade: "Upgrade", switch: "Switch" }[confirmKind]}
        isLoading={isPurchasing}
        onConfirm={handlePurchase}
        onCancel={() => {
          setConfirmTier(null);
          setPurchaseError(null);
        }}
      />
    </div>
  );
}
