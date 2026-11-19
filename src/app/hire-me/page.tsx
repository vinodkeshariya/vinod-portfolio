import type { Metadata } from "next";
import { ImageStack } from "@/components/ImageStack";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CtaBand, PageHero, SectionHead } from "@/components/ui";
import { process, site, type IconName } from "@/lib/data";

export const metadata: Metadata = {
  title: "Hire Me",
  description: "Hire an AI-powered Next.js developer — Figma and WordPress to Next.js + Sanity, with on-time delivery and clear communication.",
};

const getItems: { icon: IconName; title: string; text: string }[] = [
  { icon: "layers", title: "Modern stack", text: "Next.js, React, Sanity CMS, TypeScript and Tailwind CSS — with WordPress and Elementor when that suits your team better." },
  { icon: "spark", title: "AI-assisted workflow", text: "Claude and Claude Code turn designs into components, write schemas and migrate content — every line is reviewed and tested by me." },
  { icon: "users", title: "Editable by your team", text: "Sanity Studio set up around your content, plus a walkthrough — so you never wait on a developer for text or images." },
];

const expect: { icon: IconName; title: string; text: string }[] = [
  { icon: "chat", title: "Transparent communication", text: "Regular updates and a clear timeline from day one." },
  { icon: "clock", title: "On-time delivery", text: "Realistic estimates and disciplined execution so deadlines are respected." },
  { icon: "shield", title: "Reliable quality", text: "Design fidelity, performance awareness and production-ready code." },
  { icon: "users", title: "Long-term thinking", text: "Solutions built to be extended and maintained, not just launched once." },
];

const areas = [
  "Figma to Next.js + Sanity",
  "WordPress to Next.js Migration",
  "Next.js Landing Pages",
  "Add Sanity CMS to Next.js",
  "WordPress & Elementor Websites",
  "AI Integration",
];

export default function HireMePage() {
  return (
    <>
      <PageHero
        aside={
          <ImageStack
            priority
            back={{ src: "/images/projects/creative-agency/cover.webp", alt: "Agency website" }}
            front={{ src: "/images/projects/ai-saas-landing/cover.webp", alt: "SaaS landing page" }}
            phone={{ src: "/images/projects/fashion-catalog/mobile-1.webp", alt: "Fashion store on mobile" }}
          />
        }
        crumbs={[{ href: "/", label: "Home" }, { label: "Hire Me" }]}
        eyebrow={
          <span className="inline-flex items-center gap-2.5 self-start rounded-full border border-line-2 bg-surface py-1.5 pl-3 pr-4 text-[13px] text-ink-2">
            <span className="dot dot-live" /> Open for work
          </span>
        }
        title={<>Looking for a <span className="text-accent">reliable Next.js developer?</span></>}
        lead="Fast Next.js + Sanity websites, built from your Figma design or migrated from WordPress — delivered quickly with an AI-powered workflow and clear communication throughout."
      >
        <div className="mt-1.5 flex flex-wrap gap-3.5">
          <Link href="/contact" className="btn btn-primary">Share your project <Icon name="arrow" /></Link>
          <Link href={site.socials.upwork} className="btn btn-ghost">View My Upwork Profile</Link>
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="What you get" title="Modern development expertise" />
          <div className="grid gap-5 lg:grid-cols-3">
            {getItems.map((g, i) => (
              <div key={g.title} data-reveal data-delay={i * 100} className="card card-hover flex flex-col gap-3.5 p-7">
                <span className="grid size-12 place-items-center rounded-[14px] bg-accent-soft text-accent">
                  <Icon name={g.icon} className="size-5.5" />
                </span>
                <h3 className="text-xl font-bold">{g.title}</h3>
                <p className="text-[15px] text-muted">{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-y border-line bg-paper-2">
        <div className="wrap">
          <SectionHead eyebrow="Process" title="How we work together" />
          <ol data-reveal className="grid gap-y-10 border-t border-line-2 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <li key={p.title} className="relative flex flex-col gap-3 pr-7 pt-8">
                <span aria-hidden="true" className="absolute -top-1.25 left-0 size-2.25 rounded-full bg-accent" />
                <span className="font-display text-[44px] font-bold leading-none text-accent">0{i + 1}</span>
                <h3 className="text-xl font-bold">{p.title}</h3>
                <p className="text-[15px] text-muted">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div data-reveal className="flex flex-col gap-3.5 lg:sticky lg:top-28">
            <span className="eyebrow">Why hire me</span>
            <h2 className="h-section">What clients can expect</h2>
            <p className="text-muted">Clear scope, honest timelines and code I stand behind.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {expect.map((e, i) => (
              <div key={e.title} data-reveal data-delay={i * 80} className="card flex flex-col gap-3 p-7">
                <Icon name={e.icon} className="size-6 text-accent" />
                <h3 className="text-lg font-bold">{e.title}</h3>
                <p className="text-[15px] text-muted">{e.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-y border-line bg-paper-2">
        <div className="wrap">
          <SectionHead eyebrow="Services summary" title="Areas of focus" action={{ href: "/services", label: "Service details" }} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((a, i) => (
              <Link key={a} href="/services" data-reveal data-delay={(i % 3) * 90} className="card card-hover group flex items-center justify-between gap-4 p-7">
                <span>
                  <span className="block font-display text-[30px] font-bold leading-none text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-3 block font-display text-xl font-bold">{a}</span>
                </span>
                <Icon name="arrowUpRight" className="size-5 shrink-0 text-faint transition group-hover:rotate-45 group-hover:text-accent" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to start?"
        text="Connect on Upwork or discuss the project directly — I'm ready to help."
        primary={{ href: "/contact", label: "Share your project" }}
        secondary={{ href: site.socials.upwork, label: "Upwork Profile" }}
      />
    </>
  );
}
