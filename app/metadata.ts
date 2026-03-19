import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "FreshBhoj – India’s First Reel-Based Food Discovery",
        template: "%s | FreshBhoj",
    },
    description:
        "Discover food through reels. Watch, explore kitchens, and order instantly with FreshBhoj – India’s first reel-based food discovery platform.",

    metadataBase: new URL("https://freshbhoj.com"),

    icons: {
        icon: [
            { url: "/icon.svg", type: "image/svg+xml" },
            { url: "/icon.svg" },
        ],
        shortcut: "/icon.svg",
        apple: "/icon.svg",
    },
    manifest: "/manifest.json",

    alternates: {
        canonical: "https://freshbhoj.com",
    },

    openGraph: {
        title: "FreshBhoj – Reel Based Food Discovery",
        description:
            "India's first reel-based food discovery platform. Discover, watch and order food instantly.",
        url: "https://freshbhoj.com",
        siteName: "FreshBhoj",
        images: [
            {
                url: "https://freshbhoj.com/og-image.jpg",
                width: 1200,
                height: 630,
            },
        ],
        locale: "en_IN",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "FreshBhoj – Reel Based Food Discovery",
        description:
            "Discover food through reels and order instantly.",
        images: ["https://freshbhoj.com/og-image.jpg"],
    },

    robots: {
        index: true,
        follow: true,
    },
};