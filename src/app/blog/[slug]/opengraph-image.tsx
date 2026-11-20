import { getPosts } from "@/lib/blog";
import { coverImage } from "@/lib/blog-scene-art";
import { defaultScenes } from "@/lib/blog-meta";
import { site } from "@/lib/data";

/**
 * Branded cover for every blog post (1200×630): title on the left, the post's own scene on the right.
 * Used as the social-share image, and as the post's cover on the site when it has no `cover` of its own.
 */
export const alt = `${site.name} — blog article`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPosts().find((p) => p.slug === slug);
  if (!post) return coverImage({ title: `${site.name} — Blog`, pillar: "ai-development", scene: defaultScenes["ai-development"] });
  return coverImage({ title: post.title, pillar: post.pillar, scene: post.scene });
}
