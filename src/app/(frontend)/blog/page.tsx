import Link from "next/link";
import { BlogGrid } from "@/components/BlogGrid";
import { Icon } from "@/components/Icon";
import { JsonLd, abs, personRef } from "@/components/JsonLd";
import { ArticlesArt } from "@/components/PageArt";
import { CtaBand, PageHero } from "@/components/ui";
import { getPosts } from "@/lib/blog";
import { rich } from "@/components/Rich";
import { getContent } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata() {
  const { seo } = (await getContent()).texts.blog;
  const meta = await pageMeta({ title: seo.title, description: seo.description, path: "/blog" });
  return { ...meta, alternates: { ...meta.alternates, types: { "application/rss+xml": "/blog/rss.xml" } } };
}

export default async function BlogPage() {
  const [posts, { site, texts }] = await Promise.all([getPosts(), getContent()]);
  const t = texts.blog;

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
        eyebrow={t.hero.eyebrow}
        title={rich(t.hero.title, { hl: "text-leaf" })}
        lead={t.hero.lead}
        aside={<ArticlesArt />}
      >
        <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
          <a href="#articles" className="btn btn-primary min-h-13 px-7">
            {t.hero.primary} <Icon name="arrow" />
          </a>
          <Link href="/contact" className="btn btn-line min-h-13 px-7">
            {t.hero.secondary}
          </Link>
        </div>
      </PageHero>

      <section id="articles" aria-label="Articles" className="scroll-mt-28 bg-paper pb-14 md:pb-16">
        <div className="wrap">
          <h2 className="sr-only">All articles</h2>
          {posts.length === 0 ? (
            <div data-reveal className="tile flex flex-col items-start gap-4 p-8">
              <span className="eyebrow">{t.empty.eyebrow}</span>
              <p className="max-w-[560px] text-[16px] leading-relaxed text-ink-2">
                {t.empty.text}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/projects" className="btn btn-line">
                  {t.empty.work}
                </Link>
                <Link href="/contact" className="btn btn-primary">
                  {t.empty.contact} <Icon name="arrow" />
                </Link>
              </div>
            </div>
          ) : (
            <BlogGrid posts={posts} allLabel={t.filterAll} />
          )}
        </div>
      </section>

      <CtaBand
        title={rich(t.cta.title)}
        text={rich(t.cta.text)}
        primary={{ href: "/contact", label: t.cta.primary }}
        secondary={{ href: "/services", label: t.cta.secondary }}
      />
    </>
  );
}
