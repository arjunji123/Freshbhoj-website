"use client";

import { useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { Mail, Send, Check, Instagram, Linkedin, Twitter, Plus, MessageCircle, ArrowUpRight } from "lucide-react";
import { Navbar, Footer } from "../Components";

declare global {
  interface Window {
    Calendly: any;
  }
}

const SUBJECTS = ["Customer Support", "Kitchen Onboarding", "Partnership Inquiry", "Other"] as const;

const FAQS = [
  { q: "How do I register my kitchen?", a: "Open the Partner Portal, log in with your phone number (OTP) and complete the onboarding steps. Any food business can apply: tiffin services, cloud kitchens, restaurants, cafés, dhabas, bakeries and home kitchens." },
  { q: "What does 'Verified' mean?", a: "The FreshBhoj team visits the kitchen in person and checks hygiene and licences. Kitchens that pass earn a Verified badge and appear in their own section." },
  { q: "When will the app reach my city?", a: "We are launching city by city. Pre-register as a foodie and we will tell you the moment we arrive in yours." },
  { q: "How fast will I get a reply?", a: "Usually within 2-4 hours on working days. For anything urgent, WhatsApp is fastest." },
] as const;

const SUBJECT_LABEL: Record<(typeof SUBJECTS)[number], string> = {
  "Customer Support": "Customer Support",
  "Kitchen Onboarding": "Kitchen Onboarding",
  "Partnership Inquiry": "Partnership",
  Other: "Other",
};

const serif = { fontFamily: "var(--font-instrument), Georgia, serif" } as const;


export default function ContactUs() {
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
      setError("Please agree to the Privacy Policy first");
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

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputCls =
    "w-full px-5 py-3.5 rounded-2xl bg-[#F3F8F8] border border-transparent hover:border-slate-200 focus:bg-white focus:border-[#087F78]/40 focus:ring-4 focus:ring-[#087F78]/10 outline-none transition-all placeholder:text-slate-400 text-[#0D1B1E]";

  const CAL = "https://calendly.com/singhnarukaarjun/30min";
  const labelCls = "block text-sm font-semibold text-[#0D1B1E] mb-2";

  return (
    <div className="min-h-screen bg-[#F3F8F8] flex flex-col font-sans overflow-x-hidden">
      <Navbar />

      {/* Calendly Integration Assets */}
      <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />

      <header className="relative overflow-hidden bg-[linear-gradient(135deg,#0B4F6C_0%,#087F78_60%,#14ADA0_100%)] text-white pt-36 pb-24 md:pt-44 md:pb-32">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#5EE6D0]/25 blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.02] mb-5">
            Let&apos;s <span className="italic text-[#FFC21A]" style={serif}>talk.</span>
          </h1>
          <p className="text-white/85 text-lg md:text-xl max-w-xl mx-auto">
            Customer, kitchen owner or partner, tell us what you need and the right person will reply.
          </p>
        </div>
      </header>

      <main className="flex-1 w-full">
        <section className="max-w-6xl mx-auto px-6 -mt-14 md:-mt-16 relative grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-12 items-start pb-20 md:pb-28">
          <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_30px_60px_-30px_rgba(8,127,120,0.4)] p-6 md:p-10">
            {msgSubmitted ? (
              <div className="text-center py-12 flex flex-col items-center">
                <span className="w-16 h-16 rounded-full bg-[#087F78] text-white flex items-center justify-center mb-6">
                  <Check size={32} strokeWidth={3} />
                </span>
                <h2 className="text-3xl font-extrabold text-[#0D1B1E] mb-3">Message sent</h2>
                <p className="text-slate-600 mb-8 max-w-sm">Thanks for reaching out. We will reply to your email shortly.</p>
                <button onClick={() => setMsgSubmitted(false)} className="px-8 py-3.5 rounded-full font-bold text-white bg-[#087F78] hover:bg-[#0B4F6C] transition-colors">
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0D1B1E] mb-2">
                  Send us a <span className="italic text-[#087F78]" style={serif}>message</span>
                </h2>
                <p className="text-slate-600 mb-8">Tell us a little and we will take care of the rest.</p>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <span className={labelCls}>What is this about?</span>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          aria-pressed={msgData.subject === sub}
                          onClick={() => setMsgData({ ...msgData, subject: sub })}
                          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                            msgData.subject === sub ? "bg-[#087F78] text-white border-[#087F78]" : "bg-white text-slate-600 border-slate-200 hover:border-[#087F78]/50"
                          }`}
                        >
                          {SUBJECT_LABEL[sub]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="c-name" className={labelCls}>Your name</label>
                      <input id="c-name" type="text" placeholder="Full name" required className={inputCls} value={msgData.name} onChange={(e) => setMsgData({ ...msgData, name: e.target.value })} disabled={isSubmitting} />
                    </div>
                    <div>
                      <label htmlFor="c-email" className={labelCls}>Email</label>
                      <input id="c-email" type="email" placeholder="you@example.com" required className={inputCls} value={msgData.email} onChange={(e) => setMsgData({ ...msgData, email: e.target.value })} disabled={isSubmitting} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="c-msg" className={labelCls}>Message</label>
                    <textarea id="c-msg" placeholder="How can we help?" required rows={4} className={`${inputCls} resize-none`} value={msgData.message} onChange={(e) => setMsgData({ ...msgData, message: e.target.value })} disabled={isSubmitting} />
                  </div>

                  {error && (
                    <div role="alert" className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-semibold">
                      {error}
                    </div>
                  )}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 accent-[#087F78]" checked={msgData.agreed} onChange={(e) => setMsgData({ ...msgData, agreed: e.target.checked })} />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      I agree to the <Link href="/privacy-policy" className="text-[#087F78] font-semibold hover:underline">Privacy Policy</Link> and allow FreshBhoj to contact me about this enquiry.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-2xl text-white font-bold text-lg bg-[#087F78] hover:bg-[#0B4F6C] transition-colors flex items-center justify-center gap-3 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isSubmitting ? "Sending..." : "Send message"}
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </>
            )}
          </div>

          <aside className="flex flex-col gap-4 lg:pt-16">
            {[
              { icon: <MessageCircle size={20} />, label: "WhatsApp / Call", value: "+91 80583 18556", sub: "Mon to Sat, 9am to 7pm", href: "https://wa.me/918058318556" },
              { icon: <Mail size={20} />, label: "Email", value: "arjun@freshbhoj.com", sub: "Replies within 2-4 hours", href: "mailto:arjun@freshbhoj.com" },
              { icon: <Linkedin size={20} />, label: "LinkedIn", value: "Arjun Singh Naruka", sub: "Partnerships and press", href: "https://www.linkedin.com/in/arjun-singh-naruka/" },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-3xl bg-white border border-slate-100 p-5 shadow-sm hover:border-[#087F78]/30 transition-colors"
              >
                <span className="w-11 h-11 shrink-0 rounded-2xl bg-[#EFFAF8] text-[#087F78] flex items-center justify-center">{c.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-[#0D1B1E]">{c.label}</span>
                  <span className="block text-slate-700 text-sm truncate">{c.value}</span>
                  <span className="block text-xs text-slate-500 mt-0.5">{c.sub}</span>
                </span>
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              {[
                { icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/freshbhoj", label: "Instagram" },
                { icon: <Twitter className="w-5 h-5" />, href: "https://x.com/freshbhoj", label: "X" },
                { icon: <Linkedin className="w-5 h-5" />, href: "https://www.linkedin.com/company/freshbhoj/", label: "LinkedIn company page" },
              ].map((social) => (
                <a key={social.label} href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full flex items-center justify-center bg-white border border-slate-200 text-[#087F78] hover:bg-[#087F78] hover:text-white transition-colors">
                  {social.icon}
                </a>
              ))}
            </div>
          </aside>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0D1B1E] text-center mb-12">
              Quick <span className="italic text-[#087F78]" style={serif}>answers</span>
            </h2>
            <div className="flex flex-col gap-3">
              {FAQS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={f.q} className={`rounded-3xl border transition-colors ${open ? "bg-[#F3F8F8] border-[#087F78]/20" : "bg-white border-slate-100"}`}>
                    <button className="w-full flex items-center justify-between gap-4 text-left p-5 md:p-6" aria-expanded={open} onClick={() => setOpenFaq(open ? null : i)}>
                      <span className="font-bold text-[#0D1B1E] md:text-lg">{f.q}</span>
                      <Plus size={20} className={`shrink-0 text-[#087F78] transition-transform ${open ? "rotate-45" : ""}`} />
                    </button>
                    {open && <p className="px-5 md:px-6 pb-6 text-slate-600 leading-relaxed">{f.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-[linear-gradient(135deg,#0B4F6C_0%,#087F78_60%,#14ADA0_100%)] text-white text-center">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Talk to the <span className="italic text-[#FFC21A]" style={serif}>founders</span>
            </h2>
            <p className="text-white/85 text-lg mb-8">Partnership, roadmap or a big idea? Book a 30-minute call.</p>
            <button
              onClick={() => {
                if (window.Calendly) window.Calendly.initPopupWidget({ url: CAL });
                else window.open(CAL, "_blank");
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#FFC21A] text-[#0D1B1E] font-bold px-8 py-4 text-lg hover:scale-105 transition-transform"
            >
              Book a time <ArrowUpRight size={20} />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
