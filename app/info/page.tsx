import Link from "next/link";
import { Navbar, Footer } from "../Components";

const serif = { fontFamily: "var(--font-instrument), Georgia, serif" } as const;

const BLOCKS = [
  {
    id: "customers",
    tag: "For customers",
    title: "Fresh food, ",
    accent: "honestly shown",
    intro: "Order a single meal or set up a meal plan, from kitchens near you.",
    items: [
      { t: "Discover nearby", d: "Kitchens and dishes close to you, ranked by real orders and ratings, never paid placement." },
      { t: "Know what you eat", d: "Calories, protein, carbs and fat on every dish, plus veg, non-veg, vegan, egg and Jain-friendly marks." },
      { t: "Trust the kitchen", d: "Kitchens our team has visited in person carry a Verified badge and are shown separately." },
    ],
    note: "Pay by UPI, card, wallet or cash. Track every order, chat with the kitchen, and pause or swap a subscription meal any time.",
  },
  {
    id: "kitchens",
    tag: "For kitchens",
    title: "Be good at cooking. ",
    accent: "We handle the rest",
    intro: "Tiffin services, cloud kitchens, restaurants and cafes can start selling with a phone number and an OTP.",
    items: [
      { t: "Reviewed, then live", d: "Add kitchen details, FSSAI licence, photos, bank details and one dish. Our team checks everything before you appear." },
      { t: "Run the day", d: "Live orders, menu, operating hours, a pause switch and a simple earnings dashboard." },
      { t: "Grow if you want", d: "Reels, Stories and optional Boost ads, with a daily AI suggestion. Core selling is never locked behind a plan." },
    ],
    note: "No FSSAI licence yet? We can file it for you for a flat Rs 500 service fee, plus the Rs 1,000 government fee passed through unchanged.",
  },
  {
    id: "business",
    tag: "Business model",
    title: "Kitchens ",
    accent: "keep the majority",
    intro: "FreshBhoj earns a commission on each order. Customers pay nothing extra for using the app.",
    items: [
      { t: "Commission", d: "A kitchen keeps most of every order. The exact split is still being finalized." },
      { t: "Optional growth tools", d: "Boost ads and Premium plans are extras a kitchen can choose, never a requirement." },
      { t: "Fair by design", d: "A kitchen should earn at least as much through FreshBhoj as selling the same food offline." },
    ],
    note: "We only grow when kitchens sell more to happy customers, so both sides winning is the model.",
  },
];

const FAQS = [
  { q: "What is FreshBhoj?", a: "A food-ordering app that connects customers with verified local kitchens, from tiffin services to restaurants and cafes." },
  { q: "What does Verified mean?", a: "Our team visits the kitchen and checks hygiene in person. A kitchen without the badge is not necessarily unsafe, it just has not been physically checked yet." },
  { q: "How do meal subscriptions work?", a: "Choose a kitchen's own plan or build your own. Once the kitchen accepts, you get a delivery calendar with pause, resume and vacation mode." },
  { q: "Does it cost customers extra?", a: "No. Browsing, ordering and subscribing cost nothing beyond the price of the food." },
];

export const metadata = {
  title: "How FreshBhoj works",
  description: "A short guide for customers and kitchens: how ordering, verified kitchens, subscriptions and the business model work.",
};

export default function InfoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3F8F8] text-[#0D1B1E] overflow-x-hidden">
      <Navbar />

      <header className="relative overflow-hidden bg-[linear-gradient(135deg,#0B4F6C_0%,#087F78_60%,#14ADA0_100%)] text-white pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#5EE6D0]/25 blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-5">
            How FreshBhoj <span className="italic text-[#FFC21A]" style={serif}>works</span>
          </h1>
          <p className="text-white/85 text-lg md:text-xl max-w-xl mx-auto">
            A plain guide for the people who order food and the kitchens that cook it.
          </p>
        </div>
      </header>

      <main className="flex-1">
        {BLOCKS.map((b, i) => (
          <section key={b.id} id={b.id} className={`py-20 md:py-28 ${i % 2 ? "bg-white" : ""}`}>
            <div className="max-w-6xl mx-auto px-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087F78] mb-4">{b.tag}</p>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.08] mb-4 max-w-2xl">
                {b.title}
                <span className="italic text-[#087F78]" style={serif}>{b.accent}</span>
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mb-12">{b.intro}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {b.items.map((it) => (
                  <div key={it.t} className="rounded-3xl bg-white border border-slate-100 shadow-[0_10px_30px_-18px_rgba(8,127,120,0.35)] p-7">
                    <h3 className="text-xl font-bold mb-2">{it.t}</h3>
                    <p className="text-slate-600 leading-relaxed">{it.d}</p>
                  </div>
                ))}
              </div>
              <p className="mt-10 max-w-2xl text-slate-600 border-l-4 border-[#FFC21A] pl-5">{b.note}</p>
            </div>
          </section>
        ))}

        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-12">
              Quick <span className="italic text-[#087F78]" style={serif}>answers</span>
            </h2>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {FAQS.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-lg [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden className="text-[#087F78] text-2xl leading-none transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-slate-600 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-[linear-gradient(135deg,#0B4F6C_0%,#087F78_60%,#14ADA0_100%)] text-white text-center">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Be first to <span className="italic text-[#FFC21A]" style={serif}>taste it</span>
            </h2>
            <p className="text-white/85 text-lg mb-8">Pre-register and we will tell you the day we reach your city.</p>
            <Link href="/pre-register?type=foodie" className="inline-flex rounded-full bg-[#FFC21A] text-[#0D1B1E] font-bold px-8 py-4 text-lg hover:scale-105 transition-transform">
              Pre-register
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
