"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Script from "next/script";
import Link from "next/link";
import {
  Mail,
  Send,
  Check,
  Instagram,
  Linkedin,
  Twitter,
  Plus,
  Clock3,
  MessageCircle,
  Headphones,
  ChefHat,
  Handshake,
  Sparkles,
  CalendarDays,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { Navbar, Footer } from "../Components";

declare global {
  interface Window {
    Calendly: any;
  }
}

const SUBJECTS = ["Customer Support", "Kitchen Onboarding", "Partnership Inquiry", "Other"] as const;

const INTENTS: { icon: LucideIcon; subject: (typeof SUBJECTS)[number]; title: string; text: string; tone: string }[] = [
  { icon: Headphones, subject: "Customer Support", title: "I'm a customer", text: "Orders, account or app questions.", tone: "from-[#1DB9A0] to-[#087F78]" },
  { icon: ChefHat, subject: "Kitchen Onboarding", title: "I run a kitchen", text: "Register, get verified, start selling.", tone: "from-[#FFC21A] to-[#F59E0B]" },
  { icon: Handshake, subject: "Partnership Inquiry", title: "Partner or invest", text: "Collaborations, press and investors.", tone: "from-[#5EA8FF] to-[#1E7BD8]" },
  { icon: Sparkles, subject: "Other", title: "Something else", text: "Feedback, ideas, or just hello.", tone: "from-[#0B4F6C] to-[#087F78]" },
];

const FAQS = [
  { q: "How do I register my kitchen?", a: "Open the Partner Portal, log in with your phone number (OTP) and complete the onboarding steps. Any food business can apply: restaurant, dhaba, café, bakery, cloud or home kitchen." },
  { q: "What does 'Verified' mean?", a: "A FreshBhoj team member visits the kitchen in person and checks hygiene and licences. Kitchens that pass get a Verified badge and are shown in their own section." },
  { q: "When does the app launch in my city?", a: "We're rolling out city by city. Pre-register as a foodie and we'll notify you the moment we reach your city." },
  { q: "How fast will you reply?", a: "Usually within 2–4 hours on working days. For anything urgent, WhatsApp is quickest." },
] as const;

const gradientText = {
  background: "linear-gradient(169.21deg, #1DB9A0 9%, #087F78 77%, #0B4F6C 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

const gradientBg = {
  background: "linear-gradient(169.21deg, #1DB9A0 9%, #087F78 77%, #0B4F6C 100%)",
};

export default function ContactUs() {
  const [qrLoaded, setQrLoaded] = useState(false);
  const [msgSubmitted, setMsgSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msgData, setMsgData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    agreed: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgData.subject) {
      setError("Please choose what this is about");
      return;
    }
    if (!msgData.agreed) {
      setError("Please agree to the Privacy Policy");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: msgData.name,
          email: msgData.email,
          subject: msgData.subject,
          message: msgData.message
        }),
      });

      if (!resp.ok) {
        throw new Error("Failed to send message. Please try again later.");
      }

      setMsgSubmitted(true);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const pickSubject = (subject: string) => {
    setMsgData((d) => ({ ...d, subject }));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const inputCls =
    "w-full px-5 py-4 rounded-2xl bg-[#F3F8F8] border border-transparent hover:border-slate-200 focus:bg-white focus:border-[#087F78]/40 focus:ring-4 focus:ring-[#087F78]/10 outline-none transition-all placeholder:text-slate-400 text-[#0D1B1E]";

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
      <Navbar />

      {/* Calendly Integration Assets */}
      <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />

      {/* ── Hero ── */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#EFFAF8] via-white to-white pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(#087F78_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#1DB9A0]/25 blur-[110px] animate-[drift_14s_ease-in-out_infinite]" />
        <div className="pointer-events-none absolute top-10 -right-24 w-[380px] h-[380px] rounded-full bg-[#FFC21A]/20 blur-[110px] animate-[drift_18s_ease-in-out_infinite_reverse]" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#087F78]/15 shadow-sm px-5 py-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#087F78] mb-8">
            <span className="w-2 h-2 rounded-full bg-[#1DB9A0] animate-pulse" /> We usually reply in 2–4 hours
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-[#0D1B1E] leading-[1.02] mb-6">
            Let&apos;s{" "}
            <span style={{ ...gradientText, fontFamily: "var(--font-instrument), Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>talk</span>
            .
          </h1>
          <p className="text-slate-500 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
            Customer, kitchen owner, partner or just curious? Pick what fits and we&apos;ll point you to the right person.
          </p>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pb-20 md:pb-28 -mt-4">
        {/* ── Intent cards ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-20 md:mb-28">
          {INTENTS.map(({ icon: Icon, subject, title, text, tone }) => {
            const on = msgData.subject === subject;
            return (
              <button
                key={subject}
                type="button"
                onClick={() => pickSubject(subject)}
                className={`group relative text-left rounded-[2rem] p-6 lg:p-7 border transition-all duration-300 hover:-translate-y-1.5 overflow-hidden ${
                  on ? "bg-white border-[#087F78]/40 shadow-[0_24px_50px_-20px_rgba(8,127,120,0.55)]" : "bg-white border-slate-100 shadow-sm hover:shadow-xl"
                }`}
              >
                <div className={`pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${tone} opacity-10 group-hover:opacity-25 transition-opacity`} />
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${tone} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 group-hover:-rotate-3 transition-transform`}>
                  <Icon size={26} strokeWidth={2.1} />
                </div>
                <h3 className="relative text-xl font-extrabold text-[#0D1B1E] mb-1.5">{title}</h3>
                <p className="relative text-slate-500 text-sm leading-relaxed mb-5">{text}</p>
                <span className="relative inline-flex items-center gap-1 text-sm font-bold text-[#087F78]">
                  {on ? "Selected" : "Write to us"} <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </button>
            );
          })}
        </section>

        {/* ── Form + channels ── */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-start mb-20 md:mb-28">
          {/* Form */}
          <div ref={formRef} className="relative rounded-[2.5rem] p-px bg-[linear-gradient(135deg,#1DB9A0,rgba(8,127,120,0.1)_40%,#FFC21A)] shadow-[0_40px_80px_-40px_rgba(8,127,120,0.45)]">
            <div className="relative rounded-[calc(2.5rem-1px)] bg-white p-6 md:p-12 overflow-hidden">
              {msgSubmitted ? (
                <div className="text-center py-16 flex flex-col items-center animate-in zoom-in duration-500">
                  <div className="relative w-24 h-24 mb-8">
                    <span className="absolute inset-0 rounded-full bg-[#1DB9A0]/20 animate-ping" />
                    <span className="relative w-24 h-24 rounded-full flex items-center justify-center text-white" style={gradientBg}>
                      <Check size={44} strokeWidth={3} />
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-[#0D1B1E] mb-3">Message sent!</h3>
                  <p className="text-slate-500 mb-8 max-w-sm">Thanks for reaching out. We&apos;ve got your message and will reply to your email shortly.</p>
                  <button onClick={() => setMsgSubmitted(false)} className="px-8 py-4 rounded-full font-bold text-white hover:scale-105 transition-transform" style={gradientBg}>
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D1B1E] mb-2">Send us a message</h2>
                  <p className="text-slate-500 mb-8">Tell us a little and we&apos;ll take it from there.</p>

                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-xs font-bold text-[#0D1B1E] uppercase tracking-widest mb-3 ml-1">What is this about?</label>
                      <div className="flex flex-wrap gap-2">
                        {SUBJECTS.map((sub) => (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => setMsgData({ ...msgData, subject: sub })}
                            className={`px-4 py-2.5 rounded-full text-sm font-bold border transition-all ${
                              msgData.subject === sub ? "text-white border-transparent shadow-lg shadow-[#087F78]/25" : "bg-white text-slate-600 border-slate-200 hover:border-[#087F78]/40"
                            }`}
                            style={msgData.subject === sub ? gradientBg : undefined}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-[#0D1B1E] uppercase tracking-widest mb-3 ml-1">Your name</label>
                        <input type="text" placeholder="Your full name" required className={inputCls} value={msgData.name} onChange={(e) => setMsgData({ ...msgData, name: e.target.value })} disabled={isSubmitting} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0D1B1E] uppercase tracking-widest mb-3 ml-1">Email</label>
                        <input type="email" placeholder="you@example.com" required className={inputCls} value={msgData.email} onChange={(e) => setMsgData({ ...msgData, email: e.target.value })} disabled={isSubmitting} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0D1B1E] uppercase tracking-widest mb-3 ml-1">Message</label>
                      <textarea placeholder="Tell us how we can help..." required rows={5} className={`${inputCls} resize-none`} value={msgData.message} onChange={(e) => setMsgData({ ...msgData, message: e.target.value })} disabled={isSubmitting} />
                    </div>

                    {error && (
                      <div role="alert" className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {error}
                      </div>
                    )}

                    <button type="button" className="flex items-start gap-3 text-left w-full group/check" onClick={() => setMsgData({ ...msgData, agreed: !msgData.agreed })}>
                      <span className={`mt-0.5 w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all relative overflow-hidden ${msgData.agreed ? "border-transparent" : "border-slate-300 group-hover/check:border-[#087F78]/60"}`}>
                        <span className={`absolute inset-0 transition-opacity ${msgData.agreed ? "opacity-100" : "opacity-0"}`} style={gradientBg} />
                        <Check className={`relative w-3.5 h-3.5 text-white transition-transform ${msgData.agreed ? "scale-100" : "scale-0"}`} strokeWidth={4} />
                      </span>
                      <span className="text-[13px] text-slate-500 leading-relaxed select-none">
                        I agree to the{" "}
                        <Link href="/privacy-policy" className="text-[#087F78] font-bold hover:underline" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link>{" "}
                        and allow FreshBhoj to contact me about this inquiry.
                      </span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`group/send w-full py-5 rounded-2xl text-white font-bold text-lg shadow-[0_20px_40px_-12px_rgba(8,127,120,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                      style={gradientBg}
                    >
                      {isSubmitting ? "Sending..." : "Send message"}
                      <Send className={`w-5 h-5 transition-transform group-hover/send:translate-x-1 group-hover/send:-translate-y-0.5 ${isSubmitting ? "animate-pulse" : ""}`} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Channels */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Prefer another way?</p>
            {[
              { icon: <MessageCircle size={22} />, label: "WhatsApp / Call", value: "+91 80583 18556", sub: "Mon – Sat · 9am – 7pm", href: "https://wa.me/918058318556", tag: "Fastest" },
              { icon: <Mail size={22} />, label: "Email", value: "arjun@freshbhoj.com", sub: "Reply in 2–4 hours", href: "mailto:arjun@freshbhoj.com" },
              { icon: <Linkedin size={22} />, label: "LinkedIn", value: "Arjun Singh Naruka", sub: "Partnerships & press", href: "https://www.linkedin.com/in/arjun-singh-naruka/" },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex items-center gap-5 rounded-3xl bg-white border border-slate-100 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#087F78]/25 transition-all"
              >
                <span className="relative w-14 h-14 shrink-0 rounded-2xl bg-[#EFFAF8] text-[#087F78] flex items-center justify-center overflow-hidden group-hover:text-white transition-colors">
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={gradientBg} />
                  <span className="relative">{c.icon}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#0D1B1E]">{c.label}</span>
                    {"tag" in c && c.tag ? <span className="text-[9px] font-bold uppercase tracking-widest bg-[#FFC21A] text-[#0D1B1E] rounded-full px-2 py-0.5">{c.tag}</span> : null}
                  </span>
                  <span className="block text-slate-600 text-sm truncate">{c.value}</span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5"><Clock3 size={11} />{c.sub}</span>
                </span>
                <ArrowUpRight size={18} className="text-slate-300 group-hover:text-[#087F78] transition-colors shrink-0" />
              </a>
            ))}

            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Follow our journey</p>
              <div className="flex gap-3">
                {[
                  { icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/freshbhoj", label: "Instagram" },
                  { icon: <Twitter className="w-5 h-5" />, href: "https://x.com/freshbhoj", label: "X" },
                  { icon: <Linkedin className="w-5 h-5" />, href: "https://www.linkedin.com/company/freshbhoj/", label: "LinkedIn" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-12 h-12 rounded-full flex items-center justify-center bg-white border border-slate-200 text-[#087F78] transition-all overflow-hidden group/social hover:-translate-y-1 hover:shadow-[0_10px_24px_-6px_rgba(8,127,120,0.6)]"
                  >
                    <span className="absolute inset-0 opacity-0 group-hover/social:opacity-100 transition-opacity" style={gradientBg} />
                    <span className="relative z-10 group-hover/social:text-white transition-colors">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-3xl mx-auto mb-20 md:mb-28">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087F78] mb-3">Quick answers</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0D1B1E]">
              Maybe we already{" "}
              <span style={{ ...gradientText, fontFamily: "var(--font-instrument), Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>answered it</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className={`rounded-3xl border transition-all ${open ? "bg-[#EFFAF8] border-[#087F78]/20" : "bg-white border-slate-100"}`}>
                  <button className="w-full flex items-center justify-between gap-4 text-left p-5 md:p-6" aria-expanded={open} onClick={() => setOpenFaq(open ? null : i)}>
                    <span className="font-bold text-[#0D1B1E] md:text-lg">{f.q}</span>
                    <span className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-all ${open ? "rotate-45 text-white" : "bg-[#EFFAF8] text-[#087F78]"}`} style={open ? gradientBg : undefined}>
                      <Plus size={18} />
                    </span>
                  </button>
                  <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 md:px-6 pb-6 text-slate-500 leading-relaxed">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Founders call ── */}
        <section className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] text-white bg-[linear-gradient(135deg,#0B4F6C_0%,#087F78_60%,#14ADA0_100%)] p-8 md:p-14 lg:p-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="pointer-events-none absolute -top-24 -left-16 w-80 h-80 rounded-full bg-[#5EE6D0]/30 blur-3xl animate-[drift_14s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute -bottom-28 right-0 w-96 h-96 rounded-full bg-white/15 blur-3xl animate-[drift_18s_ease-in-out_infinite_reverse]" />
          <div className="relative flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              <CalendarDays size={14} /> 30-minute call
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-5">
              Talk to the{" "}
              <span className="text-[#FFC21A]" style={{ fontFamily: "var(--font-instrument), Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>founders</span>
            </h2>
            <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Partnership, roadmap or a bigger idea? Book a direct session with our founding team.
            </p>
            <button
              onClick={() => {
                if (window.Calendly) window.Calendly.initPopupWidget({ url: "https://calendly.com/singhnarukaarjun/30min" });
                else window.open("https://calendly.com/singhnarukaarjun/30min", "_blank");
              }}
              className="inline-flex items-center gap-3 rounded-full bg-[#FFC21A] text-[#0D1B1E] font-bold px-8 py-4 text-lg hover:scale-105 active:scale-95 transition-transform shadow-xl"
            >
              Book a time <ArrowUpRight size={20} />
            </button>
          </div>

          <div className="relative">
            <div
              onClick={() => window.Calendly?.initPopupWidget({ url: "https://calendly.com/singhnarukaarjun/30min" })}
              className="bg-white p-4 md:p-5 rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.3)] rotate-3 hover:rotate-0 transition-transform duration-700 cursor-pointer flex flex-col items-center"
            >
              <div className={`relative w-44 md:w-56 aspect-square rounded-2xl bg-white flex items-center justify-center p-5 transition-opacity duration-700 ${qrLoaded ? "opacity-100" : "opacity-0"}`}>
                <div className="absolute inset-5" style={gradientBg} />
                <Image
                  src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://calendly.com/singhnarukaarjun/30min&margin=10"
                  alt="Scan to book a call with the founders"
                  width={250}
                  height={250}
                  className="relative z-10 w-full h-full object-contain mix-blend-screen"
                  unoptimized
                  onLoad={() => setQrLoaded(true)}
                />
              </div>
              <div className="mt-4 flex items-center gap-3 w-full">
                <div className="h-px flex-1 bg-slate-200" />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">Scan to schedule</p>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
