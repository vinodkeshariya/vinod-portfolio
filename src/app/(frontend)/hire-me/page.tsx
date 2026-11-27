import { HeroShowcase } from "@/components/HeroShowcase";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CtaBand, PageHero, SectionHead } from "@/components/ui";
import { ext, hasUpwork, process, services, site, type IconName } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Hire an AI + Next.js Developer | Vinod Keshariya",
  description:
    "Hire Vinod Keshariya, an AI-powered Full-Stack Developer for AI integrations, Next.js and React websites, Sanity CMS and WordPress migrations.",
  path: "/hire-me",
});

const getItems: { icon: IconName; title: string; text: string }[] = [
  { icon: "layers", title: "Modern stack", text: "Next.js, React, TypeScript, Tailwind CSS and Sanity CMS — with WordPress and Elementor when that suits your team better." },
  { icon: "spark", title: "AI-powered workflow", text: "Claude, Claude Code and ChatGPT help me plan, build, debug and test faster — every implementation is reviewed and tested by me." },
  { icon: "chat", title: "AI integration", text: "AI assistants, chat interfaces and intelligent search added to Next.js websites with suitable AI APIs." },
];

const expect: { icon: IconName; title: string; text: string }[] = [
  { icon: "chat", title: "Transparent communication", text: "Regular updates and a clear timeline from day one." },
  { icon: "clock", title: "On-time delivery", text: "Realistic estimates and disciplined execution so deadlines are respected." },
  { icon: "shield", title: "Reviewed quality", text: "AI speeds up the work; I review, debug and test every implementation before delivery." },
  { icon: "users", title: "Long-term thinking", text: "Solutions built to be extended and maintained, not just launched once." },
];

const areas = services.map((sv) => sv.title);

export default function HireMePage() {
  return (
    <>
      <PageHero
        aside={<HeroShowcase />}
        eyebrow="Hire Me · Open for work"
        title={<>Looking for an <span className="text-leaf">AI + Next.js developer?</span></>}
        lead="AI integrations, modern Next.js and React websites, Sanity CMS and WordPress migrations — built with an AI-powered workflow, reviewed by hand, with clear communication throughout."
      >
        <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
          <Link href="/contact" className="btn btn-primary min-h-13 px-7">Let&apos;s Build Your Project <Icon name="arrow" /></Link>
          {hasUpwork ? (
            <Link href={site.socials.upwork} {...ext(site.socials.upwork)} className="btn btn-line min-h-13 px-7">Hire Me on Upwork <Icon name="arrowUpRight" /></Link>
          ) : (
            <Link href="/projects" className="btn btn-line min-h-13 px-7">Explore My Work</Link>
          )}
        </div>
      </PageHero>

      {/* ============ WHAT YOU GET ============ */}
      <section className="bg-paper py-14 md:py-16">
        <div className="wrap">
          <SectionHead eyebrow="What you get" title={<>Modern development <span className="text-leaf">expertise.</span></>} />
          <div className="grid gap-5 md:grid-cols-3">
            {getItems.map((g, i) => (
              <div key={g.title} data-reveal data-delay={i * 100} className="tile tile-hover group flex flex-col gap-3.5 p-6 lg:p-7">
                <span className="grid size-12 place-items-center rounded-[14px] bg-accent text-lime transition-transform duration-300 group-hover:-rotate-6">
                  <Icon name={g.icon} className="size-5.5" />
                </span>
                <h3 className="text-xl font-bold text-ink">{g.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROCESS (same cards as the home page) ============ */}
      <section className="bg-paper pb-14 md:pb-16">
        <div className="wrap">
          <SectionHead eyebrow="Process" title={<>How we work <span className="text-leaf">together.</span></>} />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* ============ WHY HIRE ME ============ */}
      <section className="bg-paper pb-14 md:pb-16">
        <div className="wrap grid items-start gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div data-reveal className="flex flex-col gap-3.5 lg:sticky lg:top-28">
            <span className="eyebrow">Why hire me</span>
            <h2 className="h-section">What clients can <span className="text-leaf">expect.</span></h2>
            <p className="text-[15.5px] text-muted">Clear scope, honest timelines and code I stand behind.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {expect.map((e, i) => (
              <div key={e.title} data-reveal data-delay={i * 80} className="tile tile-hover group flex flex-col gap-3 p-6">
                <span className="icon-tile transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-lime">
                  <Icon name={e.icon} className="size-4.5" />
                </span>
                <h3 className="mt-1 text-[18px] font-bold text-ink">{e.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-muted">{e.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AREAS OF FOCUS ============ */}
      <section className="bg-paper pb-14 md:pb-16">
        <div className="wrap">
          <SectionHead eyebrow="Services summary" title={<>Areas of <span className="text-leaf">focus.</span></>} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((a, i) => (
              <Link
                key={a}
                href={`/services#service-${i + 1}`}
                data-reveal
                data-delay={(i % 4) * 80}
                className="tile tile-hover group flex flex-col justify-between gap-6 p-6"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-display text-[26px] font-bold leading-none text-leaf">{String(i + 1).padStart(2, "0")}</span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-accent transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-lime">
                    <Icon name="arrowUpRight" className="size-4" />
                  </span>
                </span>
                <span className="font-display text-[18px] font-bold leading-snug text-ink">{a}</span>
              </Link>
            ))}
            <Link
              href="/services"
              data-reveal
              data-delay={240}
              className="group flex flex-col justify-between gap-6 rounded-[16px] bg-accent p-6 text-white transition duration-300 hover:-translate-y-1 hover:bg-accent-hover"
            >
              <span className="grid size-9 place-items-center rounded-full bg-lime text-accent">
                <Icon name="arrow" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
              <span className="font-display text-[18px] font-bold leading-snug">
                Service details <span className="block text-[14px] font-medium text-night-muted">Scope, features and tools for each service</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to start?"
        text="Tell me about your project — I'll reply with a clear plan, timeline, and estimate, usually within 0–4 hours."
        primary={{ href: "/contact", label: "Share Your Project" }}
        secondary={hasUpwork ? { href: site.socials.upwork, label: "Hire Me on Upwork" } : { href: "/projects", label: "Explore My Work" }}
      />
    </>
  );
}
