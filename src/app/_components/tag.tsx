import Link from "next/link";

export default function Tag({ tag }: { tag: string }) {
  return (
    <div>
      <div>
        <Link href={`/tags/${tag.toLowerCase()}`}>
          <span className="inline-flex items-center px-2 py-1 rounded-full capitalize text-xs font-medium bg-gray-800/90 text-white border border-white/20">
            {tag}
          </span>
        </Link>
      </div>
    </div>
  );
}
