import type { Metadata } from "next";
import { Inter } from "next/font/google";
import cn from "classnames";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://blog.almadih.dev"),
  title: {
    default: "Mohamed Almadih — Engineering Journal",
    template: "%s | Mohamed Almadih",
  },
  description:
    "Technical notes and deep dives on distributed systems, databases, asynchronous architectures, and modern web performance by Mohamed Almadih.",
  keywords: [
    "Mohamed Almadih",
    "systems engineering",
    "distributed systems",
    "PostgreSQL",
    "Next.js",
    "Python",
    "Celery",
    "software architecture",
    "web performance",
  ],
  authors: [{ name: "Mohamed Almadih", url: "https://blog.almadih.dev" }],
  creator: "Mohamed Almadih",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blog.almadih.dev",
    siteName: "Mohamed Almadih — Engineering Journal",
    title: "Mohamed Almadih — Engineering Journal",
    description:
      "Technical notes and deep dives on distributed systems, databases, asynchronous architectures, and modern web performance.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed Almadih — Engineering Journal",
    description:
      "Technical notes and deep dives on distributed systems, databases, asynchronous architectures, and modern web performance.",
    creator: "@almadih_desu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "./",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://blog.almadih.dev/#website",
      url: "https://blog.almadih.dev",
      name: "Mohamed Almadih — Engineering Journal",
      description:
        "Technical notes and deep dives on distributed systems, databases, asynchronous architectures, and modern web performance.",
      publisher: {
        "@id": "https://blog.almadih.dev/#person",
      },
    },
    {
      "@type": "Person",
      "@id": "https://blog.almadih.dev/#person",
      name: "Mohamed Almadih",
      url: "https://blog.almadih.dev",
      jobTitle: "Software Engineer",
      sameAs: [
        "https://github.com/almadih",
        "https://twitter.com/almadih_desu",
        "https://linkedin.com/in/almadih",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#09090b" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-[#09090b] text-zinc-100 antialiased"
        )}
      >
        <div className="relative min-h-screen flex flex-col justify-between">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
