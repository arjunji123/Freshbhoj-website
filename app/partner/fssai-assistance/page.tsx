"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Camera,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Home as HomeIcon,
  IdCard,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import { ApiError, fssaiAssistanceApi, kitchenUploadApi, onboardingApi } from "../../../lib/kitchenApi";
import { useKitchenAuth } from "../../../lib/KitchenAuthProvider";
import type {
  FssaiAssistanceDocument,
  FssaiAssistanceDocumentType,
  FssaiAssistanceRequest,
  FssaiAssistanceStatus,
  FssaiAssistanceStatusResponse,
} from "../../../lib/types";
import { BackLink, Badge, Button, Card, EmptyState, Field, OptionCard, PageHeader, Spinner, TextInput } from "../components/ui";

const POLL_MS = 30_000;

const KYC_DOCS: {
  type: FssaiAssistanceDocumentType;
  label: string;
  hint: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { type: "IDENTITY_PROOF", label: "Identity Proof", hint: "Aadhaar, PAN or Voter ID", icon: IdCard },
  { type: "ADDRESS_PROOF", label: "Address Proof", hint: "Utility bill or rent agreement", icon: HomeIcon },
  { type: "KITCHEN_PHOTO", label: "Kitchen Photo", hint: "A clear photo of your kitchen", icon: Camera },
  { type: "PASSPORT_PHOTO", label: "Passport Photo", hint: "A recent passport-size photo", icon: User },
];

type LocalStep = "choice" | "education" | "pricing" | "already-have";

export default function FssaiAssistancePage() {
  const { onboarding } = useKitchenAuth();
  const [data, setData] = useState<FssaiAssistanceStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localStep, setLocalStep] = useState<LocalStep>("choice");

  const homeHref = onboarding?.status === "ACTIVE" ? "/partner/dashboard" : "/partner/onboarding";

  const load = async (showSpinner = false) => {
    if (showSpinner) setIsLoading(true);
    try {
      const res = await fssaiAssistanceApi.status();
      setData(res);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load your FSSAI application, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(true);
  }, []);

  const request = data?.request ?? null;
  const documents = data?.documents ?? [];
  const needsChoice = !request || request.status === "REJECTED" || request.status === "CANCELLED";

  // A fresh rejected/cancelled cycle should always re-open on the choice screen,
  // not whatever local step a previous (now-superseded) cycle left behind.
  useEffect(() => {
    if (needsChoice) setLocalStep("choice");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request?.id, request?.status]);

  const isTracking =
    request &&
    (request.status === "DOCUMENTS_SUBMITTED" ||
      request.status === "APPLICATION_FILED" ||
      request.status === "GOVT_REVIEW_IN_PROGRESS");

  useEffect(() => {
    if (!isTracking) return;
    const interval = setInterval(() => load(false), POLL_MS);
    return () => clearInterval(interval);
  }, [isTracking]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="w-8 h-8 text-[#BA2121]" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <Card>
        <EmptyState title="Something went wrong" description={error} action={<Button onClick={() => load(true)}>Retry</Button>} />
      </Card>
    );
  }

  if (needsChoice) {
    if (localStep === "education") {
      return <EducationScreen onBack={() => setLocalStep("choice")} onNext={() => setLocalStep("pricing")} />;
    }
    if (localStep === "pricing") {
      return (
        <PricingScreen
          onBack={() => setLocalStep("education")}
          onStart={async () => {
            const res = await fssaiAssistanceApi.start();
            setData(res);
          }}
        />
      );
    }
    if (localStep === "already-have") {
      return <AlreadyHaveScreen onBack={() => setLocalStep("choice")} onDone={() => load(true)} homeHref={homeHref} />;
    }
    return (
      <ChoiceScreen
        rejectionReason={request?.status === "REJECTED" ? request.rejectionReason : null}
        onPickConcierge={() => setLocalStep("education")}
        onPickHaveIt={() => setLocalStep("already-have")}
      />
    );
  }

  if (!request) return null;

  if (request.status === "PENDING_PAYMENT") {
    const allDocsUploaded = KYC_DOCS.every((d) => documents.some((doc) => doc.type === d.type));
    if (!allDocsUploaded) {
      return (
        <DocumentsScreen documents={documents} onUploaded={() => load(false)} onCancelled={() => load(true)} />
      );
    }
    return <PayScreen request={request} onPaid={() => load(false)} onCancelled={() => load(true)} />;
  }

  if (isTracking) {
    return <StatusTrackerScreen request={request} onRefresh={() => load(false)} />;
  }

  if (request.status === "APPROVED") {
    return <SuccessScreen request={request} homeHref={homeHref} />;
  }

  return null;
}

// ── Shared bits ──────────────────────────────────────────────────────────────

function PriceRow({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <p className={`text-sm ${bold ? "font-extrabold text-slate-900" : "font-semibold text-slate-500"}`}>{label}</p>
      <p className={`text-sm ${bold ? "font-extrabold text-slate-900" : "font-bold text-slate-700"}`}>
        ₹{value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

function CancelApplicationLink({ onCancelled }: { onCancelled: () => void }) {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this FSSAI application? You can start a new one anytime.")) return;
    setIsCancelling(true);
    try {
      await fssaiAssistanceApi.cancel();
      onCancelled();
    } catch {
      setIsCancelling(false);
    }
  };

  return (
    <div className="text-center mt-4">
      <button
        onClick={handleCancel}
        disabled={isCancelling}
        className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
      >
        {isCancelling ? "Cancelling…" : "Cancel this application"}
      </button>
    </div>
  );
}

// ── Choice ───────────────────────────────────────────────────────────────────

function ChoiceScreen({
  rejectionReason,
  onPickConcierge,
  onPickHaveIt,
}: {
  rejectionReason: string | null;
  onPickConcierge: () => void;
  onPickHaveIt: () => void;
}) {
  return (
    <div className="max-w-xl mx-auto">
      <PageHeader title="FSSAI Licence" subtitle="A food-safety licence is required before you can sell food on FreshBhoj" />

      {rejectionReason ? (
        <Card className="mb-6 !bg-red-50 border-red-100">
          <div className="flex items-start gap-3">
            <XCircle className="text-red-500 mt-0.5 shrink-0" size={18} />
            <div>
              <p className="text-sm font-bold text-red-700">Your last application needs changes</p>
              <p className="text-sm text-red-600 mt-1">{rejectionReason}</p>
            </div>
          </div>
        </Card>
      ) : null}

      <Card>
        <h2 className="text-lg font-extrabold text-slate-900 mb-1">Do you have an FSSAI licence?</h2>
        <p className="text-sm text-slate-500 mb-6">Choose the option that fits you.</p>
        <div className="grid grid-cols-2 gap-4">
          <OptionCard icon={<ShieldCheck />} label="Get FSSAI via FreshBhoj" onClick={onPickConcierge} />
          <OptionCard icon={<FileText />} label="I already have FSSAI" onClick={onPickHaveIt} />
        </div>
      </Card>
    </div>
  );
}

// ── Education ────────────────────────────────────────────────────────────────

function EducationScreen({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <div className="max-w-xl mx-auto">
      <BackLink onClick={onBack} />
      <Card>
        <div className="w-12 h-12 rounded-2xl bg-[#BA2121]/10 text-[#BA2121] flex items-center justify-center mb-4">
          <ShieldCheck size={22} />
        </div>
        <h2 className="text-lg font-extrabold text-slate-900 mb-2">What is FSSAI, and why does it matter?</h2>
        <p className="text-sm text-slate-500 mb-4">
          The Food Safety and Standards Authority of India (FSSAI) licence is a legal requirement for anyone selling
          food in India. It confirms your kitchen meets basic food-safety standards, and every FreshBhoj kitchen
          partner needs one to go live.
        </p>
        <ul className="flex flex-col gap-3 mb-6">
          <EduPoint title="It's the law" description="Selling food without a valid FSSAI licence is a legal offence." />
          <EduPoint
            title="Builds customer trust"
            description="Your FSSAI number is shown to customers as a mark of a verified, safe kitchen."
          />
          <EduPoint
            title="We handle the paperwork"
            description="FreshBhoj files the government application for you — you just share your documents."
          />
        </ul>
        <Button onClick={onNext} className="w-full justify-center">
          Continue
        </Button>
      </Card>
    </div>
  );
}

function EduPoint({ title, description }: { title: string; description: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </li>
  );
}

// ── Pricing ──────────────────────────────────────────────────────────────────

function PricingScreen({ onBack, onStart }: { onBack: () => void; onStart: () => Promise<void> }) {
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setError(null);
    setIsStarting(true);
    try {
      await onStart();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not start your application, please try again");
      setIsStarting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <BackLink onClick={onBack} />
      <Card>
        <h2 className="text-lg font-extrabold text-slate-900 mb-1">Pricing</h2>
        <p className="text-sm text-slate-500 mb-6">A one-time fee that covers your full government registration.</p>
        <div className="flex flex-col gap-3 mb-6">
          <PriceRow label="Government FSSAI fee" value={1000} />
          <PriceRow label="FreshBhoj service fee" value={500} />
          <div className="h-px bg-slate-100" />
          <PriceRow label="Total" value={1500} bold />
        </div>
        {error ? <p className="text-xs font-semibold text-red-600 mb-4">{error}</p> : null}
        <Button onClick={handleStart} loading={isStarting} className="w-full justify-center">
          Start my application
        </Button>
      </Card>
    </div>
  );
}

// ── Already have FSSAI ────────────────────────────────────────────────────────

function AlreadyHaveScreen({ onBack, onDone, homeHref }: { onBack: () => void; onDone: () => void; homeHref: string }) {
  const [number, setNumber] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);
    try {
      const { url } = await kitchenUploadApi.upload(file, "DOCUMENT");
      await onboardingApi.uploadDocument({ type: "FSSAI", number: number.trim() || undefined, fileUrl: url });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not upload, please try again");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <BackLink onClick={onBack} />
      <Card>
        {done ? (
          <div className="text-center py-4">
            <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
            <h2 className="text-lg font-extrabold text-slate-900 mb-1">Uploaded</h2>
            <p className="text-sm text-slate-500 mb-6">We&apos;ll verify your licence shortly.</p>
            <Link href={homeHref}>
              <Button className="w-full justify-center" onClick={onDone}>
                Continue
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-extrabold text-slate-900 mb-1">Upload your FSSAI licence</h2>
            <p className="text-sm text-slate-500 mb-6">A clear photo or PDF of your existing licence.</p>
            <div className="flex flex-col gap-4">
              <Field label="Licence / registration number (optional)">
                <TextInput value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g. 12345678901234" />
              </Field>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                />
                <span className="inline-flex items-center justify-center w-full rounded-xl px-4 py-3 text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors">
                  {isUploading ? "Uploading…" : "Choose file"}
                </span>
              </label>
              {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

// ── Documents (4 KYC docs) ─────────────────────────────────────────────────

function DocumentsScreen({
  documents,
  onUploaded,
  onCancelled,
}: {
  documents: FssaiAssistanceDocument[];
  onUploaded: () => void;
  onCancelled: () => void;
}) {
  const [uploadingType, setUploadingType] = useState<FssaiAssistanceDocumentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (type: FssaiAssistanceDocumentType, file: File) => {
    setError(null);
    setUploadingType(type);
    try {
      const { url } = await kitchenUploadApi.upload(file, "FSSAI_ASSISTANCE_DOCUMENT");
      await fssaiAssistanceApi.uploadDocument({ type, fileUrl: url });
      onUploaded();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not upload, please try again");
    } finally {
      setUploadingType(null);
    }
  };

  const uploadedCount = KYC_DOCS.filter((d) => documents.some((doc) => doc.type === d.type)).length;

  return (
    <div className="max-w-xl mx-auto">
      <PageHeader title="Upload your documents" subtitle={`${uploadedCount} of ${KYC_DOCS.length} uploaded`} />
      <Card>
        <div className="flex flex-col gap-4">
          {KYC_DOCS.map(({ type, label, hint, icon: Icon }) => {
            const uploaded = documents.find((d) => d.type === type);
            return (
              <div key={type} className="flex items-center gap-3 border border-slate-100 rounded-xl p-4">
                <div className="w-10 h-10 rounded-xl bg-[#BA2121]/10 text-[#BA2121] flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-800">{label}</p>
                    {uploaded ? (
                      <Badge tone={uploaded.status === "VERIFIED" ? "success" : uploaded.status === "REJECTED" ? "danger" : "warning"}>
                        {uploaded.status}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-xs text-slate-400">{hint}</p>
                  {uploaded?.status === "REJECTED" && uploaded.remarks ? (
                    <p className="text-xs font-semibold text-red-600 mt-1">{uploaded.remarks}</p>
                  ) : null}
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
                      uploaded ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {uploadingType === type ? "Uploading…" : uploaded ? "Re-upload" : "Upload"}
                  </span>
                </label>
              </div>
            );
          })}
        </div>
        {error ? <p className="text-xs font-semibold text-red-600 mt-4">{error}</p> : null}
        <CancelApplicationLink onCancelled={onCancelled} />
      </Card>
    </div>
  );
}

// ── Pay (placeholder) ────────────────────────────────────────────────────────

function PayScreen({
  request,
  onPaid,
  onCancelled,
}: {
  request: FssaiAssistanceRequest;
  onPaid: () => void;
  onCancelled: () => void;
}) {
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    setError(null);
    setIsPaying(true);
    try {
      await fssaiAssistanceApi.confirmPayment();
      onPaid();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not confirm payment, please try again");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <PageHeader title="Confirm & pay" subtitle="Review your fees before we file your application" />
      <Card>
        <div className="flex flex-col gap-3 mb-6">
          <PriceRow label="Government FSSAI fee" value={request.govtFee} />
          <PriceRow label="FreshBhoj service fee" value={request.serviceFee} />
          <div className="h-px bg-slate-100" />
          <PriceRow label="Total" value={request.totalFee} bold />
        </div>
        <Button onClick={handlePay} loading={isPaying} className="w-full justify-center mb-3">
          Pay ₹{request.totalFee.toLocaleString("en-IN")}
        </Button>
        <p className="text-[11px] text-center text-slate-400">
          Payment is collected outside the app for now — this button just confirms you&apos;ve arranged it with our
          team. No card or bank details are collected here.
        </p>
        {error ? <p className="text-xs font-semibold text-red-600 text-center mt-3">{error}</p> : null}
        <CancelApplicationLink onCancelled={onCancelled} />
      </Card>
    </div>
  );
}

// ── Status tracker ───────────────────────────────────────────────────────────

const STAGE_ORDER: FssaiAssistanceStatus[] = [
  "DOCUMENTS_SUBMITTED",
  "APPLICATION_FILED",
  "GOVT_REVIEW_IN_PROGRESS",
  "APPROVED",
];

const STAGE_LABEL: Partial<Record<FssaiAssistanceStatus, string>> = {
  DOCUMENTS_SUBMITTED: "Documents Submitted",
  APPLICATION_FILED: "Application Filed",
  GOVT_REVIEW_IN_PROGRESS: "Govt Review In Progress",
  APPROVED: "Approved",
};

function StatusTrackerScreen({ request, onRefresh }: { request: FssaiAssistanceRequest; onRefresh: () => void }) {
  const [isSimulating, setIsSimulating] = useState(false);
  const currentIndex = STAGE_ORDER.indexOf(request.status);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await fssaiAssistanceApi.simulateAdvance();
      onRefresh();
    } catch {
      // Dev-only endpoint — a no-op in production.
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto text-center py-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-6">
        <Clock size={28} className="text-amber-500" />
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Your application is in progress</h1>
      <p className="text-sm text-slate-500 mb-10">
        We&apos;re filing your FSSAI registration with the government. This can take a few days — we&apos;ll notify
        you the moment it&apos;s approved.
      </p>

      <div className="text-left flex flex-col mb-10">
        {STAGE_ORDER.map((stage, i) => {
          const state: "done" | "current" | "upcoming" = i < currentIndex ? "done" : i === currentIndex ? "current" : "upcoming";
          return (
            <div key={stage} className="flex gap-4">
              <div className="flex flex-col items-center">
                <StageIcon state={state} />
                {i < STAGE_ORDER.length - 1 ? (
                  <div className={`w-0.5 flex-1 min-h-[28px] ${state === "done" ? "bg-emerald-200" : "bg-slate-200"}`} />
                ) : null}
              </div>
              <div className={i < STAGE_ORDER.length - 1 ? "pb-6" : ""}>
                <p className={`text-sm font-bold ${state === "upcoming" ? "text-slate-400" : "text-slate-900"}`}>
                  {STAGE_LABEL[stage]}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Button variant="outline" onClick={handleSimulate} loading={isSimulating}>
        Simulate advance (dev only)
      </Button>
    </div>
  );
}

function StageIcon({ state }: { state: "done" | "current" | "upcoming" }) {
  if (state === "done") return <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />;
  if (state === "current") return <Clock size={20} className="text-amber-500 shrink-0" />;
  return <span className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0" />;
}

// ── Success ──────────────────────────────────────────────────────────────────

function SuccessScreen({ request, homeHref }: { request: FssaiAssistanceRequest; homeHref: string }) {
  return (
    <div className="max-w-md mx-auto text-center py-6">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
        <BadgeCheck size={28} className="text-emerald-500" />
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-2">You&apos;re FSSAI approved!</h1>
      <p className="text-sm text-slate-500 mb-8">
        Your food-safety licence is live. You&apos;re all set to start selling on FreshBhoj.
      </p>

      <Card className="text-left mb-8">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Licence number</p>
            <p className="text-sm font-extrabold text-slate-900">{request.licenseNumber ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Valid</p>
            <p className="text-sm font-bold text-slate-700">
              {request.validFrom ? new Date(request.validFrom).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
              {" – "}
              {request.validTill ? new Date(request.validTill).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
            </p>
          </div>
          {request.certificateUrl ? (
            <a
              href={request.certificateUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#BA2121]"
            >
              <Download size={14} /> Download certificate
            </a>
          ) : null}
        </div>
      </Card>

      <Link href={homeHref}>
        <Button className="w-full justify-center">Complete Kitchen Setup</Button>
      </Link>
    </div>
  );
}
