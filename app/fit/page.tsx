import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight, Target, Calculator, SlidersHorizontal, UtensilsCrossed, BadgeCheck, Gauge, Droplets,
  CalendarSync, Leaf, Check, Plus, type LucideIcon,
} from "lucide-react";
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
  { n: "01", icon: Target, title: "Pick your goal", text: "Muscle gain, fat loss or stay balanced. Fit shapes everything around it." },
  { n: "02", icon: Calculator, title: "Get your daily target", text: "Tell us your weight, height, age and activity. We work out your calories and protein." },
  { n: "03", icon: UtensilsCrossed, title: "Order meals that fit", text: "Every meal shows its macros, so you can hit your numbers without the guesswork." },
] as const;

const FEATURES: { icon: LucideIcon; title: string; text: string; big?: boolean; chips?: string[] }[] = [
  { icon: Target, title: "Goal picker", text: "Choose Muscle gain, Fat loss or Stay balanced. Your targets, filters and picks follow your goal.", big: true, chips: ["Muscle gain", "Fat loss", "Stay balanced"] },
  { icon: Calculator, title: "Personal daily target", text: "A calorie and protein target built from your own body and activity." },
  { icon: SlidersHorizontal, title: "Macro filters", text: "Narrow the menu in one tap.", chips: ["High protein 30g+", "Under 400 kcal", "Veg only"] },
  { icon: UtensilsCrossed, title: "Macro-counted meals", text: "Calories, protein, carbs and fat on every card. No hunting for numbers.", big: true, chips: ["kcal", "Protein", "Carbs", "Fat"] },
  { icon: BadgeCheck, title: "Fit kitchens", text: "Kitchens ranked by protein, so the best high-protein food is at the top." },
  { icon: Gauge, title: "Live cart meter", text: "See how your cart adds up against your daily target before you pay." },
  { icon: Droplets, title: "Hydration tracker", text: "Log your water through the day and stay on track." },
  { icon: CalendarSync, title: "Weekly Fit meal plans", text: "Subscribe to a week of meals planned around your goal. Pause or skip any day.", big: true, chips: ["Weekly plans", "Pause anytime", "Skip a day"] },
];

const FAQ = [
  { q: "Who is Fit for?", a: "Anyone who trains, plays a sport, or simply wants to eat healthier. You do not need to follow a strict diet. Fit just makes the nutrition on your plate easy to see." },
  { q: "How is my daily target calculated?", a: "We use the Mifflin-St Jeor formula for your resting energy, scale it for your activity level, then adjust for your goal. Protein is set between 1.6 and 2.2 g per kg of body weight depending on the goal. It is an estimate, and you can adjust it in the app." },
  { q: "Are the macros on each meal accurate?", a: "Kitchens add nutrition for each dish, and FreshBhoj AI helps estimate calories, protein, carbs and fat. Treat the numbers as a close guide rather than a lab result." },
  { q: "Can I find vegetarian options?", a: "Yes. Switch on the Veg only filter and combine it with High protein or Under 400 kcal." },
  { q: "Is Fit free to use?", a: "Fit is part of the FreshBhoj app. You pay for the meals you order and any meal plan you subscribe to. Pre-register to hear when the app launches in your city." },
  { q: "Is this medical advice?", a: "No. Fit gives general guidance. If you have a medical condition, are pregnant, or are under 18, please speak to a doctor or dietitian first." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

function Accent({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block pr-[0.14em] -mr-[0.14em] bg-gradient-to-r from-[#5EE6D0] to-[#FFC21A] bg-clip-text text-transparent">
      <span style={serif}>{children}</span>
    </span>
  );
}

/** Sample macro card + cart meter, pure CSS/SVG. */
function SampleCard() {
  const r = 34;
  const c = 2 * Math.PI * r;
  const macros = [
    { label: "Protein", v: 34, unit: "g", pct: 0.72, tone: "bg-[#087F78]" },
    { label: "Carbs", v: 42, unit: "g", pct: 0.5, tone: "bg-[#FFC21A]" },
    { label: "Fat", v: 16, unit: "g", pct: 0.3, tone: "bg-[#0B4F6C]" },
  ];
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="absolute -inset-6 rounded-[3rem] bg-[#1DB9A0]/25 blur-3xl" aria-hidden />
      <div className="relative rounded-[2rem] bg-white text-[#0D1B1E] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] overflow-hidden">
        <div className="relative h-36 bg-[linear-gradient(135deg,#14ADA0,#087F78_55%,#0B4F6C)] overflow-hidden" aria-hidden>
          <span className="absolute -right-6 -bottom-10 w-44 h-44 rounded-full bg-white/10" />
          <span className="absolute right-10 top-6 w-20 h-20 rounded-full bg-[#FFC21A]/90" />
          <span className="absolute right-[4.4rem] top-[3.1rem] w-28 h-28 rounded-full border-[10px] border-white/90 bg-[#EFFAF8]" />
          <span className="absolute left-5 top-5 rounded-full bg-[#FFC21A] text-[#0D1B1E] px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest">High protein</span>
          <span className="absolute left-5 bottom-4 inline-flex items-center gap-1 rounded-full bg-white/90 text-[#087F78] px-2.5 py-1 text-[10px] font-extrabold"><Leaf size={11} /> Veg</span>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="font-extrabold text-lg leading-tight">Paneer tikka power bowl</h3>
              <p className="text-xs text-slate-500 mt-1 inline-flex items-center gap-1"><BadgeCheck size={13} className="text-[#1E7BD8]" /> Sample Fit kitchen</p>
            </div>
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90" role="img" aria-label="Protein covers 34 of 40 grams target for this meal">
                <circle cx="40" cy="40" r={r} fill="none" stroke="#E2E8F0" strokeWidth="8" />
                <circle cx="40" cy="40" r={r} fill="none" stroke="#087F78" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - 0.85)} />
              </svg>
              <span className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <span className="text-lg font-extrabold">480</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">kcal</span>
              </span>
            </div>
          </div>
          <ul className="grid gap-2.5">
            {macros.map((m) => (
              <li key={m.label} className="flex items-center gap-3 text-sm">
                <span className="w-14 font-bold text-slate-600">{m.label}</span>
                <span className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden"><span className={`block h-full rounded-full ${m.tone}`} style={{ width: `${m.pct * 100}%` }} /></span>
                <span className="w-10 text-right font-extrabold">{m.v}{m.unit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative -mt-5 ml-6 -mr-2 sm:-mr-6 rounded-2xl bg-[#0D1B1E] text-white border border-white/10 p-4 shadow-[0_30px_50px_-20px_rgba(0,0,0,0.6)] animate-float">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="inline-flex items-center gap-1.5 text-[#5EE6D0]"><Gauge size={14} /> Your cart today</span>
          <span className="text-white/60">1,320 / 2,400 kcal</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-2.5"><span className="block h-full w-[55%] rounded-full" style={{ background: "linear-gradient(90deg,#1DB9A0,#FFC21A)" }} /></div>
        <p className="text-[11px] text-white/70">Protein <span className="font-extrabold text-white">98g</span> of 140g. Add a high protein side to close the gap.</p>
      </div>
    </div>
  );
}

export default function FitPage() {
  return (
    <main className="font-sans bg-[#F3F8F8]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0D1B1E] text-white pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="pointer-events-none absolute -top-40 -left-24 w-[640px] h-[640px] rounded-full bg-[#087F78]/50 blur-[130px] animate-[drift_16s_ease-in-out_infinite]" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[460px] h-[460px] rounded-full bg-[#FFC21A]/15 blur-[130px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-3 rounded-full bg-white/10 border border-white/20 pl-2 pr-4 py-1.5 mb-7">
              <span className="rounded-full bg-[#FFC21A] text-[#0D1B1E] px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest">New</span>
              <span className="text-xs lg:text-sm font-bold">FreshBhoj Fit</span>
            </span>
            <h1 className="font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-[-0.03em] mb-6">
              Eat for the goal<br />you are <Accent>training for.</Accent>
            </h1>
            <p className="text-white/80 text-lg lg:text-xl leading-relaxed max-w-xl mb-8">
              Fit is a dedicated space in the FreshBhoj app for people who train, stay active or simply want to eat well. Know your daily target, see the macros on every meal and order from verified kitchens.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
              <Link
                href="/pre-register?type=foodie"
                className="group inline-flex items-center justify-center gap-3 h-14 pl-8 pr-2 rounded-full bg-white text-[#0D1B1E] font-extrabold text-base lg:text-lg shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] hover:scale-[1.03] active:scale-95 transition-transform"
              >
                Pre-Register for the App
                <span className="w-10 h-10 rounded-full flex items-center justify-center text-white group-hover:rotate-45 transition-transform" style={{ background: "linear-gradient(135deg,#14ADA0,#0B4F6C)" }}>
                  <ArrowUpRight size={20} />
                </span>
              </Link>
              <a
                href="#target"
                className="inline-flex items-center justify-center h-14 px-8 rounded-full border border-white/35 bg-white/10 text-white font-bold text-base lg:text-lg hover:bg-white/20 hover:scale-[1.03] active:scale-95 transition-all"
              >
                Try the calculator
              </a>
            </div>
            <ul className="flex flex-wrap gap-2">
              {["High protein 30g+", "Under 400 kcal", "Veg only"].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white/90">
                  <Check size={13} className="text-[#FFC21A]" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <SampleCard />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087F78] mb-4">How it works</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0D1B1E] leading-tight">
              Three steps to <span className="inline-block pr-[0.14em] -mr-[0.14em] bg-gradient-to-r from-[#1DB9A0] via-[#087F78] to-[#0B4F6C] bg-clip-text text-transparent"><span style={serif}>meals that fit.</span></span>
            </h2>
          </div>
          <ol className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {STEPS.map(({ n, icon: Icon, title, text }) => (
              <li key={n} className="relative rounded-[2rem] bg-white border border-[#087F78]/10 p-7 shadow-[0_24px_60px_-40px_rgba(8,127,120,0.6)] overflow-hidden">
                <span className="absolute -top-3 right-4 text-8xl font-extrabold text-[#087F78]/[0.07] leading-none select-none" aria-hidden>{n}</span>
                <span className="relative w-12 h-12 rounded-2xl text-white flex items-center justify-center mb-5" style={{ background: "linear-gradient(135deg,#14ADA0,#0B4F6C)" }}><Icon size={22} /></span>
                <h3 className="relative text-xl font-extrabold text-[#0D1B1E] mb-2">{title}</h3>
                <p className="relative text-slate-600 leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative bg-[#0D1B1E] text-white py-20 lg:py-28 overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[480px] rounded-full bg-[#087F78]/30 blur-[140px]" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFC21A] mb-4">What is inside Fit</p>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Everything you need to <Accent>eat on target.</Accent>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {FEATURES.map(({ icon: Icon, title, text, big, chips }) => (
              <div
                key={title}
                className={`group relative rounded-3xl p-6 lg:p-7 border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#5EE6D0]/40 ${
                  big ? "sm:col-span-2 bg-gradient-to-br from-[#14ADA0]/40 via-[#087F78]/30 to-[#0B4F6C]/40" : "bg-white/[0.04]"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 group-hover:bg-[#FFC21A] group-hover:text-[#0D1B1E] text-[#5EE6D0] flex items-center justify-center mb-5 transition-colors">
                  <Icon size={22} strokeWidth={2.2} />
                </div>
                <h3 className="font-extrabold text-lg lg:text-xl mb-2">{title}</h3>
                <p className="text-white/65 text-sm lg:text-base leading-relaxed">{text}</p>
                {chips ? (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {chips.map((c) => (
                      <span key={c} className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-semibold text-white/85">{c}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="target" className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087F78] mb-4">Daily target calculator</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0D1B1E] leading-tight mb-4">
              Know your numbers in{" "}
              <span className="inline-block pr-[0.14em] -mr-[0.14em] bg-gradient-to-r from-[#1DB9A0] via-[#087F78] to-[#0B4F6C] bg-clip-text text-transparent"><span style={serif}>ten seconds.</span></span>
            </h2>
            <p className="text-slate-600 text-lg">This is the same calculation Fit runs inside the app. Nothing you enter here is saved.</p>
          </div>
          <FitCalculator />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="pb-20 lg:pb-28">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087F78] mb-4">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0D1B1E] leading-tight">Good to know</h2>
          </div>
          <div className="grid gap-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-2xl bg-white border border-[#087F78]/10 px-6 py-5 open:shadow-[0_20px_50px_-35px_rgba(8,127,120,0.7)]">
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
      <section className="px-6 pb-20 lg:pb-28">
        <div className="relative max-w-6xl mx-auto overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] bg-[linear-gradient(150deg,#14ADA0_0%,#087F78_45%,#0B4F6C_100%)] text-white text-center px-6 py-14 lg:py-20">
          <div className="pointer-events-none absolute -top-24 -right-16 w-80 h-80 rounded-full bg-[#FFC21A]/25 blur-[100px]" />
          <h2 className="relative text-4xl md:text-6xl font-extrabold leading-[1.05] mb-4">
            Your goal. Your meals. <span className="text-[#FFC21A]" style={serif}>Your target.</span>
          </h2>
          <p className="relative text-white/85 text-lg max-w-xl mx-auto mb-8">Pre-register to get early access and a ₹100 wallet credit when FreshBhoj launches in your city.</p>
          <Link
            href="/pre-register?type=foodie"
            className="relative group inline-flex items-center justify-center gap-3 h-14 pl-8 pr-2 rounded-full bg-white text-[#0D1B1E] font-extrabold text-lg shadow-[0_20px_50px_-15px_rgba(0,0,0,0.45)] hover:scale-[1.03] active:scale-95 transition-transform"
          >
            Pre-Register Now
            <span className="w-10 h-10 rounded-full flex items-center justify-center text-white group-hover:rotate-45 transition-transform" style={{ background: "linear-gradient(135deg,#14ADA0,#0B4F6C)" }}>
              <ArrowUpRight size={20} />
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
