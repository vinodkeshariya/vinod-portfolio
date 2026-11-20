import { getPosts } from "@/lib/blog";
import { sceneImage } from "@/lib/blog-scene-art";

/** The post's scene illustration on a transparent background — shown in the post hero (built at build time) */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPosts().find((p) => p.slug === slug);
  if (!post) return new Response("Not found", { status: 404 });
  return sceneImage(post.scene);
}
