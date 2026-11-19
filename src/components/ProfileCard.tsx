import { experience, site } from "@/lib/data";

/** Dark "business card" with key facts — used where a portrait photo would normally go */
export function ProfileCard() {
  return (
    <div className="bg-forest relative mx-auto w-full max-w-[520px] overflow-hidden rounded-[18px] p-7 text-white shadow-(--shadow-float) md:p-9 lg:mr-0">
      <div className="relative flex flex-col gap-7">
        <div className="flex items-center gap-4">
          <span className="relative grid size-20 shrink-0 place-items-center rounded-full bg-white text-[26px] font-extrabold text-ink">
            {site.initials}
            <span className="absolute bottom-1 right-1 size-4 rounded-full border-[3px] border-night bg-ok" />
          </span>
          <div>
            <p className="text-[22px] font-bold tracking-[-0.02em]">{site.name}</p>
            <p className="text-[14px] text-night-muted">{site.role}</p>
            <p className="mt-1 text-[13px] text-accent-light">{experience.role} · {experience.company}</p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10">
          {[
            ["Location", "Ahmedabad, India"],
            ["Experience", "3+ years"],
            ["Response", "0–4 hours"],
            ["Availability", "30+ hrs / week"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col-reverse bg-night-2 p-4">
              <dd className="mt-1 font-semibold">{v}</dd>
              <dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-night-muted/80">{k}</dt>
            </div>
          ))}
        </dl>
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-night-muted/80">Languages</p>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {site.languages.map((l) => (
              <li key={l} className="rounded-full border border-white/15 px-3 py-1 text-[13px] text-white/80">{l}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
