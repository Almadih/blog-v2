import { getAuthor } from "@/lib/author";
import { Github, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

export default function Author() {
  const author = getAuthor();
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 p-5 rounded-2xl bg-zinc-900/30 border border-white/[0.06] backdrop-blur-sm max-w-2xl mx-auto my-8">
      <div className="relative h-16 w-16 shrink-0 rounded-full ring-1 ring-white/10 overflow-hidden bg-zinc-800">
        <Image
          src={author.picture}
          alt={author.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
          <h3 className="font-semibold text-base text-zinc-100">
            {author.name}
          </h3>
          <span className="text-xs font-mono text-zinc-400">
            {author.title}
          </span>
        </div>
        <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
          {author.bio}
        </p>
        <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
          <a
            href={author.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn Profile"
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] rounded-md transition-colors"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href={author.twitter}
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter Profile"
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] rounded-md transition-colors"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <a
            href={author.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Profile"
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] rounded-md transition-colors"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
