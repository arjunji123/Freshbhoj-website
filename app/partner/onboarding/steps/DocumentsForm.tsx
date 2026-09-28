"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { ApiError, onboardingApi } from "../../../../lib/kitchenApi";
import type { KitchenDocument } from "../../../../lib/types";
import { Button, TextInput } from "../../components/ui";

const DOCUMENT_TYPES: { type: string; label: string; required?: boolean; accept?: string }[] = [
  { type: "FSSAI", label: "FSSAI Licence", required: true, accept: "image/*,.pdf" },
  { type: "GST", label: "GST Certificate" },
  { type: "SHOP_LICENSE", label: "Shop & Establishment Licence" },
  { type: "KITCHEN_PHOTO_FRONT", label: "Front View Photo", required: true, accept: "image/*" },
  { type: "KITCHEN_PHOTO_MAIN", label: "Main Kitchen Photo", required: true, accept: "image/*" },
];

export function DocumentsForm({ onSaved, documents }: { onSaved: () => Promise<void>; documents: KitchenDocument[] }) {
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  // Seeded from documents already on file (e.g. from a previous session), then
  // extended locally as new uploads land in this one.
  const [savedTypes, setSavedTypes] = useState<Set<string>>(() => new Set(documents.map((d) => d.type)));
  const [numbers, setNumbers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const hasFssai = savedTypes.has("FSSAI");

  const handleUpload = async (type: string, file: File) => {
    setError(null);
    setUploadingType(type);
    try {
      const { kitchenUploadApi } = await import("../../../../lib/kitchenApi");
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
      <p className="text-sm text-slate-500 -mt-3">
        The FSSAI licence and both kitchen photos are required to submit — the rest speed up approval.
      </p>
      {DOCUMENT_TYPES.map(({ type, label, required, accept }) => (
        <div key={type} className="flex items-center gap-3 border border-slate-100 rounded-xl p-4">
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800">
              {label} {required ? <span className="text-red-500">*</span> : null}
            </p>
            {type === "FSSAI" && !hasFssai ? (
              <p className="text-xs text-slate-400 mt-1">
                Don&apos;t have one yet? FreshBhoj can get it for you — no paperwork on your end.
              </p>
            ) : (
              <TextInput
                className="mt-2"
                placeholder="Licence / registration number (optional)"
                value={numbers[type] ?? ""}
                onChange={(e) => setNumbers((prev) => ({ ...prev, [type]: e.target.value }))}
              />
            )}
          </div>
          {type === "FSSAI" && !hasFssai ? (
            <Link
              href="/partner/fssai-assistance"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold bg-[#BA2121]/10 text-[#BA2121] hover:bg-[#BA2121]/15 transition-colors"
            >
              <ShieldCheck size={13} />
              Get / Upload
              <ArrowRight size={12} />
            </Link>
          ) : (
            <label className="shrink-0">
              <input
                type="file"
                accept={accept ?? "image/*,.pdf"}
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
          )}
        </div>
      ))}
      {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
      <Button
        onClick={onSaved}
        disabled={!savedTypes.has("FSSAI") || !savedTypes.has("KITCHEN_PHOTO_FRONT") || !savedTypes.has("KITCHEN_PHOTO_MAIN")}
      >
        Continue
      </Button>
    </div>
  );
}
