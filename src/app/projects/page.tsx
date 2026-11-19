import { ImageStack } from "@/components/ImageStack";
import { ProjectGrid } from "@/components/ProjectGrid";
import { PageHero } from "@/components/ui";
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
      <PageHero
        aside={
          <ImageStack
            priority
            back={{ src: "/images/projects/fashion-catalog/cover.webp", alt: "Fashion store homepage" }}
            front={{ src: "/images/projects/business-wordpress/cover.webp", alt: "Construction company website" }}
            phone={{ src: "/images/projects/restaurant-menu/mobile-2.webp", alt: "Restaurant menu on mobile" }}
          />
        }
        crumbs={[{ href: "/", label: "Home" }, { label: "Projects" }]}
        eyebrow="Selected Work"
        title={<>A Collection of Websites &amp; <span className="text-accent">Digital Experiences.</span></>}
        lead="I work on modern web development projects, CMS solutions, website migrations, and AI-related product interfaces. Explore some of my work built with Next.js, React, Sanity CMS, and WordPress."
      >
        <dl className="mt-3 flex flex-wrap gap-x-10 gap-y-4">
          {[
            [String(projects.length), "Projects"],
            [String(projects.filter((p) => p.filters.includes("nextjs")).length), "Next.js + Sanity"],
            [String(projects.filter((p) => p.filters.includes("migration")).length), "Migration"],
            [String(projects.filter((p) => p.filters.includes("wordpress")).length), "WordPress"],
          ].map(([v, k]) => (
            <div key={k} className="flex flex-col-reverse">
              <dt className="text-[13px] text-muted">{k}</dt>
              <dd className="text-[28px] font-extrabold tracking-[-0.03em]">{v}</dd>
            </div>
          ))}
        </dl>
      </PageHero>
      <section className="py-10 md:py-15 lg:py-20">
        <div className="wrap">
          <ProjectGrid />
        </div>
      </section>
    </>
  );
}
