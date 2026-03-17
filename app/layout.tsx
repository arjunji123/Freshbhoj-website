import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreshBhoj | India's First Reel-Based Food Discovery",
  description: "Discover authentic local food through immersive reels. FreshBhoj connects you with the best home kitchens and street gems.",
  icons: {
    icon: "/icon.svg?v=2",
    apple: "/icon.svg?v=2",
    shortcut: "/icon.svg?v=2",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg?v=2" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg?v=2" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
