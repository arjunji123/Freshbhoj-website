"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Copy, ShieldAlert, X } from "lucide-react";
import { ApiError, kitchenAuthApi, kitchenProfileApi, kitchenUploadApi } from "../../../lib/kitchenApi";
import type { KitchenProfile } from "../../../lib/types";
import { Badge, Button, Card, EmptyState, Field, PageHeader, Spinner, TextArea, TextInput } from "../components/ui";

type DeleteStep = "closed" | "phone" | "otp";

const MAX_SPECIALITIES = 10;

/** The saved +91XXXXXXXXXX number as the 10 digits the input shows. */
const localPhone = (p: string | null) => (p ?? "").replace(/^\+91/, "");

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
  const [specialities, setSpecialities] = useState<string[]>([]);
  const [specialityInput, setSpecialityInput] = useState("");
  const [capacity, setCapacity] = useState("");
  const [copied, setCopied] = useState(false);

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
        setContactPhone(localPhone(p.contactPhone));
        setPrepTimeMins(String(p.prepTimeMins));
        setOpensAt(p.opensAt);
        setClosesAt(p.closesAt);
        setSpecialities(p.specialities ?? []);
        setCapacity(p.capacity ? String(p.capacity) : "");
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
    if (!profile) return;
    setSaved(false);
    // Mirrors UpdateKitchenProfileDto so the partner sees a readable reason instead of a 400.
    if (name.trim().length < 3) return setError("The kitchen name needs to be at least 3 characters.");
    if (contactPhone && !/^[6-9]\d{9}$/.test(contactPhone)) return setError("Enter a valid 10-digit Indian mobile number for the contact number.");
    const prep = Number(prepTimeMins);
    if (!Number.isInteger(prep) || prep < 5 || prep > 180) return setError("Prep time must be a whole number of minutes between 5 and 180.");
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(opensAt) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(closesAt)) {
      return setError("Set both the opening and closing time.");
    }
    const capacityValue = capacity.trim() ? Number(capacity) : null;
    if (capacityValue !== null && (!Number.isInteger(capacityValue) || capacityValue < 1)) {
      return setError("Capacity must be a whole number of orders, 1 or more.");
    }

    // Send only what changed, so an untouched field is never overwritten (and a cleared text field really clears).
    const patch: Partial<KitchenProfile> = {};
    if (name.trim() !== profile.name) patch.name = name.trim();
    if (tagline.trim() !== (profile.tagline ?? "")) patch.tagline = tagline.trim();
    if (description.trim() !== (profile.description ?? "")) patch.description = description.trim();
    if (logoUrl !== (profile.logoUrl ?? "") && logoUrl) patch.logoUrl = logoUrl;
    if (contactPhone !== localPhone(profile.contactPhone) && contactPhone) patch.contactPhone = `+91${contactPhone}`;
    if (prep !== profile.prepTimeMins) patch.prepTimeMins = prep;
    if (opensAt !== profile.opensAt) patch.opensAt = opensAt;
    if (closesAt !== profile.closesAt) patch.closesAt = closesAt;
    if (specialities.join("\u0000") !== (profile.specialities ?? []).join("\u0000")) patch.specialities = specialities;
    if (capacityValue !== null && capacityValue !== profile.capacity) patch.capacity = capacityValue;
    if (Object.keys(patch).length === 0) return setError("Nothing to save yet — change a field first.");

    setError(null);
    setIsSaving(true);
    try {
      const updated = await kitchenProfileApi.update(patch);
      setProfile(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save, please try again");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSpeciality = () => {
    const value = specialityInput.trim();
    if (!value || specialities.includes(value) || specialities.length >= MAX_SPECIALITIES) {
      setSpecialityInput("");
      return;
    }
    setSpecialities((prev) => [...prev, value]);
    setSpecialityInput("");
  };

  const handleCopyLink = async () => {
    if (!profile) return;
    const url = `${window.location.origin}/kitchen/${profile.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be blocked (permissions, insecure context) — silently no-op rather than error the whole page.
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
        <Spinner className="w-8 h-8 text-[#087F78]" />
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
        action={
          <div className="flex items-center gap-2">
            <Badge tone={profile.isVerified ? "success" : "warning"}>{profile.isVerified ? "Verified" : "Pending verification"}</Badge>
            <Button variant="outline" className="!py-2 !px-3.5 !text-xs whitespace-nowrap" onClick={handleCopyLink}>
              <Copy size={13} /> {copied ? "Copied!" : "Copy Public Link"}
            </Button>
          </div>
        }
      />

      <Link href="/partner/timings" className="block max-w-2xl mb-4">
        <Card className="!p-4 hover:border-[#087F78]/20 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#087F78]/10 text-[#087F78] flex items-center justify-center shrink-0">
              <Clock size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800">Operating Hours</p>
              <p className="text-xs text-slate-500">Weekly timings, holidays, and emergency close</p>
            </div>
            <ArrowRight size={16} className="text-slate-400 shrink-0" />
          </div>
        </Card>
      </Link>

      {!profile.fssaiLicense ? (
        <Link href="/partner/fssai-assistance" className="block max-w-2xl mb-6">
          <Card className="!p-4 !bg-amber-50 border-amber-100 hover:border-amber-200 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <ShieldAlert size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-amber-800">No FSSAI licence on file</p>
                <p className="text-xs text-amber-600">
                  Let FreshBhoj handle your government registration, or upload one you already have.
                </p>
              </div>
              <ArrowRight size={16} className="text-amber-500 shrink-0" />
            </div>
          </Card>
        </Link>
      ) : null}

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
            <TextInput value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
          </Field>
          <Field label="Tagline">
            <TextInput value={tagline} onChange={(e) => setTagline(e.target.value)} maxLength={120} placeholder="e.g. Home-style North Indian meals" />
          </Field>
          <Field label="Description">
            <TextArea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} placeholder="Tell customers what makes your kitchen special" />
          </Field>
          <Field label="Contact number">
            <div className="flex items-center gap-2">
              <span className="shrink-0 rounded-xl bg-slate-100 px-3.5 py-3 text-sm font-bold text-slate-500">+91</span>
              <TextInput
                inputMode="numeric"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="98765 43210"
              />
            </div>
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Prep time (mins)">
              <TextInput inputMode="numeric" value={prepTimeMins} onChange={(e) => setPrepTimeMins(e.target.value.replace(/\D/g, "").slice(0, 3))} />
            </Field>
            <Field label="Opens at">
              <TextInput type="time" value={opensAt} onChange={(e) => setOpensAt(e.target.value)} />
            </Field>
            <Field label="Closes at">
              <TextInput type="time" value={closesAt} onChange={(e) => setClosesAt(e.target.value)} />
            </Field>
          </div>

          <Field label="Specialities">
            <div className="flex flex-wrap gap-2 mb-2">
              {specialities.map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-[#087F78]/10 text-[#087F78] px-3 py-1.5 text-xs font-bold">
                  {s}
                  <button onClick={() => setSpecialities((prev) => prev.filter((x) => x !== s))} aria-label={`Remove ${s}`}>
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <TextInput
                value={specialityInput}
                onChange={(e) => setSpecialityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSpeciality();
                  }
                }}
                placeholder="e.g. North Indian, Chinese"
                disabled={specialities.length >= MAX_SPECIALITIES}
                maxLength={40}
              />
              <Button variant="outline" className="!py-3 !px-4 shrink-0" onClick={handleAddSpeciality} disabled={specialities.length >= MAX_SPECIALITIES}>
                Add
              </Button>
            </div>
          </Field>

          <Field label="Capacity (max orders per meal slot)">
            <TextInput
              inputMode="numeric"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value.replace(/\D/g, ""))}
              placeholder="e.g. 40"
              className="max-w-[160px]"
            />
          </Field>

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
