import type { Metadata } from "next";
import { getContent } from "./content";

/**
 * Page metadata with a canonical URL and matching Open Graph / Twitter cards.
 * `title` is used as-is (no template suffix).
 *   export const generateMetadata = () => pageMeta({ title, description, path });
 */
export async function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Promise<Metadata> {
  const { site } = await getContent();
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
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${site.name} — ${site.role}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
  };
}
