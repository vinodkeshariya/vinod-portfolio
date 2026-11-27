import Link from "next/link";
import { Icon } from "@/components/Icon";
import { JsonLd, personLd } from "@/components/JsonLd";
import { CodeTileArt } from "@/components/PageArt";
import { CtaBand, MiniHead, PageHero } from "@/components/ui";
import { paragraphs, plain, rich } from "@/components/Rich";
import { toList } from "@/lib/blog-check";
import { getContent } from "@/lib/content";
import type { IconName } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata() {
  const { seo } = (await getContent()).texts.about;
  return pageMeta({ title: seo.title, description: seo.description, path: "/about" });
}

export default async function AboutPage() {
  const content = await getContent();
  const { aboutFocus, certifications, experience, principles, site, texts, vars } = content;
  const t = texts.about;

  return (
    <>
      <JsonLd data={personLd(content)} />
      <PageHero
        eyebrow={plain(t.hero.eyebrow, vars)}
        title={rich(t.hero.title, { hl: "text-leaf", vars })}
        lead={plain(t.hero.lead, vars)}
        aside={<CodeTileArt />}
      >
        <p className="max-w-[560px] text-[15.5px] leading-relaxed text-muted">
          {plain(t.hero.intro, vars)}
        </p>
        <ul className="flex flex-wrap gap-2.5">
          {t.hero.facts.map((f) => (
            <li
              key={f.label}
              className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-surface px-3.5 py-2 text-[13.5px] font-medium text-ink-2"
            >
              <Icon name={f.icon} className="size-4 text-accent" /> {f.label}
            </li>
          ))}
        </ul>
        <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
          <Link href="/contact" className="btn btn-primary min-h-13 px-7">
            {t.hero.primary} <Icon name="arrow" />
          </Link>
          <a href={site.resume} download className="btn btn-line min-h-13 px-7">
            {t.hero.resume} <Icon name="download" />
          </a>
        </div>
      </PageHero>

      {/* ============ MY STORY ============ */}
      <section className="bg-paper py-14 md:py-16">
        <div className="wrap">
          <div data-reveal>
            <MiniHead>{t.story.title}</MiniHead>
            <p className="mb-8 max-w-[720px] font-display text-[clamp(22px,2.4vw,30px)] font-bold leading-[1.25] tracking-[-0.02em] text-ink">
              {rich(t.story.lead, { hl: "text-leaf", vars })}
            </p>
          </div>
          <div className="grid gap-x-14 gap-y-5 lg:grid-cols-2">
            <div data-reveal className="flex flex-col gap-5 text-[16px] leading-[1.75] text-ink-2">
              {paragraphs(t.story.left, vars).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div data-reveal data-delay={120} className="flex flex-col items-start gap-5 text-[16px] leading-[1.75] text-ink-2">
              {paragraphs(t.story.right, vars).map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p className="border-l-2 border-lime pl-4 font-medium text-ink">{plain(t.story.quote, vars)}</p>
              <Link href="/projects" className="group inline-flex items-center gap-2 font-semibold text-accent">
                {t.story.link} <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHAT I DO ============ */}
      <section className="bg-paper pb-14 md:pb-16">
        <div className="wrap">
          <div data-reveal className="flex flex-wrap items-end justify-between gap-4">
            <MiniHead text={plain(t.whatIDo.text, vars)}>{t.whatIDo.title}</MiniHead>
            <Link href="/services" className="btn btn-line mb-7 px-6">
              {t.whatIDo.button} <Icon name="arrow" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {aboutFocus.map((f, i) => (
              <article key={f.title} data-reveal data-delay={i * 90} className="tile tile-hover group flex flex-col gap-3 p-6">
                <span className="icon-tile transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-lime">
                  <Icon name={f.icon} className="size-4.5" />
                </span>
                <h3 className="mt-1 text-[18px] font-bold text-ink">{f.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-muted">{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PHILOSOPHY (forest band, like the home page) ============ */}
      <section aria-labelledby="philosophy-title" className="bg-paper">
        <div className="mx-auto w-full max-w-[1320px] sm:px-3">
          <div data-reveal className="bg-forest grid gap-10 px-5 py-12 sm:rounded-[20px] sm:px-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16 lg:py-14">
            <div className="flex flex-col items-start gap-5">
              <span className="flex items-center gap-3 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-white/80">
                <span className="h-0.5 w-7 rounded-full bg-lime" /> {t.philosophy.eyebrow}
              </span>
              <h2 id="philosophy-title" className="text-[clamp(28px,2.8vw,38px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-white">
                {rich(t.philosophy.title, { hl: "text-lime", vars })}
              </h2>
            </div>
            <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {principles.map((p) => (
                <div
                  key={p.title}
                  className="group relative flex flex-col gap-2 border-t border-white/15 pt-5 before:absolute before:-top-px before:left-0 before:h-px before:w-full before:origin-left before:scale-x-0 before:bg-lime before:transition-transform before:duration-500 hover:before:scale-x-100"
                >
                  <Icon name={p.icon} strokeWidth={1.8} className="size-6 text-lime" />
                  <h3 className="text-[17px] font-bold text-white transition-colors group-hover:text-lime">{p.title}</h3>
                  <p className="text-[14px] leading-relaxed text-night-muted">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ TECHNOLOGY STACK ============ */}
      <section className="bg-paper py-14 md:py-16">
        <div className="wrap">
          <div data-reveal className="flex flex-wrap items-end justify-between gap-4">
            <MiniHead>{t.stack.title}</MiniHead>
            <Link href="/experience" className="btn btn-line mb-7 px-6">
              {t.stack.button} <Icon name="arrow" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.stack.groups.map((g, i) => (
              <div key={g.title} data-reveal data-delay={i * 80} className="tile tile-hover group flex flex-col gap-3 p-6">
                <div className="flex items-center gap-3">
                  <span className="icon-tile transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-lime">
                    <Icon name={g.icon} className="size-4.5" />
                  </span>
                  <h3 className="text-[17px] font-bold text-ink">{g.title}</h3>
                </div>
                <p className="text-[14.5px] leading-relaxed text-muted">{toList(g.items).join(", ")}</p>
              </div>
            ))}
          </div>

          {/* Experience · Certifications */}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {[
              {
                icon: "briefcase" as IconName,
                title: t.stack.experienceTitle,
                body: (
                  <>
                    {experience.role} at {experience.company}
                    <br />
                    {experience.period}
                  </>
                ),
              },
              {
                icon: "award" as IconName,
                title: t.stack.certificationsTitle,
                body: (
                  <span className="flex flex-col gap-1">
                    {certifications.map((c) => (
                      <span key={c.title}>
                        {c.title} — {c.issuer}, {c.date}
                      </span>
                    ))}
                  </span>
                ),
              },
            ].map((c, i) => (
              <div key={c.title} data-reveal data-delay={i * 100} className="tile tile-hover group flex flex-col gap-3 p-6">
                <span className="grid size-12 place-items-center rounded-[14px] bg-accent text-lime transition-transform duration-300 group-hover:-rotate-6">
                  <Icon name={c.icon} className="size-5.5" />
                </span>
                <h3 className="mt-1 text-[18px] font-bold text-ink">{c.title}</h3>
                <div className="text-[14.5px] leading-relaxed text-muted">{c.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={rich(t.cta.title, { vars })}
        text={rich(t.cta.text, { vars })}
        primary={{ href: "/contact", label: t.cta.primary }}
        secondary={{ href: "/projects", label: t.cta.secondary }}
      />
    </>
  );
}
