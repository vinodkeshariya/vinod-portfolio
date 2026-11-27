import Link from "next/link";
import { Icon } from "@/components/Icon";
import { JsonLd, personRef } from "@/components/JsonLd";
import { LayersArt } from "@/components/PageArt";
import { CtaBand, MiniHead, PageHero } from "@/components/ui";
import { getContent } from "@/lib/content";
import type { IconName } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const generateMetadata = () => pageMeta({
  title: "AI Development & Next.js Services | Vinod Keshariya",
  description: "Explore AI integration, Claude Code development, Next.js, React, Sanity CMS, and WordPress migration services.",
  path: "/services",
});

const approachIcons: IconName[] = ["users", "pen", "spark", "shield", "check", "send"];
const packageIcons: IconName[] = ["bolt", "layers", "clock"];
const num = (i: number) => String(i + 1).padStart(2, "0");

function Points({ items, cols = "" }: { items: string[]; cols?: string }) {
  return (
    <ul className={`grid gap-2 ${cols}`}>
      {items.map((pt) => (
        <li key={pt} className="flex gap-2.5 text-[14px] text-ink-2">
          <Icon name="check" strokeWidth={2.8} className="mt-0.5 size-4 shrink-0 text-leaf" />
          {pt}
        </li>
      ))}
    </ul>
  );
}

function Tags({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="label-mono mr-1">{label}</span>
      {items.map((t) => (
        <span key={t} className="rounded-[6px] border border-line bg-surface-2 px-2 py-1 text-[12px] font-medium text-ink-2">
          {t}
        </span>
      ))}
    </div>
  );
}

function Discuss({ service }: { service: string }) {
  return (
    <Link href="/contact" className="group/link inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent">
      <span className="border-b-2 border-lime pb-0.5">
        Discuss this service<span className="sr-only">: {service}</span>
      </span>
      <Icon name="arrow" className="size-4 transition-transform duration-300 group-hover/link:translate-x-1" />
    </Link>
  );
}

export default async function ServicesPage() {
  const { approach, packages, process, services, site } = await getContent();
  const grid = services.slice(0, 6);
  const last = services[6];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": services.map((s) => ({
            "@type": "Service",
            name: s.title,
            serviceType: s.title,
            description: s.body,
            areaServed: "Worldwide",
            provider: personRef(site),
          })),
        }}
      />
      <PageHero
        eyebrow="Services"
        title={
          <>
            AI Development &amp; <span className="text-leaf">Modern Web Solutions.</span>
          </>
        }
        lead="I help businesses build intelligent digital experiences and high-performance websites using AI-assisted workflows and modern web technologies."
        aside={<LayersArt />}
      >
        <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
          <Link href="/contact" className="btn btn-primary min-h-13 px-7">
            Get a Project Quote <Icon name="arrow" />
          </Link>
          <a href="#service-1" className="btn btn-line min-h-13 px-7">
            Explore services
          </a>
        </div>
      </PageHero>

      {/* ============ SERVICES GRID ============ */}
      <section aria-label="Services" className="bg-paper pb-14 pt-4 md:pb-16">
        <div className="wrap">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {grid.map((s, i) => (
              <article
                key={s.title}
                id={`service-${i + 1}`}
                data-reveal
                data-delay={(i % 3) * 90}
                className="tile tile-hover group flex scroll-mt-28 flex-col gap-4 p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-[14px] bg-accent text-lime transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-6">
                    <Icon name={s.icon} className="size-5.5" />
                  </span>
                  <span aria-hidden="true" className="font-display text-[15px] font-bold text-accent/40 transition-colors group-hover:text-leaf">{num(i)}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-[19px] font-bold leading-snug tracking-[-0.02em] text-ink">{s.title}</h2>
                  <p className="text-[14.5px] leading-relaxed text-muted">{s.body}</p>
                </div>
                <Points items={s.points} />
                <div className="mt-auto flex flex-col gap-4 border-t border-line pt-4">
                  <Tags label={s.tagsLabel ?? "Tech"} items={s.tags} />
                  <Discuss service={s.title} />
                </div>
              </article>
            ))}
          </div>

          {/* 07 — full-width row */}
          <article
            id="service-7"
            data-reveal
            className="tile tile-hover group mt-5 grid scroll-mt-28 gap-6 p-6 md:p-7 lg:grid-cols-[1.1fr_1.3fr_auto] lg:items-center lg:gap-10"
          >
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-accent text-lime transition-transform duration-300 group-hover:-rotate-6">
                <Icon name={last.icon} className="size-5.5" />
              </span>
              <div className="flex flex-col gap-1.5">
                <span aria-hidden="true" className="font-display text-[15px] font-bold text-accent/40">07</span>
                <h2 className="text-[19px] font-bold leading-snug tracking-[-0.02em] text-ink">{last.title}</h2>
                <p className="text-[14.5px] leading-relaxed text-muted">{last.body}</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Points items={last.points} cols="sm:grid-cols-2" />
              <Tags label={last.tagsLabel ?? "Tech"} items={last.tags} />
            </div>
            <Discuss service={last.title} />
          </article>
        </div>
      </section>

      {/* ============ ENGAGEMENT MODELS ============ */}
      <section className="bg-paper pb-14 md:pb-16">
        <div className="wrap">
          <div data-reveal>
            <MiniHead text="Every project gets a clear scope and estimate before work starts.">Engagement Models</MiniHead>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {packages.map((p, i) => (
              <div
                key={p.title}
                data-reveal
                data-delay={i * 100}
                className={`tile tile-hover group flex flex-col gap-4 p-6 ${p.featured ? "border-accent-line ring-1 ring-accent-line" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className="icon-tile transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-lime">
                    <Icon name={packageIcons[i]} className="size-4.5" />
                  </span>
                  <div>
                    <h3 className="text-[18px] font-bold text-ink">{p.title}</h3>
                    {p.featured ? (
                      <span className="mt-0.5 inline-block rounded-full bg-lime px-2 py-0.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-accent">
                        {p.name}
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-faint">{p.name}</span>
                    )}
                  </div>
                </div>
                <p className="text-[14.5px] leading-relaxed text-muted">{p.text}</p>
                <Points items={p.points} />
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4 text-[14px]">
                  <strong className="text-ink">{p.price}</strong>
                  <Link href="/contact" className={`btn btn-sm ${p.featured ? "btn-primary" : "btn-line"}`}>
                    Enquire<span className="sr-only"> about {p.title}</span> <Icon name="arrow" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DEVELOPMENT PROCESS ============ */}
      <section className="bg-paper pb-14 md:pb-16">
        <div className="wrap">
          <div data-reveal>
            <MiniHead text="AI speed with a human code review — clear steps, regular updates and a preview link at every stage.">
              My Development Process
            </MiniHead>
          </div>
          <ol data-reveal aria-label="Development approach" className="tile grid grid-cols-2 gap-y-6 p-6 sm:grid-cols-3 lg:grid-cols-6 lg:p-8">
            {approach.map((a, i) => (
              <li key={a} className="group relative flex flex-col items-center gap-3 px-2 text-center">
                {i < approach.length - 1 && (
                  <span aria-hidden="true" className="absolute left-[calc(50%+34px)] right-[calc(-50%+34px)] top-6 hidden items-center lg:flex">
                    <span className="h-px flex-1 border-t border-dashed border-line-2" />
                    <Icon name="arrow" className="size-3.5 text-faint" />
                  </span>
                )}
                <span className="grid size-12 place-items-center rounded-full border border-accent-line bg-accent-soft text-accent transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-lime">
                  <Icon name={approachIcons[i]} className="size-5" />
                </span>
                <span className="text-[14px] font-semibold leading-snug text-ink-2">{a}</span>
              </li>
            ))}
          </ol>

          <ol className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <li key={p.title} data-reveal data-delay={i * 90} className="tile tile-hover group flex flex-col gap-3 p-6">
                <span className="grid size-10 place-items-center rounded-full bg-accent font-display text-[15px] font-bold text-lime transition-colors duration-300 group-hover:bg-lime group-hover:text-accent">
                  {i + 1}
                </span>
                <h3 className="text-[18px] font-bold text-ink">{p.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand
        title="Let's Discuss Your Project."
        text="Share your project idea, design, or current website. I'll suggest the right solution and provide a clear estimate."
        primary={{ href: "/contact", label: "Get a Project Quote" }}
      />
    </>
  );
}
