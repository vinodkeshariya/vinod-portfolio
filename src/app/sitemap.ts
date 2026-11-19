import type { MetadataRoute } from "next";
import { nav, projects, site } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [...nav.map((n) => n.href), "/hire-me", ...projects.map((p) => `/projects/${p.slug}`)];
  return pages.map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
