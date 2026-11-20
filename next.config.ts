import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Blog posts are read from /content/blog at render time; ship them with every server function
  outputFileTracingIncludes: {
    "/*": ["./content/blog/**/*.md"],
    // fonts for the generated blog cover / scene images (also drawn at request time on the review page)
    "/blog/**": ["./node_modules/@fontsource/manrope/files/manrope-latin-{600,800}-normal.woff"],
  },
};

export default nextConfig;
