import { JsonLd, abs } from "@/components/JsonLd";
import { DeviceArt } from "@/components/PageArt";
import { ProjectGrid } from "@/components/ProjectGrid";
import { CtaBand, PageHero } from "@/components/ui";
import { rich } from "@/components/Rich";
import { getContent } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata() {
  const { seo } = (await getContent()).texts.work;
  return pageMeta({ title: seo.title, description: seo.description, path: "/projects" });
}

export default async function ProjectsPage() {
  const { projects, texts } = await getContent();
  const t = texts.work;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Portfolio projects",
          itemListElement: projects.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: abs(`/projects/${p.slug}`),
            name: p.title,
          })),
        }}
      />
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={rich(t.hero.title, { hl: "text-leaf" })}
        lead={t.hero.lead}
        aside={<DeviceArt />}
      />
      <section aria-label="Projects" className="bg-paper pb-14 pt-2 md:pb-16">
        <div className="wrap">
          <h2 className="sr-only">All projects</h2>
          <ProjectGrid projects={projects} labels={t.filters} />
        </div>
      </section>
      <CtaBand
        title={rich(t.cta.title)}
        text={rich(t.cta.text)}
        primary={{ href: "/contact", label: t.cta.primary }}
      />
    </>
  );
}
