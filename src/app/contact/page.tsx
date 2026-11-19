import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/ui";
import { ext, site, type IconName } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell me about your project — I reply within 0–4 hours with clear next steps.",
};

const cards: { icon: IconName; label: string; value: string; href?: string }[] = [
  { icon: "mail", label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: "chat", label: "Phone · WhatsApp", value: site.phone, href: site.socials.whatsapp },
  { icon: "pin", label: "Location", value: site.location },
  { icon: "clock", label: "Availability", value: "Open for freelance projects" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        aside={
          <div className="relative mx-auto w-full max-w-[480px] lg:mr-0">
            <div className="bg-forest relative overflow-hidden rounded-[18px] p-7 text-white shadow-(--shadow-float) md:p-8">
              <div className="relative">
                <p className="flex items-center gap-2 text-[13px] text-white/70"><span className="dot dot-live" /> Online · replies in 0–4 hours</p>
                <h2 className="mt-4 text-[24px] font-extrabold tracking-[-0.03em]">What happens next</h2>
                <ol className="mt-5 flex flex-col gap-4">
                  {[
                    ["You send the details", "Figma file, website link or a short brief."],
                    ["I reply with a plan", "Questions, approach, timeline and a fixed quote."],
                    ["We start building", "Live preview link and regular updates."],
                  ].map(([t, d], i) => (
                    <li key={t} className="flex gap-4">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-lime font-mono text-[12px] font-semibold text-ink">{i + 1}</span>
                      <div>
                        <p className="font-semibold">{t}</p>
                        <p className="text-[13.5px] text-night-muted">{d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        }
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
        eyebrow="Contact"
        title={<>Have a project in mind? <span className="text-accent">Let&apos;s talk.</span></>}
        lead="Share your Figma file, current website link or a short brief. I usually reply within 0–4 hours with a clear plan, timeline and fixed quote."
      />

      <section className="section">
        <div className="wrap grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.55fr)] lg:gap-16">
          <div data-reveal className="flex flex-col gap-4">
            {cards.map((c) => {
              const inner = (
                <>
                  <span className="grid size-12 shrink-0 place-items-center rounded-[14px] border border-line-2 bg-surface-2 text-accent">
                    <Icon name={c.icon} className="size-5.5" />
                  </span>
                  <span className="min-w-0">
                    <small className="label-mono block">{c.label}</small>
                    <strong className="break-words font-semibold">{c.value}</strong>
                  </span>
                </>
              );
              return c.href ? (
                <Link key={c.label} href={c.href} {...ext(c.href)} className="card flex items-center gap-4 p-6 hover:border-accent">{inner}</Link>
              ) : (
                <div key={c.label} className="card flex items-center gap-4 p-6">{inner}</div>
              );
            })}

            <div className="card flex flex-col gap-3.5 p-6">
              <span className="label-mono">Elsewhere</span>
              <div className="flex gap-2.5">
                {([
                  ["linkedin", "LinkedIn", site.socials.linkedin],
                  ["github", "GitHub", site.socials.github],
                  ["upwork", "Upwork", site.socials.upwork],
                ] as const).map(([icon, label, href]) => (
                  <Link key={label} href={href} aria-label={label} {...ext(href)}
                    className="grid size-11 place-items-center rounded-xl border border-line-2 text-ink-2 transition hover:border-accent hover:bg-accent hover:text-white">
                    <Icon name={icon} className="size-4.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div data-reveal data-delay={120}>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
