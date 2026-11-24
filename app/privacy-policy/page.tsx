import { Navbar, Footer } from "../Components";

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
        items: ["Name and Contact Data", "Credentials", "Payment Data"],
      },
      {
        title: "Automatically Collected",
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
    rights: ["Request Access", "Request Erasure", "Object to Processing", "Data Portability"],
  }
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <header className="w-full pt-36 md:pt-40 pb-12 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087F78] mb-4">Legal</p>
          <h1 className="font-extrabold text-5xl md:text-6xl tracking-[-0.03em] leading-[1.05] text-[#0D1B1E] mb-4">Privacy Policy</h1>
          <p className="text-slate-600 text-lg mb-3">Your privacy is our responsibility. Below is what we collect and why.</p>
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
                <p key={i} className="text-slate-600 text-base md:text-lg leading-relaxed whitespace-pre-line">{para}</p>
              ))}

              {section.cards && (
                <div className="grid gap-6 sm:grid-cols-2">
                  {section.cards.map((card) => (
                    <div key={card.title}>
                      <h3 className="font-extrabold text-[#0D1B1E] mb-2">{card.title}</h3>
                      <ul className="list-disc pl-5 marker:text-[#087F78] text-slate-600 leading-relaxed space-y-1">
                        {card.items.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {section.points && (
                <ul className="list-disc pl-5 marker:text-[#087F78] space-y-4 text-slate-600 text-base md:text-lg leading-relaxed">
                  {section.points.map((point, i) => (
                    <li key={i}><span className="font-bold text-[#0D1B1E]">{point.bold}</span> {point.text}</li>
                  ))}
                </ul>
              )}

              {section.rights && (
                <ul className="list-disc pl-5 marker:text-[#087F78] space-y-1 text-slate-600 text-base md:text-lg">
                  {section.rights.map((r) => <li key={r}>{r}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>

        <p className="mt-16 pt-8 border-t border-slate-100 text-slate-600 text-lg">
          Questions about your privacy? Write to{" "}
          <a href="mailto:privacy@freshbhoj.com" className="font-bold text-[#087F78] hover:underline">privacy@freshbhoj.com</a>.
        </p>
      </main>

      <Footer />
    </div>
  );
}
