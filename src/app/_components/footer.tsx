import Link from "next/link";

const links = [
  { href: "https://github.com/almadih", label: "GitHub" },
  { href: "https://x.com/almadih_desu", label: "Twitter / X" },
  { href: "https://linkedin.com/in/almadih", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-zinc-950/60 mt-16 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p className="flex items-center space-x-2">
            <span className="font-mono font-medium text-zinc-300">
              Mohamed Almadih
            </span>
            <span aria-hidden="true">—</span>
            <span>Engineering Journal</span>
          </p>

          <nav aria-label="Footer">
            <ul className="flex items-center space-x-4">
              <li>
                <Link
                  href="/about"
                  className="inline-block p-2 hover:text-zinc-200 transition-colors"
                >
                  About
                </Link>
              </li>
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block p-2 hover:text-zinc-200 transition-colors"
                  >
                    {link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/feed.xml"
                  className="inline-block p-2 hover:text-zinc-200 transition-colors"
                >
                  RSS
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
