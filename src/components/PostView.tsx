import Link from "next/link";
import { formatDate, keepDash, pillars, type Post } from "@/lib/blog-meta";
import { getContent } from "@/lib/content";
import { rich } from "./Rich";
import { CaseNav } from "./CaseNav";
import { Icon } from "./Icon";
import { LogoMark } from "./Logo";
import { CoverFrameArt, SceneArt } from "./PageArt";
import { PageHero } from "./ui";

/**
 * A blog post's hero and body — shared by the live post page and the private review preview.
 * `sceneSrc` overrides the hero illustration (the review page passes a freshly drawn one).
 */
export async function PostView({ post, badge, sceneSrc }: { post: Post; badge?: React.ReactNode; sceneSrc?: string }) {
  const { site, texts } = await getContent();
  const t = texts.blog.post;
  const pillar = pillars[post.pillar];

  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { href: "/blog", label: "Blog" }, { label: post.title }]}
        eyebrow={pillar.label}
        title={keepDash(post.title)}
        lead={post.description}
        aside={post.cover ? <CoverFrameArt cover={post.cover} /> : <SceneArt src={sceneSrc ?? `/blog/${post.slug}/scene.png`} />}
      >
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-muted">
          <span className="font-semibold text-ink-2">{t.by} {site.name}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.updated && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                {t.updated} <time dateTime={post.updated}>{formatDate(post.updated)}</time>
              </span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes} {t.minRead}</span>
          {badge}
          {post.draft && !badge && <span className="rounded-full bg-lime px-2.5 py-0.5 text-[12px] font-semibold text-accent">Draft — not public</span>}
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
                  {rich(post.reviewed ? t.aiReviewed : t.aiUnreviewed, {
                    strong: "text-accent",
                    link: "font-semibold text-accent underline decoration-lime decoration-2 underline-offset-4",
                  })}
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
                  <LogoMark className="size-12 shrink-0" />
                  <span className="leading-tight">
                    <strong className="block text-[16px] text-ink">{site.name}</strong>
                    <small className="text-[13px] text-muted">{site.role}</small>
                  </span>
                </div>
                <p className="text-[14.5px] leading-relaxed text-muted">
                  {t.authorBio}
                </p>
                <Link href="/about" className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent">
                  <span className="border-b-2 border-lime pb-0.5">{t.aboutLink}</span>
                  <Icon name="arrow" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
              <Link
                href={post.service}
                className="group flex flex-col justify-between gap-6 rounded-[16px] bg-accent p-6 text-white transition duration-300 hover:-translate-y-1 hover:bg-accent-hover"
              >
                <span className="flex flex-col gap-2">
                  <span className="font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-lime">{t.relatedService}</span>
                  <strong className="font-display text-[20px] leading-snug">
                    {post.service === pillar.service ? pillar.serviceLabel : t.helpFallback}
                  </strong>
                </span>
                <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold">
                  {t.viewService} <Icon name="arrow" className="size-4 text-lime transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
