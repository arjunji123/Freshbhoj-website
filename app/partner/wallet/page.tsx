"use client";

import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Calendar, Check, IndianRupee, Plus, TrendingUp, Wallet } from "lucide-react";
import { ApiError, walletApi } from "../../../lib/kitchenApi";
import type { WalletSummary, WalletTopupResult, WalletTransaction } from "../../../lib/types";
import { Badge, BottomSheet, Button, Card, EmptyState, Field, GRADIENT_BG, PageHeader, Spinner, TextInput } from "../components/ui";

const REASON_LABEL: Record<WalletTransaction["reason"], string> = {
  TOPUP: "Wallet top-up",
  AD_BOOST: "Ad boost",
  PREMIUM_PLAN: "Premium plan",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function WalletPage() {
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddMoney, setShowAddMoney] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const [summaryRes, txRes] = await Promise.all([walletApi.summary(), walletApi.transactions({ page: 1, limit: 15 })]);
      setSummary(summaryRes);
      setTransactions(txRes.items);
      setHasNextPage(txRes.meta.hasNextPage);
      setPage(1);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load your wallet, please try again");
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
      const res = await walletApi.transactions({ page: page + 1, limit: 15 });
      setTransactions((prev) => [...prev, ...res.items]);
      setHasNextPage(res.meta.hasNextPage);
      setPage((p) => p + 1);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load more transactions");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleTopupSuccess = (result: WalletTopupResult) => {
    setSummary(result.wallet);
    setTransactions((prev) => [result.transaction, ...prev]);
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

  return (
    <div>
      <PageHeader
        title="Wallet"
        subtitle="Fund Boost campaigns and Premium plans from one balance"
        action={
          <Button onClick={() => setShowAddMoney(true)}>
            <Plus size={15} /> Add Money
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="!p-5">
          <div className="w-9 h-9 rounded-xl text-white flex items-center justify-center mb-3" style={GRADIENT_BG}>
            <Wallet size={16} />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">₹{summary.balanceRs.toLocaleString("en-IN")}</p>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Current balance</p>
        </Card>
        <Card className="!p-5">
          <div className="w-9 h-9 rounded-xl bg-[#0A8068]/10 text-[#0A8068] flex items-center justify-center mb-3">
            <IndianRupee size={16} />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">₹{summary.totalCreditsRs.toLocaleString("en-IN")}</p>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Total credits</p>
        </Card>
        <Card className="!p-5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mb-3">
            <TrendingUp size={16} />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">₹{summary.thisMonthSpentRs.toLocaleString("en-IN")}</p>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Spent this month</p>
        </Card>
        <Card className="!p-5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mb-3">
            <Calendar size={16} />
          </div>
          <p className="text-lg font-extrabold text-slate-900">{summary.nextBillingAt ? formatDate(summary.nextBillingAt) : "—"}</p>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">Next billing</p>
        </Card>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <h3 className="text-base font-extrabold text-slate-900">Recent Transactions</h3>
        </div>
        {transactions.length === 0 ? (
          <div className="px-6 pb-6">
            <EmptyState title="No transactions yet" description="Top-ups, boosts and premium purchases will show up here." />
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-50">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        tx.type === "CREDIT" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                      }`}
                    >
                      {tx.type === "CREDIT" ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{tx.description}</p>
                      <p className="text-xs text-slate-400">{formatDate(tx.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-extrabold ${tx.type === "CREDIT" ? "text-emerald-600" : "text-red-600"}`}>
                      {tx.type === "CREDIT" ? "+" : "−"}₹{tx.amountRs.toLocaleString("en-IN")}
                    </p>
                    <Badge tone="neutral">{REASON_LABEL[tx.reason]}</Badge>
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

      <AddMoneySheet isOpen={showAddMoney} onClose={() => setShowAddMoney(false)} onSuccess={handleTopupSuccess} />
    </div>
  );
}

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

function AddMoneySheet({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: WalletTopupResult) => void;
}) {
  const [amountStr, setAmountStr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WalletTopupResult | null>(null);

  const amount = Number(amountStr);
  const isValidAmount = amountStr.trim() !== "" && Number.isFinite(amount) && amount > 0;

  // Reset the form each time the sheet is (re)opened.
  useEffect(() => {
    if (isOpen) {
      setAmountStr("");
      setError(null);
      setResult(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!isValidAmount) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await walletApi.topup(amount);
      setResult(res);
      onSuccess(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add money, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={result ? "Money added" : "Add money"}>
      {result ? (
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Check size={24} />
          </div>
          <p className="text-lg font-extrabold text-slate-900">₹{result.transaction.amountRs.toLocaleString("en-IN")} added</p>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            New balance: <span className="font-bold text-slate-700">₹{result.wallet.balanceRs.toLocaleString("en-IN")}</span>
          </p>
          <Button className="w-full justify-center" onClick={onClose}>
            Done
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <Field label="Amount (₹)">
            <TextInput
              type="number"
              min={1}
              inputMode="numeric"
              placeholder="e.g. 500"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
            />
          </Field>
          <div className="flex gap-2 flex-wrap -mt-3">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmountStr(String(preset))}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                ₹{preset.toLocaleString("en-IN")}
              </button>
            ))}
          </div>

          {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}

          <Button className="w-full justify-center" onClick={handleSubmit} loading={isSubmitting} disabled={!isValidAmount}>
            Add Money
          </Button>
        </div>
      )}
    </BottomSheet>
  );
}
