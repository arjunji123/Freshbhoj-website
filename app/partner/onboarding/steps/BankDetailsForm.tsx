"use client";

import { useState } from "react";
import { onboardingApi } from "../../../../lib/kitchenApi";
import type { KitchenBankAccount } from "../../../../lib/types";
import { Badge, Button, Field, TextInput } from "../../components/ui";
import { useStepForm } from "./useStepForm";

export function BankDetailsForm({
  onSaved,
  bankAccount,
}: {
  onSaved: () => Promise<void>;
  bankAccount?: KitchenBankAccount | null;
}) {
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bankName, setBankName] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const { error, isSaving, submit } = useStepForm(
    () =>
      onboardingApi.bankDetails({
        accountHolderName: accountHolderName.trim(),
        accountNumber: accountNumber.trim(),
        ifsc: ifsc.trim().toUpperCase(),
        bankName: bankName.trim() || undefined,
      }),
    async () => {
      // Runs only once bankDetails() has actually succeeded — safe to flag as saved.
      setJustSaved(true);
      await onSaved();
    },
  );

  const isValid = accountHolderName.trim().length >= 2 && /^\d{9,18}$/.test(accountNumber) && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase());
  const showPendingBadge = justSaved || Boolean(bankAccount && !bankAccount.isVerified);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-slate-900">Where should payouts go?</h2>
        {showPendingBadge ? <Badge tone="warning">Verification Pending</Badge> : null}
      </div>
      <Field label="Account holder name">
        <TextInput value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} />
      </Field>
      <Field label="Account number">
        <TextInput inputMode="numeric" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="IFSC code">
          <TextInput value={ifsc} onChange={(e) => setIfsc(e.target.value.toUpperCase())} placeholder="SBIN0001234" />
        </Field>
        <Field label="Bank name (optional)">
          <TextInput value={bankName} onChange={(e) => setBankName(e.target.value)} />
        </Field>
      </div>
      <p className="text-xs text-slate-400">Only the last 4 digits are stored — your full account number never touches our database.</p>
      {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
      <Button onClick={submit} disabled={!isValid} loading={isSaving}>
        Continue
      </Button>
    </div>
  );
}
