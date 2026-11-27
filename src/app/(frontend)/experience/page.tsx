import { Icon } from "@/components/Icon";
import { MonitorArt } from "@/components/PageArt";
import { CtaBand, MiniHead, PageHero } from "@/components/ui";
import { getContent } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const generateMetadata = () => pageMeta({
  title: "Developer Experience & Skills | Vinod Keshariya",
  description:
    "Explore Vinod Keshariya's professional experience, technical skills, certifications, and AI-assisted development workflow.",
  path: "/experience",
});

/** Lime dot with a forest ring, used on the timeline */
function Node({ live = false }: { live?: boolean }) {
  return (
    <span aria-hidden="true" className="absolute -left-[37px] top-1.5 grid size-4 place-items-center rounded-full border-2 border-accent bg-paper">
      <span className={`size-1.5 rounded-full bg-lime ${live ? "dot-live" : ""}`} />
    </span>
  );
}

export default async function ExperiencePage() {
  const { aiWorkflow, certifications, experience, site, skillCards } = await getContent();
  return (
    <>
      <PageHero
        eyebrow="Experience"
        title={
          <>
            My Experience &amp; <span className="text-leaf">Technical Expertise.</span>
          </>
        }
        lead="A combination of full-stack development, modern CMS solutions, and AI-assisted development workflows."
        aside={<MonitorArt />}
      >
        <dl className="grid w-full max-w-[520px] grid-cols-3 gap-px overflow-hidden rounded-[16px] border border-line bg-line">
          {[
            ["3+", "Years"],
            ["30+", "Hrs / week"],
            ["0–4h", "Response"],
          ].map(([v, k]) => (
            <div key={k} className="flex flex-col-reverse bg-surface px-4 py-3.5">
              <dt className="text-[12.5px] text-muted">{k}</dt>
              <dd className="font-display text-[24px] font-extrabold tracking-[-0.03em] text-accent">{v}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="bg-paper pb-14 pt-4 md:pb-16">
        <div className="wrap flex flex-col gap-14 md:gap-16">
          {/* ============ ROW 1: TIMELINE | CERTIFICATIONS + LANGUAGES ============ */}
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
            <div data-reveal>
              <MiniHead>Career Timeline</MiniHead>
              <ol className="relative ml-2 flex flex-col gap-8 border-l-2 border-accent-line pl-7">
                <li className="relative">
                  <Node live />
                  <div className="tile tile-hover flex flex-col gap-4 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[20px] font-bold text-ink">
                          {experience.role} at {experience.company}
                        </h3>
                        <p className="mt-1 text-[14.5px] text-muted">{experience.place}</p>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-accent-line bg-accent-soft px-3 py-1.5 text-[12.5px] font-semibold text-accent">
                        <span className="dot dot-live" /> {experience.period}
                      </span>
                    </div>
                    <p className="text-[15px] text-ink-2">{experience.summary}</p>
                    <ul className="flex flex-col gap-2">
                      {experience.points.map((pt) => (
                        <li key={pt} className="flex gap-3 text-[14.5px] text-ink-2">
                          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-leaf" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1.5 border-t border-line pt-4">
                      {experience.tags.map((t) => (
                        <span key={t} className="rounded-[6px] border border-line bg-surface-2 px-2 py-1 text-[12px] font-medium text-ink-2">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              </ol>
            </div>

            <div className="flex flex-col gap-12">
              <div data-reveal>
                <MiniHead>Certifications</MiniHead>
                <ul className="tile flex flex-col divide-y divide-line">
                  {certifications.map((c) => (
                    <li key={c.title} className="group flex gap-4 p-5">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-lime transition-transform duration-300 group-hover:scale-110">
                        <Icon name="check" strokeWidth={3} className="size-3.5" />
                      </span>
                      <div>
                        <p className="text-[15.5px] font-semibold text-ink">
                          {c.title} <span className="font-normal text-muted">— {c.issuer}, {c.date}</span>
                        </p>
                        <p className="mt-0.5 text-[14px] text-muted">{c.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div data-reveal>
                <MiniHead>Languages</MiniHead>
                <ul className="tile flex flex-col divide-y divide-line">
                  {site.languages.map((l) => {
                    const [lang, level] = l.split(" — ");
                    return (
                      <li key={l} className="flex items-center justify-between gap-4 px-5 py-3.5">
                        <span className="flex items-center gap-2.5 font-semibold text-ink">
                          <Icon name="globe" className="size-4 text-leaf" /> {lang}
                        </span>
                        <span className="text-right text-[14px] text-muted">{level}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* ============ ROW 2: AI WORKFLOW (full width) ============ */}
          <div data-reveal>
            <MiniHead text="I use AI tools to support everyday development tasks, including code generation, component building, debugging, and testing.">
              AI Workflow
            </MiniHead>
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {aiWorkflow.points.map((pt, i) => (
                <li key={pt.title} className="tile tile-hover group relative flex flex-col gap-2.5 p-5">
                  <span className="flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent font-display text-[13px] font-bold text-lime transition-colors duration-300 group-hover:bg-lime group-hover:text-accent">
                      {i + 1}
                    </span>
                    <h3 className="text-[15.5px] font-bold leading-snug text-ink">{pt.title}</h3>
                  </span>
                  <p className="text-[14px] leading-relaxed text-muted">{pt.text}</p>
                  {i < aiWorkflow.points.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={`absolute -right-5 top-1/2 z-10 hidden size-6 -translate-y-1/2 place-items-center rounded-full border border-accent-line bg-paper text-leaf ${
                        i % 2 === 0 ? "sm:grid" : "lg:grid"
                      }`}
                    >
                      <Icon name="arrow" className="size-3.5" />
                    </span>
                  )}
                </li>
              ))}
            </ol>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {aiWorkflow.tools.map((t) => (
                  <span key={t} className="rounded-full border border-accent-line bg-accent-soft px-3 py-1 text-[12.5px] font-semibold text-accent">
                    {t}
                  </span>
                ))}
              </div>
              <p className="border-l-2 border-lime pl-4 text-[15px] font-semibold text-ink">{aiWorkflow.closing}</p>
            </div>
          </div>

          {/* ============ ROW 3: SKILLS (full width) ============ */}
          <div>
            <div data-reveal>
              <MiniHead>Skills</MiniHead>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {skillCards.map((g, i) => (
                <div key={g.title} data-reveal data-delay={i * 80} className="tile tile-hover group flex flex-col gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <span className="icon-tile transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-lime">
                      <Icon name={g.icon} className="size-4.5" />
                    </span>
                    <h3 className="text-[15.5px] font-bold leading-snug text-ink">{g.title}</h3>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {g.items.map((t) => (
                      <li
                        key={t}
                        className="cursor-default rounded-full border border-line-2 bg-surface px-3 py-1.5 text-[13px] font-medium text-ink-2 transition-colors duration-200 hover:border-accent hover:text-accent"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Let's Work Together."
        text="Need an AI-powered feature, a modern Next.js website, or a WordPress migration? Tell me about your project."
        primary={{ href: "/contact", label: "Contact Me" }}
        secondary={{ href: site.resume, label: "Download résumé" }}
      />
    </>
  );
}
