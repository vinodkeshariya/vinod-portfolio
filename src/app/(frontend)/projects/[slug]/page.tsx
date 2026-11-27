import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseNav } from "@/components/CaseNav";
import { JsonLd, abs, personRef } from "@/components/JsonLd";
import { Chips, CtaBand, PageHero, TickList } from "@/components/ui";
import { getContent } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

/** Pages for the projects that exist at build time; projects added later in the CMS render on their first visit */
export async function generateStaticParams() {
  const { projects } = await getContent();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ slug }, { projects, site }] = await Promise.all([params, getContent()]);
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const title = `${project.title} — Case Study | ${site.name}`;
  return {
    title: { absolute: title },
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      siteName: site.name,
      url: `/projects/${project.slug}`,
      title,
      description: project.summary,
      images: [{ url: project.cover, width: 1440, height: 900, alt: project.title }],
    },
    twitter: { card: "summary_large_image", title, description: project.summary, images: [project.cover] },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const [{ slug }, { projects, site, texts }] = await Promise.all([params, getContent()]);
  const c = texts.work.caseStudy;
  const sections = (["overview", "challenge", "approach", "features", "gallery", "tech"] as const).map((id) => ({ id, label: c[id].nav }));
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const prev = projects[index - 1];
  const next = projects[index + 1];
  const [first, ...titleRest] = project.title.replace(/-/g, "‑").split(" ");
  const desktopShots = project.gallery.filter((g) => g.device === "desktop");
  const mobileShots = project.gallery.filter((g) => g.device === "mobile");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CreativeWork",
              name: project.title,
              headline: project.tagline,
              description: project.summary,
              url: abs(`/projects/${project.slug}`),
              image: abs(project.cover),
              dateCreated: project.year,
              keywords: project.tech.join(", "),
              creator: personRef(site),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
                { "@type": "ListItem", position: 2, name: "Work", item: abs("/projects") },
                { "@type": "ListItem", position: 3, name: project.title, item: abs(`/projects/${project.slug}`) },
              ],
            },
          ],
        }}
      />
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { href: "/projects", label: "Work" }, { label: project.title }]}
        eyebrow={`${c.eyebrow} ${project.category}`}
        title={<>{first} <span className="text-leaf">{titleRest.join(" ")}</span></>}
        lead={project.tagline}
      >
        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-line bg-line md:grid-cols-4">
          {[
            [c.client, project.client],
            [c.role, project.role],
            [c.stack, project.stack],
            [c.year, project.year],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1.5 bg-surface px-5 py-4">
              <dt className="label-mono">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* Cover */}
      <section className="bg-paper">
        <div className="wrap">
          <div data-reveal className="relative aspect-16/10 overflow-hidden rounded-[18px] border border-line-2 bg-surface shadow-(--shadow-lift)">
            <Image src={project.cover} alt={`${project.title} — homepage`} fill priority sizes="(min-width: 1200px) 1152px, 100vw" className="object-cover object-top" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid items-start gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-[72px]">
          <CaseNav sections={sections} />

          <div className="flex min-w-0 flex-col gap-[72px]">
            {[
              ["overview", c.overview.eyebrow, c.overview.title, project.overview],
              ["challenge", c.challenge.eyebrow, c.challenge.title, project.challenge],
              ["approach", c.approach.eyebrow, c.approach.title, project.approach],
            ].map(([id, eyebrow, title, text]) => (
              <div key={id} id={id} data-reveal className="flex scroll-mt-28 flex-col gap-4">
                <span className="eyebrow">{eyebrow}</span>
                <h2 className="text-[clamp(26px,3vw,32px)] font-bold text-accent">{title}</h2>
                <p className="text-[17px] leading-[1.75] text-ink-2">{text}</p>
              </div>
            ))}

            <div id="features" data-reveal className="flex scroll-mt-28 flex-col gap-5">
              <span className="eyebrow">{c.features.eyebrow}</span>
              <h2 className="text-[clamp(26px,3vw,32px)] font-bold text-accent">{c.features.title}</h2>
              <TickList items={project.features} twoCol />
            </div>

            <div id="gallery" className="flex scroll-mt-28 flex-col gap-5">
              <span className="eyebrow">{c.gallery.eyebrow}</span>
              <h2 className="text-[clamp(26px,3vw,32px)] font-bold text-accent">{c.gallery.title}</h2>
              {desktopShots.map((g) => (
                <figure key={g.src} data-reveal className="m-0">
                  <div className="relative aspect-16/10 overflow-hidden rounded-[18px] border border-line bg-surface">
                    <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1200px) 860px, 100vw" className="object-cover object-top" />
                  </div>
                  <figcaption className="mt-2.5 text-sm text-muted">{g.alt}</figcaption>
                </figure>
              ))}
              <div className="grid grid-cols-2 gap-4 rounded-[18px] bg-paper-2 p-4 sm:gap-6 sm:p-8">
                {mobileShots.map((g, i) => (
                  <figure key={g.src} data-reveal data-delay={i * 100} className="m-0">
                    <div className="relative mx-auto aspect-[390/844] w-full max-w-[300px] overflow-hidden rounded-[26px] border-[6px] border-night bg-night shadow-(--shadow-lift)">
                      <Image src={g.src} alt={g.alt} fill sizes="300px" className="object-cover object-top" />
                    </div>
                    <figcaption className="mt-3 text-center text-sm text-muted">{g.alt}</figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <div id="tech" data-reveal className="flex scroll-mt-28 flex-col gap-5">
              <span className="eyebrow">{c.tech.eyebrow}</span>
              <h2 className="text-[clamp(26px,3vw,32px)] font-bold text-accent">{c.tech.title}</h2>
              <Chips items={project.tech} fill />
            </div>

            <nav aria-label="More projects" className="grid gap-4 sm:grid-cols-2">
              <Link href={prev ? `/projects/${prev.slug}` : "/projects"} className="tile tile-hover flex flex-col gap-1.5 p-7">
                <small className="label-mono">{prev ? c.previous : c.back}</small>
                <strong className="font-display text-xl">{prev ? prev.title : c.all}</strong>
              </Link>
              <Link href={next ? `/projects/${next.slug}` : "/projects"} className="tile tile-hover flex flex-col gap-1.5 p-7 sm:text-right">
                <small className="label-mono">{next ? c.next : c.backTo}</small>
                <strong className="font-display text-xl">{next ? next.title : c.all}</strong>
              </Link>
            </nav>
          </div>
        </div>
      </section>

      <CtaBand title={project.ctaTitle} text={project.ctaText} primary={{ href: "/contact", label: c.cta }} />
    </>
  );
}
