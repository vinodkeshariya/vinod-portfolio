import { HeroShowcase } from "@/components/HeroShowcase";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CtaBand, PageHero, SectionHead } from "@/components/ui";
import { rich } from "@/components/Rich";
import { getContent } from "@/lib/content";
import { ext, hasUpwork } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata() {
  const { seo } = (await getContent()).texts.hireMe;
  return pageMeta({ title: seo.title, description: seo.description, path: "/hire-me" });
}

export default async function HireMePage() {
  const { process, services, showcase, site, texts } = await getContent();
  const t = texts.hireMe;
  const upwork = hasUpwork(site);
  const areas = services.map((sv) => sv.title);

  return (
    <>
      <PageHero
        aside={<HeroShowcase shots={showcase} />}
        eyebrow={t.hero.eyebrow}
        title={rich(t.hero.title, { hl: "text-leaf" })}
        lead={t.hero.lead}
      >
        <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
          <Link href="/contact" className="btn btn-primary min-h-13 px-7">{t.hero.primary} <Icon name="arrow" /></Link>
          {upwork ? (
            <Link href={site.socials.upwork} {...ext(site.socials.upwork)} className="btn btn-line min-h-13 px-7">{t.hero.upwork} <Icon name="arrowUpRight" /></Link>
          ) : (
            <Link href="/projects" className="btn btn-line min-h-13 px-7">{t.hero.work}</Link>
          )}
        </div>
      </PageHero>

      {/* ============ WHAT YOU GET ============ */}
      <section className="bg-paper py-14 md:py-16">
        <div className="wrap">
          <SectionHead eyebrow={t.get.eyebrow} title={rich(t.get.title, { hl: "text-leaf" })} />
          <div className="grid gap-5 md:grid-cols-3">
            {t.get.items.map((g, i) => (
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
          <SectionHead eyebrow={t.process.eyebrow} title={rich(t.process.title, { hl: "text-leaf" })} />
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
            <span className="eyebrow">{t.why.eyebrow}</span>
            <h2 className="h-section">{rich(t.why.title, { hl: "text-leaf" })}</h2>
            <p className="text-[15.5px] text-muted">{t.why.text}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {t.why.items.map((e, i) => (
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
          <SectionHead eyebrow={t.areas.eyebrow} title={rich(t.areas.title, { hl: "text-leaf" })} />
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
                {t.areas.detailsTitle} <span className="block text-[14px] font-medium text-night-muted">{t.areas.detailsText}</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <CtaBand
        title={rich(t.cta.title)}
        text={rich(t.cta.text)}
        primary={{ href: "/contact", label: t.cta.primary }}
        secondary={upwork ? { href: site.socials.upwork, label: t.hero.upwork } : { href: "/projects", label: t.hero.work }}
      />
    </>
  );
}
