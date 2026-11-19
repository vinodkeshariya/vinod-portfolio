import { faqs } from "@/lib/data";

/** Accessible accordion built on native <details> — works without JavaScript */
export function Faq() {
  return (
    <div data-reveal data-delay={120} className="border-t border-line">
      {faqs.map((f, i) => (
        <details key={f.q} open={i === 0} className="group border-b border-line">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-5 py-5 text-[16px] font-semibold md:text-[17px] [&::-webkit-details-marker]:hidden">
            {f.q}
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-full border border-line-2 text-[15px] leading-none text-ink-2 transition duration-200 group-open:rotate-45 group-open:border-accent group-open:text-accent"
            >
              +
            </span>
          </summary>
          <p className="pb-5 pr-0 text-[15px] text-muted md:pr-12">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
