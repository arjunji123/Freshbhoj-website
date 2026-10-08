"use client";

import { useState } from "react";
import Link from "next/link";
import { ApiError, onboardingApi } from "../../../../lib/kitchenApi";
import { Button } from "../../components/ui";

export function ReviewForm({
  pending,
  canSubmit,
  onSubmitted,
}: {
  pending: string[];
  canSubmit: boolean;
  onSubmitted: () => Promise<void>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const needsMenu = pending.some((p) => p.toLowerCase().includes("dish"));

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await onboardingApi.submit();
      await onSubmitted();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-extrabold text-slate-900">Review &amp; submit</h2>
      <p className="text-sm text-slate-500 -mt-3">
        You&apos;re all set. Submit your application and our team will review it — you can add your menu anytime,
        even while waiting for approval.
      </p>
      {pending.length ? (
        <div className="rounded-xl bg-amber-50 p-4">
          <p className="text-xs font-bold text-amber-700 mb-1">Still needed:</p>
          <ul className="text-xs text-amber-700 list-disc list-inside">
            {pending.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          {needsMenu ? (
            <Link href="/partner/menu/new" className="inline-block mt-2 text-xs font-bold text-[#087F78]">
              Add a dish now →
            </Link>
          ) : null}
        </div>
      ) : null}
      {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
      <Button onClick={handleSubmit} disabled={!canSubmit} loading={isSubmitting}>
        Submit for review
      </Button>
    </div>
  );
}
