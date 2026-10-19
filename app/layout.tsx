import "./globals.css";
import { Plus_Jakarta_Sans, Bricolage_Grotesque, Instrument_Serif, Tiro_Devanagari_Hindi, Hind } from "next/font/google";
import { SplashScreen } from "./Components";
export { metadata } from "./metadata";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });

// Devanagari: Tiro for display accents (pairs with Instrument Serif italic), Hind as the readable body fallback for Hindi text
const deva = Tiro_Devanagari_Hindi({ subsets: ["devanagari", "latin"], weight: "400", style: ["normal", "italic"], variable: "--font-deva", display: "swap" });
const hind = Hind({ subsets: ["devanagari", "latin"], weight: ["500", "600", "700"], variable: "--font-hind", display: "swap" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${bricolage.variable} ${instrument.variable} ${deva.variable} ${hind.variable}`}>
      <body className="font-sans antialiased">

        {/* ✅ Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "FreshBhoj",
              url: "https://freshbhoj.com",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://freshbhoj.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        <SplashScreen />
        {children}
      </body>
    </html>
  );
}