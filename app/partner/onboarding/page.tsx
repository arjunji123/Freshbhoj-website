"use client";

import Image from "next/image";
import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { useKitchenAuth } from "../../../lib/KitchenAuthProvider";
import { Card, GRADIENT_BG, GRADIENT_TEXT } from "../components/ui";
import { BankDetailsForm } from "./steps/BankDetailsForm";
import { DocumentsForm } from "./steps/DocumentsForm";
import { KitchenDetailsForm } from "./steps/KitchenDetailsForm";
import { LocationForm } from "./steps/LocationForm";
import { OwnerDetailsForm } from "./steps/OwnerDetailsForm";
import { ReviewForm } from "./steps/ReviewForm";
import { UnderReviewScreen } from "./steps/UnderReviewScreen";

const WIZARD_STEPS = ["OWNER_DETAILS", "KITCHEN_DETAILS", "LOCATION", "DOCUMENTS", "BANK_DETAILS"] as const;

export default function OnboardingPage() {
  const { onboarding, refresh } = useKitchenAuth();

  if (!onboarding) return null;

  if (onboarding.status === "UNDER_REVIEW" || onboarding.status === "SUSPENDED") {
    return <UnderReviewScreen />;
  }

  const formStep = nextFormFor(onboarding.currentStep);

  return (
    <div className="min-h-screen w-full bg-[#F4F8F6] font-sans px-6 py-10">
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
                    ? "bg-[#0A8068]/10 text-[#0A8068]"
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
          {formStep === "DOCUMENTS" && <DocumentsForm onSaved={refresh} documents={onboarding.documents} />}
          {formStep === "BANK_DETAILS" && <BankDetailsForm onSaved={refresh} bankAccount={onboarding.bankAccount} />}
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
