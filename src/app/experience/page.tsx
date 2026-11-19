import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { Chips, CtaBand, PageHero, SectionHead, TickList } from "@/components/ui";
import { certifications, education, experience, site, skillCards } from "@/lib/data";

export const metadata: Metadata = {
  title: "Experience",
  description: "Full Stack Developer at Krushna53 since June 2023 — Next.js, Sanity CMS and WordPress client work, certifications and skills.",
};

export default function ExperiencePage() {
  return (
    <>
      <PageHero
        aside={
          <div className="relative mx-auto w-full max-w-[520px] lg:mr-0">
            <div className="rounded-[18px] border border-line bg-surface p-6 shadow-(--shadow-lift) md:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">Career snapshot</p>
              <ol className="mt-5 flex flex-col">
                {[
                  { y: "2023 – now", t: experience.role, s: `${experience.company} · Next.js, Sanity, WordPress`, now: true },
                  { y: "2024 – 25", t: `${certifications.length} certifications`, s: "Udemy · WP Academy" },
                  { y: "2018 – 20", t: education.degree, s: education.school },
                ].map((r, i, arr) => (
                  <li key={r.t} className="relative grid grid-cols-[88px_1fr] gap-4 pb-6 last:pb-0">
                    {i < arr.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-[95px] top-5 w-px bg-line" />}
                    <span className="pt-0.5 font-mono text-[12px] text-faint">{r.y}</span>
                    <div className="relative pl-6">
                      <span aria-hidden="true" className={`absolute left-0 top-1.5 size-3 rounded-full ${r.now ? "bg-accent ring-4 ring-accent-soft" : "border-2 border-line-2 bg-surface"}`} />
                      <p className="font-bold">{r.t}</p>
                      <p className="text-[13.5px] text-muted">{r.s}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-6">
                {[["3+", "Years"], ["6", "Projects"], ["0–4h", "Response"]].map(([v, k]) => (
                  <div key={k}>
                    <p className="text-[22px] font-extrabold tracking-[-0.03em]">{v}</p>
                    <p className="text-[12.5px] text-muted">{k}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
        crumbs={[{ href: "/", label: "Home" }, { label: "Experience" }]}
        eyebrow="Experience & expertise"
        title={<>A professional journey in <span className="text-accent">modern web.</span></>}
        lead="Building, migrating and maintaining client websites with Next.js, Sanity CMS and WordPress — plus certifications and continuous learning."
      />

      {/* Timeline */}
      <section className="section">
        <div className="wrap grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.55fr)] lg:gap-16">
          <div data-reveal className="flex flex-col gap-3.5 lg:sticky lg:top-28">
            <span className="eyebrow">Work experience</span>
            <h2 className="h-section">Professional timeline</h2>
            <p className="text-muted">{experience.summary}</p>
          </div>

          <ol className="relative flex flex-col gap-7 pl-8 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-line-2 sm:pl-9">
            <li data-reveal className="relative">
              <span aria-hidden="true" className="absolute -left-8 top-8 size-3.75 rounded-full border-[3px] border-accent bg-paper sm:-left-9" />
              <div className="card flex flex-col gap-5 p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-bold">{experience.role}</h3>
                    <p className="mt-1.5 text-muted">{experience.company} · {experience.place}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-surface py-1.5 pl-3 pr-4 text-[13px] text-ink-2">
                    <span className="dot dot-live" /> {experience.period}
                  </span>
                </div>
                <TickList items={experience.points} twoCol />
                <Chips items={experience.tags} fill />
              </div>
            </li>
            <li data-reveal data-delay={100} className="relative">
              <span aria-hidden="true" className="absolute -left-8 top-8 size-3.75 rounded-full border-[3px] border-accent bg-paper sm:-left-9" />
              <div className="card flex flex-col gap-4 p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-bold">{education.degree}</h3>
                    <p className="mt-1.5 text-muted">{education.school}</p>
                  </div>
                  <span className="chip chip-fill">{education.period}</span>
                </div>
                <p className="text-muted">{education.text}</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Certifications */}
      <section className="section border-y border-line bg-paper-2">
        <div className="wrap">
          <SectionHead eyebrow="Certifications" title="Continuous learning" />
          <div className="grid gap-5 md:grid-cols-2">
            {certifications.map((c, i) => (
              <div key={c.title} data-reveal data-delay={i * 100} className="card card-hover flex items-start gap-5 p-7">
                <span className="grid size-13 shrink-0 place-items-center rounded-[14px] bg-accent-soft text-accent">
                  <Icon name="award" className="size-6" />
                </span>
                <div>
                  <small className="font-mono text-[13px] text-faint">{c.date} · {c.issuer}</small>
                  <h3 className="my-1 text-[19px] font-bold">{c.title}</h3>
                  <p className="text-sm text-muted">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Skills" title="Tools & technologies" />
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
        </div>
      </section>

      <CtaBand
        title="Want this experience on your project?"
        text="Next.js, Sanity and WordPress work — delivered fast with an AI-powered workflow and reviewed by hand."
        primary={{ href: "/contact", label: "Get in Touch" }}
        secondary={{ href: site.resume, label: "Download résumé" }}
      />
    </>
  );
}
