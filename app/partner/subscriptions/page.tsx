"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, Search, Users } from "lucide-react";
import { ApiError, subscriptionsApi } from "../../../lib/kitchenApi";
import type { DayOfWeek, Subscription, SubscriptionCounts, SubscriptionStatus } from "../../../lib/types";
import { Badge, BottomSheet, Button, Card, ConfirmDialog, EmptyState, FoodTypeDot, PageHeader, Spinner, TabBar, TextArea, TextInput } from "../components/ui";

type Tab = "ALL" | SubscriptionStatus;

const TAB_META: { key: Tab; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "ACTIVE", label: "Active" },
  { key: "PAUSED", label: "Paused" },
  { key: "CANCELLED", label: "Cancelled" },
  { key: "REJECTED", label: "Rejected" },
];

const STATUS_TONE: Record<SubscriptionStatus, "success" | "warning" | "danger" | "neutral"> = {
  PENDING: "warning",
  ACTIVE: "success",
  PAUSED: "warning",
  CANCELLED: "neutral",
  REJECTED: "danger",
};

const DAY_SHORT: Record<DayOfWeek, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

export default function SubscriptionsPage() {
  const [tab, setTab] = useState<Tab>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Subscription[]>([]);
  const [counts, setCounts] = useState<SubscriptionCounts | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [approving, setApproving] = useState<Subscription | null>(null);
  const [rejecting, setRejecting] = useState<Subscription | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Debounce the search box so we don't fire a request on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setQuery(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const load = async (currentPage: number) => {
    setIsLoading(true);
    try {
      const res = await subscriptionsApi.list({
        status: tab === "ALL" ? undefined : tab,
        q: query || undefined,
        page: currentPage,
        limit: 12,
      });
      setItems(res.items);
      setTotalPages(res.meta.totalPages);
      setCounts(res.counts);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load subscribers, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, query]);

  useEffect(() => {
    if (page !== 1) load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const allCount = counts ? Object.values(counts).reduce((sum, n) => sum + n, 0) : undefined;
  const countFor = (key: Tab): number | undefined => (key === "ALL" ? allCount : counts?.[key]);

  const confirmApprove = async () => {
    if (!approving) return;
    setBusyId(approving.id);
    try {
      await subscriptionsApi.approve(approving.id);
      await load(page);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not approve this subscriber, please try again");
    } finally {
      setBusyId(null);
      setApproving(null);
    }
  };

  const confirmReject = async () => {
    if (!rejecting) return;
    setBusyId(rejecting.id);
    try {
      await subscriptionsApi.reject(rejecting.id, rejectReason.trim());
      await load(page);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reject this subscriber, please try again");
    } finally {
      setBusyId(null);
      setRejecting(null);
      setRejectReason("");
    }
  };

  return (
    <div>
      <PageHeader title="Subscribers" subtitle="Manage subscription plans and daily deliveries" />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <TabBar
          tabs={TAB_META.map(({ key, label }) => ({ key, label, count: countFor(key) }))}
          activeKey={tab}
          onChange={setTab}
        />

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <TextInput
            placeholder="Search by name or phone…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="!pl-10"
          />
        </div>
      </div>

      {error ? <p className="text-xs font-semibold text-red-600 mb-4">{error}</p> : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-[#087F78]" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users />}
            title="No subscribers found"
            description={query ? "Try a different search." : "Subscribers will show up here once customers subscribe to your plans."}
          />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((sub) => (
              <SubscriberCard
                key={sub.id}
                sub={sub}
                isBusy={busyId === sub.id}
                onApprove={() => setApproving(sub)}
                onReject={() => setRejecting(sub)}
              />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                Previous
              </Button>
              <span className="text-xs font-bold text-slate-500">
                Page {page} of {totalPages}
              </span>
              <Button variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                Next
              </Button>
            </div>
          ) : null}
        </>
      )}

      <ConfirmDialog
        open={Boolean(approving)}
        title={approving ? `Approve ${approving.customer.fullName ?? "this subscriber"}?` : ""}
        description="This starts their subscription — deliveries begin on schedule."
        confirmLabel="Approve"
        isLoading={Boolean(busyId) && busyId === approving?.id}
        onConfirm={confirmApprove}
        onCancel={() => setApproving(null)}
      />

      <BottomSheet
        isOpen={Boolean(rejecting)}
        onClose={() => {
          setRejecting(null);
          setRejectReason("");
        }}
        title={rejecting ? `Reject ${rejecting.customer.fullName ?? "this subscriber"}?` : "Reject subscriber"}
      >
        <p className="text-sm text-slate-500 mb-4">Let the customer know why (they&apos;ll see this reason).</p>
        <TextArea
          rows={3}
          placeholder="e.g. outside our delivery area right now…"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          className="mb-4"
          disabled={Boolean(busyId)}
        />
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="flex-1 justify-center bg-slate-100"
            onClick={() => {
              setRejecting(null);
              setRejectReason("");
            }}
            disabled={Boolean(busyId)}
          >
            Never mind
          </Button>
          <Button
            variant="danger"
            className="flex-1 justify-center"
            onClick={confirmReject}
            loading={Boolean(busyId) && busyId === rejecting?.id}
            disabled={!rejectReason.trim()}
          >
            Reject
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}

function SubscriberCard({
  sub,
  isBusy,
  onApprove,
  onReject,
}: {
  sub: Subscription;
  isBusy: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <Card className="!p-4 flex flex-col gap-3">
      <Link href={`/partner/subscriptions/${sub.id}`} className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center text-slate-300 font-bold">
            {sub.customer.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sub.customer.profileImage} alt="" className="w-full h-full object-cover" />
            ) : (
              (sub.customer.fullName ?? "?").charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-slate-900 truncate">{sub.customer.fullName ?? "Customer"}</p>
            <p className="text-xs text-slate-400 truncate">{sub.customer.phone}</p>
          </div>
        </div>
        <Badge tone={STATUS_TONE[sub.status]}>{sub.status}</Badge>
      </Link>

      <div className="flex items-center gap-1.5">
        <FoodTypeDot foodType={sub.foodType} />
        <p className="text-sm font-bold text-slate-700 truncate">{sub.planName}</p>
      </div>

      <div className="text-xs text-slate-500 space-y-1">
        <p>
          {sub.mealsPerDay} meal{sub.mealsPerDay === 1 ? "" : "s"}/day · {sub.deliveryTime.charAt(0) + sub.deliveryTime.slice(1).toLowerCase()} ·{" "}
          {sub.billingCycle.charAt(0) + sub.billingCycle.slice(1).toLowerCase()}
        </p>
        <p>{sub.deliveryDays.map((d) => DAY_SHORT[d]).join(", ")}</p>
      </div>

      <div className="flex items-center justify-between mt-1">
        <p className="text-sm font-extrabold text-slate-900">₹{sub.pricePerCycle.toLocaleString("en-IN")}</p>
        <a href={`tel:${sub.customer.phone}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
          <Phone size={10} /> Call
        </a>
      </div>

      {sub.status === "PENDING" ? (
        <div className="flex gap-2 mt-1">
          <Button variant="outline" className="flex-1 justify-center !py-2 !text-xs" onClick={onReject} disabled={isBusy}>
            Reject
          </Button>
          <Button className="flex-1 justify-center !py-2 !text-xs" onClick={onApprove} loading={isBusy}>
            Approve
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
