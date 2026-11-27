import { getPosts } from "@/lib/blog";
import { getContent } from "@/lib/content";
import { sceneImage } from "@/lib/blog-scene-art";

/** The post's scene illustration on a transparent background — shown in the post hero (built at build time or on the first request, refreshed whenever the CMS changes) */
export const dynamic = "force-static";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, posts, { site }] = await Promise.all([params, getPosts(), getContent()]);
  const post = posts.find((p) => p.slug === slug);
  if (!post) return new Response("Not found", { status: 404 });
  return sceneImage(post.scene, site);
}
