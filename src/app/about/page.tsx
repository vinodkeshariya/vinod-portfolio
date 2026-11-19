import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProfileCard } from "@/components/ProfileCard";
import { CtaBand, PageHero, SectionHead } from "@/components/ui";
import { aboutFocus, certifications, education, experience, principles, projects, site, type IconName } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About Vinod Keshariya | Full-Stack Developer",
  description:
    "Learn about Vinod Keshariya, an AI-powered Full-Stack Developer specializing in Next.js, React, Claude Code, and modern web development.",
  path: "/about",
});

const shots = [projects[3], projects[4], projects[2], projects[0]];

const stack: { title: string; icon: IconName; items: string[] }[] = [
  { title: "AI Tools", icon: "spark", items: ["Claude", "Claude Code", "ChatGPT", "MCP", "Cursor"] },
  { title: "Frontend", icon: "code", items: ["Next.js", "React", "TypeScript", "JavaScript", "Tailwind CSS"] },
  { title: "CMS", icon: "layers", items: ["Sanity CMS", "WordPress", "Elementor"] },
  { title: "Tools", icon: "pen", items: ["Figma", "Vercel", "Git"] },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "About" }]}
        eyebrow="About Me"
        title={<>I&apos;m Vinod Keshariya — <span className="text-accent">an AI-Powered Full-Stack Developer.</span></>}
        lead="I build modern websites and digital experiences using Next.js, React, Sanity CMS, and AI-powered development workflows."
        aside={<ProfileCard />}
      >
        <p className="max-w-[580px] text-[15.5px] leading-relaxed text-muted">
          Based in Ahmedabad, India, I work with businesses and clients worldwide to turn ideas into fast, responsive, and
          maintainable digital products.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href="/contact" className="btn btn-primary">Contact Me <Icon name="arrow" /></Link>
          <a href={site.resume} download className="btn btn-ghost">Download résumé <Icon name="download" /></a>
        </div>
      </PageHero>

      {/* Story + work snapshot */}
      <section className="section">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div data-reveal className="flex flex-col gap-5">
            <span className="eyebrow">My Story</span>
            <h2 className="h-section">From frontend development to AI-powered engineering.</h2>
            <p className="text-[16.5px] leading-[1.75] text-ink-2">
              My development journey started with frontend and full-stack web development. Over time, I gained experience working
              with WordPress, React, Next.js, and modern content management systems.
            </p>
            <p className="text-[16.5px] leading-[1.75] text-ink-2">
              Since joining {experience.company} in June 2023, I&apos;ve worked on building, migrating, and maintaining client
              websites — from converting Figma designs into responsive interfaces to setting up Sanity CMS and migrating WordPress
              websites.
            </p>
            <p className="text-[16.5px] leading-[1.75] text-ink-2">
              As AI development tools evolved, I integrated Claude, Claude Code, and ChatGPT into my everyday workflow. Today, I
              combine hands-on engineering with AI-assisted development to work more efficiently, solve technical challenges, and
              deliver better digital experiences.
            </p>
            <Link href="/projects" className="mt-1 inline-flex items-center gap-2 font-semibold text-accent hover:text-accent-hover">
              Explore my work <Icon name="arrow" className="size-4" />
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

      {/* What I do */}
      <section className="section border-y border-line bg-surface">
        <div className="wrap">
          <SectionHead eyebrow="What I Do" title="AI-powered development and modern web solutions" action={{ href: "/services", label: "View services" }} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {aboutFocus.map((f, i) => (
              <div key={f.title} data-reveal data-delay={i * 90} className="card card-hover flex flex-col gap-3.5 p-6">
                <span className="icon-tile"><Icon name={f.icon} className="size-4.5" /></span>
                <h3 className="mt-1 text-[18px] font-bold">{f.title}</h3>
                <p className="text-[14.5px] text-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div data-reveal className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow">My Development Philosophy</span>
            <h2 className="h-section">AI should make developers more productive — not replace engineering judgment.</h2>
            <p className="text-muted">
              My approach combines AI-powered productivity, clean code, practical problem-solving, and careful testing.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {principles.map((p, i) => (
              <div key={p.title} data-reveal data-delay={i * 90} className="flex flex-col gap-3.5 rounded-[18px] border border-line bg-surface p-6">
                <span className="icon-tile"><Icon name={p.icon} className="size-4.5" /></span>
                <h3 className="mt-1 text-[17px] font-bold">{p.title}</h3>
                <p className="text-[14.5px] text-muted">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack + background */}
      <section className="section border-t border-line bg-surface">
        <div className="wrap">
          <SectionHead eyebrow="My Technology Stack" title="Tools & technologies I use" action={{ href: "/experience", label: "Full experience" }} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stack.map((g, i) => (
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

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <div data-reveal className="card flex items-start gap-4 p-6">
              <span className="icon-tile"><Icon name="code" className="size-4.5" /></span>
              <div>
                <h3 className="text-[16px] font-bold">Professional Experience</h3>
                <p className="mt-1 text-[14.5px] text-muted">
                  {experience.role} — {experience.company}
                  <br />
                  {experience.period}
                </p>
              </div>
            </div>
            <div data-reveal data-delay={100} className="card flex items-start gap-4 p-6">
              <span className="icon-tile"><Icon name="pin" className="size-4.5" /></span>
              <div>
                <h3 className="text-[16px] font-bold">Education</h3>
                <p className="mt-1 text-[14.5px] text-muted">
                  {education.degree}
                  <br />
                  {education.school} · {education.period}
                </p>
              </div>
            </div>
            <div data-reveal data-delay={200} className="card flex items-start gap-4 p-6">
              <span className="icon-tile"><Icon name="award" className="size-4.5" /></span>
              <div>
                <h3 className="text-[16px] font-bold">Certifications</h3>
                <ul className="mt-1 flex flex-col gap-1 text-[14.5px] text-muted">
                  {certifications.map((c) => (
                    <li key={c.title}>{c.title} — {c.issuer}, {c.date}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Let's Work Together"
        text="Have an idea for an AI-powered application, modern website, or CMS project? Let's discuss how we can build it."
        primary={{ href: "/contact", label: "Contact Me" }}
        secondary={{ href: "/projects", label: "Explore my work" }}
      />
    </>
  );
}
