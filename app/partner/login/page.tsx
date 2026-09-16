"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChefHat, ShieldCheck } from "lucide-react";
import { kitchenAuthApi } from "../../../lib/kitchenApi";
import { ApiError } from "../../../lib/kitchenApi";
import { useKitchenAuth } from "../../../lib/KitchenAuthProvider";
import { Button, Field, GRADIENT_TEXT, TextInput } from "../components/ui";

type Stage = "phone" | "otp";

function toE164(digits: string): string {
  return `+91${digits.replace(/\D/g, "").slice(-10)}`;
}

export default function PartnerLoginPage() {
  const router = useRouter();
  const { setSession } = useKitchenAuth();

  const [stage, setStage] = useState<Stage>("phone");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const canSendOtp = phoneDigits.replace(/\D/g, "").length === 10 && !isSending && cooldown === 0;
  const canVerify = otp.length >= 4 && !isVerifying;

  const handleSendOtp = async () => {
    setError(null);
    setIsSending(true);
    try {
      const result = await kitchenAuthApi.sendOtp(toE164(phoneDigits));
      setDevOtp(result.devOtp ?? null);
      setStage("otp");
      setCooldown(30);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send OTP, please try again");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    setError(null);
    setIsVerifying(true);
    try {
      const result = await kitchenAuthApi.verifyOtp(toE164(phoneDigits), otp);
      await setSession(result.tokens);
      router.replace(result.account.status === "ACTIVE" ? "/partner/dashboard" : "/partner/onboarding");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "That code didn't work, please try again");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F6F6] font-sans px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <Image
              src="/freshbhoj-red-new.svg"
              alt="FreshBhoj"
              width={160}
              height={44}
              className="h-9 w-auto object-contain mb-6"
            />
          </Link>
          <div className="w-14 h-14 rounded-2xl bg-[#BA2121]/10 flex items-center justify-center mb-4">
            <ChefHat size={26} color="#BA2121" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 text-center">
            <span style={GRADIENT_TEXT}>Partner</span> Portal
          </h1>
          <p className="text-sm text-slate-500 text-center mt-1.5">
            For kitchens running their business on FreshBhoj
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_-20px_rgba(186,33,33,0.15)] p-8">
          {stage === "phone" ? (
            <div className="flex flex-col gap-5">
              <Field label="Phone number" error={error}>
                <div className="flex gap-2">
                  <div className="flex items-center px-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-bold text-slate-700">
                    +91
                  </div>
                  <TextInput
                    value={phoneDigits}
                    onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="98765 43210"
                    inputMode="numeric"
                    autoFocus
                  />
                </div>
              </Field>
              <Button onClick={handleSendOtp} disabled={!canSendOtp} loading={isSending}>
                Send OTP
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm text-slate-600">
                  Code sent to <span className="font-bold text-slate-900">+91 {phoneDigits}</span>
                </p>
                {devOtp ? (
                  <p className="text-xs text-amber-600 font-semibold mt-1">Dev mode OTP: {devOtp}</p>
                ) : null}
              </div>
              <Field label="Enter OTP" error={error}>
                <TextInput
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  inputMode="numeric"
                  autoFocus
                />
              </Field>
              <Button onClick={handleVerify} disabled={!canVerify} loading={isVerifying}>
                Verify &amp; continue
              </Button>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={cooldown > 0 || isSending}
                className="text-xs font-bold text-slate-400 hover:text-[#BA2121] disabled:hover:text-slate-400 transition-colors"
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
          <ShieldCheck size={14} />
          <span>Not a kitchen partner yet? </span>
          <Link href="/pre-register?type=kitchen" className="font-bold text-[#BA2121]">
            Register your interest
          </Link>
        </div>
      </div>
    </div>
  );
}
