import type { Metadata } from "next";
import { Inter } from "next/font/google";
import cn from "classnames";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `DevCraft`,
  description: `DevCraft is a technical blog focused on modern web development, system architecture, and engineering best practices.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
        <meta name="theme-color" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body
        className={cn(inter.className, "dark:bg-slate-900 dark:text-slate-400")}
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100">
          {/* Animated Background - UPDATED: Blob colors now match the new cyan/indigo theme. */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-2000" />
            <div className="absolute top-40 left-1/2 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-4000" />
          </div>
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
