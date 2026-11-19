import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ImageStack } from "@/components/ImageStack";
import { CtaBand, PageHero, SectionHead } from "@/components/ui";
import { packages, process, services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description: "Figma to Next.js + Sanity, WordPress to Next.js migration, landing pages, WordPress & Elementor sites and AI integration.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ href: "/", label: "Home" }, { label: "Services" }]}
        eyebrow="Services"
        title={<>Fast websites your team <span className="text-accent">can actually edit.</span></>}
        lead="Next.js + Sanity builds and migrations, plus WordPress when it fits — every project with a clear scope, a fixed quote and an AI-powered workflow."
        aside={
          <ImageStack
            priority
            back={{ src: "/images/projects/blog-migration/cover.webp", alt: "Blog migrated to Next.js" }}
            front={{ src: "/images/projects/restaurant-menu/studio.webp", alt: "Content studio editing a menu item" }}
            phone={{ src: "/images/projects/creative-agency/mobile-1.webp", alt: "Agency website on mobile" }}
          />
        }
      >
        <nav aria-label="Jump to a service" className="mt-2 flex flex-wrap gap-2">
          {services.map((s, i) => (
            <a key={s.title} href={`#service-${i + 1}`} className="chip transition-colors hover:border-accent hover:text-accent">
              {s.title}
            </a>
          ))}
        </nav>
      </PageHero>

      {/* Service rows */}
      <section className="section">
        <div className="wrap flex flex-col gap-20 md:gap-28">
          {services.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={s.title}
                id={`service-${i + 1}`}
                className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <div data-reveal className={`flex flex-col items-start gap-5 ${flip ? "lg:order-2" : ""}`}>
                  <div className="flex items-center gap-3">
                    <span className="icon-tile"><Icon name={s.icon} className="size-4.5" /></span>
                    <span className="font-mono text-[12px] text-faint">Service {String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h2 className="text-[clamp(26px,2.8vw,36px)] font-extrabold leading-tight tracking-[-0.03em]">{s.title}</h2>
                  <p className="text-[16.5px] leading-relaxed text-muted">{s.body}</p>
                  <ul className="flex flex-col gap-2.5">
                    {s.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5 text-[15px] text-ink-2">
                        <Icon name="check" strokeWidth={2.6} className="mt-0.5 size-4.5 shrink-0 text-accent" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <ul className="flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <li key={t} className="rounded-full bg-surface-2 px-2.5 py-1 text-[12px] font-medium text-ink-2">{t}</li>
                    ))}
                  </ul>
                  <Link href="/contact" className="btn btn-ghost btn-sm mt-1">
                    Discuss this service <Icon name="arrow" />
                  </Link>
                </div>

                <div data-reveal data-delay={120} className={flip ? "lg:order-1" : ""}>
                  <div className="rounded-[18px] border border-line bg-surface p-2.5 shadow-(--shadow-card)">
                    <div className="overflow-hidden rounded-[18px] border border-line">
                      <div className="flex items-center gap-1.5 border-b border-line bg-surface-2 px-3.5 py-2.5">
                        <i className="size-2.5 rounded-full bg-[#ff5f57]" />
                        <i className="size-2.5 rounded-full bg-[#febc2e]" />
                        <i className="size-2.5 rounded-full bg-[#28c840]" />
                      </div>
                      <div className="relative aspect-16/10">
                        <Image src={s.image} alt={s.imageAlt} fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover object-left-top" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Packages */}
      <section className="section bg-surface">
        <div className="wrap">
          <SectionHead
            eyebrow="Engagements"
            title="Pick how we work together"
            text="Every project gets a fixed scope and a clear quote before work starts."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {packages.map((p, i) => (
              <div
                key={p.title}
                data-reveal
                data-delay={i * 100}
                className={`flex flex-col gap-4 rounded-[18px] p-7 ${
                  p.featured ? "bg-forest text-white shadow-(--shadow-float)" : "border border-line bg-paper"
                }`}
              >
                <span className={`font-mono text-[12px] uppercase tracking-[0.1em] ${p.featured ? "text-accent-light" : "text-faint"}`}>{p.name}</span>
                <h3 className="text-[22px] font-bold">{p.title}</h3>
                <p className={`text-[15px] ${p.featured ? "text-night-muted" : "text-muted"}`}>{p.text}</p>
                <ul className="flex flex-col gap-2.5">
                  {p.points.map((pt) => (
                    <li key={pt} className={`flex gap-2.5 text-[14.5px] ${p.featured ? "text-white/85" : "text-ink-2"}`}>
                      <Icon name="check" strokeWidth={2.6} className={`mt-0.5 size-4 shrink-0 ${p.featured ? "text-accent-light" : "text-accent"}`} />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className={`mt-auto flex items-center justify-between gap-3 border-t pt-5 text-[14px] ${p.featured ? "border-white/10" : "border-line"}`}>
                  <strong>{p.price}</strong>
                  <Link href="/contact" className={`btn btn-sm ${p.featured ? "btn-lime" : "btn-ghost"}`}>
                    Enquire <Icon name="arrow" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Process" title="How every project runs" text="Clear steps, regular updates and a preview link at every stage." />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <li key={p.title} data-reveal data-delay={i * 90} className="card flex flex-col gap-3 p-6">
                <span className="grid size-10 place-items-center rounded-full bg-accent font-mono text-[13px] font-semibold text-white">0{i + 1}</span>
                <h3 className="mt-2 text-[17px] font-bold">{p.title}</h3>
                <p className="text-[14.5px] text-muted">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand
        title="Not sure which service fits?"
        text="Send your Figma file or website link — I'll suggest the right approach with a plan and fixed quote."
        primary={{ href: "/contact", label: "Share your project" }}
      />
    </>
  );
}
