import { Icon } from "./Icon";

function Step({ n, label }: { n: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent py-1 pl-1 pr-2.5 text-[11px] font-semibold text-white">
      <span className="grid size-4.5 place-items-center rounded-full bg-lime text-[10px] text-ink">{n}</span>
      {label}
    </span>
  );
}

/** Design → Build → Edit: a Figma frame becomes a Next.js component, then content is edited in Sanity */
export function HeroVisual() {
  return (
    <div className="relative mx-auto h-[600px] w-full max-w-[540px] lg:mr-0" aria-hidden="true">

      {/* 1 — DESIGN (Figma-like canvas) */}
      <div className="absolute left-0 top-0 w-[74%] animate-float-slow overflow-hidden rounded-2xl border border-line bg-surface shadow-(--shadow-lift)">
        <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
          <Step n={1} label="Design" />
          <span className="font-mono text-[10.5px] text-faint">Home · Desktop</span>
        </div>
        <div className="grid grid-cols-[92px_1fr]">
          <ul className="flex flex-col gap-1.5 border-r border-line p-2.5 font-mono text-[9.5px] text-faint">
            {["Frame", "Nav", "Hero", "Features", "Footer"].map((l) => (
              <li key={l} className={`whitespace-nowrap rounded px-1.5 py-1 ${l === "Hero" ? "bg-accent-soft font-semibold text-accent" : ""}`}>
                {l === "Frame" ? "▾ " : "· "}{l}
              </li>
            ))}
          </ul>
          <div className="relative bg-surface-2 p-4">
            <div className="rounded-lg bg-white p-3 shadow-(--shadow-soft)">
              <div className="flex justify-between">
                <i className="block h-1.5 w-8 rounded-full bg-ink" />
                <span className="flex gap-1"><i className="block h-1.5 w-4 rounded-full bg-line-2" /><i className="block h-1.5 w-4 rounded-full bg-line-2" /></span>
              </div>
              {/* selected block */}
              <div className="relative mt-3 rounded-sm p-1.5 outline-[1.5px] outline-accent outline-solid">
                <i className="block h-2.5 w-[85%] rounded bg-ink" />
                <i className="mt-1.5 block h-2.5 w-[60%] rounded bg-accent" />
                <i className="mt-2 block h-1.5 w-[90%] rounded-full bg-line-2" />
                <span className="mt-2 block h-3.5 w-12 rounded-full bg-ink" />
                {["-left-1 -top-1", "-right-1 -top-1", "-left-1 -bottom-1", "-right-1 -bottom-1"].map((p) => (
                  <i key={p} className={`absolute size-2 border border-accent bg-white ${p}`} />
                ))}
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded bg-accent px-1.5 py-px font-mono text-[9px] text-white">1440 × 640</span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-1.5">
                <i className="block h-7 rounded bg-surface-2" /><i className="block h-7 rounded bg-surface-2" /><i className="block h-7 rounded bg-surface-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2 — BUILD (code editor) */}
      <div className="absolute right-0 top-[150px] w-[70%] animate-float overflow-hidden rounded-2xl border border-white/10 bg-night shadow-(--shadow-float)">
        <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-2.5">
          <Step n={2} label="Build" />
          <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10.5px] text-white/70">Hero.tsx</span>
        </div>
        <pre className="overflow-hidden px-4 py-3.5 font-mono text-[11px] leading-[1.75] text-white/80">
          <span className="text-lime">export function</span> <span className="text-lime-2">Hero</span>({"{ "}data{" }"}) {"{"}{"\n"}
          {"  "}<span className="text-lime">return</span> ({"\n"}
          {"    "}<span className="text-white/45">&lt;</span><span className="text-white">section</span> <span className="text-lime-2">className</span>=<span className="text-night-muted">&quot;py-24&quot;</span><span className="text-white/45">&gt;</span>{"\n"}
          {"      "}<span className="text-white/45">&lt;</span><span className="text-white">h1</span><span className="text-white/45">&gt;</span>{"{"}data.title{"}"}<span className="text-white/45">&lt;/</span><span className="text-white">h1</span><span className="text-white/45">&gt;</span>{"\n"}
          {"      "}<span className="text-white/45">&lt;</span><span className="text-white">Button</span> <span className="text-lime-2">href</span>={"{"}data.cta{"}"} <span className="text-white/45">/&gt;</span>{"\n"}
          {"    "}<span className="text-white/45">&lt;/</span><span className="text-white">section</span><span className="text-white/45">&gt;</span>{"\n"}
          {"  "});{"\n"}
          {"}"}
        </pre>
        <div className="flex items-center gap-2 border-t border-white/10 px-4 py-2.5 font-mono text-[10.5px] text-white/55">
          <span className="size-1.5 rounded-full bg-lime" /> Deployed to Vercel
        </div>
      </div>

      {/* 3 — EDIT (CMS field) */}
      <div className="absolute bottom-0 left-[4%] w-[62%] animate-float-slow overflow-hidden rounded-2xl border border-line bg-surface shadow-(--shadow-lift)">
        <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
          <Step n={3} label="Edit" />
          <span className="font-mono text-[10.5px] text-faint">Sanity Studio</span>
        </div>
        <div className="flex flex-col gap-2.5 p-3.5">
          <span className="text-[11px] font-semibold text-ink-2">Hero title</span>
          <div className="rounded-lg border border-accent bg-white px-3 py-2 text-[12.5px] shadow-[0_0_0_3px_rgb(21_61_53/0.1)]">
            Spring collection is live<span className="ml-px inline-block h-3.5 w-px translate-y-0.5 bg-ink" />
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] text-muted">
              <span className="dot" /> Edited by your team
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-ok px-2.5 py-1 text-[11px] font-semibold text-white">
              <Icon name="check" strokeWidth={3} className="size-3" /> Publish
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
