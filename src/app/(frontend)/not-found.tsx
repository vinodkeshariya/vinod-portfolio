import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { NotFoundArt } from "@/components/PageArt";
import { rich } from "@/components/Rich";
import { PageHero } from "@/components/ui";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist or has moved.",
};

export default async function NotFound() {
  const { menu, texts } = await getContent();
  const t = texts.layout.notFound;
  const links = ["/services", "/projects", "/about", "/contact"].map((href) => menu.find((m) => m.href === href)!).filter(Boolean);
  return (
    <div className="pb-10">
      <PageHero
        eyebrow={t.eyebrow}
        title={rich(t.title, { hl: "text-leaf" })}
        lead={t.lead}
        aside={<NotFoundArt />}
      >
        <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
          <Link href="/" className="btn btn-primary min-h-13 px-7">
            {t.home} <Icon name="arrow" />
          </Link>
          <Link href="/projects" className="btn btn-line min-h-13 px-7">
            {t.projects}
          </Link>
        </div>
        <nav aria-label="Popular pages" className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-[14.5px]">
          <span className="text-muted">{t.try}</span>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="group inline-flex items-center gap-1 py-1 font-semibold text-accent">
              <span className="border-b-2 border-lime pb-0.5">{l.label}</span>
              <Icon name="arrow" className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </nav>
      </PageHero>
    </div>
  );
}
