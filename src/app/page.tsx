import Link from "next/link";
import { Faq } from "@/components/Faq";
import { HeroVisual } from "@/components/HeroVisual";
import { Icon } from "@/components/Icon";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHead, Stars } from "@/components/ui";
import {
  aiWorkflow,
  education,
  experience,
  certifications,
  featuredServices,
  problems,
  process,
  projects,
  site,
  stats,
  testimonials,
  toolkit,
} from "@/lib/data";

const compare = [
  { k: "Page speed", wp: "Slow on mobile, heavy themes", nx: "Loads in about a second" },
  { k: "Maintenance", wp: "Constant plugin updates", nx: "No plugins to babysit" },
  { k: "Security", wp: "Frequent plugin vulnerabilities", nx: "Static pages, tiny attack surface" },
  { k: "Editing", wp: "Page builders that break layouts", nx: "Clean Sanity Studio dashboard" },
  { k: "Hosting", wp: "Server to manage and scale", nx: "Vercel — scales automatically" },
];

export default function HomePage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero-bg">
        <div className="wrap relative z-10 grid items-center gap-14 pb-20 pt-12 md:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-24">
          <div className="flex flex-col items-start gap-7">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-accent-line bg-accent-soft py-1.5 pl-3 pr-4 text-[13px] font-medium text-accent">
              <span className="dot dot-live" />
              Next.js + Sanity specialist · Open for work
            </span>

            <h1 className="h-display max-w-[640px]">
              Design in Figma.
              <br />
              Launch on Next.js.
              <br />
              <span className="relative inline-block text-accent">
                Edit it yourself.
                <svg aria-hidden="true" viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-2.5 w-full text-accent-line">
                  <path d="M2 9C80 3 200 2 298 7" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="lead">
              I turn Figma files and ageing WordPress sites into fast Next.js websites with Sanity CMS — so your team can update
              every page, image and post on its own. With Claude Code in my workflow, projects ship in days instead of weeks.
            </p>

            <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
              <Link href="/contact" className="btn btn-primary">
                Share your project <Icon name="arrow" />
              </Link>
              <Link href="/projects" className="btn btn-ghost">
                View portfolio
              </Link>
            </div>

            {/* signature */}
            <div className="mt-2 flex items-center gap-3.5 border-t border-line pt-6">
              <span className="relative grid size-11 place-items-center rounded-full bg-accent text-[14px] font-bold text-white">
                {site.initials}
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-paper bg-lime" />
              </span>
              <span className="flex flex-col leading-snug">
                <strong className="text-[15px] font-bold">{site.name}</strong>
                <span className="text-[13px] text-muted">
                  {experience.role} at {experience.company} · {site.location.split(",")[0]}, India
                </span>
              </span>
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* ============ TOOLKIT ============ */}
      <section aria-label="Core toolkit" className="border-y border-line bg-surface">
        <div className="wrap flex flex-wrap items-center justify-center gap-x-5 gap-y-3 py-6">
          <span className="label-mono mr-1">Tools I use daily</span>
          <ul className="flex flex-wrap justify-center gap-2">
            {toolkit.map((t) => (
              <li key={t} className="chip">{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ PROBLEM → SOLUTION ============ */}
      <section className="section">
        <div className="wrap grid gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
          <div data-reveal className="flex flex-col gap-4 md:sticky md:top-28 md:self-start">
            <span className="eyebrow">The usual problems</span>
            <h2 className="h-section">Is your current website holding you back?</h2>
            <p className="text-muted">
              These are the three things clients mention most when they ask me to rebuild their site.
            </p>
          </div>
          <div className="flex flex-col gap-3.5">
            {problems.map((p, i) => (
              <div key={p.title} data-reveal data-delay={i * 90} className="card flex gap-4 p-5 md:p-6">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-paper-2 font-mono text-[12px] font-semibold text-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[16px] text-muted">
                  <strong className="font-bold text-ink">{p.title}</strong> {p.text}
                </p>
              </div>
            ))}
            <div data-reveal className="mt-2 flex gap-4 rounded-2xl border border-accent-line bg-accent-soft p-5 md:p-6">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-lime">
                <Icon name="check" strokeWidth={3} className="size-4" />
              </span>
              <p className="text-[16px] text-ink-2">
                <strong className="text-ink">How I solve it:</strong> a Next.js front end for speed, Sanity Studio for easy editing,
                and Vercel hosting that scales automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="section border-y border-line bg-surface">
        <div className="wrap">
          <SectionHead
            eyebrow="Services"
            title="How I can help"
            text="Every project starts with a clear plan, timeline and fixed quote."
            action={{ href: "/services", label: "All services" }}
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((s, i) => (
              <article key={s.title} data-reveal data-delay={i * 100} className="card card-hover group flex flex-col p-6 md:p-7">
                <div className="flex items-center justify-between">
                  <span className="icon-tile transition-colors group-hover:bg-accent group-hover:text-white">
                    <Icon name={s.icon} className="size-4.5" />
                  </span>
                  <span className="chip chip-fill">{s.tag}</span>
                </div>
                <h3 className="mt-5 text-[20px] font-bold tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-2 text-[15px] text-muted">{s.text}</p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex gap-2.5 text-[14px] text-ink-2">
                      <Icon name="check" strokeWidth={2.6} className="mt-0.5 size-4 shrink-0 text-accent" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <p className="border-t border-line pt-4 text-[14px] font-semibold text-ink">→ {s.outcome}</p>
                  <Link href="/services" className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-accent hover:text-accent-hover">
                    Details <Icon name="arrow" className="size-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY NEXT.JS + SANITY ============ */}
      <section className="section bg-forest text-white">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div data-reveal className="flex flex-col items-start gap-4">
            <span className="font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-lime">Why Next.js + Sanity?</span>
            <h2 className="h-section">Same content. A much better website.</h2>
            <p className="text-night-muted">
              Your pages, posts and images move over intact. What changes is speed, security, and how easy it is for your team to
              keep the site fresh.
            </p>
            <Link href="/services" className="btn btn-lime mt-2">How a migration works <Icon name="arrow" /></Link>
          </div>

          <div data-reveal data-delay={120} className="overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-2 bg-white/5 font-mono text-[11.5px] uppercase tracking-[0.08em] text-white/50 sm:grid-cols-[0.8fr_1fr_1fr]">
              <span className="hidden p-4 sm:block">&nbsp;</span>
              <span className="p-4 sm:border-l sm:border-white/10">Typical WordPress</span>
              <span className="border-l border-white/10 p-4 text-accent-light">Next.js + Sanity</span>
            </div>
            {compare.map((r) => (
              <div key={r.k} className="grid grid-cols-2 border-t border-white/10 text-[14px] sm:grid-cols-[0.8fr_1fr_1fr]">
                <span className="col-span-2 px-4 pt-4 font-semibold sm:col-span-1 sm:pb-4">{r.k}</span>
                <span className="flex gap-2 p-4 text-white/60 sm:border-l sm:border-white/10">
                  <Icon name="close" strokeWidth={2.4} className="mt-0.5 size-3.5 shrink-0 text-white/40" /> {r.wp}
                </span>
                <span className="flex gap-2 border-l border-white/10 bg-white/[0.03] p-4 text-white/90">
                  <Icon name="check" strokeWidth={2.6} className="mt-0.5 size-3.5 shrink-0 text-lime" /> {r.nx}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WORK ============ */}
      <section className="py-10 md:py-15 lg:py-20">
        <div className="wrap">
          <SectionHead
            className="mb-8! md:mb-10!"
            eyebrow="Selected work"
            title="Recent builds"
            text="Next.js + Sanity websites, migrations and WordPress builds — each focused on speed, clean structure and easy editing."
            action={{ href: "/projects", label: `All ${projects.length} projects` }}
          />
          <div className="grid gap-5 md:grid-cols-4 md:[&>*]:col-span-2 md:[&>*:last-child]:col-start-2 lg:grid-cols-3 lg:gap-6 lg:[&>*]:col-span-1 lg:[&>*:last-child]:col-start-auto">
            {projects.slice(0, 3).map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i + 1} delay={i * 90} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ EXPERIENCE ============ */}
      <section className="section border-t border-line bg-surface">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.45fr] lg:gap-16">
          <div data-reveal className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow">Experience</span>
            <h2 className="h-section">
              3+ years building <span className="text-accent">client websites.</span>
            </h2>
            <p className="text-muted">
              At Krushna53 I handle client projects from requirement to deployment — new Next.js builds, Sanity setups,
              WordPress sites and migrations, plus ongoing care for live websites.
            </p>
            <Link href="/experience" className="group flex items-center gap-4 rounded-2xl bg-forest p-5 text-white shadow-(--shadow-float)">
              <span className="grid size-11 place-items-center rounded-xl bg-white/10">
                <Icon name="code" className="size-5" />
              </span>
              <span className="flex flex-1 flex-col leading-snug">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-white/50">Now</span>
                <span className="font-semibold">{experience.role}, {experience.company}</span>
                <span className="text-[13px] text-white/60">Next.js, Sanity &amp; WordPress client work</span>
              </span>
              <Icon name="arrowUpRight" className="size-4.5 transition-transform group-hover:rotate-45" />
            </Link>
            <dl className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse rounded-2xl border border-line bg-paper p-4">
                  <dt className="mt-0.5 text-[12.5px] text-muted">{s.label}</dt>
                  <dd className="text-[22px] font-extrabold tracking-[-0.03em]">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <ol className="relative flex flex-col gap-5 border-l border-line pl-7">
            {[
              {
                title: experience.role,
                org: `${experience.company} · ${experience.place}`,
                period: experience.period,
                text: experience.summary,
                points: experience.points.slice(0, 4),
              },
              {
                title: "Certifications",
                org: "Udemy · WP Academy",
                period: "2024 – 2025",
                text: "Continuous learning across Next.js, full-stack development and WordPress e-commerce.",
                points: certifications.slice(0, 4).map((c) => `${c.title} — ${c.issuer}, ${c.date}`),
              },
              {
                title: education.degree,
                org: education.school,
                period: education.period,
                text: education.text,
                points: [],
              },
            ].map((job, i) => (
              <li key={job.title} data-reveal data-delay={i * 100} className="relative">
                <span className="absolute -left-[35px] top-7 grid size-4 place-items-center rounded-full border border-accent-line bg-surface" aria-hidden="true">
                  <span className="size-2 rounded-full bg-accent" />
                </span>
                <div className="rounded-2xl border border-line bg-paper p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[17px] font-bold">{job.title}</h3>
                      <p className="text-[14px] font-medium text-accent">{job.org}</p>
                    </div>
                    <span className="rounded-full border border-line bg-surface px-2.5 py-0.5 font-mono text-[11px] text-muted">{job.period}</span>
                  </div>
                  <p className="mt-3 text-[15px] text-muted">{job.text}</p>
                  {job.points.length > 0 && (
                    <ul className="mt-3 flex flex-col gap-1.5">
                      {job.points.map((pt) => (
                        <li key={pt} className="flex gap-2.5 text-[14px] text-ink-2">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="section border-t border-line">
        <div className="wrap">
          <SectionHead eyebrow="How it works" title="How we'll work together" text="Clear steps, regular updates and a preview link at every stage." />
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {process.map((step, i) => (
              <li key={step.title} data-reveal data-delay={i * 90} className="group border-t-2 border-line pt-5 transition-colors hover:border-accent">
                <span className="font-mono text-[12px] text-accent">Step {i + 1}</span>
                <h3 className="mt-2 text-[17px] font-bold">{step.title}</h3>
                <p className="mt-2 text-[14.5px] text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ AI WORKFLOW ============ */}
      <section className="section pt-0">
        <div className="wrap">
          <div data-reveal className="relative grid gap-10 overflow-hidden rounded-[18px] border border-line bg-ivory p-7 shadow-(--shadow-card) md:p-12 lg:grid-cols-[1.1fr_1fr]">
            <div className="relative flex flex-col items-start gap-5">
              <span className="eyebrow">AI-powered workflow</span>
              <h2 className="h-section">The speed of AI. The quality check of a real developer.</h2>
              <p className="text-muted">
                I use Claude and Claude Code throughout development — turning Figma designs into components, writing Sanity
                schemas, migrating content and testing. Then I review every component myself and test on real devices.
              </p>
              <ul className="flex flex-wrap gap-2">
                {aiWorkflow.tools.map((t) => (
                  <li key={t} className="chip gap-1.5"><span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />{t}</li>
                ))}
              </ul>
              <Link href="/services" className="btn btn-ink mt-1">See AI services <Icon name="arrow" /></Link>
            </div>
            <div className="relative flex flex-col gap-3.5">
              {aiWorkflow.points.map((pt, i) => (
                <div key={pt.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
                  <span className="font-mono text-[12px] text-accent">0{i + 1}</span>
                  <div>
                    <h3 className="text-[15.5px] font-bold">{pt.title}</h3>
                    <p className="mt-1.5 text-[14px] text-muted">{pt.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ REVIEWS (shown once real reviews are added) ============ */}
      {testimonials.length > 0 && (
        <section className="section border-t border-line">
          <div className="wrap">
            <SectionHead eyebrow="Client reviews" title="What clients say" />
            <div className="grid gap-5 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <figure key={t.name} data-reveal data-delay={i * 90} className="card flex flex-col gap-5 p-6">
                  <Stars />
                  <blockquote className="text-[15.5px] leading-relaxed text-ink-2">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-auto border-t border-line pt-4">
                    <strong className="block text-[14px]">{t.name}</strong>
                    <span className="text-[13px] text-muted">{t.meta}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ FAQ ============ */}
      <section className="section border-t border-line bg-surface">
        <div className="wrap grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <div data-reveal className="flex flex-col gap-4 md:sticky md:top-28 md:self-start">
            <span className="eyebrow">FAQ</span>
            <h2 className="h-section">Common questions</h2>
            <p className="text-muted">
              Something else? <Link href="/contact" className="font-semibold text-accent underline-offset-4 hover:underline">Send me a message</Link>.
            </p>
          </div>
          <Faq />
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="bg-surface pb-16 md:pb-20">
        <div className="wrap">
          <div data-reveal className="bg-forest relative overflow-hidden rounded-[18px] p-8 text-white md:p-14">
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
              <div className="flex max-w-[660px] flex-col items-start gap-5">
                <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-lime">Free plan &amp; quote</span>
                <h2 className="text-[clamp(28px,3.4vw,42px)] font-extrabold leading-[1.1] tracking-[-0.03em]">
                  Send me your Figma file or website link.
                </h2>
                <p className="text-night-muted">I&apos;ll reply with a clear plan, timeline and fixed quote — usually within 0–4 hours.</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <Link href="/contact" className="btn btn-lime">Share your project <Icon name="arrow" /></Link>
                  <Link href={site.socials.upwork} className="btn btn-outline-light">Hire on Upwork <Icon name="arrowUpRight" /></Link>
                </div>
              </div>
              <ul className="flex flex-col gap-3 border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                {["Reply within 0–4 hours", "Clear plan and fixed quote", "Live preview link while I build", "Your team edits content after launch"].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-[15px] text-white/90">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-lime text-ink">
                      <Icon name="check" strokeWidth={3} className="size-3.5" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
