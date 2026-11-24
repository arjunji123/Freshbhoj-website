"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Smartphone } from "lucide-react";
import { kitchenAuthApi } from "../../../lib/kitchenApi";
import { ApiError } from "../../../lib/kitchenApi";
import { useKitchenAuth } from "../../../lib/KitchenAuthProvider";
import { Spinner } from "../components/ui";

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

  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "");
    if (!d) return;
    const arr = otp.padEnd(6, " ").split("");
    arr[i] = d[0];
    setOtp(arr.join("").replace(/ /g, "").slice(0, 6));
    if (i < 5) boxes.current[i + 1]?.focus();
  };
  const onBoxKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (otp[i]) setOtp(otp.slice(0, i) + otp.slice(i + 1));
      else if (i > 0) {
        setOtp(otp.slice(0, i - 1) + otp.slice(i));
        boxes.current[i - 1]?.focus();
      }
    } else if (e.key === "Enter" && canVerify) {
      handleVerify();
    } else if (e.key === "ArrowLeft" && i > 0) boxes.current[i - 1]?.focus();
    else if (e.key === "ArrowRight" && i < 5) boxes.current[i + 1]?.focus();
  };
  const onBoxPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const d = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!d) return;
    e.preventDefault();
    setOtp(d);
    boxes.current[Math.min(d.length, 5)]?.focus();
  };

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

  const phoneReady = phoneDigits.replace(/\D/g, "").length === 10;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 font-sans bg-[#F3F8F8]">
      <Link href="/" aria-label="FreshBhoj home" className="mb-8">
        <Image src="/FreshBhoj.svg" alt="FreshBhoj" width={160} height={44} className="h-9 w-auto object-contain" priority />
      </Link>

      <main className="w-full max-w-md rounded-3xl bg-white border border-slate-100 shadow-[0_24px_60px_-40px_rgba(8,127,120,0.5)] p-6 sm:p-10">
        <div className="w-full">
          <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-[#0D1B1E] mb-2">
            {stage === "phone" ? "Partner login" : "Enter your code"}
          </h2>
          <p className="text-slate-500 mb-8">
            {stage === "phone" ? (
              "Log in or register your kitchen with your phone number. No password needed."
            ) : (
              <>We sent a code to <span className="font-bold text-[#0D1B1E]">+91 {phoneDigits}</span>.{" "}
                <button type="button" onClick={() => { setStage("phone"); setOtp(""); setError(null); }} className="text-[#087F78] font-bold hover:underline">Change</button>
              </>
            )}
          </p>

          {stage === "phone" ? (
            <form onSubmit={(e) => { e.preventDefault(); if (canSendOtp) handleSendOtp(); }} className="flex flex-col gap-5">
              <div>
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-[#0D1B1E] mb-3 ml-1">Phone number</label>
                <div className={`flex items-center rounded-2xl bg-white border-2 transition-all focus-within:border-[#087F78] focus-within:ring-4 focus-within:ring-[#087F78]/10 ${error ? "border-red-300" : "border-slate-200"}`}>
                  <span className="flex items-center gap-2 pl-4 pr-3 py-4 border-r border-slate-200 font-bold text-[#0D1B1E]">
                    <Smartphone size={18} className="text-[#087F78]" /> +91
                  </span>
                  <input
                    id="phone"
                    value={phoneDigits}
                    onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="98765 43210"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    autoFocus
                    className="flex-1 min-w-0 px-4 py-4 text-lg font-semibold tracking-wide bg-transparent outline-none placeholder:text-slate-300 placeholder:font-medium"
                  />
                  {phoneReady ? <BadgeCheck size={20} className="text-[#087F78] mr-4 shrink-0" /> : null}
                </div>
                {error ? <p role="alert" className="text-sm font-semibold text-red-600 mt-2 ml-1">{error}</p> : null}
              </div>

              <button
                type="submit"
                disabled={!canSendOtp}
                className="w-full py-4 rounded-2xl bg-[#087F78] hover:bg-[#066b65] text-white font-bold text-lg flex items-center justify-center gap-2 shadow-[0_20px_40px_-12px_rgba(8,127,120,0.55)] transition-all enabled:hover:scale-[1.01] enabled:active:scale-[0.99] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
               
              >
                {isSending ? <Spinner /> : null} Send OTP
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-5">
              {devOtp ? <p className="text-xs text-amber-600 font-semibold -mt-4">Dev mode OTP: {devOtp}</p> : null}
              <div>
                <div className="flex gap-2 sm:gap-3 justify-between" onPaste={onBoxPaste}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      ref={(el) => { boxes.current[i] = el; }}
                      value={otp[i] ?? ""}
                      onChange={(e) => setDigit(i, e.target.value)}
                      onKeyDown={(e) => onBoxKey(i, e)}
                      onFocus={(e) => e.target.select()}
                      inputMode="numeric"
                      autoComplete={i === 0 ? "one-time-code" : "off"}
                      autoFocus={i === 0}
                      maxLength={1}
                      aria-label={`Digit ${i + 1}`}
                      className={`w-full aspect-[4/5] max-w-[56px] text-center text-2xl font-extrabold rounded-2xl bg-white border-2 outline-none transition-all text-[#0D1B1E] focus:border-[#087F78] focus:ring-4 focus:ring-[#087F78]/10 ${otp[i] ? "border-[#087F78]/60 bg-[#EFFAF8]" : error ? "border-red-300" : "border-slate-200"}`}
                    />
                  ))}
                </div>
                {error ? <p role="alert" className="text-sm font-semibold text-red-600 mt-3 ml-1">{error}</p> : null}
              </div>

              <button
                type="button"
                onClick={handleVerify}
                disabled={!canVerify}
                className="w-full py-4 rounded-2xl bg-[#087F78] hover:bg-[#066b65] text-white font-bold text-lg flex items-center justify-center gap-2 shadow-[0_20px_40px_-12px_rgba(8,127,120,0.55)] transition-all enabled:hover:scale-[1.01] enabled:active:scale-[0.99] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
               
              >
                {isVerifying ? <Spinner /> : null} Verify and continue
              </button>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={cooldown > 0 || isSending}
                className="text-sm font-bold text-[#087F78] hover:underline disabled:text-slate-400 disabled:no-underline"
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
              </button>
            </div>
          )}

          <p className="text-xs text-slate-500 leading-relaxed text-center mt-7">
            New here? Logging in creates your kitchen account. By continuing, you agree to our{" "}
            <Link href="/terms-of-service" className="font-bold text-[#087F78] hover:underline">Terms</Link> and{" "}
            <Link href="/privacy-policy" className="font-bold text-[#087F78] hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </main>

      <p className="text-center text-sm text-slate-500 mt-6">
        Need help? <Link href="/contact-us" className="font-bold text-[#087F78] hover:underline">Talk to us</Link>
      </p>
    </div>
  );
}
