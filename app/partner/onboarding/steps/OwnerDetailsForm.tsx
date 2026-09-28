"use client";

import { useState } from "react";
import { onboardingApi } from "../../../../lib/kitchenApi";
import { Button, Field, TextInput } from "../../components/ui";
import { useStepForm } from "./useStepForm";

export function OwnerDetailsForm({ onSaved }: { onSaved: () => Promise<void> }) {
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const { error, isSaving, submit } = useStepForm(
    () => onboardingApi.ownerDetails({ ownerName: ownerName.trim(), email: email.trim() || undefined }),
    onSaved,
  );

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-extrabold text-slate-900">Owner details</h2>
      <Field label="Your full name">
        <TextInput value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Rahul Sharma" />
      </Field>
      <Field label="Email (optional)">
        <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@kitchen.com" />
      </Field>
      {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
      <Button onClick={submit} disabled={ownerName.trim().length < 2} loading={isSaving}>
        Continue
      </Button>
    </div>
  );
}
