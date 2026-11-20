import Image from "next/image";

/*
 * Decorative 3D-style illustrations for the inner-page heroes.
 * Built from CSS transforms + layered shadows and small isometric SVG cubes,
 * in the same forest / lime palette as the home page. Purely decorative (aria-hidden).
 */

/** Layered hard shadows give a flat element visible thickness */
function depth(steps: number, color: string, dir: 1 | -1 = 1) {
  return Array.from({ length: steps }, (_, i) => `${dir * (i + 1)}px ${i + 1}px 0 ${color}`).join(", ");
}
const drop = "0 50px 70px -30px rgb(21 61 53 / 0.45)";

/** Lime glow + ground shadow behind every illustration (matches the home hero) */
function Stage({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      aria-hidden="true"
      style={{ animationDelay: "200ms" }}
      className={`animate-fade-in relative mx-auto aspect-[1.12/1] w-full max-w-[500px] select-none lg:mr-0 ${className}`}
    >
      <span className="absolute -right-[14%] -top-[16%] size-[112%] rounded-full bg-[radial-gradient(closest-side,rgb(214_230_166/0.8),rgb(214_230_166/0.28)_60%,transparent)]" />
      <span className="absolute bottom-[3%] left-[16%] h-[9%] w-[66%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(21_61_53/0.22),transparent)]" />
      {children}
    </div>
  );
}

const tones = {
  lime: { top: ["#e3efbf", "#cde59a"], left: "#b9d96c", right: "#97bf4b" },
  forest: { top: ["#2f6a59", "#1d5145"], left: "#153d35", right: "#0e2d27" },
} as const;

/** Isometric cube with soft rounded edges */
export function Cube({ tone = "lime", className = "" }: { tone?: keyof typeof tones; className?: string }) {
  const c = tones[tone];
  const id = `cube-${tone}`;
  return (
    <svg viewBox="0 8 200 222" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.top[0]} />
          <stop offset="1" stopColor={c.top[1]} />
        </linearGradient>
      </defs>
      <g strokeLinejoin="round" strokeWidth="12">
        <path d="M13.4 70 100 120v100l-86.6-50z" fill={c.left} stroke={c.left} />
        <path d="M100 120 186.6 70v100L100 220z" fill={c.right} stroke={c.right} />
        <path d="M100 20 186.6 70 100 120 13.4 70z" fill={`url(#${id})`} stroke={`url(#${id})`} />
      </g>
    </svg>
  );
}

/** Isometric slab (flat diamond with thickness) for the stacked-layers art */
function Slab({ cy, tone, t = 34 }: { cy: number; tone: keyof typeof tones; t?: number }) {
  const c = tones[tone];
  const cx = 200;
  const w = 152;
  const h = 88;
  const id = `slab-${tone}-${cy}`;
  return (
    <g strokeLinejoin="round" strokeWidth="14">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.top[0]} />
          <stop offset="1" stopColor={c.top[1]} />
        </linearGradient>
      </defs>
      <path d={`M${cx - w} ${cy} L${cx} ${cy + h} L${cx} ${cy + h + t} L${cx - w} ${cy + t}Z`} fill={c.left} stroke={c.left} />
      <path d={`M${cx} ${cy + h} L${cx + w} ${cy} L${cx + w} ${cy + t} L${cx} ${cy + h + t}Z`} fill={c.right} stroke={c.right} />
      <path d={`M${cx} ${cy - h} L${cx + w} ${cy} L${cx} ${cy + h} L${cx - w} ${cy}Z`} fill={`url(#${id})`} stroke={`url(#${id})`} />
    </g>
  );
}

/* ------------------------------------------------------------------ */

/** A forest tile tilted in 3D with a glowing lime symbol on its face */
function TileArt({ children }: { children: React.ReactNode }) {
  return (
    <Stage>
      <div className="absolute left-[24%] top-[12%] w-[52%] animate-float">
        <div
          style={{ transform: "perspective(1100px) rotateY(-26deg) rotateX(12deg) rotateZ(-7deg)", boxShadow: `${depth(18, "#0b2621")}, ${drop}` }}
          className="grid aspect-square place-items-center rounded-[30px] border border-white/10 bg-[linear-gradient(150deg,#2f6a59,#153d35_55%,#0f3029)]"
        >
          {children}
        </div>
      </div>
      <Cube tone="lime" className="absolute bottom-[10%] left-[6%] w-[22%] animate-float-slow" />
      <Cube tone="forest" className="absolute right-[6%] top-[8%] w-[12%] animate-float-slow" />
    </Stage>
  );
}

/** About — code symbol */
export function CodeTileArt() {
  return (
    <TileArt>
      <svg viewBox="0 0 100 100" className="w-[58%] drop-shadow-[0_0_14px_rgb(185_217_108/0.6)]">
        <path d="M33 30 15 50l18 20M67 30l18 20-18 20M57 22 43 78" fill="none" stroke="#b9d96c" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </TileArt>
  );
}

/** 404 — "404" in the same glowing lime */
export function NotFoundArt() {
  return (
    <TileArt>
      <span className="font-display text-[clamp(44px,7vw,84px)] font-extrabold tracking-[-0.04em] text-lime [text-shadow:0_0_18px_rgb(185_217_108/0.55)]">
        404
      </span>
    </TileArt>
  );
}

/** Services — stacked forest / lime layers */
export function LayersArt() {
  return (
    <Stage>
      <svg viewBox="30 0 340 410" className="absolute left-[18%] top-[4%] w-[64%] drop-shadow-[0_40px_40px_rgb(21_61_53/0.25)]">
        <g className="animate-float-slow">
          <Slab cy={290} tone="forest" />
        </g>
        <g className="animate-float">
          <Slab cy={200} tone="lime" />
        </g>
        <g className="animate-float-slow">
          <Slab cy={110} tone="forest" />
        </g>
      </svg>
      <Cube tone="lime" className="absolute right-[4%] top-[10%] w-[11%] animate-float" />
    </Stage>
  );
}

/** Work — a tablet showing a real project screen */
export function DeviceArt() {
  return (
    <Stage>
      <div className="absolute left-[10%] top-[16%] w-[80%] animate-float">
        <div
          style={{ transform: "perspective(1300px) rotateY(-20deg) rotateX(10deg) rotateZ(-4deg)", boxShadow: `${depth(12, "#cfd1c6")}, ${drop}` }}
          className="rounded-[22px] bg-white p-[3.2%]"
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-[12px] bg-ink">
            <Image src="/images/projects/creative-agency/cover.webp" alt="" fill priority sizes="420px" className="object-cover object-left-top" />
          </div>
        </div>
      </div>
      <Cube tone="forest" className="absolute bottom-[8%] left-[4%] w-[17%] animate-float-slow" />
      <Cube tone="lime" className="absolute right-[3%] top-[6%] w-[10%] animate-float-slow" />
    </Stage>
  );
}

const code: [number, number, string][] = [
  [0, 38, "#b9d96c"], [1, 56, "#8fc1e8"], [1, 44, "#e3c48a"], [2, 62, "#d5dbd2"], [2, 34, "#b9d96c"],
  [1, 50, "#8fc1e8"], [0, 20, "#d5dbd2"], [0, 46, "#b9d96c"], [1, 58, "#e3c48a"], [1, 30, "#d5dbd2"],
];

/** Experience — a code monitor and a lime cube */
export function MonitorArt() {
  return (
    <Stage>
      <div className="absolute left-[4%] top-[12%] w-[74%] animate-float-slow">
        <div
          style={{ transform: "perspective(1200px) rotateY(20deg) rotateX(9deg) rotateZ(3deg)", boxShadow: `${depth(14, "#0a0d0b", -1)}, ${drop}` }}
          className="rounded-[18px] border border-white/5 bg-[#1b1f1c] p-[5%]"
        >
          <div className="mb-[6%] flex gap-1.5">
            <i className="size-2.5 rounded-full bg-[#ff5f57]" />
            <i className="size-2.5 rounded-full bg-[#febc2e]" />
            <i className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex flex-col gap-[3.2%]">
            {code.map(([indent, w, color], i) => (
              <span key={i} className="flex items-center gap-[3%]">
                <span className="w-[5%] shrink-0 text-right font-mono text-[9px] leading-none text-white/25">{i + 1}</span>
                <span className="h-[7px] rounded-full opacity-90" style={{ marginLeft: `${indent * 7}%`, width: `${w}%`, backgroundColor: color }} />
              </span>
            ))}
          </div>
        </div>
      </div>
      <Cube tone="lime" className="absolute bottom-[6%] right-[4%] w-[34%] animate-float" />
    </Stage>
  );
}
