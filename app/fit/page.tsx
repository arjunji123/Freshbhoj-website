import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Target, Calculator, UtensilsCrossed, BadgeCheck, CalendarSync, Plus, type LucideIcon } from "lucide-react";
import { Navbar, Footer } from "../Components";
import FitCalculator from "./FitCalculator";

const TITLE = "FreshBhoj Fit: Eat to Your Goal";
const DESCRIPTION =
  "Fit is the FreshBhoj section for people who train or just want to eat well. Set a goal, get your daily calorie and protein target, and order macro-counted meals from verified kitchens.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://freshbhoj.com/fit" },
  openGraph: {
    title: `${TITLE} | FreshBhoj`,
    description: DESCRIPTION,
    url: "https://freshbhoj.com/fit",
    siteName: "FreshBhoj",
    images: [{ url: "https://freshbhoj.com/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | FreshBhoj`,
    description: DESCRIPTION,
    images: ["https://freshbhoj.com/og-image.jpg"],
  },
};

const serif = { fontFamily: "var(--font-instrument), Georgia, serif", fontStyle: "italic" as const, fontWeight: 400 };

const STEPS = [
  { icon: Target, title: "Pick your goal", text: "Muscle gain, fat loss or stay balanced." },
  { icon: Calculator, title: "Get your daily target", text: "Your calories and protein, worked out from your body and activity." },
  { icon: UtensilsCrossed, title: "Order meals that fit", text: "Every meal shows its macros, so there is no guesswork." },
] as const;

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Target, title: "Goal picker", text: "Targets and picks follow your goal." },
  { icon: Calculator, title: "Daily target", text: "Calories and protein, built for you." },
  { icon: BadgeCheck, title: "Macro-counted meals", text: "Calories, protein, carbs and fat on every card." },
  { icon: CalendarSync, title: "Weekly meal plans", text: "Pause or skip any day." },
];

const FAQ = [
  { q: "Who is Fit for?", a: "Anyone who trains, plays a sport, or simply wants to eat healthier. You do not need to follow a strict diet. Fit just makes the nutrition on your plate easy to see." },
  { q: "How is my daily target calculated?", a: "We use the Mifflin-St Jeor formula for your resting energy, scale it for your activity level, then adjust for your goal. Protein is set between 1.6 and 2.2 g per kg of body weight depending on the goal. It is an estimate, and you can adjust it in the app." },
  { q: "Are the macros on each meal accurate?", a: "Kitchens add nutrition for each dish, and FreshBhoj AI helps estimate calories, protein, carbs and fat. Treat the numbers as a close guide rather than a lab result." },
  { q: "Is this medical advice?", a: "No. Fit gives general guidance. If you have a medical condition, are pregnant, or are under 18, please speak to a doctor or dietitian first." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const heading = "font-extrabold tracking-[-0.03em] leading-[1.05]";

function Accent({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <span className={tone === "light" ? "text-[#FFC21A]" : "text-[#087F78]"} style={serif}>
      {children}
    </span>
  );
}

/** One clean sample macro card, pure CSS. */
function SampleCard() {
  const macros = [
    { label: "Protein", v: 34, pct: 72, tone: "bg-[#087F78]" },
    { label: "Carbs", v: 42, pct: 50, tone: "bg-[#FFC21A]" },
    { label: "Fat", v: 16, pct: 30, tone: "bg-[#0B4F6C]" },
  ];
  return (
    <div className="w-full max-w-sm mx-auto rounded-3xl bg-white text-[#0D1B1E] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)] p-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087F78] mb-2">Sample meal</p>
      <div className="flex items-end justify-between gap-3 mb-6">
        <h3 className="font-extrabold text-xl leading-tight">Paneer tikka power bowl</h3>
        <p className="shrink-0 text-right leading-none">
          <span className="block text-3xl font-extrabold">480</span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">kcal</span>
        </p>
      </div>
      <ul className="grid gap-3">
        {macros.map((m) => (
          <li key={m.label} className="flex items-center gap-3 text-sm">
            <span className="w-14 font-bold text-slate-600">{m.label}</span>
            <span className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden"><span className={`block h-full rounded-full ${m.tone}`} style={{ width: `${m.pct}%` }} /></span>
            <span className="w-10 text-right font-extrabold">{m.v}g</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FitPage() {
  return (
    <main className="font-sans bg-[#F3F8F8]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[linear-gradient(150deg,#087F78_0%,#0B4F6C_100%)] text-white pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="pointer-events-none absolute -top-40 -left-24 w-[560px] h-[560px] rounded-full bg-[#1DB9A0]/30 blur-[130px]" />
        <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-12 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFC21A] mb-5">FreshBhoj Fit</p>
            <h1 className={`${heading} text-5xl sm:text-6xl lg:text-7xl mb-6`}>
              Eat for the goal you are <Accent tone="light">training for.</Accent>
            </h1>
            <p className="text-white/85 text-lg lg:text-xl leading-relaxed max-w-xl mb-8">
              Know your daily target, see the macros on every meal and order from verified kitchens.
            </p>
            <Link
              href="/pre-register?type=foodie"
              className="group inline-flex items-center justify-center gap-3 h-14 pl-8 pr-2 rounded-full bg-white text-[#0D1B1E] font-extrabold text-base lg:text-lg shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:scale-[1.03] active:scale-95 transition-transform"
            >
              Pre-Register for the App
              <span className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-[#087F78] group-hover:rotate-45 transition-transform">
                <ArrowUpRight size={20} />
              </span>
            </Link>
          </div>
          <SampleCard />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className={`${heading} text-4xl md:text-5xl text-[#0D1B1E] text-center mb-14`}>
            Three steps to <Accent>meals that fit.</Accent>
          </h2>
          <ol className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="rounded-3xl bg-white border border-[#087F78]/10 p-8 shadow-[0_24px_60px_-40px_rgba(8,127,120,0.5)]">
                <span className="w-12 h-12 rounded-2xl bg-[#087F78] text-white flex items-center justify-center mb-6"><Icon size={22} /></span>
                <h3 className="text-xl font-extrabold text-[#0D1B1E] mb-2"><span className="text-[#087F78] mr-2">{i + 1}.</span>{title}</h3>
                <p className="text-slate-600 leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Calculator */}
      <section id="target" className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className={`${heading} text-4xl md:text-5xl text-[#0D1B1E] mb-4`}>
              Know your numbers in <Accent>ten seconds.</Accent>
            </h2>
            <p className="text-slate-600 text-lg">The same calculation Fit runs in the app. Nothing you enter is saved.</p>
          </div>
          <FitCalculator />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className={`${heading} text-4xl md:text-5xl text-[#0D1B1E] text-center mb-14`}>
            Everything to <Accent>eat on target.</Accent>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-3xl bg-white border border-[#087F78]/10 p-6 shadow-[0_24px_60px_-40px_rgba(8,127,120,0.5)]">
                <span className="w-11 h-11 rounded-2xl bg-[#087F78]/10 text-[#087F78] flex items-center justify-center mb-5"><Icon size={20} /></span>
                <h3 className="font-extrabold text-lg text-[#0D1B1E] mb-1.5">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className={`${heading} text-4xl md:text-5xl text-[#0D1B1E] text-center mb-12`}>Good to know</h2>
          <div className="grid gap-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-2xl bg-[#F3F8F8] border border-[#087F78]/10 px-6 py-5">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-extrabold text-[#0D1B1E] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus size={20} className="shrink-0 text-[#087F78] transition-transform group-open:rotate-45" />
                </summary>
                <p className="text-slate-600 leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-[linear-gradient(150deg,#087F78_0%,#0B4F6C_100%)] text-white text-center px-6 py-20 md:py-28">
        <div className="max-w-2xl mx-auto">
          <h2 className={`${heading} text-4xl md:text-6xl mb-4`}>
            Your goal. Your meals. <Accent tone="light">Your target.</Accent>
          </h2>
          <p className="text-white/85 text-lg mb-8">Pre-register for early access and a ₹100 wallet credit at launch.</p>
          <Link
            href="/pre-register?type=foodie"
            className="group inline-flex items-center justify-center gap-3 h-14 pl-8 pr-2 rounded-full bg-white text-[#0D1B1E] font-extrabold text-lg shadow-[0_20px_50px_-15px_rgba(0,0,0,0.45)] hover:scale-[1.03] active:scale-95 transition-transform"
          >
            Pre-Register Now
            <span className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-[#087F78] group-hover:rotate-45 transition-transform">
              <ArrowUpRight size={20} />
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
