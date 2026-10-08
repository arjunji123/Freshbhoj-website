"use client";

import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Banknote, CalendarClock, IndianRupee, Wallet } from "lucide-react";
import { ApiError, payoutsApi } from "../../../lib/kitchenApi";
import type { PayoutStatus, PayoutSummary, Transaction } from "../../../lib/types";
import { Badge, Button, Card, EmptyState, GRADIENT_BG, PageHeader, Spinner } from "../components/ui";

const STATUS_TONE: Record<PayoutStatus, "neutral" | "success" | "warning" | "danger"> = {
  REQUESTED: "warning",
  PROCESSING: "warning",
  PAID: "success",
  FAILED: "danger",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function PayoutsPage() {
  const [summary, setSummary] = useState<PayoutSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const [summaryRes, txRes] = await Promise.all([payoutsApi.summary(), payoutsApi.transactions({ page: 1, limit: 15 })]);
      setSummary(summaryRes);
      setTransactions(txRes.items);
      setHasNextPage(txRes.meta.hasNextPage);
      setPage(1);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load your payouts, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const res = await payoutsApi.transactions({ page: page + 1, limit: 15 });
      setTransactions((prev) => [...prev, ...res.items]);
      setHasNextPage(res.meta.hasNextPage);
      setPage((p) => p + 1);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load more transactions");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleRequestPayout = async () => {
    setRequestError(null);
    setRequestSuccess(false);
    setIsRequesting(true);
    try {
      await payoutsApi.request();
      setRequestSuccess(true);
      await load();
    } catch (err) {
      setRequestError(err instanceof ApiError ? err.message : "Could not request a payout, please try again");
    } finally {
      setIsRequesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="w-8 h-8 text-[#0A8068]" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <Card>
        <EmptyState title="Something went wrong" description={error ?? undefined} action={<Button onClick={load}>Retry</Button>} />
      </Card>
    );
  }

  const canRequest = summary.availableForPayout > 0;

  return (
    <div>
      <PageHeader title="Payouts" subtitle="Your earnings and payout history" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card className="!p-5">
          <div className="w-9 h-9 rounded-xl bg-[#0A8068]/10 text-[#0A8068] flex items-center justify-center mb-3">
            <IndianRupee size={16} />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">₹{summary.totalEarnings.toLocaleString("en-IN")}</p>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Total earnings</p>
        </Card>
        <Card className="!p-5">
          <div className="w-9 h-9 rounded-xl text-white flex items-center justify-center mb-3" style={GRADIENT_BG}>
            <Wallet size={16} />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">₹{summary.availableForPayout.toLocaleString("en-IN")}</p>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Available for payout</p>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold text-slate-900">Request a payout</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {canRequest
                ? `₹${summary.availableForPayout.toLocaleString("en-IN")} will be transferred to your bank account on file.`
                : "Nothing available to pay out right now."}
            </p>
          </div>
          <Button onClick={handleRequestPayout} loading={isRequesting} disabled={!canRequest}>
            <Banknote size={15} /> Request payout
          </Button>
        </div>
        {requestError ? <p className="text-xs font-semibold text-red-600 mt-3">{requestError}</p> : null}
        {requestSuccess ? <p className="text-xs font-semibold text-emerald-600 mt-3">Payout requested successfully.</p> : null}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="!p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Last payout</p>
          {summary.lastPayout ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-lg font-extrabold text-slate-900">₹{summary.lastPayout.amount.toLocaleString("en-IN")}</p>
                <Badge tone={STATUS_TONE[summary.lastPayout.status]}>{summary.lastPayout.status}</Badge>
              </div>
              <p className="text-xs text-slate-400">Requested {formatDate(summary.lastPayout.requestedAt)}</p>
              {summary.lastPayout.paidAt ? <p className="text-xs text-slate-400">Paid {formatDate(summary.lastPayout.paidAt)}</p> : null}
              {summary.lastPayout.failureReason ? (
                <p className="text-xs font-semibold text-red-600">{summary.lastPayout.failureReason}</p>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No payouts yet.</p>
          )}
        </Card>

        <Card className="!p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Next scheduled</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
              <CalendarClock size={16} />
            </div>
            <p className="text-sm font-bold text-slate-600">Not scheduled — request payouts manually anytime.</p>
          </div>
        </Card>
      </div>

      <Card className="!p-5 mb-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Bank account</p>
        {summary.bankAccount ? (
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <div>
              <p className="text-sm font-extrabold text-slate-900">{summary.bankAccount.accountHolderName}</p>
              <p className="text-xs text-slate-500">{summary.bankAccount.accountNumberMasked}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">IFSC</p>
              <p className="text-xs font-bold text-slate-700">{summary.bankAccount.ifsc}</p>
            </div>
            {summary.bankAccount.bankName ? (
              <div>
                <p className="text-xs text-slate-400">Bank</p>
                <p className="text-xs font-bold text-slate-700">{summary.bankAccount.bankName}</p>
              </div>
            ) : null}
            <Badge tone={summary.bankAccount.isVerified ? "success" : "warning"}>
              {summary.bankAccount.isVerified ? "Verified" : "Pending verification"}
            </Badge>
          </div>
        ) : (
          <p className="text-sm text-slate-400">No bank account on file — add one during onboarding or contact support.</p>
        )}
      </Card>

      <Card className="!p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <h3 className="text-base font-extrabold text-slate-900">Recent Transactions</h3>
        </div>
        {transactions.length === 0 ? (
          <div className="px-6 pb-6">
            <EmptyState title="No transactions yet" description="Delivered orders and payouts will show up here." />
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-50">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        tx.sign === 1 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                      }`}
                    >
                      {tx.sign === 1 ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{tx.label}</p>
                      <p className="text-xs text-slate-400">{formatDate(tx.occurredAt)}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-extrabold ${tx.sign === 1 ? "text-emerald-600" : "text-red-600"}`}>
                      {tx.sign === 1 ? "+" : "−"}₹{tx.amount.toLocaleString("en-IN")}
                    </p>
                    <Badge tone={tx.type === "ORDER" ? "neutral" : STATUS_TONE[tx.status as PayoutStatus] ?? "neutral"}>{tx.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
            {hasNextPage ? (
              <div className="flex justify-center py-4">
                <Button variant="ghost" onClick={handleLoadMore} loading={isLoadingMore}>
                  Load more
                </Button>
              </div>
            ) : null}
          </>
        )}
      </Card>
    </div>
  );
}
