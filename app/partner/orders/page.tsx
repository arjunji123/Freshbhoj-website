"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, MessageSquare, Phone, StickyNote } from "lucide-react";
import { ApiError, kitchenOrdersApi } from "../../../lib/kitchenApi";
import type { KitchenOrderCard, OrderStatus } from "../../../lib/types";
import { Badge, Button, Card, ConfirmDialog, EmptyState, GRADIENT_BG, PageHeader, Spinner, TabBar, TextArea } from "../components/ui";

const POLL_MS = 15_000;

type LiveTab = "NEW" | "PREPARING" | "OUT_FOR_DELIVERY";
type Tab = LiveTab | "COMPLETED";

const TAB_META: { key: Tab; label: string }[] = [
  { key: "NEW", label: "New" },
  { key: "PREPARING", label: "Preparing" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "COMPLETED", label: "Completed" },
];

const ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  ACCEPTED: "Accept order",
  PREPARING: "Start preparing",
  OUT_FOR_DELIVERY: "Mark out for delivery",
  DELIVERED: "Mark delivered",
  CANCELLED: "Cancel order",
};

const COLUMN_LABEL: Partial<Record<OrderStatus, string>> = {
  ACCEPTED: "Accepted",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
};

/** `item.customizations` is typed `unknown` on the wire — the backend actually populates it as `{ name, priceDelta }[]`. */
function customizationNames(customizations: unknown): string[] {
  if (!Array.isArray(customizations)) return [];
  return customizations
    .map((c) => (c && typeof c === "object" && "name" in c ? String((c as { name: unknown }).name) : null))
    .filter((name): name is string => Boolean(name));
}

function itemNote(item: KitchenOrderCard["items"][number]): string | null {
  const parts = [...customizationNames(item.customizations)];
  if (item.specialInstructions) parts.push(item.specialInstructions);
  return parts.length > 0 ? `${item.name}: ${parts.join(", ")}` : null;
}

/** Client-side bucketing of the polled "incoming" list — `null` means it doesn't belong on a live tab. */
function bucketOf(status: OrderStatus): LiveTab | null {
  if (status === "PLACED" || status === "ACCEPTED") return "NEW";
  if (status === "PREPARING") return "PREPARING";
  if (status === "OUT_FOR_DELIVERY") return "OUT_FOR_DELIVERY";
  return null;
}

export default function OrdersPage() {
  const [tab, setTab] = useState<Tab>("NEW");
  const [orders, setOrders] = useState<KitchenOrderCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [pendingChange, setPendingChange] = useState<{ order: KitchenOrderCard; status: OrderStatus } | null>(null);
  const [rejecting, setRejecting] = useState<KitchenOrderCard | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = async (showSpinner = false) => {
    if (showSpinner) setIsLoading(true);
    try {
      setOrders(await kitchenOrdersApi.incoming());
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load orders, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(true);
    pollRef.current = setInterval(() => load(false), POLL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const buckets = useMemo(() => {
    const grouped: Record<LiveTab, KitchenOrderCard[]> = { NEW: [], PREPARING: [], OUT_FOR_DELIVERY: [] };
    for (const order of orders) {
      const bucket = bucketOf(order.status);
      if (bucket) grouped[bucket].push(order);
    }
    return grouped;
  }, [orders]);

  const confirmChange = async () => {
    if (!pendingChange) return;
    const { order, status } = pendingChange;
    setError(null);
    setBusyOrderId(order.id);
    try {
      await kitchenOrdersApi.advanceStatus(order.id, status);
      await load(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update the order, please try again");
    } finally {
      setBusyOrderId(null);
      setPendingChange(null);
    }
  };

  const confirmReject = async (reason: string) => {
    if (!rejecting) return;
    const order = rejecting;
    setError(null);
    setBusyOrderId(order.id);
    try {
      await kitchenOrdersApi.advanceStatus(order.id, "CANCELLED", reason || undefined);
      await load(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reject the order, please try again");
    } finally {
      setBusyOrderId(null);
      setRejecting(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle={tab === "COMPLETED" ? "Past orders, any date range" : "Live orders, refreshed automatically"}
      />

      <TabBar
        className="mb-6"
        tabs={TAB_META.map(({ key, label }) => ({
          key,
          label,
          count: key !== "COMPLETED" ? buckets[key].length : undefined,
        }))}
        activeKey={tab}
        onChange={setTab}
      />

      {tab === "COMPLETED" ? (
        <HistoryView />
      ) : (
        <LiveTabPanel
          tab={tab}
          orders={buckets[tab]}
          isLoading={isLoading}
          error={error}
          busyOrderId={busyOrderId}
          onRetry={() => load(true)}
          onRequestChange={(order, status) => setPendingChange({ order, status })}
          onReject={(order) => setRejecting(order)}
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingChange)}
        title={
          pendingChange
            ? `${ACTION_LABEL[pendingChange.status] ?? "Update order"} #${pendingChange.order.orderNumber}?`
            : ""
        }
        description={`Moves this order to "${COLUMN_LABEL[pendingChange?.status as OrderStatus] ?? pendingChange?.status}". The customer sees this update immediately.`}
        confirmLabel={pendingChange ? ACTION_LABEL[pendingChange.status] ?? "Confirm" : "Confirm"}
        isLoading={Boolean(busyOrderId) && busyOrderId === pendingChange?.order.id}
        onConfirm={confirmChange}
        onCancel={() => setPendingChange(null)}
      />

      <RejectDialog
        key={rejecting?.id ?? "none"}
        order={rejecting}
        isLoading={Boolean(busyOrderId) && busyOrderId === rejecting?.id}
        onCancel={() => setRejecting(null)}
        onConfirm={confirmReject}
      />
    </div>
  );
}

// ── Live tab panel (New / Preparing / Out for Delivery) ─────────────────────

function LiveTabPanel({
  tab,
  orders,
  isLoading,
  error,
  busyOrderId,
  onRetry,
  onRequestChange,
  onReject,
}: {
  tab: LiveTab;
  orders: KitchenOrderCard[];
  isLoading: boolean;
  error: string | null;
  busyOrderId: string | null;
  onRetry: () => void;
  onRequestChange: (order: KitchenOrderCard, status: OrderStatus) => void;
  onReject: (order: KitchenOrderCard) => void;
}) {
  return (
    <div>
      {error && orders.length > 0 ? <p className="text-xs font-semibold text-red-600 mb-4">{error}</p> : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-[#087F78]" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          {error ? (
            <EmptyState title="Couldn't load orders" description={error} action={<Button onClick={onRetry}>Retry</Button>} />
          ) : (
            <EmptyState
              title={`No orders in "${TAB_META.find((t) => t.key === tab)?.label}"`}
              description="New orders will show up here the moment they come in."
            />
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isBusy={busyOrderId === order.id}
              onRequestChange={(status) => onRequestChange(order, status)}
              onReject={tab === "NEW" ? () => onReject(order) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  isBusy,
  onRequestChange,
  onReject,
}: {
  order: KitchenOrderCard;
  isBusy: boolean;
  onRequestChange: (status: OrderStatus) => void;
  onReject?: () => void;
}) {
  const forwardAction = order.allowedNextStatuses.find((s) => s !== "CANCELLED");
  // Outside the New tab there's no dedicated Reject flow, so fall back to the plain cancel link when it's allowed.
  const canPlainCancel = !onReject && order.allowedNextStatuses.includes("CANCELLED");
  // No point chatting before the kitchen has actually accepted the order.
  const canChat = order.status !== "PLACED" && order.status !== "PENDING_PAYMENT";

  return (
    <Card className="!p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-extrabold text-slate-900">#{order.orderNumber}</p>
        <div className="flex items-center gap-2">
          {canChat ? (
            <Link
              href={`/partner/orders/${order.id}/chat`}
              className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:bg-[#087F78]/10 hover:text-[#087F78] flex items-center justify-center transition-colors shrink-0"
              aria-label="Chat with customer"
              title="Chat with customer"
            >
              <MessageSquare size={13} />
            </Link>
          ) : null}
          <Badge tone="brand">₹{order.totalAmount}</Badge>
        </div>
      </div>
      <p className="text-xs text-slate-500 mb-1">{order.customer.name}</p>
      <a href={`tel:${order.customer.phone}`} className="inline-flex items-center gap-1 text-xs font-bold text-[#087F78] mb-3">
        <Phone size={11} /> {order.customer.phone}
      </a>
      <div className="text-xs text-slate-600 mb-3 space-y-1">
        {order.items.map((item, i) => {
          const names = customizationNames(item.customizations);
          return (
            <div key={i}>
              <p>
                {item.quantity}× {item.name}
              </p>
              {names.length > 0 ? <p className="text-[11px] text-slate-400">{names.join(", ")}</p> : null}
              {item.specialInstructions ? (
                <p className="text-[11px] italic text-amber-600">&ldquo;{item.specialInstructions}&rdquo;</p>
              ) : null}
            </div>
          );
        })}
      </div>
      {order.orderNotes ? (
        <div className="flex items-start gap-1.5 text-[11px] italic text-amber-600 mb-3">
          <StickyNote size={12} className="mt-0.5 shrink-0" />
          <span>&ldquo;{order.orderNotes}&rdquo;</span>
        </div>
      ) : null}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-3">
        <Clock size={11} />
        ETA {order.etaMinutes} mins
      </div>
      <div className="flex flex-col gap-2">
        {forwardAction ? (
          <Button className="w-full !py-2 !text-xs" onClick={() => onRequestChange(forwardAction)} loading={isBusy}>
            {ACTION_LABEL[forwardAction] ?? forwardAction}
          </Button>
        ) : null}
        {onReject ? (
          <Button variant="danger" className="w-full !py-2 !text-xs" onClick={onReject} disabled={isBusy}>
            Reject
          </Button>
        ) : canPlainCancel ? (
          <button
            onClick={() => onRequestChange("CANCELLED")}
            disabled={isBusy}
            className="text-[11px] font-bold text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            Cancel order
          </button>
        ) : null}
      </div>
    </Card>
  );
}

function RejectDialog({
  order,
  isLoading,
  onCancel,
  onConfirm,
}: {
  order: KitchenOrderCard | null;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-6" onClick={isLoading ? undefined : onCancel}>
      <Card className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-extrabold text-slate-900 mb-1.5">Reject order #{order.orderNumber}?</h3>
        <p className="text-sm text-slate-500 mb-4">
          This cannot be undone — the customer is notified immediately. Let them know why (optional).
        </p>
        <TextArea
          rows={3}
          placeholder="e.g. out of stock, kitchen is too busy right now…"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mb-4"
          disabled={isLoading}
        />
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1 justify-center bg-slate-100" onClick={onCancel} disabled={isLoading}>
            Never mind
          </Button>
          <Button variant="danger" className="flex-1 justify-center" onClick={() => onConfirm(reason.trim())} loading={isLoading}>
            Reject order
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ── History view (Completed tab) ────────────────────────────────────────────

type Period = "today" | "month" | "year" | "custom";

const COMPLETED_STATUSES: OrderStatus[] = ["DELIVERED", "CANCELLED"];

/** Parses a `YYYY-MM-DD` `<input type="date">` value into local date parts. */
function parseDateInput(value: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

function periodToRange(period: Period, customFrom: string, customTo: string): { dateFrom?: string; dateTo?: string } {
  const now = new Date();
  if (period === "today") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return { dateFrom: start.toISOString() };
  }
  if (period === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { dateFrom: start.toISOString() };
  }
  if (period === "year") {
    const start = new Date(now.getFullYear(), 0, 1);
    return { dateFrom: start.toISOString() };
  }
  // Build from local date parts, same as "today"/"month"/"year" above —
  // `new Date(customFrom)` parses the YYYY-MM-DD string as UTC midnight,
  // which shifts the boundary by the local UTC offset and can silently
  // exclude early-morning orders on the start date.
  const from = customFrom ? parseDateInput(customFrom) : null;
  const to = customTo ? parseDateInput(customTo) : null;
  return {
    dateFrom: from ? new Date(from.year, from.month - 1, from.day).toISOString() : undefined,
    dateTo: to ? new Date(to.year, to.month - 1, to.day, 23, 59, 59, 999).toISOString() : undefined,
  };
}

function HistoryView() {
  const [period, setPeriod] = useState<Period>("month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [orders, setOrders] = useState<KitchenOrderCard[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const range = useMemo(() => periodToRange(period, customFrom, customTo), [period, customFrom, customTo]);

  const loadHistory = async (currentPage: number, currentRange: { dateFrom?: string; dateTo?: string }) => {
    setIsLoading(true);
    try {
      const result = await kitchenOrdersApi.list({
        page: currentPage,
        limit: 20,
        status: COMPLETED_STATUSES,
        ...currentRange,
      });
      setOrders(result.items);
      setTotalPages(result.meta.totalPages);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load orders, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory(page, range);
  }, [page, range]);

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div className="flex gap-2">
          {(["today", "month", "year", "custom"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPeriod(p);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                period === p ? "text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
              style={period === p ? GRADIENT_BG : undefined}
            >
              {p === "today" ? "Today" : p === "month" ? "This month" : p === "year" ? "This year" : "Custom range"}
            </button>
          ))}
        </div>
        {period === "custom" ? (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => {
                setCustomFrom(e.target.value);
                setPage(1);
              }}
              className="rounded-xl px-3 py-2 text-xs font-semibold input-gradient-focus"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => {
                setCustomTo(e.target.value);
                setPage(1);
              }}
              className="rounded-xl px-3 py-2 text-xs font-semibold input-gradient-focus"
            />
          </div>
        ) : null}
      </div>

      {error && orders.length > 0 ? <p className="text-xs font-semibold text-red-600 mb-4">{error}</p> : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-[#087F78]" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          {error ? (
            <EmptyState
              icon={<Calendar />}
              title="Couldn't load orders"
              description={error}
              action={<Button onClick={() => loadHistory(page, range)}>Retry</Button>}
            />
          ) : (
            <EmptyState
              icon={<Calendar />}
              title="No completed orders in this range"
              description="Try a different period."
            />
          )}
        </Card>
      ) : (
        <>
          <Card className="!p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-bold text-slate-400 uppercase tracking-wide">
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const notes = order.items.map(itemNote).filter((n): n is string => Boolean(n));
                  return (
                    <tr key={order.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-5 py-3.5 font-bold text-slate-800">#{order.orderNumber}</td>
                      <td className="px-5 py-3.5 text-slate-500">{new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className="px-5 py-3.5 text-slate-600">{order.customer.name}</td>
                      <td className="px-5 py-3.5 text-slate-500 max-w-[220px]">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate">{order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}</span>
                          {notes.length > 0 || order.orderNotes ? (
                            <span title={[order.orderNotes, ...notes].filter(Boolean).join(" · ")} className="shrink-0 text-amber-500">
                              <StickyNote size={12} />
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge tone={order.status === "DELIVERED" ? "success" : order.status === "CANCELLED" ? "danger" : "neutral"}>
                          {order.status.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-slate-800">₹{order.totalAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

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
    </div>
  );
}
