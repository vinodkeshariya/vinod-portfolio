import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/ui";
import { ext, hasUpwork, helpWith, site, type IconName } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Hire Vinod Keshariya | AI + Next.js Developer",
  description:
    "Contact Vinod Keshariya for AI-powered development, Next.js websites, AI integration, and modern web development projects.",
  path: "/contact",
});

const cards: { icon: IconName; label: string; value: string; href?: string }[] = [
  { icon: "mail", label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: "chat", label: "Phone · WhatsApp", value: site.phone, href: site.socials.whatsapp },
  { icon: "pin", label: "Location", value: site.location },
  { icon: "users", label: "Availability", value: "Open for Freelance Projects" },
  { icon: "clock", label: "Response time", value: "Usually within 0–4 hours" },
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
                    ["I reply with a plan", "A practical approach, timeline and estimate."],
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
        eyebrow="Get in Touch"
        title={<>Let&apos;s Talk About Your <span className="text-accent">Next Project.</span></>}
        lead="Looking for a developer to build an AI-powered application, integrate intelligent features, or create a modern website? I'm available to collaborate with startups, agencies, businesses, and individuals worldwide."
      >
        <p className="max-w-[580px] text-[15.5px] leading-relaxed text-muted">
          Tell me about your idea, requirements, and goals. I&apos;ll review your project and respond with a practical approach and
          estimated timeline.
        </p>
      </PageHero>

      <section className="section">
        <div className="wrap grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.55fr)] lg:gap-16">
          <div data-reveal className="flex flex-col gap-4">
            <div className="card flex flex-col gap-4 p-6">
              <h2 className="text-[18px] font-bold">What Can I Help You Build?</h2>
              <ul className="flex flex-col gap-2.5">
                {helpWith.map((h) => (
                  <li key={h} className="flex gap-2.5 text-[14.5px] text-ink-2">
                    <Icon name="check" strokeWidth={2.6} className="mt-0.5 size-4 shrink-0 text-accent" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

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
                  ...(hasUpwork ? [["upwork", "Upwork", site.socials.upwork] as const] : []),
                ] as const).map(([icon, label, href]) => (
                  <Link key={label} href={href} aria-label={label} {...ext(href)}
                    className="grid size-11 place-items-center rounded-xl border border-line-2 text-ink-2 transition hover:border-accent hover:bg-accent hover:text-white">
                    <Icon name={icon} className="size-4.5" />
                  </Link>
                ))}
              </div>
              {hasUpwork && (
                <Link href={site.socials.upwork} {...ext(site.socials.upwork)} className="btn btn-ghost btn-sm self-start">
                  Hire Me on Upwork <Icon name="arrowUpRight" />
                </Link>
              )}
            </div>
          </div>

          <div data-reveal data-delay={120} className="flex flex-col gap-4">
            <ContactForm />
            <p className="text-center text-[14.5px] text-muted">I look forward to hearing about your project.</p>
          </div>
        </div>
      </section>
    </>
  );
}
