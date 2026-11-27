import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { getContent } from "@/lib/content";
import { nav, siteUrl } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, { projects }] = await Promise.all([getPosts(), getContent()]);
  // nav already includes /blog; a Set keeps every URL once
  const pages = [...new Set<string>([...nav.map((n) => n.href), "/hire-me", ...projects.map((p) => `/projects/${p.slug}`)])];
  return [
    ...pages.map((path) => ({
      url: `${siteUrl}${path === "/" ? "" : path}`,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...posts.map((p) => ({
      url: `${siteUrl}/blog/${p.slug}`,
      lastModified: p.updated ?? p.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
