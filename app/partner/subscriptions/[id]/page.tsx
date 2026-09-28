"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, CircleSlash, Clock, MessageCircle, Pencil, Phone } from "lucide-react";
import { ApiError, subscriptionsApi } from "../../../../lib/kitchenApi";
import type { DayOfWeek, SubscriptionDeliveryScheduleItem, SubscriptionDetail } from "../../../../lib/types";
import { BackLink, Badge, BottomSheet, Button, Card, ConfirmDialog, EmptyState, FoodTypeDot, Spinner, TextArea } from "../../components/ui";

const STATUS_TONE: Record<SubscriptionDetail["status"], "success" | "warning" | "danger" | "neutral"> = {
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

function formatDate(iso: string | null, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", opts);
}

type Action = "approve" | "reject" | "pause" | "resume";

export default function SubscriptionDetailPage() {
  const params = useParams<{ id: string }>();
  const subscriptionId = params.id;

  const [sub, setSub] = useState<SubscriptionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActing, setIsActing] = useState(false);

  const [confirmAction, setConfirmAction] = useState<"approve" | "pause" | "resume" | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [showDispatchConfirm, setShowDispatchConfirm] = useState(false);
  const [showSkipSheet, setShowSkipSheet] = useState(false);
  const [skipReason, setSkipReason] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setSub(await subscriptionsApi.get(subscriptionId));
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load this subscriber, please try again");
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionId]);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = async (action: Action, reason?: string) => {
    setIsActing(true);
    setError(null);
    try {
      const updated =
        action === "approve"
          ? await subscriptionsApi.approve(subscriptionId)
          : action === "reject"
            ? await subscriptionsApi.reject(subscriptionId, reason ?? "")
            : action === "pause"
              ? await subscriptionsApi.pause(subscriptionId)
              : await subscriptionsApi.resume(subscriptionId);
      setSub(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update this subscriber, please try again");
    } finally {
      setIsActing(false);
      setConfirmAction(null);
      setShowReject(false);
      setRejectReason("");
    }
  };

  const handleDispatch = async () => {
    if (!sub) return;
    const today = sub.deliverySchedule[0];
    if (!today) return;
    setIsActing(true);
    setError(null);
    try {
      await subscriptionsApi.dispatchDelivery(subscriptionId, today.date);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not mark this delivery dispatched, please try again");
    } finally {
      setIsActing(false);
      setShowDispatchConfirm(false);
    }
  };

  const handleSkip = async () => {
    if (!sub) return;
    const today = sub.deliverySchedule[0];
    if (!today) return;
    setIsActing(true);
    setError(null);
    try {
      await subscriptionsApi.skipDelivery(subscriptionId, today.date, skipReason.trim() || undefined);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not skip this delivery, please try again");
    } finally {
      setIsActing(false);
      setShowSkipSheet(false);
      setSkipReason("");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="w-8 h-8 text-[#BA2121]" />
      </div>
    );
  }

  if (error && !sub) {
    return (
      <div>
        <BackLink href="/partner/subscriptions" label="Back to Subscribers" />
        <Card>
          <EmptyState title="Couldn't load this subscriber" description={error} action={<Button onClick={load}>Retry</Button>} />
        </Card>
      </div>
    );
  }

  if (!sub) return null;

  const today = sub.deliverySchedule[0] ?? null;

  return (
    <div>
      <BackLink href="/partner/subscriptions" label="Back to Subscribers" />

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center text-slate-300 font-bold text-lg">
            {sub.customer.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sub.customer.profileImage} alt="" className="w-full h-full object-cover" />
            ) : (
              (sub.customer.fullName ?? "?").charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight">
                {sub.customer.fullName ?? "Customer"}
              </h1>
              <Badge tone={STATUS_TONE[sub.status]}>{sub.status}</Badge>
            </div>
            <a href={`tel:${sub.customer.phone}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#BA2121] mt-1">
              <Phone size={13} /> {sub.customer.phone}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Button variant="outline" disabled>
              <MessageCircle size={15} /> Message
            </Button>
            <span className="absolute -top-2 -right-2 text-[9px] font-extrabold bg-slate-200 text-slate-500 rounded-full px-1.5 py-0.5">SOON</span>
          </div>
          <div className="relative">
            <Button variant="outline" disabled>
              <Pencil size={15} /> Edit plan
            </Button>
            <span className="absolute -top-2 -right-2 text-[9px] font-extrabold bg-slate-200 text-slate-500 rounded-full px-1.5 py-0.5">SOON</span>
          </div>
          {sub.status === "PENDING" ? (
            <>
              <Button variant="danger" onClick={() => setShowReject(true)} disabled={isActing}>
                Reject
              </Button>
              <Button onClick={() => setConfirmAction("approve")} loading={isActing}>
                Approve
              </Button>
            </>
          ) : null}
          {sub.status === "ACTIVE" ? (
            <Button variant="outline" onClick={() => setConfirmAction("pause")} loading={isActing}>
              Pause
            </Button>
          ) : null}
          {sub.status === "PAUSED" ? (
            <Button onClick={() => setConfirmAction("resume")} loading={isActing}>
              Resume
            </Button>
          ) : null}
        </div>
      </div>

      {error ? <p className="text-xs font-semibold text-red-600 mb-4">{error}</p> : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 !p-5 lg:!p-6">
          <div className="flex items-center gap-2 mb-4">
            <FoodTypeDot foodType={sub.foodType} />
            <h3 className="text-base font-extrabold text-slate-900">{sub.planName}</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <InfoTile label="Meals/day" value={sub.mealsPerDay} />
            <InfoTile label="Delivery time" value={sub.deliveryTime.charAt(0) + sub.deliveryTime.slice(1).toLowerCase()} />
            <InfoTile label="Billing" value={sub.billingCycle.charAt(0) + sub.billingCycle.slice(1).toLowerCase()} />
            <InfoTile label="Price/cycle" value={`₹${sub.pricePerCycle.toLocaleString("en-IN")}`} />
          </div>
          <div className="mb-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Delivery days</p>
            <div className="flex flex-wrap gap-1.5">
              {sub.deliveryDays.map((d) => (
                <span key={d} className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                  {DAY_SHORT[d]}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400">Started {formatDate(sub.startDate)}</p>
          {sub.specialInstructions ? (
            <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3">
              <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide mb-1">Special instructions</p>
              <p className="text-xs text-amber-700">{sub.specialInstructions}</p>
            </div>
          ) : null}
          {sub.status === "REJECTED" && sub.rejectionReason ? (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3">
              <p className="text-[11px] font-bold text-red-700 uppercase tracking-wide mb-1">Rejection reason</p>
              <p className="text-xs text-red-700">{sub.rejectionReason}</p>
            </div>
          ) : null}
        </Card>

        <Card className="!p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Timeline</p>
          <div className="flex flex-col gap-2 text-xs text-slate-600">
            {sub.approvedAt ? <p>Approved {formatDate(sub.approvedAt)}</p> : null}
            {sub.pausedAt ? <p>Paused {formatDate(sub.pausedAt)}</p> : null}
            {sub.cancelledAt ? <p>Cancelled {formatDate(sub.cancelledAt)}</p> : null}
            <p className="text-slate-400">Created {formatDate(sub.createdAt)}</p>
          </div>
        </Card>
      </div>

      <Card className="!p-5 lg:!p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Next 7 days</p>
            <h3 className="text-base font-extrabold text-slate-900">Delivery schedule</h3>
          </div>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {sub.deliverySchedule.map((day, i) => (
            <DeliveryCell key={day.date} day={day} isToday={i === 0} />
          ))}
        </div>
        {today && today.status === "SCHEDULED" ? (
          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1 justify-center" onClick={() => setShowSkipSheet(true)} disabled={isActing}>
              Skip today
            </Button>
            <Button className="flex-1 justify-center" onClick={() => setShowDispatchConfirm(true)} loading={isActing}>
              Mark dispatched
            </Button>
          </div>
        ) : null}
      </Card>

      <Card className="!p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <h3 className="text-base font-extrabold text-slate-900">Billing history</h3>
        </div>
        {sub.billingHistory.length === 0 ? (
          <div className="px-6 pb-6">
            <EmptyState title="No billing cycles yet" />
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {sub.billingHistory.map((b, i) => (
              <div key={`${b.cycleStart}-${i}`} className="flex items-center justify-between gap-4 px-6 py-4">
                <p className="text-sm font-bold text-slate-700">{formatDate(b.cycleStart)}</p>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-extrabold text-slate-900">₹{b.amount.toLocaleString("en-IN")}</p>
                  <Badge tone={b.paymentStatus === "PAID" ? "success" : b.paymentStatus === "FAILED" ? "danger" : "warning"}>
                    {b.paymentStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={confirmAction === "approve"}
        title="Approve this subscriber?"
        description="This starts their subscription — deliveries begin on schedule."
        confirmLabel="Approve"
        isLoading={isActing}
        onConfirm={() => runAction("approve")}
        onCancel={() => setConfirmAction(null)}
      />
      <ConfirmDialog
        open={confirmAction === "pause"}
        title="Pause this subscription?"
        description="Deliveries stop until you resume it."
        confirmLabel="Pause"
        isLoading={isActing}
        onConfirm={() => runAction("pause")}
        onCancel={() => setConfirmAction(null)}
      />
      <ConfirmDialog
        open={confirmAction === "resume"}
        title="Resume this subscription?"
        description="Deliveries pick back up on schedule."
        confirmLabel="Resume"
        isLoading={isActing}
        onConfirm={() => runAction("resume")}
        onCancel={() => setConfirmAction(null)}
      />
      <ConfirmDialog
        open={showDispatchConfirm}
        title="Mark today's delivery as dispatched?"
        description="The customer is notified immediately."
        confirmLabel="Mark dispatched"
        isLoading={isActing}
        onConfirm={handleDispatch}
        onCancel={() => setShowDispatchConfirm(false)}
      />

      <BottomSheet isOpen={showReject} onClose={() => setShowReject(false)} title="Reject this subscriber?">
        <p className="text-sm text-slate-500 mb-4">Let the customer know why (they&apos;ll see this reason).</p>
        <TextArea
          rows={3}
          placeholder="e.g. outside our delivery area right now…"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          className="mb-4"
          disabled={isActing}
        />
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1 justify-center bg-slate-100" onClick={() => setShowReject(false)} disabled={isActing}>
            Never mind
          </Button>
          <Button
            variant="danger"
            className="flex-1 justify-center"
            onClick={() => runAction("reject", rejectReason.trim())}
            loading={isActing}
            disabled={!rejectReason.trim()}
          >
            Reject
          </Button>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={showSkipSheet} onClose={() => setShowSkipSheet(false)} title="Skip today's delivery?">
        <p className="text-sm text-slate-500 mb-4">Optional — let the customer know why.</p>
        <TextArea
          rows={3}
          placeholder="e.g. ingredient shortage…"
          value={skipReason}
          onChange={(e) => setSkipReason(e.target.value)}
          className="mb-4"
          disabled={isActing}
        />
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1 justify-center bg-slate-100" onClick={() => setShowSkipSheet(false)} disabled={isActing}>
            Never mind
          </Button>
          <Button variant="danger" className="flex-1 justify-center" onClick={handleSkip} loading={isActing}>
            Skip delivery
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-sm font-extrabold text-slate-900">{value}</p>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
    </div>
  );
}

function DeliveryCell({ day, isToday }: { day: SubscriptionDeliveryScheduleItem; isToday: boolean }) {
  const [, m, d] = day.date.split("-").map(Number);
  const dt = new Date(new Date(day.date).getFullYear(), (m || 1) - 1, d || 1);
  const weekday = dt.toLocaleDateString("en-IN", { weekday: "short" });
  const dayNum = dt.getDate();

  const tone =
    day.status === "DISPATCHED"
      ? { bg: "bg-emerald-50", text: "text-emerald-700", icon: <CheckCircle2 size={13} /> }
      : day.status === "SKIPPED"
        ? { bg: "bg-amber-50", text: "text-amber-700", icon: <CircleSlash size={13} /> }
        : { bg: "bg-slate-50", text: "text-slate-500", icon: <Clock size={13} /> };

  return (
    <div
      className={`flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 ${tone.bg} ${
        isToday ? "ring-2 ring-[#BA2121]/40" : ""
      }`}
    >
      <p className={`text-[10px] font-bold uppercase tracking-wide ${tone.text}`}>{isToday ? "Today" : weekday}</p>
      <p className={`text-sm font-extrabold ${tone.text}`}>{dayNum}</p>
      <span className={tone.text}>{tone.icon}</span>
    </div>
  );
}
