import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getPosts, keepDash, pillars, type Pillar } from "@/lib/blog";
import { site } from "@/lib/data";

/**
 * Branded cover for every blog post (1200×630): title on the left, a category illustration on the right.
 * Used as the social-share image, and as the post's cover on the site when it has no `cover` of its own.
 * (ImageResponse supports flexbox-only layout — every element with several children needs display:flex.)
 */
export const alt = `${site.name} — blog article`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

const fontFile = (weight: number) =>
  readFile(join(process.cwd(), `node_modules/@fontsource/manrope/files/manrope-latin-${weight}-normal.woff`));
const [semibold, extrabold] = await Promise.all([fontFile(600), fontFile(800)]);

const C = { forest: "#153d35", forest2: "#204b41", lime: "#b9d96c", soft: "#f1f6e3", ink: "#242824", line: "#e1e2d9", muted: "#d5dfd4" };

/** Isometric cube, same shape as the site's hero art */
function cube(top: [string, string], left: string, right: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 8 200 222"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${top[0]}"/><stop offset="1" stop-color="${top[1]}"/></linearGradient></defs><g stroke-linejoin="round" stroke-width="12"><path d="M13.4 70 100 120v100l-86.6-50z" fill="${left}" stroke="${left}"/><path d="M100 120 186.6 70v100L100 220z" fill="${right}" stroke="${right}"/><path d="M100 20 186.6 70 100 120 13.4 70z" fill="url(#g)" stroke="url(#g)"/></g></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
const limeCube = cube(["#e3efbf", "#cde59a"], "#b9d96c", "#97bf4b");
const mintCube = cube(["#5d9a83", "#3f7a66"], "#2f6a59", "#24574a");

/** A skeleton text line */
const Bar = ({ w, h = 10, bg }: { w: number | string; h?: number; bg: string }) => (
  <div style={{ display: "flex", width: w, height: h, borderRadius: 999, background: bg }} />
);

const card = { display: "flex", flexDirection: "column" as const, borderRadius: 26, boxShadow: "0 30px 60px rgba(0,0,0,0.35)" };

function Chat() {
  return (
    <div style={{ ...card, width: 400, padding: 26, gap: 16, background: "#ffffff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14, borderBottom: `2px solid ${C.line}` }}>
        <div style={{ display: "flex", width: 40, height: 40, borderRadius: 999, background: C.forest, alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", width: 14, height: 14, borderRadius: 999, background: C.lime }} />
        </div>
        <Bar w={130} h={12} bg="rgba(36,40,36,0.8)" />
        <div style={{ display: "flex", marginLeft: "auto", width: 12, height: 12, borderRadius: 999, background: "#2f7d4f" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignSelf: "flex-end", width: 240, gap: 8, padding: 16, borderRadius: 18, borderBottomRightRadius: 5, background: C.forest }}>
        <Bar w="90%" h={9} bg="rgba(255,255,255,0.85)" />
        <Bar w="60%" h={9} bg="rgba(255,255,255,0.85)" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: 290, gap: 8, padding: 16, borderRadius: 18, borderBottomLeftRadius: 5, background: C.soft, border: "1.5px solid #d9e7b8" }}>
        <Bar w="94%" h={9} bg="rgba(36,40,36,0.5)" />
        <Bar w="80%" h={9} bg="rgba(36,40,36,0.5)" />
        <Bar w="50%" h={9} bg="rgba(36,40,36,0.5)" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 8px 8px 18px", borderRadius: 999, border: `2px solid ${C.line}` }}>
        <Bar w={170} h={9} bg={C.line} />
        <div style={{ display: "flex", marginLeft: "auto", width: 36, height: 36, borderRadius: 999, background: C.lime }} />
      </div>
    </div>
  );
}

const code: [number, number, string][] = [
  [0, 46, "#b9d96c"], [1, 64, "#8fc1e8"], [1, 50, "#e3c48a"], [2, 70, "#d5dbd2"], [2, 40, "#b9d96c"],
  [1, 58, "#8fc1e8"], [0, 26, "#d5dbd2"], [0, 52, "#b9d96c"], [1, 66, "#e3c48a"],
];

function Code() {
  return (
    <div style={{ display: "flex", position: "relative" }}>
      <div style={{ ...card, width: 420, padding: 28, gap: 13, background: "#1b1f1c" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} style={{ display: "flex", width: 13, height: 13, borderRadius: 999, background: c }} />
          ))}
        </div>
        {code.map(([indent, w, color], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", width: 16, fontSize: 13, color: "rgba(255,255,255,0.25)" }}>{i + 1}</div>
            <div style={{ display: "flex", marginLeft: indent * 24, width: `${w}%`, height: 10, borderRadius: 999, background: color }} />
          </div>
        ))}
      </div>
      {/* "reviewed" badge */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: -34,
          bottom: -30,
          alignItems: "center",
          gap: 12,
          padding: "14px 20px",
          borderRadius: 18,
          background: "#ffffff",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ display: "flex", width: 34, height: 34, borderRadius: 999, background: C.lime, alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", width: 12, height: 7, borderLeft: `3px solid ${C.forest}`, borderBottom: `3px solid ${C.forest}`, transform: "rotate(-45deg)", marginTop: -3 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <Bar w={110} h={10} bg="rgba(36,40,36,0.8)" />
          <Bar w={70} h={8} bg={C.line} />
        </div>
      </div>
    </div>
  );
}

function Browser() {
  return (
    <div style={{ ...card, width: 430, padding: 20, gap: 14, background: "#ffffff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ display: "flex", width: 12, height: 12, borderRadius: 999, background: c }} />
        ))}
        <div style={{ display: "flex", marginLeft: 14, width: 220, height: 18, borderRadius: 999, background: "#f0f1ea", border: `1.5px solid ${C.line}` }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 11, padding: 26, borderRadius: 16, background: `linear-gradient(135deg, ${C.forest}, ${C.forest2})` }}>
        <Bar w={90} h={8} bg={C.lime} />
        <Bar w="72%" h={14} bg="rgba(255,255,255,0.9)" />
        <Bar w="50%" h={14} bg="rgba(255,255,255,0.9)" />
        <Bar w={96} h={22} bg={C.lime} />
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {[C.forest, C.lime, C.forest].map((c, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", flex: 1, gap: 9, padding: 14, borderRadius: 14, background: "#f0f1ea", border: `1.5px solid ${C.line}` }}>
            <div style={{ display: "flex", width: 22, height: 22, borderRadius: 6, background: c }} />
            <Bar w="86%" h={8} bg="rgba(36,40,36,0.6)" />
            <Bar w="58%" h={7} bg="rgba(36,40,36,0.3)" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Quote() {
  return (
    <div style={{ ...card, width: 380, padding: 36, gap: 16, background: "linear-gradient(150deg, #eef6d6, #b9d96c)" }}>
      <svg width="96" height="96" viewBox="0 0 100 100" fill={C.forest}>
        <path d="M18 70V52c0-14 7-25 22-30l4 8c-8 4-12 9-12 16h10v24zm40 0V52c0-14 7-25 22-30l4 8c-8 4-12 9-12 16h10v24z" />
      </svg>
      <Bar w="92%" h={15} bg="rgba(21,61,53,0.85)" />
      <Bar w="80%" h={15} bg="rgba(21,61,53,0.85)" />
      <Bar w="56%" h={15} bg="rgba(21,61,53,0.85)" />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
        <div style={{ display: "flex", width: 40, height: 40, borderRadius: 999, background: C.forest }} />
        <Bar w={120} h={10} bg="rgba(21,61,53,0.55)" />
      </div>
    </div>
  );
}

const motif: Record<Pillar, () => React.JSX.Element> = {
  "ai-for-business": Chat,
  "ai-development": Code,
  "web-development": Browser,
  "honest-takes": Quote,
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPosts().find((p) => p.slug === slug);
  const pillar: Pillar = post?.pillar ?? "ai-development";
  const title = keepDash(post?.title ?? `${site.name} — Blog`);
  const titleSize = title.length > 64 ? 46 : title.length > 44 ? 52 : 60;
  const host = site.url.replace(/^https?:\/\//, "");
  const Motif = motif[pillar];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: `linear-gradient(135deg, ${C.forest} 0%, ${C.forest2} 100%)`,
          fontFamily: "Manrope",
        }}
      >
        {/* glow + ring behind the illustration, like the page heroes */}
        <div style={{ display: "flex", position: "absolute", right: -120, top: -150, width: 720, height: 720, borderRadius: 999, background: "radial-gradient(circle, rgba(185,217,108,0.26) 0%, rgba(185,217,108,0.08) 45%, rgba(185,217,108,0) 70%)" }} />
        <div style={{ display: "flex", position: "absolute", right: -200, top: -240, width: 760, height: 760, borderRadius: 999, border: "2px solid rgba(185,217,108,0.28)" }} />

        {/* left: text */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 640, padding: "60px 0 56px 68px" }}>
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 20px",
                borderRadius: 999,
                background: "rgba(185,217,108,0.14)",
                border: "1.5px solid rgba(185,217,108,0.45)",
                color: C.lime,
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: 2.5,
                textTransform: "uppercase",
              }}
            >
              <div style={{ display: "flex", width: 10, height: 10, borderRadius: 999, background: C.lime }} />
              {pillars[pillar].label}
            </div>
          </div>

          <div style={{ display: "flex", fontSize: titleSize, fontWeight: 800, lineHeight: 1.13, letterSpacing: -1.4, color: "#ffffff" }}>{title}</div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", width: 58, height: 58, borderRadius: 999, background: C.lime, color: C.forest, alignItems: "center", justifyContent: "center", fontSize: 23, fontWeight: 800 }}>
              {site.initials}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ display: "flex", fontSize: 23, fontWeight: 800, color: "#ffffff" }}>{site.name}</div>
              <div style={{ display: "flex", fontSize: 17, fontWeight: 600, color: C.muted }}>
                {site.role} · {host}
              </div>
            </div>
          </div>
        </div>

        {/* right: category illustration with cubes */}
        <div style={{ display: "flex", position: "absolute", left: 700, top: 0, width: 500, height: 630, alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", transform: "rotate(-4deg)" }}>
            <Motif />
          </div>
          <img src={limeCube} width={118} height={131} style={{ position: "absolute", right: 34, bottom: 46 }} alt="" />
          <img src={mintCube} width={64} height={71} style={{ position: "absolute", right: 64, top: 52 }} alt="" />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Manrope", data: semibold, weight: 600, style: "normal" },
        { name: "Manrope", data: extrabold, weight: 800, style: "normal" },
      ],
    },
  );
}
