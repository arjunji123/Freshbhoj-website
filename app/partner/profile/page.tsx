"use client";

import { useEffect, useState } from "react";
import { ApiError, kitchenAuthApi, kitchenProfileApi, kitchenUploadApi } from "../../../lib/kitchenApi";
import type { KitchenProfile } from "../../../lib/types";
import { Badge, Button, Card, EmptyState, Field, PageHeader, Spinner, TextArea, TextInput } from "../components/ui";

type DeleteStep = "closed" | "phone" | "otp";

export default function ProfilePage() {
  const [profile, setProfile] = useState<KitchenProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [prepTimeMins, setPrepTimeMins] = useState("25");
  const [opensAt, setOpensAt] = useState("08:00");
  const [closesAt, setClosesAt] = useState("22:00");

  const [deleteStep, setDeleteStep] = useState<DeleteStep>("closed");
  const [deletePhone, setDeletePhone] = useState("");
  const [deleteOtp, setDeleteOtp] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteDone, setDeleteDone] = useState(false);

  const load = () => {
    setIsLoading(true);
    setError(null);
    kitchenProfileApi
      .get()
      .then((p) => {
        setProfile(p);
        setName(p.name);
        setTagline(p.tagline ?? "");
        setDescription(p.description ?? "");
        setLogoUrl(p.logoUrl ?? "");
        setContactPhone(p.contactPhone ?? "");
        setPrepTimeMins(String(p.prepTimeMins));
        setOpensAt(p.opensAt);
        setClosesAt(p.closesAt);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Could not load your profile, please try again");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleLogoUpload = async (file: File) => {
    setIsUploadingLogo(true);
    try {
      const { url } = await kitchenUploadApi.upload(file, "KITCHEN_LOGO");
      setLogoUrl(url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not upload logo");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    setSaved(false);
    setIsSaving(true);
    try {
      const updated = await kitchenProfileApi.update({
        name: name.trim(),
        tagline: tagline.trim() || undefined,
        description: description.trim() || undefined,
        logoUrl: logoUrl || undefined,
        contactPhone: contactPhone.trim() || undefined,
        prepTimeMins: Number(prepTimeMins) || undefined,
        opensAt,
        closesAt,
      });
      setProfile(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save, please try again");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendDeleteOtp = async () => {
    if (deletePhone.replace(/\D/g, "").length !== 10) return;
    setDeleteError(null);
    setIsDeleting(true);
    try {
      await kitchenAuthApi.requestAccountDeletion(`+91${deletePhone.replace(/\D/g, "")}`);
      setDeleteStep("otp");
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Could not send the code, please try again");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteOtp.trim().length < 4) return;
    setDeleteError(null);
    setIsDeleting(true);
    try {
      await kitchenAuthApi.confirmAccountDeletion(`+91${deletePhone.replace(/\D/g, "")}`, deleteOtp.trim());
      kitchenAuthApi.setTokens(null);
      setDeleteDone(true);
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Could not verify that code, please try again");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="w-8 h-8 text-[#BA2121]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <EmptyState
          title="Something went wrong"
          description={error ?? "Could not load your profile, please try again"}
          action={<Button onClick={load}>Retry</Button>}
        />
      </Card>
    );
  }

  return (
    <div>
      <PageHeader
        title="Kitchen Profile"
        subtitle={profile.slug}
        action={<Badge tone={profile.isVerified ? "success" : "warning"}>{profile.isVerified ? "Verified" : "Pending verification"}</Badge>}
      />

      <Card className="max-w-2xl">
        <div className="flex flex-col gap-5">
          <Field label="Logo">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-slate-400">None</span>
                )}
              </div>
              <label className="cursor-pointer">
                <span className="inline-flex items-center rounded-xl px-4 py-2 text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200">
                  {isUploadingLogo ? "Uploading…" : "Change logo"}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])} />
              </label>
            </div>
          </Field>

          <Field label="Kitchen name">
            <TextInput value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Tagline">
            <TextInput value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </Field>
          <Field label="Description">
            <TextArea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <Field label="Contact phone">
            <TextInput value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+919876543210" />
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

          {profile.fssaiLicense ? (
            <p className="text-xs text-slate-400">FSSAI: {profile.fssaiLicense} (from onboarding — update via support)</p>
          ) : null}

          {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
          {saved ? <p className="text-xs font-semibold text-emerald-600">Saved</p> : null}

          <Button onClick={handleSave} loading={isSaving} className="self-start">
            Save changes
          </Button>
        </div>
      </Card>

      <Card className="max-w-2xl mt-8 !border-red-100 !bg-red-50/40">
        <h3 className="text-sm font-extrabold text-red-700 uppercase tracking-wide mb-1">Danger zone</h3>
        <p className="text-sm text-slate-600 mb-4">
          Permanently delete your Kitchen Partner account. Verification documents and bank details are deleted outright. If your kitchen has
          ever taken orders, its storefront is paused (hidden from customers) rather than erased, since past orders, reviews and payouts need
          it to stay resolvable.
        </p>

        {deleteDone ? (
          <p className="text-sm font-semibold text-emerald-700">
            Your account has been deleted.{" "}
            <a href="/partner/login" className="underline">
              Return to login
            </a>
          </p>
        ) : deleteStep === "closed" ? (
          <Button variant="danger" onClick={() => setDeleteStep("phone")}>
            Delete my account
          </Button>
        ) : deleteStep === "phone" ? (
          <div className="flex flex-col gap-3 max-w-sm">
            <Field label="Confirm your phone number">
              <TextInput
                value={deletePhone}
                onChange={(e) => setDeletePhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit mobile number"
              />
            </Field>
            {deleteError ? <p className="text-xs font-semibold text-red-600">{deleteError}</p> : null}
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setDeleteStep("closed")}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleSendDeleteOtp} loading={isDeleting} disabled={deletePhone.replace(/\D/g, "").length !== 10}>
                Send verification code
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-w-sm">
            <Field label={`Enter the code sent to +91 ${deletePhone}`}>
              <TextInput value={deleteOtp} onChange={(e) => setDeleteOtp(e.target.value.replace(/\D/g, "").slice(0, 8))} placeholder="Verification code" />
            </Field>
            {deleteError ? <p className="text-xs font-semibold text-red-600">{deleteError}</p> : null}
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setDeleteStep("phone")}>
                Back
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete} loading={isDeleting} disabled={deleteOtp.trim().length < 4}>
                Permanently delete my account
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
