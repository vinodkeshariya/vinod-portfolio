import Link from "next/link";
import { BlogGrid } from "@/components/BlogGrid";
import { Icon } from "@/components/Icon";
import { JsonLd, abs, personRef } from "@/components/JsonLd";
import { ArticlesArt } from "@/components/PageArt";
import { CtaBand, PageHero } from "@/components/ui";
import { getPosts } from "@/lib/blog";
import { getContent } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata() {
  const meta = await pageMeta({
    title: "Blog | AI-Powered Web Development — Vinod Keshariya",
    description:
      "Practical articles on adding AI to websites, AI-assisted development with Claude Code, Next.js, Sanity CMS and WordPress migration.",
    path: "/blog",
  });
  return { ...meta, alternates: { ...meta.alternates, types: { "application/rss+xml": "/blog/rss.xml" } } };
}

export default async function BlogPage() {
  const [posts, { site }] = await Promise.all([getPosts(), getContent()]);

  return (
    <>
      {posts.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Blog",
            name: `${site.name} — Blog`,
            url: abs("/blog"),
            author: personRef(site),
            blogPost: posts.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: abs(`/blog/${p.slug}`),
              datePublished: p.date,
            })),
          }}
        />
      )}
      <PageHero
        eyebrow="Blog"
        title={
          <>
            Notes on <span className="text-leaf">AI‑powered web development.</span>
          </>
        }
        lead="Practical, no-hype articles on adding AI to websites, building faster with AI-assisted development, and modern Next.js, Sanity and WordPress work — based on hands-on project experience."
        aside={<ArticlesArt />}
      >
        <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
          <a href="#articles" className="btn btn-primary min-h-13 px-7">
            Read the articles <Icon name="arrow" />
          </a>
          <Link href="/contact" className="btn btn-line min-h-13 px-7">
            Discuss your project
          </Link>
        </div>
      </PageHero>

      <section id="articles" aria-label="Articles" className="scroll-mt-28 bg-paper pb-14 md:pb-16">
        <div className="wrap">
          <h2 className="sr-only">All articles</h2>
          {posts.length === 0 ? (
            <div data-reveal className="tile flex flex-col items-start gap-4 p-8">
              <span className="eyebrow">Coming soon</span>
              <p className="max-w-[560px] text-[16px] leading-relaxed text-ink-2">
                The first articles are being written. Meanwhile, have a look at my work or tell me about your project.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/projects" className="btn btn-line">
                  See my work
                </Link>
                <Link href="/contact" className="btn btn-primary">
                  Let&apos;s talk <Icon name="arrow" />
                </Link>
              </div>
            </div>
          ) : (
            <BlogGrid posts={posts} />
          )}
        </div>
      </section>

      <CtaBand
        title="Want AI in Your Website?"
        text="Tell me what you'd like your website to do. I'll suggest a practical approach, timeline and estimate."
        primary={{ href: "/contact", label: "Discuss your project" }}
        secondary={{ href: "/services", label: "View services" }}
      />
    </>
  );
}
