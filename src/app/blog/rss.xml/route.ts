import { getPosts } from "@/lib/blog";
import { site } from "@/lib/data";

export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);

/** RSS feed of published posts — lets readers and tools (Feedly, LinkedIn schedulers, etc.) follow the blog */
export function GET() {
  const posts = getPosts().filter((p) => !p.draft);
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${site.url}/blog/${p.slug}</link>
      <guid isPermaLink="true">${site.url}/blog/${p.slug}</guid>
      <pubDate>${new Date(`${p.date}T09:00:00+05:30`).toUTCString()}</pubDate>
      <description>${esc(p.description)}</description>
${p.tags.map((t) => `      <category>${esc(t)}</category>`).join("\n")}
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} — Blog</title>
    <link>${site.url}/blog</link>
    <atom:link href="${site.url}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Practical articles on AI-powered web development, Next.js, Sanity CMS and WordPress migration.</description>
    <language>en</language>
${posts[0] ? `    <lastBuildDate>${new Date(`${posts[0].date}T09:00:00+05:30`).toUTCString()}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
