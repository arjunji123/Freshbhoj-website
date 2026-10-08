"use client";

import { Camera, CheckCircle2, FileWarning, IdCard, ShieldCheck, XCircle } from "lucide-react";
import { BackLink, Card, PageHeader } from "../../components/ui";

function ExampleTile({ good, label }: { good: boolean; label: string }) {
  return (
    <div className={`rounded-xl border-2 p-3 flex flex-col items-center text-center gap-2 ${good ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
      {good ? <CheckCircle2 size={20} className="text-emerald-600" /> : <XCircle size={20} className="text-red-500" />}
      <p className={`text-xs font-bold ${good ? "text-emerald-700" : "text-red-600"}`}>{label}</p>
    </div>
  );
}

function GuideSection({
  icon: Icon,
  title,
  description,
  good,
  bad,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  good: string[];
  bad: string[];
}) {
  return (
    <Card>
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#087F78]/10 text-[#087F78] flex items-center justify-center shrink-0">
          <Icon size={18} />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          {good.map((g) => (
            <ExampleTile key={g} good label={g} />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {bad.map((b) => (
            <ExampleTile key={b} good={false} label={b} />
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function UploadGuidePage() {
  return (
    <div>
      <BackLink href="/partner/menu" label="Back to Menu" />
      <PageHeader title="Photo & document upload guide" subtitle="Good photos get approved faster and sell better — here's how to get them right" />

      <div className="flex flex-col gap-6 max-w-3xl">
        <GuideSection
          icon={Camera}
          title="Dish & kitchen photos"
          description="Bright, honest, close-up shots — this is what a customer decides to order from."
          good={["Natural daylight", "Filled frame, in focus", "Actual dish you serve"]}
          bad={["Dark or blurry", "Heavy filters/stock photos", "Cluttered background"]}
        />

        <GuideSection
          icon={IdCard}
          title="ID proof photos"
          description="Aadhaar, PAN, Voter ID — the full document, nothing cropped out."
          good={["All four corners visible", "Text sharp and readable", "Flat, no glare"]}
          bad={["Cropped or angled", "Blurry / low resolution", "Screenshot of a screenshot"]}
        />

        <GuideSection
          icon={ShieldCheck}
          title="FSSAI certificate"
          description="Upload the main certificate page — the QR code and licence number must be readable."
          good={["Original certificate, main page", "QR code / number clearly visible", "Good lighting, flat surface"]}
          bad={["Photocopy of a photocopy", "QR code cropped out", "Expired certificate"]}
        />

        <Card className="!bg-amber-50 border-amber-100">
          <div className="flex items-start gap-3">
            <FileWarning size={18} className="text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-800">A quick note on FSSAI certificates</p>
              <p className="text-sm text-amber-700 mt-1">
                We only accept the main certificate page — not a photocopy, and not a cropped screenshot. The licence
                number and QR code both need to be clearly readable, since our team verifies them directly against
                the government registry.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-extrabold text-slate-900 mb-4">Do&apos;s and Don&apos;ts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-extrabold text-emerald-700 uppercase tracking-wide mb-3">Do</p>
              <ul className="flex flex-col gap-2.5">
                {[
                  "Shoot in natural daylight, near a window",
                  "Fill the frame with the dish or document",
                  "Use a plain, uncluttered background",
                  "Double-check text is sharp before uploading",
                  "Re-upload if a document was rejected, with the remark fixed",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-extrabold text-red-600 uppercase tracking-wide mb-3">Don&apos;t</p>
              <ul className="flex flex-col gap-2.5">
                {[
                  "Use stock photos or someone else's dish photos",
                  "Upload a screenshot instead of the original file",
                  "Crop out corners, QR codes, or licence numbers",
                  "Use heavy filters that change the dish's real colour",
                  "Upload an expired or photocopied certificate",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <XCircle size={15} className="text-red-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
