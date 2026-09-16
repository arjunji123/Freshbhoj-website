"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, Clock, Phone } from "lucide-react";
import { ApiError, kitchenOrdersApi } from "../../../lib/kitchenApi";
import type { KitchenOrderCard, OrderStatus } from "../../../lib/types";
import { Badge, Button, Card, ConfirmDialog, EmptyState, PageHeader, Spinner } from "../components/ui";

const COLUMNS: { status: OrderStatus; label: string }[] = [
  { status: "PLACED", label: "New" },
  { status: "ACCEPTED", label: "Accepted" },
  { status: "PREPARING", label: "Preparing" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
];

const ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  ACCEPTED: "Accept order",
  PREPARING: "Start preparing",
  OUT_FOR_DELIVERY: "Mark out for delivery",
  CANCELLED: "Cancel order",
};

const COLUMN_LABEL: Partial<Record<OrderStatus, string>> = {
  ACCEPTED: "Accepted",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
};

const POLL_MS = 15_000;

type Tab = "live" | "history";

export default function OrdersPage() {
  const [tab, setTab] = useState<Tab>("live");

  return (
    <div>
      <PageHeader title="Orders" subtitle={tab === "live" ? "Live orders, refreshed automatically" : "Past orders, any date range"} />

      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-2xl w-fit">
        <TabButton active={tab === "live"} onClick={() => setTab("live")}>
          Live
        </TabButton>
        <TabButton active={tab === "history"} onClick={() => setTab("history")}>
          History
        </TabButton>
      </div>

      {tab === "live" ? <LiveBoard /> : <HistoryView />}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
        active ? "bg-white text-[#BA2121] shadow-sm" : "text-slate-500"
      }`}
    >
      {children}
    </button>
  );
}

// ── Live kanban board ────────────────────────────────────────────────────────

function LiveBoard() {
  const [orders, setOrders] = useState<KitchenOrderCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingChange, setPendingChange] = useState<{ order: KitchenOrderCard; status: OrderStatus } | null>(null);
  const [dragOrderId, setDragOrderId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<OrderStatus | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = async (showSpinner = false) => {
    if (showSpinner) setIsLoading(true);
    try {
      setOrders(await kitchenOrdersApi.incoming());
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

  const requestChange = (order: KitchenOrderCard, status: OrderStatus) => setPendingChange({ order, status });

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

  const handleDrop = (order: KitchenOrderCard, targetStatus: OrderStatus) => {
    setDragOverStatus(null);
    if (targetStatus === order.status) return;
    if (!order.allowedNextStatuses.includes(targetStatus)) return;
    requestChange(order, targetStatus);
  };

  return (
    <div>
      {error ? <p className="text-xs font-semibold text-red-600 mb-4">{error}</p> : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-[#BA2121]" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <EmptyState title="No live orders right now" description="New orders will show up here the moment they come in." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLUMNS.map(({ status, label }) => {
            const columnOrders = orders.filter((o) => o.status === status);
            const isDropTarget = dragOverStatus === status;
            return (
              <div
                key={status}
                onDragOver={(e) => {
                  const dragged = orders.find((o) => o.id === dragOrderId);
                  if (dragged && dragged.allowedNextStatuses.includes(status)) {
                    e.preventDefault();
                    setDragOverStatus(status);
                  }
                }}
                onDragLeave={() => setDragOverStatus((s) => (s === status ? null : s))}
                onDrop={(e) => {
                  e.preventDefault();
                  const dragged = orders.find((o) => o.id === dragOrderId);
                  if (dragged) handleDrop(dragged, status);
                }}
                className={`rounded-3xl transition-colors ${isDropTarget ? "bg-[#BA2121]/5 ring-2 ring-[#BA2121]/30" : ""}`}
              >
                <div className="flex items-center gap-2 mb-3 px-1 pt-2">
                  <h3 className="text-sm font-extrabold text-slate-700">{label}</h3>
                  <span className="text-xs font-bold text-slate-400">{columnOrders.length}</span>
                </div>
                <div className="flex flex-col gap-3 px-1 pb-2 min-h-[80px]">
                  {columnOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      isBusy={busyOrderId === order.id}
                      isDragging={dragOrderId === order.id}
                      onDragStart={() => setDragOrderId(order.id)}
                      onDragEnd={() => {
                        setDragOrderId(null);
                        setDragOverStatus(null);
                      }}
                      onRequestChange={(next) => requestChange(order, next)}
                    />
                  ))}
                  {columnOrders.length === 0 ? (
                    <div className="text-xs text-slate-300 font-semibold text-center py-6 border border-dashed border-slate-200 rounded-2xl">
                      Drop here or nothing yet
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingChange)}
        title={
          pendingChange
            ? `${ACTION_LABEL[pendingChange.status] ?? "Update order"} #${pendingChange.order.orderNumber}?`
            : ""
        }
        description={
          pendingChange?.status === "CANCELLED"
            ? "This cannot be undone — the customer will be notified their order was cancelled."
            : `Moves this order to "${COLUMN_LABEL[pendingChange?.status as OrderStatus] ?? pendingChange?.status}". The customer sees this update immediately.`
        }
        confirmLabel={pendingChange ? ACTION_LABEL[pendingChange.status] ?? "Confirm" : "Confirm"}
        isLoading={Boolean(busyOrderId)}
        onConfirm={confirmChange}
        onCancel={() => setPendingChange(null)}
      />
    </div>
  );
}

function OrderCard({
  order,
  isBusy,
  isDragging,
  onDragStart,
  onDragEnd,
  onRequestChange,
}: {
  order: KitchenOrderCard;
  isBusy: boolean;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onRequestChange: (status: OrderStatus) => void;
}) {
  const forwardAction = order.allowedNextStatuses.find((s) => s !== "CANCELLED");
  const canCancel = order.allowedNextStatuses.includes("CANCELLED");
  const isDraggable = order.allowedNextStatuses.length > 0;

  return (
    <Card
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`!p-4 transition-opacity ${isDragging ? "opacity-40" : ""} ${isDraggable ? "cursor-grab active:cursor-grabbing" : ""}`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-extrabold text-slate-900">#{order.orderNumber}</p>
        <Badge tone="brand">₹{order.totalAmount}</Badge>
      </div>
      <p className="text-xs text-slate-500 mb-1">{order.customer.name}</p>
      <a href={`tel:${order.customer.phone}`} className="inline-flex items-center gap-1 text-xs font-bold text-[#BA2121] mb-3">
        <Phone size={11} /> {order.customer.phone}
      </a>
      <div className="text-xs text-slate-600 mb-3 space-y-0.5">
        {order.items.map((item, i) => (
          <p key={i}>
            {item.quantity}× {item.name}
          </p>
        ))}
      </div>
      {order.orderNotes ? <p className="text-xs italic text-amber-600 mb-3">&ldquo;{order.orderNotes}&rdquo;</p> : null}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-3">
        <Clock size={11} />
        ETA {order.etaMinutes} mins
        {isDraggable ? <span className="ml-auto italic">drag to move →</span> : null}
      </div>
      <div className="flex flex-col gap-2">
        {forwardAction ? (
          <Button className="w-full !py-2 !text-xs" onClick={() => onRequestChange(forwardAction)} loading={isBusy}>
            {ACTION_LABEL[forwardAction] ?? forwardAction}
          </Button>
        ) : null}
        {canCancel ? (
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

// ── History view ─────────────────────────────────────────────────────────────

type Period = "today" | "month" | "year" | "custom";

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
  return {
    dateFrom: customFrom ? new Date(customFrom).toISOString() : undefined,
    dateTo: customTo ? new Date(`${customTo}T23:59:59.999`).toISOString() : undefined,
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

  const range = useMemo(() => periodToRange(period, customFrom, customTo), [period, customFrom, customTo]);

  const loadHistory = async (currentPage: number, currentRange: { dateFrom?: string; dateTo?: string }) => {
    setIsLoading(true);
    try {
      const result = await kitchenOrdersApi.list({ page: currentPage, limit: 20, ...currentRange });
      setOrders(result.items);
      setTotalPages(result.meta.totalPages);
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
              style={period === p ? { background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)" } : undefined}
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

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-[#BA2121]" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Calendar />}
            title="No orders in this range"
            description="Try a different period."
          />
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
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3.5 font-bold text-slate-800">#{order.orderNumber}</td>
                    <td className="px-5 py-3.5 text-slate-500">{new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className="px-5 py-3.5 text-slate-600">{order.customer.name}</td>
                    <td className="px-5 py-3.5 text-slate-500 max-w-[220px] truncate">
                      {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge tone={order.status === "DELIVERED" ? "success" : order.status === "CANCELLED" ? "danger" : "neutral"}>
                        {order.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-800">₹{order.totalAmount}</td>
                  </tr>
                ))}
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
