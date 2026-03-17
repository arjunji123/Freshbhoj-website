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
    title: "Introduction",
    content: [
      "Welcome to FreshBhoj. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at privacy@freshbhoj.com.",
      "When you visit our website and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we describe our privacy policy. We seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it.",
    ],
  },
  {
    number: "2",
    title: "Data Collection",
    content: [],
    cards: [
      {
        title: "Personal Information",
        icon: "/person.svg",
        items: ["Name and Contact Data", "Credentials", "Payment Data"],
      },
      {
        title: "Automatically Collected",
        icon: "/automatically.svg",
        items: ["IP Address", "Browser Characteristics", "Device Information"],
      },
    ],
  },
  {
    number: "3",
    title: "How We Use Your Data",
    content: [
      "We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.",
    ],
    points: [
      {
        bold: "To facilitate account creation:",
        text: "We use the information you allowed us to collect to facilitate the creation of your FreshBhoj account.",
      },
      {
        bold: "To fulfill and manage your orders:",
        text: "We use your information to fulfil and manage your orders, payments, returns, and exchanges made through the Services.",
      },
      {
        bold: "To send administrative information:",
        text: "We may use your personal information to send you product, service and new feature information and/or information about changes to our terms, conditions, and policies.",
      },
    ],
  },
  {
    number: "4",
    title: "User Rights",
    content: [
      "In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right to:",
    ],
    rights: [
      { label: "Request Access", icon: "/request-access.svg" },
      { label: "Request Erasure", icon: "/request-erasure.svg" },
      { label: "Object to Processing", icon: "/object-processing.svg" },
      { label: "Data Portability", icon: "/data-portability.svg" },
    ],
  }
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      {/* Hero Header — No Background */}
      <div className="w-full pt-28 md:pt-28 pb-8 md:pb-16 lg:pb-24 border-b border-slate-100">
        <div className="w-full max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-2 bg-[#FFF5F5] rounded-full px-4 py-1.5 w-fit mb-4">
            <div className="relative w-3.5 h-3.5">
              <Image src="/legal.svg" alt="legal" fill className="object-contain" />
            </div>
            <span className="text-[#BA2121] text-[10px] font-bold uppercase tracking-[0.2em]">
              Legal
            </span>
          </div>
          <h1 className="font-extrabold text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight mb-4">
            <span className="text-[#0F172A]">Privacy </span>
            <span
              className="inline-block"
              style={{
                background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              Policy
            </span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Last Updated: March 17, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="w-full max-w-5xl mx-auto px-6 py-16 lg:py-24 flex-1">
        <div className="flex flex-col gap-16">
          {sections.map((section) => (
            <div key={section.number} className="flex flex-col gap-6">
              {/* Section Heading */}
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                <span
                  className="inline-block"
                  style={gradientStyle}
                >
                  {section.number}.
                </span>{" "}
                <span
                  className="inline-block"
                  style={gradientStyle}
                >
                  {section.title}
                </span>
              </h2>

              {/* Text Content — skip for sections that have rights (content is inside the card) */}
              {!section.rights && section.content.map((para, i) => (
                <p
                  key={i}
                  className="text-slate-600 text-base md:text-lg leading-relaxed whitespace-pre-line"
                >
                  {para}
                </p>
              ))}

              {/* Cards (Data Collection) */}
              {section.cards && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  {section.cards.map((card) => (
                    <div
                      key={card.title}
                      className="bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
                    >
                      {/* Card Icon */}
                      <div className="relative w-6 h-6 mb-4">
                        <Image
                          src={card.icon}
                          alt={card.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h3 className="font-extrabold text-[#0F172A] text-lg mb-4">{card.title}</h3>
                      <ul className="flex flex-col gap-3">
                        {card.items.map((item) => (
                          <li key={item} className="flex items-center gap-3 text-slate-600 font-medium text-sm md:text-base">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)" }}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Points (How We Use) */}
              {section.points && (
                <ul className="flex flex-col gap-5 mt-2">
                  {section.points.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-4 text-slate-600 text-base md:text-lg leading-relaxed"
                    >
                      <div className="relative w-6 h-6 flex-shrink-0 mt-1">
                        <Image
                          src="/right-circle.svg"
                          alt="check"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span>
                        <span className="font-bold text-[#0F172A]">{point.bold}</span> {point.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Rights — Bordered Card with 2x2 Grid */}
              {section.rights && (
                <div className="rounded-2xl bg-[#FFF5F5] border-l-4 p-6 mt-2" style={{ borderColor: "#BA2121" }}>
                  {/* Description text inside card */}
                  {section.content.map((para, i) => (
                    <p key={i} className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
                      {para}
                    </p>
                  ))}
                  {/* 2x2 Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.rights.map((right) => (
                      <div
                        key={right.label}
                        className="flex items-center gap-4 bg-white border border-slate-100 rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="relative w-6 h-6 flex-shrink-0">
                          <Image
                            src={right.icon}
                            alt={right.label}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="font-semibold text-[#0F172A] text-sm md:text-base">
                          {right.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-24 rounded-[2.5rem] lg:rounded-[3.5rem] py-16 px-8 text-center overflow-hidden relative bg-[#0F172A] border border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#BA2121] opacity-10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-10 blur-[100px] rounded-full" />
          <div className="relative z-10">
            <p className="text-slate-400 font-medium text-base md:text-lg mb-8">
              Have more questions about your privacy?
            </p>
            <a
              href="mailto:privacy@freshbhoj.com"
              className="inline-flex items-center justify-center px-10 py-5 text-white font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl"
              style={{
                background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
              }}
            >
              Contact Support Team →
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
