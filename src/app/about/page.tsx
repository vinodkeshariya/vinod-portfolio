import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProfileCard } from "@/components/ProfileCard";
import { CtaBand, PageHero, SectionHead } from "@/components/ui";
import { certifications, education, experience, principles, projects, site, skillCards } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "AI-powered Next.js developer in Ahmedabad — Figma and WordPress to fast Next.js + Sanity websites.",
};

const shots = [projects[3], projects[4], projects[2], projects[0]];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "About" }]}
        eyebrow="About me"
        title={<>Fast websites, built with <span className="text-accent">care and craft.</span></>}
        lead="I'm Vinod — an AI-powered Next.js developer in Ahmedabad. I build fast websites your team can edit, from Figma designs or existing WordPress sites."
        aside={<ProfileCard />}
      >
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href="/contact" className="btn btn-primary">Work with me <Icon name="arrow" /></Link>
          <a href={site.resume} download className="btn btn-ghost">Download résumé <Icon name="download" /></a>
        </div>
      </PageHero>

      {/* Story + work snapshot */}
      <section className="section">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div data-reveal className="flex flex-col gap-5">
            <span className="eyebrow">My story</span>
            <h2 className="h-section">Next.js engineering meets a practical AI workflow.</h2>
            <p className="text-[16.5px] leading-[1.75] text-ink-2">
              Since June 2023 I&apos;ve been a {experience.role} at {experience.company} — converting Figma and PSD designs into
              Next.js websites, setting up Sanity Studio, migrating WordPress sites while keeping their SEO, and maintaining live
              client websites.
            </p>
            <p className="text-[16.5px] leading-[1.75] text-ink-2">
              I use Claude and Claude Code every day to move faster — turning designs into components, writing schemas and
              migrating content — and I review and test every component myself before it ships.
            </p>
            <p className="text-[16.5px] leading-[1.75] text-ink-2">
              My B.A. in Geography from Gujarat University gave me a structured way of thinking about systems — the same mindset I
              now bring to content models and component architecture.
            </p>
            <Link href="/projects" className="mt-1 inline-flex items-center gap-2 font-semibold text-accent hover:text-accent-hover">
              See the work <Icon name="arrow" className="size-4" />
            </Link>
          </div>

          <div data-reveal data-delay={120} className="grid grid-cols-2 gap-4">
            {shots.map((p, i) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className={`group overflow-hidden rounded-[18px] border border-line bg-surface p-2 shadow-(--shadow-card) transition hover:-translate-y-1 hover:shadow-(--shadow-lift) ${
                  i % 2 === 1 ? "translate-y-8" : ""
                }`}
              >
                <div className="relative aspect-4/3 overflow-hidden rounded-[14px]" style={{ backgroundColor: p.tint }}>
                  <Image src={p.cover} alt={p.title} fill sizes="300px" className="object-cover object-left-top transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <p className="px-2 pb-1 pt-2.5 text-[13.5px] font-semibold">{p.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="section bg-surface">
        <div className="wrap">
          <SectionHead eyebrow="How I work" title="Four principles behind every project" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <div key={p.title} data-reveal data-delay={i * 90} className="flex flex-col gap-3.5 rounded-[18px] border border-line bg-paper p-7">
                <span className="icon-tile"><Icon name={p.icon} className="size-4.5" /></span>
                <h3 className="mt-1 text-[18px] font-bold">{p.title}</h3>
                <p className="text-[14.5px] text-muted">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills + background */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Expertise" title="Skills & background" action={{ href: "/experience", label: "Full experience" }} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {skillCards.map((g, i) => (
              <div key={g.title} data-reveal data-delay={i * 80} className="card p-6">
                <div className="flex items-center gap-3">
                  <span className="icon-tile"><Icon name={g.icon} className="size-4.5" /></span>
                  <h3 className="text-[16px] font-bold">{g.title}</h3>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {g.items.map((t) => (
                    <li key={t} className="rounded-full bg-surface-2 px-2.5 py-1 text-[12.5px] font-medium text-ink-2">{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div data-reveal className="card flex items-start gap-4 p-6">
              <span className="icon-tile"><Icon name="award" className="size-4.5" /></span>
              <div>
                <h3 className="text-[16px] font-bold">Certifications</h3>
                <p className="mt-1 text-[14.5px] text-muted">
                  {certifications.map((c) => `${c.title} (${c.issuer})`).join(" · ")}
                </p>
              </div>
            </div>
            <div data-reveal data-delay={100} className="card flex items-start gap-4 p-6">
              <span className="icon-tile"><Icon name="pin" className="size-4.5" /></span>
              <div>
                <h3 className="text-[16px] font-bold">{education.degree}</h3>
                <p className="mt-1 text-[14.5px] text-muted">{education.school} · {education.period}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Interested in working together?"
        text="Open for work — send your Figma file or website link and I'll reply within 0–4 hours."
        primary={{ href: "/contact", label: "Share your project" }}
        secondary={{ href: "/projects", label: "View projects" }}
      />
    </>
  );
}
