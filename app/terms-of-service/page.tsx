import { Navbar, Footer } from "../Components";

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

      <header className="w-full pt-36 md:pt-40 pb-12 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087F78] mb-4">Legal</p>
          <h1 className="font-extrabold text-5xl md:text-6xl tracking-[-0.03em] leading-[1.05] text-[#0D1B1E] mb-4">Terms of Service</h1>
          <p className="text-slate-600 text-lg mb-3">Please read these terms before using FreshBhoj.</p>
          <p className="text-slate-500 text-sm font-medium">Last updated: March 17, 2026</p>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-6 py-14 md:py-20 flex-1">
        <nav aria-label="Contents" className="mb-14 rounded-2xl bg-[#F3F8F8] border border-slate-100 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Contents</p>
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[#087F78] font-semibold">
            {sections.map((s) => (
              <li key={s.number}><a href={`#section-${s.number}`} className="hover:underline">{s.number}. {s.title}</a></li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col gap-14">
          {sections.map((section) => (
            <section key={section.number} id={`section-${section.number}`} className="flex flex-col gap-5 scroll-mt-28">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0D1B1E]">{section.number}. {section.title}</h2>
              {section.content.map((para, i) => (
                <p key={i} className="text-slate-600 text-base md:text-lg leading-relaxed">{para}</p>
              ))}
              {section.bullets && (
                <ul className="list-disc pl-5 marker:text-[#087F78] space-y-3 text-slate-600 text-base md:text-lg leading-relaxed">
                  {section.bullets.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>

        <p className="mt-16 pt-8 border-t border-slate-100 text-slate-600 text-lg">
          Questions about these terms? Write to{" "}
          <a href="mailto:legal@freshbhoj.com" className="font-bold text-[#087F78] hover:underline">legal@freshbhoj.com</a>.
        </p>
      </main>

      <Footer />
    </div>
  );
}
