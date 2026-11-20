"use client";

import { useEffect, useState } from "react";

/** Distance from the top of the viewport (below the sticky header) at which a section counts as "current" */
const OFFSET = 160;

/** Sticky "On this page" nav for case studies; highlights the section currently being read */
export function CaseNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
      if (!els.length) return;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      // last section whose top has passed the offset line; the final one once the page bottom is reached
      let current = els[0].id;
      for (const el of els) if (el.getBoundingClientRect().top <= OFFSET) current = el.id;
      setActive(atBottom ? els[els.length - 1].id : current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  return (
    <nav aria-label="On this page" className="sticky top-28 hidden flex-col border-l-2 border-line lg:flex">
      <p className="label-mono mb-2 pl-4">On this page</p>
      {sections.map((s) => {
        const on = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={on ? "location" : undefined}
            className={`-ml-0.5 border-l-2 py-2 pl-4 text-[15px] transition-colors ${
              on ? "border-lime font-semibold text-accent" : "border-transparent text-muted hover:border-accent-line hover:text-ink"
            }`}
          >
            {s.label}
          </a>
        );
      })}
    </nav>
  );
}
