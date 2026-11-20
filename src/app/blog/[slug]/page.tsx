import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { JsonLd, abs, personRef } from "@/components/JsonLd";
import { PostCard } from "@/components/PostCard";
import { PostView } from "@/components/PostView";
import { CtaBand, MiniHead } from "@/components/ui";
import { coverOf, getPost, getPosts, pillars } from "@/lib/blog";
import { site } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

/** Only the posts that exist at build time; anything else is a 404 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPosts().find((p) => p.slug === slug);
  if (!post) return {};
  const title = `${post.title} | ${site.name}`;
  return {
    title: { absolute: title },
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}`, types: { "application/rss+xml": "/blog/rss.xml" } },
    openGraph: {
      type: "article",
      siteName: site.name,
      url: `/blog/${post.slug}`,
      title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [site.url],
      tags: post.tags,
      // image: the generated ./opengraph-image (branded cover with the post title)
    },
    twitter: { card: "summary_large_image", title, description: post.description },
    ...(post.draft && { robots: { index: false } }),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const pillar = pillars[post.pillar];
  const cover = coverOf(post);
  const more = getPosts()
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.pillar === post.pillar) - Number(a.pillar === post.pillar))
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              headline: post.title,
              description: post.description,
              url: abs(`/blog/${post.slug}`),
              mainEntityOfPage: abs(`/blog/${post.slug}`),
              image: abs(cover.src),
              datePublished: post.date,
              dateModified: post.updated ?? post.date,
              keywords: post.tags.join(", "),
              articleSection: pillar.label,
              author: personRef,
              publisher: personRef,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
                { "@type": "ListItem", position: 2, name: "Blog", item: abs("/blog") },
                { "@type": "ListItem", position: 3, name: post.title, item: abs(`/blog/${post.slug}`) },
              ],
            },
          ],
        }}
      />
      <PostView post={post} />

      {more.length > 0 && (
        <section aria-labelledby="more-title" className="bg-paper pb-14 md:pb-16">
          <div className="wrap">
            <div data-reveal className="flex flex-wrap items-end justify-between gap-4">
              <MiniHead>
                <span id="more-title">Keep reading</span>
              </MiniHead>
              <Link href="/blog" className="btn btn-line mb-7 px-6">
                All articles <Icon name="arrow" />
              </Link>
            </div>
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {more.map((p, i) => (
                <li key={p.slug} data-reveal data-delay={i * 90}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand
        title="Have a Project in Mind?"
        text="Share your idea, design or current website. I'll reply with a practical approach, timeline and estimate — usually within 0–4 hours."
        primary={{ href: "/contact", label: "Let's talk" }}
        secondary={{ href: "/blog", label: "More articles" }}
      />
    </>
  );
}
