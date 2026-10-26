import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "./_components/header";

export default function NotFound() {
  return (
    <>
      <Header />

      <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 max-w-3xl flex-1 flex flex-col items-center justify-center text-center">
        <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6">
          Error 404
        </span>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
          Page not found
        </h1>

        <p className="text-zinc-400 text-base max-w-md mb-8 leading-relaxed">
          The page or article you are looking for doesn&apos;t exist or may have been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-zinc-100 text-sm font-medium border border-white/[0.1] active:scale-95 transition-all group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </main>

      <footer className="border-t border-white/[0.08] py-8 text-center text-xs text-zinc-400 font-mono">
        Mohamed Almadih — Engineering Journal
      </footer>
    </>
  );
}
