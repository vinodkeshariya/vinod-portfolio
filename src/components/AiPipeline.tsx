import { Icon } from "./Icon";
import type { IconName } from "@/lib/data";

const steps: { label: string; icon: IconName }[] = [
  { label: "AI Planning", icon: "spark" },
  { label: "Claude Code", icon: "code" },
  { label: "Next.js Development", icon: "react" },
  { label: "Code Review", icon: "shield" },
  { label: "Deployment", icon: "bolt" },
];

/** Compact AI-powered build pipeline shown under the hero visual */
export function AiPipeline() {
  return (
    <div className="mx-auto w-full max-w-135 rounded-[14px] border border-line bg-surface px-4 pb-4 pt-3.5 shadow-(--shadow-soft) lg:mr-0">
      <p className="label-mono">AI-powered build pipeline</p>
      <ol className="mt-3.5 grid grid-cols-5">
        {steps.map((s, i) => (
          <li key={s.label} className="relative flex flex-col items-center gap-2 px-1 text-center">
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="absolute left-1/2 top-3.5 h-px w-full bg-accent-line" />
            )}
            <span className="relative grid size-7 place-items-center rounded-full bg-accent text-lime ring-4 ring-surface">
              <Icon name={s.icon} className="size-3.5" />
            </span>
            <span className="text-[11.5px] font-semibold leading-tight text-ink-2">{s.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
