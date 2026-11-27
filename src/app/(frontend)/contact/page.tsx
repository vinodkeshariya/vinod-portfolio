import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Faq } from "@/components/Faq";
import { Icon } from "@/components/Icon";
import { JsonLd, abs } from "@/components/JsonLd";
import { Cube } from "@/components/PageArt";
import { CtaBand, MiniHead, PageHero } from "@/components/ui";
import { plain, rich } from "@/components/Rich";
import { getContent } from "@/lib/content";
import { ext, hasUpwork, type IconName } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata() {
  const { seo } = (await getContent()).texts.contact;
  return pageMeta({ title: seo.title, description: seo.description, path: "/contact" });
}

export default async function ContactPage() {
  const { budgets, helpWith, projectTypes, site, texts, vars } = await getContent();
  const t = texts.contact;
  const upwork = hasUpwork(site);
  const details: { icon: IconName; label: string; value: string; href?: string }[] = [
    { icon: "mail", label: t.details.email, value: site.email, href: `mailto:${site.email}` },
    { icon: "chat", label: t.details.phone, value: site.phone, href: site.socials.whatsapp },
    { icon: "pin", label: t.details.location, value: site.location },
    { icon: "users", label: t.details.availability, value: t.details.availabilityValue },
    { icon: "clock", label: t.details.response, value: t.details.responseValue },
  ];
  const socials = [
    ["linkedin", "LinkedIn", site.socials.linkedin],
    ["github", "GitHub", site.socials.github],
    ...(upwork ? [["upwork", "Upwork", site.socials.upwork] as const] : []),
  ] as const;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: `Contact ${site.name}`,
          url: abs("/contact"),
          mainEntity: {
            "@type": "Person",
            name: site.name,
            url: site.url,
            email: `mailto:${site.email}`,
            telephone: site.phone.replace(/\s/g, ""),
          },
        }}
      />
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={rich(t.hero.title, { hl: "text-leaf" })}
        lead={plain(t.hero.lead, vars)}
        aside={
          <div style={{ animationDelay: "200ms" }} className="animate-fade-in relative mx-auto w-full max-w-[560px] lg:mr-0">
            <Cube tone="forest" className="absolute -right-10 -top-10 hidden w-40 animate-float-slow sm:block" />
            <Cube tone="lime" className="absolute -bottom-8 -left-12 hidden w-28 animate-float sm:block" />
            <div className="relative">
              <ContactForm email={site.email} budgets={budgets} projectTypes={projectTypes} labels={t.form} />
            </div>
            <p className="relative mt-5 text-center text-[14.5px] text-muted">{t.hero.formNote}</p>
          </div>
        }
      >
        <p className="max-w-[560px] text-[15.5px] leading-relaxed text-muted">
          {plain(t.hero.intro, vars)}
        </p>

        {/* Contact details */}
        <ul className="flex w-full max-w-[520px] flex-col gap-3.5">
          {details.map((d) => {
            const inner = (
              <>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-lime transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                  <Icon name={d.icon} className="size-[18px]" />
                </span>
                <span className="min-w-0 leading-tight">
                  <small className="block text-[12.5px] text-muted">{d.label}</small>
                  <strong className="break-words text-[15.5px] font-semibold text-ink transition-colors group-hover:text-accent">{d.value}</strong>
                </span>
              </>
            );
            return (
              <li key={d.label}>
                {d.href ? (
                  <Link href={d.href} {...ext(d.href)} className="group flex items-center gap-4">
                    {inner}
                  </Link>
                ) : (
                  <div className="group flex items-center gap-4">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          {socials.map(([icon, label, href]) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              {...ext(href)}
              className="grid size-11 place-items-center rounded-full border border-line-2 bg-surface text-accent transition duration-300 hover:-translate-y-1 hover:border-accent hover:bg-accent hover:text-lime"
            >
              <Icon name={icon} className="size-[18px]" />
            </Link>
          ))}
          {upwork && (
            <Link href={site.socials.upwork} {...ext(site.socials.upwork)} className="btn btn-line btn-sm">
              {t.details.upwork} <Icon name="arrowUpRight" />
            </Link>
          )}
        </div>

        {/* Next steps */}
        <div className="w-full max-w-[560px] pt-2">
          <h2 className="mb-5 flex items-center gap-3 font-display text-[20px] font-bold text-accent">
            <span aria-hidden="true" className="h-[3px] w-6 rounded-full bg-lime" /> {t.steps.title}
          </h2>
          <ol className="grid grid-cols-3 gap-3">
            {t.steps.items.map(({ title: st, text: d }, i) => (
              <li key={st} className="relative flex flex-col gap-2">
                {i < t.steps.items.length - 1 && (
                  <span aria-hidden="true" className="absolute left-9 right-[-12px] top-4 border-t border-dashed border-line-2" />
                )}
                <span className="relative grid size-8 place-items-center rounded-full bg-lime font-display text-[13px] font-bold text-accent ring-4 ring-paper">
                  {i + 1}
                </span>
                <span className="text-[14px] font-semibold text-ink">{st}</span>
                <span className="text-[13px] leading-snug text-muted">{d}</span>
              </li>
            ))}
          </ol>
        </div>
      </PageHero>

      {/* ============ WHAT CAN I HELP YOU BUILD ============ */}
      <section className="bg-paper pb-14 pt-6 md:pb-16">
        <div className="wrap">
          <div data-reveal>
            <MiniHead>{t.helpWith.title}</MiniHead>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {helpWith.map((h, i) => (
              <li key={h} data-reveal data-delay={(i % 4) * 80} className="tile tile-hover group flex items-center gap-3.5 p-5">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-lime">
                  <Icon name="check" strokeWidth={3} className="size-4" />
                </span>
                <span className="text-[15px] font-semibold text-ink-2">{h}</span>
              </li>
            ))}
            <li data-reveal data-delay={240}>
              <Link
                href="/services"
                className="group flex h-full items-center justify-between gap-3 rounded-[16px] bg-accent p-5 text-[15px] font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-accent-hover"
              >
                {t.helpWith.link}
                <Icon name="arrow" className="size-4 text-lime transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section aria-labelledby="faq-title" className="bg-paper pb-14 md:pb-16">
        <div className="wrap grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div data-reveal className="flex flex-col items-start gap-3 lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow">{t.faq.eyebrow}</span>
            <h2 id="faq-title" className="h-section">
              {rich(t.faq.title, { hl: "text-leaf" })}
            </h2>
            <p className="text-[15.5px] text-muted">{t.faq.text}</p>
          </div>
          <Faq />
        </div>
      </section>

      <CtaBand
        title={rich(t.cta.title, { vars })}
        text={rich(t.cta.text, { vars, link: "font-semibold text-accent underline underline-offset-4" })}
        primary={{ href: `mailto:${site.email}`, label: t.cta.primary }}
        secondary={{ href: site.socials.whatsapp, label: t.cta.secondary }}
      />
    </>
  );
}
