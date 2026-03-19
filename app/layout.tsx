import "./globals.css";
import { SplashScreen } from "./Components";
export { metadata } from "./metadata";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

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