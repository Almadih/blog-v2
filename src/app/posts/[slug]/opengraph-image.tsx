import { ImageResponse } from "next/og";
import { getAllPosts, getPublishedPostBySlug } from "@/lib/api";

export const alt = "Blog post cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPublishedPostBySlug(slug);
  const title = post?.title ?? "Mohamed Almadih — Engineering Journal";
  const tags = (post?.tags ?? []).slice(0, 4);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09090b",
          color: "#f4f4f5",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 20,
            fontSize: 28,
            color: "#a1a1aa",
            fontFamily: "monospace",
          }}
        >
          {tags.map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 70 ? 52 : 68,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: -1.5,
            color: "#fafafa",
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#a1a1aa" }}>
          blog.almadih.dev · Mohamed Almadih
        </div>
      </div>
    ),
    size
  );
}
