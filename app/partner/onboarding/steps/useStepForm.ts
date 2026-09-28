"use client";

import { useState } from "react";
import { ApiError } from "../../../../lib/kitchenApi";

export function useStepForm(save: () => Promise<unknown>, onSaved: () => Promise<void>) {
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const submit = async () => {
    setError(null);
    setIsSaving(true);
    try {
      await save();
      await onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save, please try again");
    } finally {
      setIsSaving(false);
    }
  };

  return { error, isSaving, submit };
}
