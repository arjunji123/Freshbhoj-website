"use client";

import { useState } from "react";
import { Cloud, Home, Package, UtensilsCrossed } from "lucide-react";
import { onboardingApi } from "../../../../lib/kitchenApi";
import type { KitchenType } from "../../../../lib/types";
import { Button, Field, OptionCard, TextArea, TextInput } from "../../components/ui";
import { useStepForm } from "./useStepForm";

const KITCHEN_TYPES: { value: KitchenType; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { value: "HOME_KITCHEN", label: "Home Kitchen", icon: Home },
  { value: "CLOUD_KITCHEN", label: "Cloud Kitchen", icon: Cloud },
  { value: "RESTAURANT", label: "Restaurant", icon: UtensilsCrossed },
  { value: "TIFFIN_SERVICE", label: "Tiffin Service", icon: Package },
];

export function KitchenDetailsForm({ onSaved }: { onSaved: () => Promise<void> }) {
  const [name, setName] = useState("");
  const [kitchenType, setKitchenType] = useState<KitchenType | null>(null);
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [prepTimeMins, setPrepTimeMins] = useState("25");
  const [opensAt, setOpensAt] = useState("08:00");
  const [closesAt, setClosesAt] = useState("22:00");
  const { error, isSaving, submit } = useStepForm(
    () =>
      onboardingApi.kitchenDetails({
        name: name.trim(),
        // Guarded by the button's disabled state below, which requires kitchenType to be set.
        kitchenType: kitchenType as KitchenType,
        tagline: tagline.trim() || undefined,
        description: description.trim() || undefined,
        prepTimeMins: Number(prepTimeMins) || undefined,
        opensAt,
        closesAt,
      }),
    onSaved,
  );

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-extrabold text-slate-900">Your kitchen</h2>
      <Field label="Kitchen name">
        <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Annapurna Kitchen" />
      </Field>
      <Field label="What kind of kitchen is this?">
        <div className="grid grid-cols-2 gap-3">
          {KITCHEN_TYPES.map(({ value, label, icon: Icon }) => (
            <OptionCard
              key={value}
              icon={<Icon size={22} />}
              label={label}
              selected={kitchenType === value}
              onClick={() => setKitchenType(value)}
            />
          ))}
        </div>
      </Field>
      <Field label="Tagline (optional)">
        <TextInput value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Fresh, nutritious meals made daily" />
      </Field>
      <Field label="Description (optional)">
        <TextArea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell customers what makes your kitchen special" />
      </Field>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Prep time (mins)">
          <TextInput inputMode="numeric" value={prepTimeMins} onChange={(e) => setPrepTimeMins(e.target.value.replace(/\D/g, ""))} />
        </Field>
        <Field label="Opens at">
          <TextInput type="time" value={opensAt} onChange={(e) => setOpensAt(e.target.value)} />
        </Field>
        <Field label="Closes at">
          <TextInput type="time" value={closesAt} onChange={(e) => setClosesAt(e.target.value)} />
        </Field>
      </div>
      {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
      <Button onClick={submit} disabled={name.trim().length < 3 || !kitchenType} loading={isSaving}>
        Continue
      </Button>
    </div>
  );
}
