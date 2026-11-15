/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 2678400,
  },
  async redirects() {
    const r = (source, destination) => ({ source, destination, permanent: true });
    return [
      r("/posts/conver-sync-code-to-async-python", "/posts/convert-sync-code-to-async-python"),
      r("/posts/background-processing-nexjts-inngest", "/posts/background-processing-nextjs-inngest"),
      r("/posts/nextjs-severside-component-search-params-data-fetching", "/posts/nextjs-server-side-component-search-params-data-fetching"),
      r("/posts/distribute-work-between-multiple-queues-in-celery", "/posts/celery-dynamic-thread-count"),
      r("/tags/cloudflare", "/tags/cloudflare-workers"),
      r("/tags/asyncio", "/tags/async"),
      r("/tags/google-cloud", "/tags/cloud-functions"),
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
