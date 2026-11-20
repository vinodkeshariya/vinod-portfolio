import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseNav } from "@/components/CaseNav";
import { Icon } from "@/components/Icon";
import { JsonLd, abs, personRef } from "@/components/JsonLd";
import { CoverFrameArt, PillarArt } from "@/components/PageArt";
import { PostCard } from "@/components/PostCard";
import { CtaBand, MiniHead, PageHero } from "@/components/ui";
import { coverOf, formatDate, getPost, getPosts, keepDash, pillars } from "@/lib/blog";
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
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { href: "/blog", label: "Blog" }, { label: post.title }]}
        eyebrow={pillar.label}
        title={keepDash(post.title)}
        lead={post.description}
        aside={post.cover ? <CoverFrameArt cover={post.cover} /> : <PillarArt pillar={post.pillar} />}
      >
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-muted">
          <span className="font-semibold text-ink-2">By {site.name}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.updated && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
              </span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes} min read</span>
          {post.draft && <span className="rounded-full bg-lime px-2.5 py-0.5 text-[12px] font-semibold text-accent">Draft — not public</span>}
        </p>
      </PageHero>

      <section className="bg-paper pb-14 md:pb-16">
        <div className={`wrap grid items-start gap-10 ${post.headings.length > 1 ? "lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-[72px]" : ""}`}>
          {post.headings.length > 1 && <CaseNav sections={post.headings} />}

          <div className="flex min-w-0 max-w-[760px] flex-col gap-10">
            <article className="article" dangerouslySetInnerHTML={{ __html: post.html }} />

            {post.aiAssisted && (
              <p className="flex items-start gap-3 rounded-[14px] border border-accent-line bg-accent-soft p-4 text-[14px] leading-relaxed text-ink-2">
                <Icon name="spark" className="mt-0.5 size-4.5 shrink-0 text-accent" />
                <span>
                  <strong className="text-accent">Drafted with AI, reviewed and edited by Vinod.</strong> I use AI the same way in client work: it
                  speeds up the first draft, and I check every fact and recommendation before it goes live.
                </span>
              </p>
            )}

            {post.tags.length > 0 && (
              <ul aria-label="Tags" className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <li key={t} className="rounded-[6px] border border-line bg-surface-2 px-2.5 py-1 text-[12.5px] font-medium text-ink-2">
                    {t}
                  </li>
                ))}
              </ul>
            )}

            {/* Author + related service */}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="tile flex flex-col gap-3 p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-full bg-accent font-display text-[16px] font-bold text-lime">
                    {site.initials}
                  </span>
                  <span className="leading-tight">
                    <strong className="block text-[16px] text-ink">{site.name}</strong>
                    <small className="text-[13px] text-muted">{site.role}</small>
                  </span>
                </div>
                <p className="text-[14.5px] leading-relaxed text-muted">
                  I build AI-powered websites and applications with Next.js, React and Sanity CMS — using AI tools to move faster, and my own
                  review to keep the quality high.
                </p>
                <Link href="/about" className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent">
                  <span className="border-b-2 border-lime pb-0.5">More about me</span>
                  <Icon name="arrow" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
              <Link
                href={post.service}
                className="group flex flex-col justify-between gap-6 rounded-[16px] bg-accent p-6 text-white transition duration-300 hover:-translate-y-1 hover:bg-accent-hover"
              >
                <span className="flex flex-col gap-2">
                  <span className="font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-lime">Related service</span>
                  <strong className="font-display text-[20px] leading-snug">
                    {post.service === pillar.service ? pillar.serviceLabel : "See how I can help"}
                  </strong>
                </span>
                <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold">
                  View service <Icon name="arrow" className="size-4 text-lime transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

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
