import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // images uploaded through Payload live in Vercel Blob
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    // the site and the Payload admin each have their own root layout, so unknown URLs use app/global-not-found.tsx
    globalNotFound: true,
  },
  // Blog posts are read from /content/blog at render time; ship them with every server function
  outputFileTracingIncludes: {
    "/*": ["./content/blog/**/*.md"],
    "/api/assistant": ["./content/blog/**/*.md"], // the assistant can point visitors to articles
    // fonts for the generated blog cover / scene images (also drawn at request time on the review page)
    "/blog/**": ["./node_modules/@fontsource/manrope/files/manrope-latin-{600,800}-normal.woff", "./public/images/vinod-photo-round.png"],
  },
};

export default withPayload(nextConfig);
