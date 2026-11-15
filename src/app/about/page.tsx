import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { getAuthor } from "@/lib/author";
import { jsonLdScript } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Mohamed Almadih, a software engineer writing about distributed systems, background processing, PostgreSQL and edge apps.",
  alternates: { canonical: "/about" },
};

const projects = [
  {
    href: "/posts/building-hindsight-free-chess-game-review",
    label: "Hindsight, a free chess game review",
  },
  {
    href: "/posts/building-a-local-first-vscode-time-tracker",
    label: "A local-first VS Code time tracker",
  },
  {
    href: "/posts/bulk-rename-node-my-first-npm-package",
    label: "bulk-rename-node, my first npm package",
  },
];

export default function About() {
  const author = getAuthor();
  const social = [
    { href: author.github, label: "GitHub" },
    { href: author.twitter, label: "X" },
    { href: author.linkedin, label: "LinkedIn" },
    { href: "https://almadih.dev", label: "almadih.dev" },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: "https://blog.almadih.dev/about",
    mainEntity: { "@id": "https://blog.almadih.dev/#person" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <Header />
      <main id="main-content" tabIndex={-1} className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="relative h-24 w-24 rounded-full ring-1 ring-white/10 overflow-hidden bg-zinc-800 mb-6">
            <Image
              src={author.picture}
              alt="Mohamed Almadih"
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
            About
          </h1>
          <div className="space-y-4 text-zinc-300 leading-relaxed">
            <p>
              I&apos;m Mohamed Almadih, a software engineer with 7 years of
              experience, currently a fullstack developer at Agilium, based in
              Khartoum, Sudan.
            </p>
            <p>
              I write about distributed systems, Python and Celery, async
              workflows, PostgreSQL, Laravel, and building apps with Next.js and
              Cloudflare Workers. This blog is my engineering journal: notes on
              what I build, what broke, and what I learned.
            </p>
          </div>

          <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mt-12 mb-4">
            Projects
          </h2>
          <ul className="space-y-2 list-disc pl-5 text-zinc-300">
            {projects.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="underline hover:text-white">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mt-12 mb-4">
            Elsewhere
          </h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {social.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-2 text-zinc-300 underline hover:text-white"
                >
                  {l.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
