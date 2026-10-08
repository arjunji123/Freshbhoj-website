"use client";

import { useState } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { onboardingApi } from "../../../../lib/kitchenApi";
import { useKitchenAuth } from "../../../../lib/KitchenAuthProvider";
import { Button } from "../../components/ui";

type StageState = "done" | "current" | "issue" | "upcoming";

export function UnderReviewScreen() {
  const { onboarding, refresh } = useKitchenAuth();
  const [isSimulating, setIsSimulating] = useState(false);
  const isSuspended = onboarding?.status === "SUSPENDED";

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

  const stages: { label: string; description: string; state: StageState }[] = [
    { label: "Application Submitted", description: "Your details and documents are with us", state: "done" },
    {
      label: "Verification In-Progress",
      description: isSuspended ? "Your application needs attention" : "Our team is checking your documents",
      state: isSuspended ? "issue" : "current",
    },
    { label: "Live on Platform", description: "Accepting orders from customers", state: "upcoming" },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F3F8F8] font-sans px-6 py-12">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-6">
          <Clock size={28} className="text-amber-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Application under review</h1>
        <p className="text-sm text-slate-500 mb-10">
          Our team is verifying your documents and kitchen details. This usually takes 24-48 hours — we&apos;ll notify
          you the moment you&apos;re approved.
        </p>

        <div className="text-left flex flex-col mb-10">
          {stages.map((stage, i) => (
            <div key={stage.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <StageIcon state={stage.state} />
                {i < stages.length - 1 ? (
                  <div className={`w-0.5 flex-1 min-h-[28px] ${stage.state === "done" ? "bg-emerald-200" : "bg-slate-200"}`} />
                ) : null}
              </div>
              <div className={i < stages.length - 1 ? "pb-6" : ""}>
                <p
                  className={`text-sm font-bold ${
                    stage.state === "upcoming" ? "text-slate-400" : stage.state === "issue" ? "text-red-600" : "text-slate-900"
                  }`}
                >
                  {stage.label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{stage.description}</p>
              </div>
            </div>
          ))}
        </div>

        {!isSuspended ? (
          <Button variant="outline" onClick={handleSimulateApprove} loading={isSimulating}>
            Simulate approval (dev only)
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function StageIcon({ state }: { state: StageState }) {
  if (state === "done") return <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />;
  if (state === "current") return <Clock size={20} className="text-amber-500 shrink-0" />;
  if (state === "issue") return <XCircle size={20} className="text-red-500 shrink-0" />;
  return <span className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0" />;
}
