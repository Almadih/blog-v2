import Link from "next/link";

export default function Tag({ tag }: { tag: string }) {
  return (
    <Link
      href={`/tags/${tag.toLowerCase()}`}
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono capitalize text-zinc-400 hover:text-zinc-100 bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.06] transition-colors active:scale-95"
    >
      #{tag}
    </Link>
  );
}
