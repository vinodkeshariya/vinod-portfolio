import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Chips, CtaBand, PageHero, TickList } from "@/components/ui";
import { projects, site } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
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

const sections = [
  { id: "overview", label: "Overview" },
  { id: "challenge", label: "The challenge" },
  { id: "approach", label: "Approach" },
  { id: "features", label: "Key features" },
  { id: "gallery", label: "Gallery" },
  { id: "tech", label: "Technologies" },
];

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const prev = projects[index - 1];
  const next = projects[index + 1];
  const [first, ...titleRest] = project.title.split(" ");
  const desktopShots = project.gallery.filter((g) => g.device === "desktop");
  const mobileShots = project.gallery.filter((g) => g.device === "mobile");

  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { href: "/projects", label: "Work" }, { label: project.title }]}
        eyebrow={`Case study · ${project.category}`}
        title={<>{first} <span className="text-accent">{titleRest.join(" ")}</span></>}
        lead={project.tagline}
      >
        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-line bg-line md:grid-cols-4">
          {[
            ["Client", project.client],
            ["Role", project.role],
            ["Stack", project.stack],
            ["Year", project.year],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1.5 bg-surface px-5 py-4">
              <dt className="label-mono">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      {/* Cover */}
      <section className="pt-14">
        <div className="wrap">
          <div data-reveal className="relative aspect-16/10 overflow-hidden rounded-[18px] border border-line-2 bg-surface shadow-(--shadow-lift)">
            <Image src={project.cover} alt={`${project.title} — homepage`} fill priority sizes="(min-width: 1200px) 1152px, 100vw" className="object-cover object-top" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid items-start gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-[72px]">
          <nav aria-label="On this page" className="sticky top-28 hidden flex-col border-l border-line-2 lg:flex">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="-ml-px border-l border-transparent py-2 pl-4 text-[15px] text-muted transition-colors hover:border-accent hover:text-ink">
                {s.label}
              </a>
            ))}
          </nav>

          <div className="flex min-w-0 flex-col gap-[72px]">
            {[
              ["overview", "Overview", "Project overview", project.overview],
              ["challenge", "Challenge", "The challenge", project.challenge],
              ["approach", "Approach", "Approach & solution", project.approach],
            ].map(([id, eyebrow, title, text]) => (
              <div key={id} id={id} data-reveal className="flex scroll-mt-28 flex-col gap-4">
                <span className="eyebrow">{eyebrow}</span>
                <h2 className="text-[32px] font-bold">{title}</h2>
                <p className="text-[17px] leading-[1.75] text-ink-2">{text}</p>
              </div>
            ))}

            <div id="features" data-reveal className="flex scroll-mt-28 flex-col gap-5">
              <span className="eyebrow">Features</span>
              <h2 className="text-[32px] font-bold">Key features</h2>
              <TickList items={project.features} twoCol />
            </div>

            <div id="gallery" className="flex scroll-mt-28 flex-col gap-5">
              <span className="eyebrow">Gallery</span>
              <h2 className="text-[32px] font-bold">Screens</h2>
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
              <span className="eyebrow">Stack</span>
              <h2 className="text-[32px] font-bold">Technologies used</h2>
              <Chips items={project.tech} fill />
            </div>

            <nav aria-label="More projects" className="grid gap-4 sm:grid-cols-2">
              <Link href={prev ? `/projects/${prev.slug}` : "/projects"} className="card card-hover flex flex-col gap-1.5 p-7">
                <small className="label-mono">{prev ? "← Previous project" : "← Back"}</small>
                <strong className="font-display text-xl">{prev ? prev.title : "All projects"}</strong>
              </Link>
              <Link href={next ? `/projects/${next.slug}` : "/projects"} className="card card-hover flex flex-col gap-1.5 p-7 sm:text-right">
                <small className="label-mono">{next ? "Next project →" : "Back to →"}</small>
                <strong className="font-display text-xl">{next ? next.title : "All projects"}</strong>
              </Link>
            </nav>
          </div>
        </div>
      </section>

      <CtaBand title={project.ctaTitle} text={project.ctaText} primary={{ href: "/contact", label: "Share your project" }} />
    </>
  );
}
