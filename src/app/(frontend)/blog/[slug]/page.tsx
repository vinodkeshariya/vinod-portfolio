import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { JsonLd, abs, personRef } from "@/components/JsonLd";
import { PostCard } from "@/components/PostCard";
import { PostView } from "@/components/PostView";
import { CtaBand, MiniHead } from "@/components/ui";
import { coverOf, getPost, getPosts, pillars } from "@/lib/blog";
import { rich } from "@/components/Rich";
import { getContent } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

/** Pages for the posts published at build time; posts published later in the CMS render on their first visit */
export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ slug }, posts, { site }] = await Promise.all([params, getPosts(), getContent()]);
  const post = posts.find((p) => p.slug === slug);
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
      // the generated branded cover (title + scene) — see ./cover.png/route.ts
      images: [{ url: `/blog/${post.slug}/cover.png`, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: "summary_large_image", title, description: post.description, images: [`/blog/${post.slug}/cover.png`] },
    ...(post.draft && { robots: { index: false } }),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, posts, { site, texts }] = await Promise.all([getPost(slug), getPosts(), getContent()]);
  const t = texts.blog.post;
  if (!post) notFound();

  const pillar = pillars[post.pillar];
  const cover = coverOf(post);
  const more = posts
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
              author: personRef(site),
              publisher: personRef(site),
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
                <span id="more-title">{t.more}</span>
              </MiniHead>
              <Link href="/blog" className="btn btn-line mb-7 px-6">
                {t.allArticles} <Icon name="arrow" />
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
        title={rich(t.cta.title)}
        text={rich(t.cta.text)}
        primary={{ href: "/contact", label: t.cta.primary }}
        secondary={{ href: "/blog", label: t.cta.secondary }}
      />
    </>
  );
}
