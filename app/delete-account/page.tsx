"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar, Footer } from "../Components";

const gradientStyle = {
  background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

type Step = "phone" | "otp" | "done";

const RETAINED_ITEMS = [
  "Past orders and reviews stay on file, no longer linked to your name — kitchens and our accounting need these records for legal and dispute-resolution purposes.",
  "This history is kept indefinitely in anonymized form, the same way it would be for any completed transaction.",
];

const DELETED_ITEMS = [
  "Your name, email, and profile photo",
  "Your phone number (freed up — you could sign up again later with it)",
  "Saved addresses and saved payment methods",
  "Favorites, kitchen follows, story/reel likes and saves",
  "Notification preferences",
  "All active login sessions, on every device",
];

export default function DeleteAccountPage() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedPhone = () => {
    const digits = phone.replace(/\D/g, "").slice(-10);
    return `+91${digits}`;
  };

  const isPhoneValid = phone.replace(/\D/g, "").length === 10;
  const isOtpValid = otp.trim().length >= 4;

  const handleSendOtp = async () => {
    if (!isPhoneValid || isLoading) return;
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/auth/account-deletion/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone() }),
      });
      const body: ApiEnvelope<{ expiresInMinutes: number }> = await res.json();
      if (!res.ok || !body.success) throw new Error(body.message || "Something went wrong");
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!isOtpValid || isLoading) return;
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/auth/account-deletion/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone(), otp: otp.trim() }),
      });
      const body: ApiEnvelope<null> = await res.json();
      if (!res.ok || !body.success) throw new Error(body.message || "Something went wrong");
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify that code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <div className="w-full pt-28 md:pt-28 pb-8 md:pb-16 border-b border-slate-100">
        <div className="w-full max-w-3xl mx-auto px-6">
          <div className="flex items-center gap-2 bg-[#FFF5F5] rounded-full px-4 py-1.5 w-fit mb-4">
            <div className="relative w-3.5 h-3.5">
              <Image src="/legal.svg" alt="legal" fill className="object-contain" />
            </div>
            <span className="text-[#BA2121] text-[10px] font-bold uppercase tracking-[0.2em]">Account</span>
          </div>
          <h1 className="font-extrabold text-4xl md:text-6xl leading-tight tracking-tight mb-4">
            Delete your <span style={gradientStyle}>FreshBhoj</span> account
          </h1>
          <p className="text-slate-500 text-lg max-w-xl">
            You can permanently delete your FreshBhoj account and personal data right here — no app install, no login required, just your phone number.
          </p>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto px-6 py-12 md:py-16 flex-1">
        <div className="grid md:grid-cols-2 gap-10 mb-14">
          <div>
            <h2 className="font-extrabold text-lg mb-3 text-slate-900">What gets deleted</h2>
            <ul className="space-y-2.5">
              {DELETED_ITEMS.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-slate-600">
                  <span className="text-[#BA2121] font-bold mt-0.5">&#10005;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-extrabold text-lg mb-3 text-slate-900">What we keep, and why</h2>
            <ul className="space-y-2.5">
              {RETAINED_ITEMS.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-slate-600">
                  <span className="text-emerald-600 font-bold mt-0.5">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-[#FFF9F9] border border-[#FFE0E0] rounded-3xl p-6 md:p-10 max-w-xl mx-auto">
          {step === "phone" ? (
            <>
              <h3 className="font-extrabold text-xl mb-1.5 text-slate-900">Step 1 — Verify it&apos;s you</h3>
              <p className="text-sm text-slate-500 mb-6">
                Enter the phone number your FreshBhoj account uses. We&apos;ll send a one-time code to confirm.
              </p>
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3.5 mb-4">
                <span className="text-slate-500 font-bold text-sm">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="flex-1 outline-none text-sm font-medium"
                />
              </div>
              {error ? <p className="text-xs font-semibold text-red-600 mb-4">{error}</p> : null}
              <button
                onClick={handleSendOtp}
                disabled={!isPhoneValid || isLoading}
                className="w-full rounded-xl py-3.5 text-white font-bold text-sm disabled:opacity-50 transition-transform active:scale-[0.98]"
                style={{ background: gradientStyle.background }}
              >
                {isLoading ? "Sending…" : "Send verification code"}
              </button>
            </>
          ) : step === "otp" ? (
            <>
              <h3 className="font-extrabold text-xl mb-1.5 text-slate-900">Step 2 — Enter the code</h3>
              <p className="text-sm text-slate-500 mb-6">
                We sent a code to +91 {phone}. Enter it below to permanently delete your account. This can&apos;t be undone.
              </p>
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder="Verification code"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 mb-4 outline-none text-sm font-medium tracking-widest"
              />
              {error ? <p className="text-xs font-semibold text-red-600 mb-4">{error}</p> : null}
              <button
                onClick={handleConfirm}
                disabled={!isOtpValid || isLoading}
                className="w-full rounded-xl py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm disabled:opacity-50 transition-transform active:scale-[0.98] mb-3"
              >
                {isLoading ? "Deleting…" : "Permanently delete my account"}
              </button>
              <button
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setError(null);
                }}
                className="w-full text-center text-xs font-bold text-slate-400"
              >
                Use a different number
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600 text-2xl font-bold">
                &#10003;
              </div>
              <h3 className="font-extrabold text-xl mb-1.5 text-slate-900">Your account has been deleted</h3>
              <p className="text-sm text-slate-500">
                Your personal data has been removed from FreshBhoj. If you ever want to come back, you can sign up again with the same number.
              </p>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 text-center mt-8 max-w-xl mx-auto">
          Questions about your data? Contact us at{" "}
          <a href="mailto:privacy@freshbhoj.com" className="font-bold text-slate-500">
            privacy@freshbhoj.com
          </a>
          . See our{" "}
          <a href="/privacy-policy" className="font-bold text-slate-500">
            Privacy Policy
          </a>{" "}
          for more on how FreshBhoj handles your data.
        </p>
      </div>

      <Footer />
    </div>
  );
}
