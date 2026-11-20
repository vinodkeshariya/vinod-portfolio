import Image from "next/image";
import Link from "next/link";
import { Faq } from "@/components/Faq";
import { HeroShowcase } from "@/components/HeroShowcase";
import { Icon } from "@/components/Icon";
import { aiWorkflow, experience, featuredServices, problems, process, projects, site, stats, type IconName } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Vinod Keshariya | AI + Next.js Developer",
  description: site.description,
  path: "/",
});

/* ---------- small brand marks for the technology strip ---------- */
const badge = "grid size-8 shrink-0 place-items-center font-display font-extrabold leading-none";
const tech: { label: string; mark: React.ReactNode }[] = [
  { label: "React", mark: <Icon name="react" strokeWidth={1.6} className="size-8 text-[#149eca]" /> },
  { label: "Next.js", mark: <span className={`${badge} rounded-full bg-black text-[15px] text-white`}>N</span> },
  { label: "TypeScript", mark: <span className={`${badge} rounded-[6px] bg-[#3178c6] pt-2 pl-2 text-[12px] text-white`}>TS</span> },
  { label: "Sanity CMS", mark: <span className={`${badge} rounded-[7px] bg-[#f03e2f] text-[16px] text-white`}>S</span> },
  { label: "WordPress", mark: <span className={`${badge} rounded-full border-[2.5px] border-[#21759b] font-serif text-[17px] text-[#21759b]`}>W</span> },
  {
    label: "Claude Code",
    mark: (
      <svg viewBox="0 0 24 24" className="size-8 text-[#d97757]" fill="currentColor" aria-hidden="true">
        {[0, 30, 60, 90, 120, 150].map((r) => (
          <rect key={r} x="11" y="2" width="2" height="20" rx="1" transform={`rotate(${r} 12 12)`} />
        ))}
      </svg>
    ),
  },
  {
    label: "AI Integration",
    mark: (
      <svg viewBox="0 0 24 24" className="size-8 text-[#2f6fe0]" fill="currentColor" aria-hidden="true">
        <path d="M12 1.5c.6 5.6 4.9 9.9 10.5 10.5-5.6.6-9.9 4.9-10.5 10.5C11.4 16.9 7.1 12.6 1.5 12 7.1 11.4 11.4 7.1 12 1.5z" />
      </svg>
    ),
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-3 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-ink-2">
      <span className="h-0.5 w-7 rounded-full bg-lime" /> {children}
    </span>
  );
}

const serviceIcons: IconName[] = ["cpu", "monitor", "pen", "layers"];

const featured = ["fashion-catalog", "ai-saas-landing"]
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is (typeof projects)[number] => Boolean(p));

export default function HomePage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-paper">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-[12%] -top-[30%] hidden aspect-square w-[62%] rounded-full border border-lime/40 bg-[radial-gradient(circle_at_40%_60%,rgb(214_230_166/0.45),transparent_65%)] lg:block"
        />
        <div className="wrap relative grid items-center gap-14 pb-16 pt-12 md:pt-16 lg:grid-cols-[1.02fr_1fr] lg:gap-10 lg:pb-20 lg:pt-14">
          <div className="flex flex-col items-start gap-7">
            <span className="animate-fade-up flex items-center gap-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-ink-2">
              <span className="relative flex size-2.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-lime opacity-60 motion-reduce:hidden" />
                <span className="relative size-2.5 rounded-full bg-lime" />
              </span>
              {site.role} · Ahmedabad, India
            </span>

            <h1 style={{ animationDelay: "80ms" }} className="animate-fade-up max-w-[620px] text-[clamp(42px,5.4vw,72px)] font-extrabold leading-[1.02] tracking-[-0.04em] text-accent">
              Build Smarter with AI. <span className="text-[#6a9a3a]">Launch Faster with Next.js.</span>
            </h1>

            <p style={{ animationDelay: "160ms" }} className="animate-fade-up max-w-[540px] text-[clamp(16px,1.3vw,17.5px)] leading-[1.7] text-ink-2">
              I&apos;m {site.name}, an AI-powered Full-Stack Developer specializing in Next.js, React, Claude Code, AI
              integrations, and modern CMS solutions.
            </p>

            <div style={{ animationDelay: "240ms" }} className="animate-fade-up grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
              <Link href="/projects" className="btn btn-primary min-h-13 px-7 text-[15.5px]">
                Explore My Work <Icon name="arrow" />
              </Link>
              <Link href="/contact" className="btn min-h-13 border-accent px-7 text-[15.5px] text-accent hover:-translate-y-0.5 hover:bg-accent hover:text-white">
                Let&apos;s Build Your Project
              </Link>
            </div>
          </div>

          <HeroShowcase />
        </div>

        {/* ============ TECHNOLOGY STRIP ============ */}
        <div className="wrap relative pb-10">
          <ul aria-label="Technologies I work with" className="grid grid-cols-2 gap-x-4 gap-y-5 border-t border-line pt-8 sm:flex sm:flex-wrap sm:items-center sm:justify-center lg:flex-nowrap lg:justify-between">
            {tech.map((t, i) => (
              <li
                key={t.label}
                className={`group flex cursor-default items-center gap-3 text-[15px] font-medium text-ink transition-colors hover:text-accent sm:px-5 sm:text-[16px] lg:px-0 ${
                  i > 0 ? "lg:border-l lg:border-line-2 lg:pl-[clamp(16px,2.4vw,36px)]" : ""
                }`}
              >
                <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110">{t.mark}</span>
                {t.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ SERVICES BAND ============ */}
      <section aria-labelledby="services-title" className="bg-paper">
        <div className="mx-auto w-full max-w-[1320px] sm:px-3">
          <div data-reveal className="bg-forest grid gap-10 rounded-none px-5 py-12 sm:rounded-[20px] sm:px-10 lg:grid-cols-[1.15fr_1fr_1fr_1fr_1fr] lg:gap-0 lg:px-10 lg:py-12">
            <div className="flex flex-col gap-4 lg:pr-8">
              <span className="flex items-center gap-3 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-white/80">
                <span className="h-0.5 w-7 rounded-full bg-lime" /> Services
              </span>
              <h2 id="services-title" className="text-[clamp(30px,3vw,40px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white">
                Modern Development. <span className="text-lime">Smarter Solutions.</span>
              </h2>
            </div>

            {featuredServices.map((s, i) => (
              <Link
                key={s.title}
                href={s.href}
                className="group flex flex-col gap-3 border-t border-white/15 pt-8 transition-colors sm:grid sm:grid-cols-[auto_1fr] sm:gap-x-5 lg:flex lg:border-l lg:border-t-0 lg:px-6 lg:pt-0 xl:px-8"
              >
                <Icon name={serviceIcons[i]} strokeWidth={1.7} className="row-span-2 size-11 text-lime transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105" />
                <span className="flex flex-1 flex-col gap-2 lg:mt-4">
                  <span className="font-display text-[17px] font-bold leading-snug text-white transition-colors group-hover:text-lime">{s.title}</span>
                  <span className="text-[14px] leading-relaxed text-night-muted">{s.text}</span>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-semibold text-lime/80 lg:mt-auto lg:pt-2 transition-colors group-hover:text-lime">
                    Learn more <Icon name="arrow" className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PROJECTS ============ */}
      <section aria-labelledby="work-title" className="bg-paper py-16 md:py-20">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-3 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-ink-2">
                <span className="h-0.5 w-7 rounded-full bg-lime" /> Featured Projects
              </span>
              <h2 id="work-title" className="max-w-[560px] text-[clamp(30px,3.4vw,44px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-accent">
                Projects Built with <span className="text-[#6a9a3a]">Modern Technologies.</span>
              </h2>
            </div>
            <Link href="/projects" className="btn border-accent px-6 text-accent hover:-translate-y-0.5 hover:bg-accent hover:text-white">
              View all projects <Icon name="arrow" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {featured.map((p, i) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                data-reveal
                data-delay={i * 120}
                className="group grid overflow-hidden rounded-[16px] border border-line bg-surface shadow-(--shadow-card) hover:-translate-y-1 hover:border-accent-line hover:shadow-(--shadow-float) sm:grid-cols-[1.15fr_1fr]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-paper-2 sm:aspect-auto sm:min-h-[220px]">
                  <Image
                    src={p.cover}
                    alt={`${p.title} — homepage`}
                    fill
                    sizes="(min-width: 1024px) 340px, (min-width: 640px) 55vw, 100vw"
                    className="object-cover object-left-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex flex-col gap-3 p-6">
                  <span className="label-mono">{p.category}</span>
                  <h3 className="text-[20px] font-bold leading-snug tracking-[-0.02em] text-ink group-hover:text-accent">{p.title.replace("-", "‑")}</h3>
                  <p className="line-clamp-3 text-[14px] leading-relaxed text-muted">{p.summary}</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 3).map((t) => (
                      <li key={t} className="rounded-[6px] border border-line bg-surface-2 px-2 py-1 text-[12px] font-medium text-ink-2">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto flex items-center justify-between pt-2 text-[14px] font-semibold text-ink">
                    <span className="border-b-2 border-lime pb-0.5">{p.year}</span>
                    <span className="grid size-9 place-items-center rounded-full border border-line text-accent transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-lime">
                      <Icon name="arrowUpRight" className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* ============ EXPERIENCE BAR ============ */}
          <div data-reveal className="mt-8 grid gap-6 rounded-[20px] bg-paper-2 px-6 py-6 sm:grid-cols-2 sm:px-10 md:rounded-full">
            <div className="group flex items-center justify-center gap-4 sm:border-r sm:border-line-2">
              <Icon name="briefcase" strokeWidth={1.8} className="size-9 text-accent transition-transform duration-300 group-hover:-rotate-6" />
              <span className="flex flex-col leading-tight">
                <strong className="font-display text-[22px] font-extrabold text-ink">{stats[0].value}</strong>
                <span className="text-[14.5px] text-muted">building for the web</span>
              </span>
            </div>
            <div className="group flex items-center justify-center gap-4">
              <span className="grid size-10 place-items-center rounded-[10px] bg-accent transition-transform duration-300 group-hover:rotate-6 font-display text-[17px] font-extrabold text-lime">
                {experience.company.charAt(0)}
              </span>
              <span className="flex flex-col leading-tight">
                <strong className="font-display text-[19px] font-bold text-ink">
                  {experience.role} · {experience.company}
                </strong>
                <span className="text-[14.5px] text-muted">{experience.period.replace("–", "—")}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROBLEMS ============ */}
      <section aria-labelledby="problems-title" className="bg-paper pb-16 md:pb-20">
        <div className="wrap">
          <div className="mb-10 flex flex-col gap-3">
            <Eyebrow>Common Challenges</Eyebrow>
            <h2 id="problems-title" className="max-w-[640px] text-[clamp(30px,3.4vw,44px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-accent">
              Is Your Website <span className="text-[#6a9a3a]">Holding You Back?</span>
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((p, i) => (
              <article
                key={p.title}
                data-reveal
                data-delay={i * 90}
                className="group flex flex-col gap-3 rounded-[16px] border border-line bg-surface p-6 shadow-(--shadow-card) hover:-translate-y-1 hover:border-accent-line hover:shadow-(--shadow-lift)"
              >
                <span className="relative w-fit pb-1 font-display text-[14px] font-bold text-accent">
                  0{i + 1}
                  <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left rounded-full bg-lime transition-transform duration-300 group-hover:scale-x-[2.2]" />
                </span>
                <h3 className="text-[18px] font-bold leading-snug text-ink">{p.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-muted">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AI WORKFLOW BAND ============ */}
      <section aria-labelledby="ai-title" className="bg-paper">
        <div className="mx-auto w-full max-w-[1320px] sm:px-3">
          <div data-reveal className="bg-forest grid gap-10 px-5 py-12 sm:rounded-[20px] sm:px-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16 lg:py-14">
            <div className="flex flex-col items-start gap-5">
              <span className="flex items-center gap-3 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-white/80">
                <span className="h-0.5 w-7 rounded-full bg-lime" /> AI-Powered Workflow
              </span>
              <h2 id="ai-title" className="text-[clamp(30px,3vw,40px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-white">
                The Speed of AI. <span className="text-lime">The Quality Check of a Real Developer.</span>
              </h2>
              <ul className="flex flex-wrap gap-2">
                {aiWorkflow.tools.map((t) => (
                  <li key={t} className="cursor-default rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors duration-300 hover:border-lime hover:bg-lime hover:text-accent">{t}</li>
                ))}
              </ul>
              <p className="mt-auto border-l-2 border-lime pl-4 text-[15px] font-semibold text-white">{aiWorkflow.closing}</p>
            </div>
            <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {aiWorkflow.points.map((p, i) => (
                <div
                  key={p.title}
                  className="group relative flex flex-col gap-2 border-t border-white/15 pt-5 before:absolute before:-top-px before:left-0 before:h-px before:w-full before:origin-left before:scale-x-0 before:bg-lime before:transition-transform before:duration-500 hover:before:scale-x-100"
                >
                  <span className="font-display text-[14px] font-bold text-lime">0{i + 1}</span>
                  <h3 className="text-[17px] font-bold text-white transition-colors group-hover:text-lime">{p.title}</h3>
                  <p className="text-[14px] leading-relaxed text-night-muted">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section aria-labelledby="process-title" className="bg-paper py-16 md:py-20">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-3">
              <Eyebrow>My Process</Eyebrow>
              <h2 id="process-title" className="max-w-[560px] text-[clamp(30px,3.4vw,44px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-accent">
                From Your Idea to a <span className="text-[#6a9a3a]">Finished Product.</span>
              </h2>
            </div>
            <Link href="/contact" className="btn border-accent px-6 text-accent hover:-translate-y-0.5 hover:bg-accent hover:text-white">
              Start Your Project <Icon name="arrow" />
            </Link>
          </div>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <li
                key={p.title}
                data-reveal
                data-delay={i * 90}
                className="group relative flex flex-col gap-3 rounded-[16px] border border-line bg-surface p-6 shadow-(--shadow-card) hover:-translate-y-1 hover:border-accent-line hover:shadow-(--shadow-lift)"
              >
                <span className="grid size-10 place-items-center rounded-full bg-accent font-display text-[15px] font-bold text-lime transition-colors duration-300 group-hover:bg-lime group-hover:text-accent">{i + 1}</span>
                <h3 className="text-[18px] font-bold text-ink">{p.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section aria-labelledby="faq-title" className="bg-paper pb-16 md:pb-20">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div className="flex flex-col items-start gap-4 lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>FAQ</Eyebrow>
            <h2 id="faq-title" className="text-[clamp(30px,3.4vw,44px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-accent">
              Common <span className="text-[#6a9a3a]">Questions.</span>
            </h2>
            <p className="text-[15.5px] text-muted">
              Something else?{" "}
              <Link href="/contact" className="font-semibold text-accent underline underline-offset-4">Send me a message</Link>.
            </p>
          </div>
          <Faq />
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="bg-paper pb-14 md:pb-16">
        <div className="mx-auto w-full max-w-[1320px] sm:px-3">
          <div
            data-reveal
            className="grid items-center gap-6 animate-gradient-pan bg-[linear-gradient(100deg,#d6e6a6_0%,#eef4d6_35%,#d6e6a6_70%,#e8f0c8_100%)] bg-size-[220%_220%] px-6 py-10 sm:rounded-[24px] sm:px-12 lg:grid-cols-[1.25fr_1fr_auto] lg:gap-10"
          >
            <h2 className="text-[clamp(28px,3vw,38px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-accent">
              Have a Project in Mind?
              <br />
              Let&apos;s Build Something Smarter.
            </h2>
            <p className="text-[15.5px] leading-relaxed text-ink-2 lg:border-l lg:border-accent/20 lg:pl-10">
              Tell me about your project. I&apos;ll review your requirements and get back to you with a clear plan, timeline, and
              estimate.
            </p>
            <Link href="/contact" className="btn btn-primary min-h-14 w-full px-8 text-[16px] sm:w-auto">
              Contact Me <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
