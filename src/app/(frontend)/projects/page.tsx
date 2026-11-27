import { JsonLd, abs } from "@/components/JsonLd";
import { DeviceArt } from "@/components/PageArt";
import { ProjectGrid } from "@/components/ProjectGrid";
import { CtaBand, PageHero } from "@/components/ui";
import { projects } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Portfolio | Next.js, AI & Web Development",
  description: "Explore web development projects built with Next.js, React, Sanity CMS, WordPress, and modern technologies.",
  path: "/projects",
});

export default function ProjectsPage() {
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
        eyebrow="Work"
        title={
          <>
            A Collection of Websites &amp; <span className="text-leaf">Digital Experiences.</span>
          </>
        }
        lead="I work on modern web development projects, CMS solutions, website migrations, and AI-related product interfaces. Explore some of my work built with Next.js, React, Sanity CMS, and WordPress."
        aside={<DeviceArt />}
      />
      <section aria-label="Projects" className="bg-paper pb-14 pt-2 md:pb-16">
        <div className="wrap">
          <h2 className="sr-only">All projects</h2>
          <ProjectGrid />
        </div>
      </section>
      <CtaBand
        title="Interested in Working Together?"
        text="Have a similar project? Let's discuss your requirements."
        primary={{ href: "/contact", label: "Start a Project" }}
      />
    </>
  );
}
