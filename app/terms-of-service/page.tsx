"use client";

import Image from "next/image";
import { Navbar, Footer } from "../Components";

const gradientStyle = {
  background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

const sections = [
  {
    number: "1",
    title: "Acceptance of Terms",
    content: [
      `By accessing and using FreshBhoj ("the Service"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.`,
      "These terms constitute a legally binding agreement between you and FreshBhoj regarding your use of our platform, mobile applications, and delivery services.",
    ],
  },
  {
    number: "2",
    title: "User Obligations",
    content: ["As a user of FreshBhoj, you represent and warrant that:"],
    bullets: [
      "You are at least 18 years of age or possess legal parental or guardian consent.",
      "The registration information you provide is accurate, current, and complete.",
      "You will maintain the security of your password and identification.",
      "Your use of the service does not violate any applicable law or regulation.",
    ],
  },
  {
    number: "3",
    title: "Intellectual Property",
    content: [
      "The Service and its original content, features, and functionality are and will remain the exclusive property of FreshBhoj and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of FreshBhoj.",
    ],
  },
  {
    number: "4",
    title: "Limitation of Liability",
    content: [
      "In no event shall FreshBhoj, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.",
    ],
  },
  {
    number: "5",
    title: "Governing Law",
    content: [
      "These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which FreshBhoj operates, without regard to its conflict of law provisions.",
      "Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.",
    ],
  },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <div className="w-full pt-20 md:pt-28 pb-4 md:pb-4">
        <div className="w-full max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-2 bg-[#FFF5F5] border border-[#FFEAEA] rounded-full px-4 py-1.5 w-fit mb-4">
            <div className="relative w-3.5 h-3.5">
              <Image src="/legal.svg" alt="legal" fill className="object-contain" />
            </div>
            <span className="text-[#BA2121] text-[10px] font-bold uppercase tracking-[0.2em]">
              Legal Documentation
            </span>
          </div>
          <h1 className="font-extrabold text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight mb-4">
            <span className="text-[#0F172A]">Terms of </span>
            <span
              className="inline-block"
              style={{
                background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Service
            </span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Last Updated: March 17, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="w-full max-w-5xl mx-auto px-6 py-14 lg:py-18 flex-1">
        {/* All sections in one bordered card like the image */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
          {sections.map((section) => (
            <div key={section.number} className="p-8 lg:p-12 flex flex-col gap-5">

              {/* Section Heading */}
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                <span className="inline-block" style={gradientStyle}>
                  {section.number}.
                </span>{" "}
                <span className="inline-block" style={gradientStyle}>
                  {section.title}
                </span>
              </h2>

              {/* Text Content */}
              {section.content.map((para, i) => (
                <p
                  key={i}
                  className="text-slate-600 text-sm md:text-base leading-relaxed"
                >
                  {para}
                </p>
              ))}

              {/* Bullet Points */}
              {section.bullets && (
                <ul className="flex flex-col gap-3 pl-2">
                  {section.bullets.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-slate-600 text-sm md:text-base leading-relaxed"
                    >
                      <span
                        className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 rounded-2xl bg-[#FFF5F5] border border-slate-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-[#0F172A] font-extrabold text-lg md:text-xl mb-1">
              Questions about our Terms?
            </h3>
            <p className="text-slate-500 text-sm">
              Our legal team is here to help you understand your rights.
            </p>
          </div>
          <a
            href="mailto:legal@freshbhoj.com"
            className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap"
            style={{
              background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Legal
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
