import { getPosts } from "@/lib/blog";
import { getContent } from "@/lib/content";
import { coverImage } from "@/lib/blog-scene-art";

/**
 * Branded cover for every blog post (1200×630): title on the left, the post's own scene on the right.
 * Served at a fixed URL — /blog/<slug>/cover.png — used as the social-share image and on post cards.
 * Built at build time (posts published later: on the first request), refreshed whenever the CMS changes.
 */
export const dynamic = "force-static";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, posts, { site }] = await Promise.all([params, getPosts(), getContent()]);
  const post = posts.find((p) => p.slug === slug);
  if (!post) return new Response("Not found", { status: 404 });
  return coverImage({ title: post.title, pillar: post.pillar, scene: post.scene, author: site });
}
