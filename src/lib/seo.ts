import type { Metadata } from "next";
import { site } from "./data";

/**
 * Page metadata with a canonical URL and matching Open Graph / Twitter cards.
 * `title` is used as-is (no template suffix).
 */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      url: path,
      title,
      description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} — ${site.role}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}
