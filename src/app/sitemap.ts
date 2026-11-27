import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { nav, projects, site } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts().filter((p) => !p.draft);
  // nav already includes /blog; a Set keeps every URL once
  const pages = [...new Set<string>([...nav.map((n) => n.href), "/hire-me", ...projects.map((p) => `/projects/${p.slug}`)])];
  return [
    ...pages.map((path) => ({
      url: `${site.url}${path === "/" ? "" : path}`,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: p.updated ?? p.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
