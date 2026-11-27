import Link from "next/link";
import { Icon } from "@/components/Icon";
import { JsonLd, personLd } from "@/components/JsonLd";
import { CodeTileArt } from "@/components/PageArt";
import { CtaBand, MiniHead, PageHero } from "@/components/ui";
import { getContent } from "@/lib/content";
import type { IconName } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const generateMetadata = () => pageMeta({
  title: "About Vinod Keshariya | Full-Stack Developer",
  description:
    "Learn about Vinod Keshariya, an AI-powered Full-Stack Developer specializing in Next.js, React, Claude Code, and modern web development.",
  path: "/about",
});

const stack: { title: string; icon: IconName; items: string[] }[] = [
  { title: "AI Tools", icon: "spark", items: ["Claude", "Claude Code", "ChatGPT", "MCP", "Cursor"] },
  { title: "Frontend", icon: "code", items: ["Next.js", "React", "TypeScript", "JavaScript", "Tailwind CSS"] },
  { title: "CMS", icon: "layers", items: ["Sanity CMS", "WordPress", "Elementor"] },
  { title: "Tools", icon: "pen", items: ["Figma", "Vercel", "Git"] },
];

export default async function AboutPage() {
  const content = await getContent();
  const { aboutFocus, certifications, experience, principles, site } = content;
  const languages = site.languages.map((l) => l.split(" — ")[0]).join(", ");

  /** Quick facts under the hero (previously on the profile card) */
  const facts: { icon: IconName; label: string }[] = [
    { icon: "pin", label: "Ahmedabad, India" },
    { icon: "globe", label: languages },
    { icon: "briefcase", label: "3+ years experience" },
    { icon: "clock", label: "Replies within 0–4 hours" },
  ];

  return (
    <>
      <JsonLd data={personLd(content)} />
      <PageHero
        eyebrow="About"
        title={
          <>
            I&apos;m Vinod Keshariya — an AI-Powered <span className="text-leaf">Full‑Stack Developer.</span>
          </>
        }
        lead="I build modern websites and digital experiences using Next.js, React, Sanity CMS, and AI-powered development workflows."
        aside={<CodeTileArt />}
      >
        <p className="max-w-[560px] text-[15.5px] leading-relaxed text-muted">
          Based in Ahmedabad, India, I work with businesses and clients worldwide to turn ideas into fast, responsive, and
          maintainable digital products.
        </p>
        <ul className="flex flex-wrap gap-2.5">
          {facts.map((f) => (
            <li
              key={f.label}
              className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-surface px-3.5 py-2 text-[13.5px] font-medium text-ink-2"
            >
              <Icon name={f.icon} className="size-4 text-accent" /> {f.label}
            </li>
          ))}
        </ul>
        <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
          <Link href="/contact" className="btn btn-primary min-h-13 px-7">
            Contact Me <Icon name="arrow" />
          </Link>
          <a href={site.resume} download className="btn btn-line min-h-13 px-7">
            Download résumé <Icon name="download" />
          </a>
        </div>
      </PageHero>

      {/* ============ MY STORY ============ */}
      <section className="bg-paper py-14 md:py-16">
        <div className="wrap">
          <div data-reveal>
            <MiniHead>My Story</MiniHead>
            <p className="mb-8 max-w-[720px] font-display text-[clamp(22px,2.4vw,30px)] font-bold leading-[1.25] tracking-[-0.02em] text-ink">
              From frontend development to <span className="text-leaf">AI-powered engineering.</span>
            </p>
          </div>
          <div className="grid gap-x-14 gap-y-5 lg:grid-cols-2">
            <div data-reveal className="flex flex-col gap-5 text-[16px] leading-[1.75] text-ink-2">
              <p>
                My development journey started with frontend and full-stack web development. Over time, I gained experience working
                with WordPress, React, Next.js, and modern content management systems.
              </p>
              <p>
                Since joining {experience.company} in June 2023, I&apos;ve worked on building, migrating, and maintaining client
                websites — from converting Figma designs into responsive interfaces to setting up Sanity CMS and migrating WordPress
                websites.
              </p>
            </div>
            <div data-reveal data-delay={120} className="flex flex-col items-start gap-5 text-[16px] leading-[1.75] text-ink-2">
              <p>
                As AI development tools evolved, I integrated Claude, Claude Code, and ChatGPT into my everyday workflow. Today, I
                combine hands-on engineering with AI-assisted development to work more efficiently, solve technical challenges, and
                deliver better digital experiences.
              </p>
              <p className="border-l-2 border-lime pl-4 font-medium text-ink">
                My approach combines AI-powered productivity, clean code, practical problem-solving, and careful testing.
              </p>
              <Link href="/projects" className="group inline-flex items-center gap-2 font-semibold text-accent">
                Explore my work <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHAT I DO ============ */}
      <section className="bg-paper pb-14 md:pb-16">
        <div className="wrap">
          <div data-reveal className="flex flex-wrap items-end justify-between gap-4">
            <MiniHead text="AI-powered development and modern web solutions.">What I Do</MiniHead>
            <Link href="/services" className="btn btn-line mb-7 px-6">
              View services <Icon name="arrow" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {aboutFocus.map((f, i) => (
              <article key={f.title} data-reveal data-delay={i * 90} className="tile tile-hover group flex flex-col gap-3 p-6">
                <span className="icon-tile transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-lime">
                  <Icon name={f.icon} className="size-4.5" />
                </span>
                <h3 className="mt-1 text-[18px] font-bold text-ink">{f.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-muted">{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PHILOSOPHY (forest band, like the home page) ============ */}
      <section aria-labelledby="philosophy-title" className="bg-paper">
        <div className="mx-auto w-full max-w-[1320px] sm:px-3">
          <div data-reveal className="bg-forest grid gap-10 px-5 py-12 sm:rounded-[20px] sm:px-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16 lg:py-14">
            <div className="flex flex-col items-start gap-5">
              <span className="flex items-center gap-3 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-white/80">
                <span className="h-0.5 w-7 rounded-full bg-lime" /> My Development Philosophy
              </span>
              <h2 id="philosophy-title" className="text-[clamp(28px,2.8vw,38px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-white">
                AI should make developers more productive — <span className="text-lime">not replace engineering judgment.</span>
              </h2>
            </div>
            <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {principles.map((p) => (
                <div
                  key={p.title}
                  className="group relative flex flex-col gap-2 border-t border-white/15 pt-5 before:absolute before:-top-px before:left-0 before:h-px before:w-full before:origin-left before:scale-x-0 before:bg-lime before:transition-transform before:duration-500 hover:before:scale-x-100"
                >
                  <Icon name={p.icon} strokeWidth={1.8} className="size-6 text-lime" />
                  <h3 className="text-[17px] font-bold text-white transition-colors group-hover:text-lime">{p.title}</h3>
                  <p className="text-[14px] leading-relaxed text-night-muted">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ TECHNOLOGY STACK ============ */}
      <section className="bg-paper py-14 md:py-16">
        <div className="wrap">
          <div data-reveal className="flex flex-wrap items-end justify-between gap-4">
            <MiniHead>Technology Stack</MiniHead>
            <Link href="/experience" className="btn btn-line mb-7 px-6">
              Full experience <Icon name="arrow" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stack.map((g, i) => (
              <div key={g.title} data-reveal data-delay={i * 80} className="tile tile-hover group flex flex-col gap-3 p-6">
                <div className="flex items-center gap-3">
                  <span className="icon-tile transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-lime">
                    <Icon name={g.icon} className="size-4.5" />
                  </span>
                  <h3 className="text-[17px] font-bold text-ink">{g.title}</h3>
                </div>
                <p className="text-[14.5px] leading-relaxed text-muted">{g.items.join(", ")}</p>
              </div>
            ))}
          </div>

          {/* Experience · Certifications */}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {[
              {
                icon: "briefcase" as IconName,
                title: "Experience",
                body: (
                  <>
                    {experience.role} at {experience.company}
                    <br />
                    {experience.period}
                  </>
                ),
              },
              {
                icon: "award" as IconName,
                title: "Certifications",
                body: (
                  <span className="flex flex-col gap-1">
                    {certifications.map((c) => (
                      <span key={c.title}>
                        {c.title} — {c.issuer}, {c.date}
                      </span>
                    ))}
                  </span>
                ),
              },
            ].map((c, i) => (
              <div key={c.title} data-reveal data-delay={i * 100} className="tile tile-hover group flex flex-col gap-3 p-6">
                <span className="grid size-12 place-items-center rounded-[14px] bg-accent text-lime transition-transform duration-300 group-hover:-rotate-6">
                  <Icon name={c.icon} className="size-5.5" />
                </span>
                <h3 className="mt-1 text-[18px] font-bold text-ink">{c.title}</h3>
                <div className="text-[14.5px] leading-relaxed text-muted">{c.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Let's Work Together."
        text="Have an idea for an AI-powered application, modern website, or CMS project? Let's discuss how we can build it."
        primary={{ href: "/contact", label: "Contact Me" }}
        secondary={{ href: "/projects", label: "Explore my work" }}
      />
    </>
  );
}
