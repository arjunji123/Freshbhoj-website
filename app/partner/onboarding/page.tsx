"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Circle, Clock, XCircle } from "lucide-react";
import { ApiError, onboardingApi } from "../../../lib/kitchenApi";
import { useKitchenAuth } from "../../../lib/KitchenAuthProvider";
import { Button, Card, Field, GRADIENT_BG, GRADIENT_TEXT, TextArea, TextInput } from "../components/ui";

const WIZARD_STEPS = ["OWNER_DETAILS", "KITCHEN_DETAILS", "LOCATION", "DOCUMENTS", "BANK_DETAILS"] as const;

export default function OnboardingPage() {
  const { onboarding, refresh } = useKitchenAuth();

  if (!onboarding) return null;

  if (onboarding.status === "UNDER_REVIEW" || onboarding.status === "SUSPENDED") {
    return <UnderReviewScreen />;
  }

  const formStep = nextFormFor(onboarding.currentStep);

  return (
    <div className="min-h-screen w-full bg-[#F8F6F6] font-sans px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Image src="/freshbhoj-red-new.svg" alt="FreshBhoj" width={150} height={40} className="h-9 w-auto object-contain mb-6" />
          <h1 className="text-2xl font-extrabold text-slate-900 text-center">
            Set up your <span style={GRADIENT_TEXT}>Kitchen</span>
          </h1>
          <p className="text-sm text-slate-500 text-center mt-1">A few quick steps before you go live</p>
        </div>

        <Progress percent={onboarding.progressPercent} />

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {onboarding.steps
            .filter((s) => WIZARD_STEPS.includes(s.step as (typeof WIZARD_STEPS)[number]))
            .map((s) => (
              <div
                key={s.step}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                  s.isComplete
                    ? "bg-emerald-50 text-emerald-700"
                    : s.isCurrent
                    ? "bg-[#BA2121]/10 text-[#BA2121]"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {s.isComplete ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                {s.label}
              </div>
            ))}
        </div>

        {onboarding.rejectionReason ? (
          <Card className="mb-6 !bg-red-50 border-red-100">
            <div className="flex items-start gap-3">
              <XCircle className="text-red-500 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-sm font-bold text-red-700">Your application needs changes</p>
                <p className="text-sm text-red-600 mt-1">{onboarding.rejectionReason}</p>
              </div>
            </div>
          </Card>
        ) : null}

        <Card>
          {formStep === "OWNER_DETAILS" && <OwnerDetailsForm onSaved={refresh} />}
          {formStep === "KITCHEN_DETAILS" && <KitchenDetailsForm onSaved={refresh} />}
          {formStep === "LOCATION" && <LocationForm onSaved={refresh} />}
          {formStep === "DOCUMENTS" && <DocumentsForm onSaved={refresh} />}
          {formStep === "BANK_DETAILS" && <BankDetailsForm onSaved={refresh} />}
          {formStep === "REVIEW" && (
            <ReviewForm pending={onboarding.pending} canSubmit={onboarding.canSubmit} onSubmitted={refresh} />
          )}
        </Card>
      </div>
    </div>
  );
}

function nextFormFor(currentStep: string): (typeof WIZARD_STEPS)[number] | "REVIEW" {
  switch (currentStep) {
    case "PHONE_VERIFIED":
      return "OWNER_DETAILS";
    case "OWNER_DETAILS":
      return "KITCHEN_DETAILS";
    case "KITCHEN_DETAILS":
      return "LOCATION";
    case "LOCATION":
      return "DOCUMENTS";
    case "DOCUMENTS":
      return "BANK_DETAILS";
    default:
      return "REVIEW";
  }
}

function Progress({ percent }: { percent: number }) {
  return (
    <div className="w-full h-2 rounded-full bg-slate-200 mb-6 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ ...GRADIENT_BG, width: `${percent}%` }} />
    </div>
  );
}

function UnderReviewScreen() {
  const { onboarding, refresh } = useKitchenAuth();
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateApprove = async () => {
    setIsSimulating(true);
    try {
      await onboardingApi.simulateApprove();
      await refresh();
    } catch {
      // Only available outside production — a no-op there.
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F6F6] font-sans px-6">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-6">
          <Clock size={28} className="text-amber-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Application under review</h1>
        <p className="text-sm text-slate-500 mb-8">
          Our team is verifying your documents and kitchen details. This usually takes 24-48 hours — we&apos;ll notify
          you the moment you&apos;re approved.
        </p>
        {onboarding?.status !== "SUSPENDED" ? (
          <Button variant="outline" onClick={handleSimulateApprove} loading={isSimulating}>
            Simulate approval (dev only)
          </Button>
        ) : null}
      </div>
    </div>
  );
}

// ── Step forms ──────────────────────────────────────────────────────────────

function useStepForm(save: () => Promise<unknown>, onSaved: () => Promise<void>) {
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

function OwnerDetailsForm({ onSaved }: { onSaved: () => Promise<void> }) {
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

function KitchenDetailsForm({ onSaved }: { onSaved: () => Promise<void> }) {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [prepTimeMins, setPrepTimeMins] = useState("25");
  const [opensAt, setOpensAt] = useState("08:00");
  const [closesAt, setClosesAt] = useState("22:00");
  const { error, isSaving, submit } = useStepForm(
    () =>
      onboardingApi.kitchenDetails({
        name: name.trim(),
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
      <Button onClick={submit} disabled={name.trim().length < 3} loading={isSaving}>
        Continue
      </Button>
    </div>
  );
}

function LocationForm({ onSaved }: { onSaved: () => Promise<void> }) {
  const [addressLine, setAddressLine] = useState("");
  const [locality, setLocality] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState("26.9124");
  const [longitude, setLongitude] = useState("75.7873");
  const { error, isSaving, submit } = useStepForm(
    () =>
      onboardingApi.location({
        addressLine: addressLine.trim(),
        locality: locality.trim(),
        pincode: pincode.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
      }),
    onSaved,
  );

  const isValid = addressLine.trim().length >= 5 && locality.trim().length > 0 && /^\d{6}$/.test(pincode);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-extrabold text-slate-900">Where should customers find you?</h2>
      <Field label="Address line">
        <TextInput value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder="Shop 4, Malviya Nagar Market" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Locality">
          <TextInput value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="Malviya Nagar" />
        </Field>
        <Field label="Pincode">
          <TextInput value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="302017" inputMode="numeric" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Latitude">
          <TextInput value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        </Field>
        <Field label="Longitude">
          <TextInput value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        </Field>
      </div>
      <p className="text-xs text-slate-400">Defaulted to central Jaipur — adjust to your kitchen&apos;s actual coordinates.</p>
      {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
      <Button onClick={submit} disabled={!isValid} loading={isSaving}>
        Continue
      </Button>
    </div>
  );
}

const DOCUMENT_TYPES: { type: string; label: string; required?: boolean }[] = [
  { type: "FSSAI", label: "FSSAI Licence", required: true },
  { type: "GST", label: "GST Certificate" },
  { type: "SHOP_LICENSE", label: "Shop & Establishment Licence" },
  { type: "KITCHEN_PHOTOS", label: "Kitchen Photos" },
];

function DocumentsForm({ onSaved }: { onSaved: () => Promise<void> }) {
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [savedTypes, setSavedTypes] = useState<Set<string>>(new Set());
  const [numbers, setNumbers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (type: string, file: File) => {
    setError(null);
    setUploadingType(type);
    try {
      const { kitchenUploadApi } = await import("../../../lib/kitchenApi");
      const { url } = await kitchenUploadApi.upload(file, "DOCUMENT");
      await onboardingApi.uploadDocument({ type, number: numbers[type]?.trim() || undefined, fileUrl: url });
      setSavedTypes((prev) => new Set(prev).add(type));
      await onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not upload, please try again");
    } finally {
      setUploadingType(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-extrabold text-slate-900">Documents</h2>
      <p className="text-sm text-slate-500 -mt-3">Only the FSSAI licence is required to submit — the rest speed up approval.</p>
      {DOCUMENT_TYPES.map(({ type, label, required }) => (
        <div key={type} className="flex items-center gap-3 border border-slate-100 rounded-xl p-4">
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800">
              {label} {required ? <span className="text-red-500">*</span> : null}
            </p>
            <TextInput
              className="mt-2"
              placeholder="Licence / registration number (optional)"
              value={numbers[type] ?? ""}
              onChange={(e) => setNumbers((prev) => ({ ...prev, [type]: e.target.value }))}
            />
          </div>
          <label className="shrink-0">
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(type, e.target.files[0])}
            />
            <span
              className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-xs font-bold cursor-pointer transition-colors ${
                savedTypes.has(type) ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {uploadingType === type ? "Uploading…" : savedTypes.has(type) ? "Uploaded ✓" : "Upload"}
            </span>
          </label>
        </div>
      ))}
      {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
      <Button onClick={onSaved} disabled={!savedTypes.has("FSSAI")}>
        Continue
      </Button>
    </div>
  );
}

function BankDetailsForm({ onSaved }: { onSaved: () => Promise<void> }) {
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bankName, setBankName] = useState("");
  const { error, isSaving, submit } = useStepForm(
    () =>
      onboardingApi.bankDetails({
        accountHolderName: accountHolderName.trim(),
        accountNumber: accountNumber.trim(),
        ifsc: ifsc.trim().toUpperCase(),
        bankName: bankName.trim() || undefined,
      }),
    onSaved,
  );

  const isValid = accountHolderName.trim().length >= 2 && /^\d{9,18}$/.test(accountNumber) && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase());

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-extrabold text-slate-900">Where should payouts go?</h2>
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

function ReviewForm({
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
            <Link href="/partner/menu/new" className="inline-block mt-2 text-xs font-bold text-[#BA2121]">
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
