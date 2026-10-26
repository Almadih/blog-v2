import type { Metadata } from "next";
import { Inter } from "next/font/google";
import cn from "classnames";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Mohamed Almadih — Engineering Journal",
    template: "%s | Mohamed Almadih",
  },
  description:
    "Technical notes and deep dives on distributed systems, databases, asynchronous architectures, and modern web performance by Mohamed Almadih.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
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
