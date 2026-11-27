import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { keepDash, pillars, SCENES, type Pillar, type Scene } from "./blog-meta";
import { site } from "./data";

/*
 * Blog cover art, drawn with ImageResponse (Satori). Layout is flexbox only:
 * every element with more than one child needs display:flex.
 *   coverImage()  1200×630 — title + scene, for social shares and post cards
 *   sceneImage()  scene only on a transparent background, for the post hero
 */

const C = { forest: "#153d35", forest2: "#204b41", lime: "#b9d96c", soft: "#f1f6e3", ink: "#242824", muted: "#565d55", line: "#e1e2d9", paper2: "#f0f1ea", onDark: "#d5dfd4" };

let fonts: Promise<{ name: string; data: Buffer; weight: 600 | 800; style: "normal" }[]> | null = null;
function loadFonts() {
  const file = (w: number) => readFile(join(process.cwd(), `node_modules/@fontsource/manrope/files/manrope-latin-${w}-normal.woff`));
  fonts ??= Promise.all([file(600), file(800)]).then(([a, b]) => [
    { name: "Manrope", data: a, weight: 600 as const, style: "normal" as const },
    { name: "Manrope", data: b, weight: 800 as const, style: "normal" as const },
  ]);
  return fonts;
}

/** Vinod's round photo as a data URI (the generated images can't load site URLs while building) */
let avatar: Promise<string> | null = null;
function loadAvatar() {
  avatar ??= readFile(join(process.cwd(), "public/images/vinod-photo-round.png")).then((b) => `data:image/png;base64,${b.toString("base64")}`);
  return avatar;
}

type DrawProps = { l: string[]; avatar: string };

/** Labels for a scene, padded / clipped to what the drawing expects */
function labelsOf(scene: Scene) {
  const spec = SCENES[scene.kind].labels;
  return spec.map((max, i) => {
    const l = (scene.labels[i] ?? "").trim();
    return l.length > max ? l.slice(0, max - 1).trimEnd() + "…" : l;
  });
}

/* ---------- small building blocks ---------- */

const row = (extra: React.CSSProperties = {}): React.CSSProperties => ({ display: "flex", alignItems: "center", ...extra });
const col = (extra: React.CSSProperties = {}): React.CSSProperties => ({ display: "flex", flexDirection: "column", ...extra });
const card = (bg: string, extra: React.CSSProperties = {}): React.CSSProperties => col({ background: bg, borderRadius: 26, boxShadow: "0 30px 60px rgba(0,0,0,0.30)", ...extra });
const Bar = ({ w, h = 10, bg }: { w: number | string; h?: number; bg: string }) => <div style={{ display: "flex", width: w, height: h, borderRadius: 999, background: bg }} />;
const Dot = ({ size, bg }: { size: number; bg: string }) => <div style={{ display: "flex", width: size, height: size, borderRadius: 999, background: bg, flexShrink: 0 }} />;
const Text = ({ children, size = 16, weight = 600, color = C.ink, extra = {} }: { children: React.ReactNode; size?: number; weight?: 600 | 800; color?: string; extra?: React.CSSProperties }) => (
  <div style={{ display: "flex", fontSize: size, fontWeight: weight, color, lineHeight: 1.3, ...extra }}>{children}</div>
);
const Traffic = () => (
  <div style={row({ gap: 8 })}>
    {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
      <Dot key={c} size={12} bg={c} />
    ))}
  </div>
);
/** Lime circle with a forest tick */
const Check = ({ size = 30, bg = C.forest, tick = C.lime }: { size?: number; bg?: string; tick?: string }) => (
  <div style={row({ width: size, height: size, borderRadius: 999, background: bg, justifyContent: "center", flexShrink: 0 })}>
    <div style={{ display: "flex", width: size * 0.36, height: size * 0.2, borderLeft: `3px solid ${tick}`, borderBottom: `3px solid ${tick}`, transform: "rotate(-45deg)", marginTop: -size * 0.08 }} />
  </div>
);

/* ---------- scenes (each about 430 px wide) ---------- */

function Chat({ l }: DrawProps) {
  return (
    <div style={card("#ffffff", { width: 420, padding: 24, gap: 14 })}>
      <div style={row({ gap: 12, paddingBottom: 12, borderBottom: `2px solid ${C.line}` })}>
        <div style={row({ width: 38, height: 38, borderRadius: 999, background: C.forest, justifyContent: "center" })}>
          <Dot size={13} bg={C.lime} />
        </div>
        <Text size={17} weight={800}>
          AI assistant
        </Text>
        <div style={{ display: "flex", marginLeft: "auto" }}>
          <Dot size={11} bg="#2f7d4f" />
        </div>
      </div>
      <div style={col({ alignSelf: "flex-end", maxWidth: 300, padding: "12px 16px", borderRadius: 18, borderBottomRightRadius: 5, background: C.forest })}>
        <Text size={16} color="#ffffff">
          {l[0]}
        </Text>
      </div>
      <div style={col({ maxWidth: 340, padding: "12px 16px", borderRadius: 18, borderBottomLeftRadius: 5, background: C.soft, border: "1.5px solid #d9e7b8" })}>
        <Text size={16}>{l[1]}</Text>
      </div>
      <div style={row({ gap: 10, padding: "8px 8px 8px 18px", borderRadius: 999, border: `2px solid ${C.line}` })}>
        <Text size={14} color="#8a908a">
          Ask a question…
        </Text>
        <div style={{ display: "flex", marginLeft: "auto" }}>
          <Dot size={34} bg={C.lime} />
        </div>
      </div>
    </div>
  );
}

const codeLines: [number, number, string][] = [
  [0, 46, "#b9d96c"], [1, 64, "#8fc1e8"], [1, 50, "#e3c48a"], [2, 70, "#d5dbd2"], [2, 40, "#b9d96c"], [1, 58, "#8fc1e8"], [0, 26, "#d5dbd2"], [0, 52, "#b9d96c"],
];

function Code({ l }: DrawProps) {
  return (
    <div style={{ display: "flex", position: "relative" }}>
      <div style={card("#1b1f1c", { width: 420, padding: 24, gap: 13 })}>
        <div style={row({ gap: 14, marginBottom: 6 })}>
          <Traffic />
          <div style={row({ padding: "5px 12px", borderRadius: 8, background: "rgba(255,255,255,0.08)" })}>
            <Text size={14} color="#d5dbd2">
              {l[0]}
            </Text>
          </div>
        </div>
        {codeLines.map(([indent, w, color], i) => (
          <div key={i} style={row({ gap: 14 })}>
            <Text size={13} color="rgba(255,255,255,0.25)" extra={{ width: 16 }}>
              {String(i + 1)}
            </Text>
            <div style={{ display: "flex", marginLeft: indent * 24, width: `${w}%`, height: 10, borderRadius: 999, background: color }} />
          </div>
        ))}
      </div>
      <div style={row({ position: "absolute", left: -30, bottom: -28, gap: 12, padding: "13px 20px 13px 14px", borderRadius: 18, background: "#ffffff", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" })}>
        <Check size={32} bg={C.lime} tick={C.forest} />
        <Text size={16} weight={800}>
          {l[1]}
        </Text>
      </div>
    </div>
  );
}

function Browser({ l }: DrawProps) {
  return (
    <div style={card("#ffffff", { width: 430, padding: 20, gap: 14 })}>
      <div style={row({ gap: 8 })}>
        <Traffic />
        <div style={{ display: "flex", marginLeft: 12, width: 220, height: 18, borderRadius: 999, background: C.paper2, border: `1.5px solid ${C.line}` }} />
      </div>
      <div style={col({ gap: 12, padding: 24, borderRadius: 16, background: `linear-gradient(135deg, ${C.forest}, ${C.forest2})` })}>
        <Bar w={80} h={7} bg={C.lime} />
        <Text size={24} weight={800} color="#ffffff" extra={{ maxWidth: 330 }}>
          {l[0]}
        </Text>
        <Bar w={96} h={22} bg={C.lime} />
      </div>
      <div style={row({ gap: 12, alignItems: "stretch" })}>
        {l.slice(1).map((label, i) => (
          <div key={i} style={col({ flex: 1, gap: 8, padding: 14, borderRadius: 14, background: C.paper2, border: `1.5px solid ${C.line}` })}>
            <div style={{ display: "flex", width: 22, height: 22, borderRadius: 6, background: i === 1 ? C.lime : C.forest }} />
            <Text size={14} weight={800}>
              {label}
            </Text>
            <Bar w="70%" h={7} bg="rgba(36,40,36,0.25)" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Search({ l }: DrawProps) {
  return (
    <div style={card("#ffffff", { width: 430, padding: 22, gap: 14 })}>
      <div style={row({ gap: 12, padding: "12px 16px", borderRadius: 999, border: `2px solid ${C.forest}` })}>
        <div style={{ display: "flex", position: "relative", width: 20, height: 20 }}>
          <div style={{ display: "flex", width: 15, height: 15, borderRadius: 999, border: `3px solid ${C.forest}` }} />
          <div style={{ display: "flex", position: "absolute", right: 0, bottom: 1, width: 8, height: 3, background: C.forest, transform: "rotate(45deg)" }} />
        </div>
        <Text size={16}>{l[0]}</Text>
      </div>
      <div style={col({ gap: 8, padding: 16, borderRadius: 16, background: C.soft, border: "1.5px solid #d9e7b8" })}>
        <div style={row({ gap: 8 })}>
          <Dot size={9} bg={C.forest} />
          <Text size={12} weight={800} color={C.forest} extra={{ letterSpacing: 1.5, textTransform: "uppercase" }}>
            AI answer
          </Text>
        </div>
        <Text size={16}>{l[1]}</Text>
      </div>
      {l.slice(2).map((label, i) => (
        <div key={i} style={col({ gap: 7, padding: "4px 4px" })}>
          <Text size={15} weight={800} color={C.forest}>
            {label}
          </Text>
          <Bar w={`${80 - i * 15}%`} h={8} bg={C.line} />
        </div>
      ))}
    </div>
  );
}

function Migration({ l }: DrawProps) {
  const side = (title: string, dark: boolean) => (
    <div style={card(dark ? C.forest : "#ffffff", { width: 178, padding: 18, gap: 12 })}>
      <Text size={15} weight={800} color={dark ? C.lime : C.ink}>
        {title}
      </Text>
      {l.map((label, i) => (
        <div key={i} style={row({ gap: 9 })}>
          {dark ? <Check size={20} bg={C.lime} tick={C.forest} /> : <Dot size={10} bg="#cfd1c6" />}
          <Text size={14} color={dark ? "#ffffff" : C.muted}>
            {label}
          </Text>
        </div>
      ))}
    </div>
  );
  return (
    <div style={row({ gap: 14 })}>
      {side("WordPress", false)}
      <div style={row({ width: 46, height: 46, borderRadius: 999, background: C.lime, justifyContent: "center", flexShrink: 0 })}>
        <div style={{ display: "flex", width: 14, height: 14, borderTop: `4px solid ${C.forest}`, borderRight: `4px solid ${C.forest}`, transform: "rotate(45deg)", marginLeft: -5 }} />
      </div>
      {side("Next.js + Sanity", true)}
    </div>
  );
}

function Cms({ l }: DrawProps) {
  return (
    <div style={card("#ffffff", { width: 430, padding: 22, gap: 14 })}>
      <div style={row({ gap: 10 })}>
        <div style={row({ width: 24, height: 24, borderRadius: 6, background: C.forest, justifyContent: "center" })}>
          <Dot size={9} bg={C.lime} />
        </div>
        <Text size={14} color={C.muted}>
          Studio
        </Text>
        <div style={row({ marginLeft: "auto", padding: "6px 14px", borderRadius: 8, background: "#2f7d4f" })}>
          <Text size={13} weight={800} color="#ffffff">
            Publish
          </Text>
        </div>
      </div>
      <Text size={20} weight={800}>
        {l[0]}
      </Text>
      {l.slice(1).map((label, i) => (
        <div key={i} style={col({ gap: 6 })}>
          <Text size={13} weight={800} color={C.muted}>
            {label}
          </Text>
          <div style={row({ height: 38, padding: "0 14px", borderRadius: 9, border: i === 0 ? "2px solid #2b5fd9" : `1.5px solid ${C.line}` })}>
            <Bar w={`${70 - i * 18}%`} h={8} bg="rgba(36,40,36,0.22)" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Checklist({ l }: DrawProps) {
  return (
    <div style={card("#ffffff", { width: 420, padding: 24, gap: 12 })}>
      <Bar w={120} h={9} bg={C.lime} />
      {l.map((label, i) => (
        <div key={i} style={row({ gap: 12, padding: "12px 14px", borderRadius: 14, background: i % 2 ? "#ffffff" : C.soft, border: `1.5px solid ${i % 2 ? C.line : "#d9e7b8"}` })}>
          <Check size={28} />
          <Text size={16}>{label}</Text>
        </div>
      ))}
    </div>
  );
}

function Steps({ l }: DrawProps) {
  return (
    <div style={card(`linear-gradient(135deg, ${C.forest}, ${C.forest2})`, { width: 400, padding: 26, gap: 0 })}>
      {l.map((label, i) => (
        <div key={i} style={row({ gap: 16, alignItems: "flex-start" })}>
          <div style={col({ alignItems: "center" })}>
            <div style={row({ width: 38, height: 38, borderRadius: 999, background: C.lime, justifyContent: "center" })}>
              <Text size={16} weight={800} color={C.forest}>
                {String(i + 1)}
              </Text>
            </div>
            {i < l.length - 1 && <div style={{ display: "flex", width: 2, height: 30, background: "rgba(185,217,108,0.4)" }} />}
          </div>
          <Text size={18} weight={800} color="#ffffff" extra={{ marginTop: 8 }}>
            {label}
          </Text>
        </div>
      ))}
    </div>
  );
}

function Compare({ l }: DrawProps) {
  const side = (title: string, dark: boolean) => (
    <div style={card(dark ? C.forest : "#ffffff", { width: 196, padding: 20, gap: 13 })}>
      <Text size={17} weight={800} color={dark ? C.lime : C.ink}>
        {title}
      </Text>
      {[0, 1, 2].map((i) => (
        <div key={i} style={row({ gap: 9 })}>
          {dark ? <Check size={20} bg={C.lime} tick={C.forest} /> : <Dot size={10} bg="#cfd1c6" />}
          <Bar w={`${78 - i * 14}%`} h={8} bg={dark ? "rgba(255,255,255,0.75)" : "rgba(36,40,36,0.22)"} />
        </div>
      ))}
    </div>
  );
  return (
    <div style={row({ position: "relative", gap: 26 })}>
      {side(l[0], false)}
      {side(l[1], true)}
      <div style={row({ position: "absolute", left: 189, top: 70, width: 44, height: 44, borderRadius: 999, background: C.lime, justifyContent: "center", border: "4px solid #ffffff" })}>
        <Text size={14} weight={800} color={C.forest}>
          VS
        </Text>
      </div>
    </div>
  );
}

function Shield({ l }: DrawProps) {
  return (
    <div style={card("#ffffff", { width: 420, padding: 26, gap: 14 })}>
      <div style={row({ gap: 16 })}>
        <svg width="62" height="70" viewBox="0 0 62 70">
          <path d="M31 2 58 12v20c0 17-11 30-27 36C15 62 4 49 4 32V12z" fill={C.forest} />
          <path d="M19 35l8 8 16-17" fill="none" stroke={C.lime} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={col({ gap: 8 })}>
          <Bar w={150} h={11} bg="rgba(36,40,36,0.75)" />
          <Bar w={100} h={8} bg={C.line} />
        </div>
      </div>
      {l.map((label, i) => (
        <div key={i} style={row({ gap: 12, padding: "11px 14px", borderRadius: 14, background: C.soft, border: "1.5px solid #d9e7b8" })}>
          <Check size={26} />
          <Text size={16}>{label}</Text>
        </div>
      ))}
    </div>
  );
}

function Quote({ l, avatar }: DrawProps) {
  return (
    <div style={card("linear-gradient(150deg, #eef6d6, #b9d96c)", { width: 400, padding: 34, gap: 18 })}>
      <svg width="80" height="80" viewBox="0 0 100 100" fill={C.forest}>
        <path d="M18 70V52c0-14 7-25 22-30l4 8c-8 4-12 9-12 16h10v24zm40 0V52c0-14 7-25 22-30l4 8c-8 4-12 9-12 16h10v24z" />
      </svg>
      <Text size={24} weight={800} color={C.forest}>
        {l[0]}
      </Text>
      <div style={row({ gap: 12, marginTop: 6 })}>
        <img src={avatar} width={42} height={42} style={{ borderRadius: 999, border: `2px solid ${C.forest}` }} alt="" />
        <Text size={16} weight={800} color={C.forest}>
          {site.name}
        </Text>
      </div>
    </div>
  );
}

const draw = { chat: Chat, code: Code, browser: Browser, search: Search, migration: Migration, cms: Cms, checklist: Checklist, steps: Steps, compare: Compare, shield: Shield, quote: Quote };

/* ---------- cubes (same shape as the site's hero art) ---------- */

function cube(top: [string, string], left: string, right: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 8 200 222"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${top[0]}"/><stop offset="1" stop-color="${top[1]}"/></linearGradient></defs><g stroke-linejoin="round" stroke-width="12"><path d="M13.4 70 100 120v100l-86.6-50z" fill="${left}" stroke="${left}"/><path d="M100 120 186.6 70v100L100 220z" fill="${right}" stroke="${right}"/><path d="M100 20 186.6 70 100 120 13.4 70z" fill="url(#g)" stroke="url(#g)"/></g></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
const limeCube = cube(["#e3efbf", "#cde59a"], "#b9d96c", "#97bf4b");
const mintCube = cube(["#5d9a83", "#3f7a66"], "#2f6a59", "#24574a");
const forestCube = cube(["#2f6a59", "#1d5145"], "#153d35", "#0e2d27");

/** The scene, tilted, with two cubes — `size` is the square-ish box it sits in */
function SceneBlock({ scene, width, height, scale = 1, onDark, avatar }: { scene: Scene; width: number; height: number; scale?: number; onDark: boolean; avatar: string }) {
  const Drawing = draw[scene.kind];
  return (
    <div style={row({ position: "relative", width, height, justifyContent: "center" })}>
      <div style={{ display: "flex", transform: `scale(${scale}) rotate(-4deg)` }}>
        <Drawing l={labelsOf(scene)} avatar={avatar} />
      </div>
      <img src={limeCube} width={118 * scale} height={131 * scale} style={{ position: "absolute", right: 30 * scale, bottom: 30 * scale }} alt="" />
      <img src={onDark ? mintCube : forestCube} width={62 * scale} height={69 * scale} style={{ position: "absolute", right: 56 * scale, top: 40 * scale }} alt="" />
    </div>
  );
}

/* ---------- images ---------- */

/** 1200×630 cover: category + title on the left, the post's scene on the right */
export async function coverImage({ title, pillar, scene }: { title: string; pillar: Pillar; scene: Scene }) {
  const t = keepDash(title);
  const titleSize = t.length > 64 ? 46 : t.length > 44 ? 52 : 60;
  const host = site.url.replace(/^https?:\/\//, "");
  const photo = await loadAvatar();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: `linear-gradient(135deg, ${C.forest} 0%, ${C.forest2} 100%)`, fontFamily: "Manrope" }}>
        <div style={{ display: "flex", position: "absolute", right: -120, top: -150, width: 720, height: 720, borderRadius: 999, background: "radial-gradient(circle, rgba(185,217,108,0.26) 0%, rgba(185,217,108,0.08) 45%, rgba(185,217,108,0) 70%)" }} />
        <div style={{ display: "flex", position: "absolute", right: -200, top: -240, width: 760, height: 760, borderRadius: 999, border: "2px solid rgba(185,217,108,0.28)" }} />

        <div style={col({ justifyContent: "space-between", width: 640, padding: "60px 0 56px 68px" })}>
          <div style={{ display: "flex" }}>
            <div style={row({ gap: 12, padding: "10px 20px", borderRadius: 999, background: "rgba(185,217,108,0.14)", border: "1.5px solid rgba(185,217,108,0.45)", color: C.lime, fontSize: 18, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase" })}>
              <Dot size={10} bg={C.lime} />
              {pillars[pillar].label}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: titleSize, fontWeight: 800, lineHeight: 1.13, letterSpacing: -1.4, color: "#ffffff" }}>{t}</div>
          <div style={row({ gap: 16 })}>
            <img src={photo} width={60} height={60} style={{ borderRadius: 999, border: `3px solid ${C.lime}` }} alt="" />
            <div style={col({ gap: 2 })}>
              <Text size={23} weight={800} color="#ffffff">
                {site.name}
              </Text>
              <Text size={17} color={C.onDark}>
                {`${site.role} · ${host}`}
              </Text>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", position: "absolute", left: 690, top: 0 }}>
          <SceneBlock scene={scene} width={510} height={630} onDark avatar={photo} />
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: await loadFonts() },
  );
}

/** The scene alone on a transparent background (960×860), for the post hero */
export async function sceneImage(scene: Scene) {
  const photo = await loadAvatar();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", fontFamily: "Manrope" }}>
        <SceneBlock scene={scene} width={960} height={860} scale={1.6} onDark={false} avatar={photo} />
      </div>
    ),
    { width: 960, height: 860, fonts: await loadFonts() },
  );
}
