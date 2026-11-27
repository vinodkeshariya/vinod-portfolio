/**
 * Weekly blog auto-post.
 *
 * Takes the next unchecked topic from content/blog/_topics.md, has Gemini write the post from the
 * site's own content (fetched from the CMS through the site: GET /api/blog/autopost), then checks it:
 *   1. content rules  — no invented numbers/clients, only internal links, length, visuals…
 *   2. AI fact-check  — a second Gemini pass compares every claim with the site data
 * If something fails, Gemini gets one chance to fix it. The post is then sent to the site
 * (POST /api/blog/autopost), which saves it in the CMS as a draft and emails Vinod an approval link
 * (default) — or, with AUTO_PUBLISH=true and every check passed, publishes it straight away.
 * Run by .github/workflows/blog-autopost.yml every Monday.
 *
 * Local dry run (prints the post, saves nothing, sends no email):
 *   node --env-file=.env.local scripts/blog/autopost.mjs --dry-run
 * Options:
 *   --topic "pillar | Title | angle"   write about this instead of the queue's next topic (or env TOPIC)
 * Env:
 *   GEMINI_API_KEY      required
 *   BLOG_REVIEW_SECRET  required — authorises the calls to the site
 *   SITE_URL            optional, default https://vinodkeshariya.vercel.app (e.g. http://localhost:3000 for testing)
 *   AUTO_PUBLISH        "true" = publish posts that pass every check without asking
 *   GEMINI_MODELS       optional comma list, best first (default below; busy/unavailable models fall through)
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { defaultScenes, pillars, SCENES } from "../../src/lib/blog-meta.ts";
import { parseVisual } from "../../src/lib/blog-visuals.ts";

const ROOT = path.resolve(import.meta.dirname, "../..");
const TOPICS = path.join(ROOT, "content", "blog", "_topics.md");
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const topicArg = args.includes("--topic") ? args[args.indexOf("--topic") + 1] : process.env.TOPIC;
const KEY = process.env.GEMINI_API_KEY;
const SECRET = process.env.BLOG_REVIEW_SECRET;
const SITE = (process.env.SITE_URL || "https://vinodkeshariya.vercel.app").replace(/\/$/, "");
const autoPublish = process.env.AUTO_PUBLISH === "true";
// reliable model first; "latest" aliases follow so the script keeps working when older models retire
const MODELS = (process.env.GEMINI_MODELS || "gemini-3.5-flash,gemini-flash-latest,gemini-3.8-flash")
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log("[autopost]", ...a);

/* ---------------- outputs for the GitHub Action ---------------- */

const issuesFile = path.join(process.env.RUNNER_TEMP || os.tmpdir(), "blog-issues.md");
function output(values) {
  if (!process.env.GITHUB_OUTPUT) return;
  for (const [k, v] of Object.entries(values)) fs.appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${String(v).replace(/\n/g, " ")}\n`);
}
function finish(status, extra = {}, issues = []) {
  fs.mkdirSync(path.dirname(issuesFile), { recursive: true });
  fs.writeFileSync(issuesFile, issues.map((i) => `- ${i}`).join("\n") + (issues.length ? "\n" : ""));
  output({ status, ...extra });
  log(`status: ${status}`);
  if (issues.length) log("issues:\n  - " + issues.join("\n  - "));
}

/* ---------------- topic queue ---------------- */

const TOPIC_LINE = /^- \[( |x)\] ([a-z-]+) \| (.+?) \| (.+)$/;

function parseTopic(text, index = -1) {
  const m = text.trim().match(TOPIC_LINE) ?? `- [ ] ${text.trim()}`.match(TOPIC_LINE);
  if (!m || !(m[2] in pillars)) return null;
  return { index, done: m[1] === "x", pillar: m[2], title: m[3].trim(), angle: m[4].trim() };
}

function nextTopic() {
  if (topicArg) {
    const t = parseTopic(topicArg);
    if (!t) throw new Error(`--topic must look like "pillar | Title | angle" with pillar one of: ${Object.keys(pillars).join(", ")}`);
    return t;
  }
  const lines = fs.readFileSync(TOPICS, "utf8").split(/\r?\n/);
  return lines.map((l, i) => parseTopic(l, i)).find((t) => t && !t.done) ?? null;
}

function markTopicDone(topic) {
  if (topic.index < 0) return;
  const raw = fs.readFileSync(TOPICS, "utf8");
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  const lines = raw.split(/\r?\n/);
  lines[topic.index] = lines[topic.index].replace("- [ ]", "- [x]");
  fs.writeFileSync(TOPICS, lines.join(eol));
}

/* ---------------- the site: facts the post may use, saving the post ---------------- */

async function api(method, body) {
  const res = await fetch(`${SITE}/api/blog/autopost`, {
    method,
    headers: { Authorization: `Bearer ${SECRET}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(120_000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`The site answered ${res.status}: ${data.error ?? "no details"}`);
  return data;
}

// filled from the site in main()
let site, FACTS, ALLOWED_LINKS, allowedHrefs, serviceLinks, conceptBrands, published, styleExample;

const AUDIENCE = {
  "ai-for-business": "business owners, marketing managers and founders without a technical background who are considering AI features for their website",
  "ai-development": "developers, agencies and technical founders who want to understand a practical AI-assisted development workflow",
  "web-development": "business owners and teams choosing, rebuilding or improving a website (Next.js, Sanity CMS, WordPress)",
  "honest-takes": "potential clients comparing options — they want direct, balanced, honest guidance",
};

/* ---------------- Gemini ---------------- */

let working = 0; // index of the model that answered last — later calls start there

async function gemini({ system, prompt, schema, temperature }) {
  const errors = [];
  for (let m = working; m < MODELS.length; m++) {
    const model = MODELS[m];
    for (let attempt = 1; attempt <= 2; attempt++) {
      let res;
      try {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: "POST",
          headers: { "x-goog-api-key": KEY, "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature, responseMimeType: "application/json", responseSchema: schema, maxOutputTokens: 32768 },
          }),
          signal: AbortSignal.timeout(300_000),
        });
      } catch (e) {
        errors.push(`${model}: ${e.message}`);
        await sleep(attempt * 15_000);
        continue;
      }
      if (res.ok) {
        const data = await res.json();
        const cand = data.candidates?.[0];
        const text = (cand?.content?.parts ?? []).filter((p) => !p.thought).map((p) => p.text ?? "").join("");
        if (cand?.finishReason !== "STOP") {
          errors.push(`${model}: stopped early (${cand?.finishReason ?? data.promptFeedback?.blockReason ?? "no answer"})`);
          break;
        }
        try {
          const value = JSON.parse(text);
          working = m;
          return { model: data.modelVersion || model, value };
        } catch {
          errors.push(`${model}: answer was not valid JSON`);
          break;
        }
      }
      errors.push(`${model}: HTTP ${res.status} ${(await res.text()).slice(0, 140).replace(/\s+/g, " ")}`);
      // busy / server error: wait and retry the same model once; anything else: try the next model
      if (res.status >= 500 && attempt === 1) await sleep(15_000);
      else break;
    }
  }
  throw new Error(`Gemini could not answer:\n  ${errors.join("\n  ")}`);
}

const STR = { type: "STRING" };
const LIST = { type: "ARRAY", items: STR };
const side = { type: "OBJECT", properties: { label: STR, points: LIST }, required: ["label", "points"] };

const postSchema = () => ({
  type: "OBJECT",
  properties: {
    title: STR,
    description: STR,
    tags: LIST,
    service: { type: "STRING", enum: serviceLinks.map((s) => s.link) },
    cover: { type: "OBJECT", properties: { scene: { type: "STRING", enum: Object.keys(SCENES) }, labels: LIST }, required: ["scene", "labels"] },
    intro: STR,
    sections: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          heading: STR,
          body: STR,
          visual: {
            type: "OBJECT",
            nullable: true,
            properties: {
              kind: { type: "STRING", enum: ["steps", "compare", "checklist"] },
              title: STR,
              steps: { type: "ARRAY", items: { type: "OBJECT", properties: { title: STR, text: STR }, required: ["title", "text"] } },
              left: side,
              right: side,
              items: LIST,
            },
            required: ["kind", "title"],
          },
        },
        required: ["heading", "body"],
      },
    },
    closing: STR,
  },
  required: ["title", "description", "tags", "service", "cover", "intro", "sections", "closing"],
  propertyOrdering: ["title", "description", "tags", "service", "cover", "intro", "sections", "closing"],
});

const CHECK_SCHEMA = {
  type: "OBJECT",
  properties: { issues: { type: "ARRAY", items: { type: "OBJECT", properties: { quote: STR, problem: STR }, required: ["quote", "problem"] } } },
  required: ["issues"],
};

const writerSystem = () => `You write blog posts for the personal portfolio blog of ${site.name}, an ${site.role} based in ${site.location}.
Write in the first person as Vinod. The blog's goal: show practical expertise in AI-powered web development and bring in client enquiries.

HARD RULES — a post that breaks any of these is rejected:
1. About Vinod, state ONLY what the FACTS say. Never invent clients, companies, projects, results, anecdotes ("last month a client…"), numbers, percentages, prices, timelines or testimonials.
2. Items in FACTS.conceptProjects are concept projects, not client work. Prefer not to mention them; if you do, call them concept projects. Never name their brands.
3. No statistics, percentages, "x times faster", prices, currencies or guarantees.
4. Keep tool descriptions timeless: no version numbers, release dates, current pricing or "the latest/new in <year>" claims.
5. Links: only links from ALLOWED_LINKS, written as Markdown links. 2–4 links in the text, and the closing must link to /contact. No external links.
6. No placeholders or notes to the author. Never mention that AI or Gemini wrote the post.
7. Plain, clear English with American spelling. Short paragraphs (2–4 sentences); most sentences under 20 words.
   Say "I" for Vinod's work and "you" for the reader — never "we". Concrete and practical. No hype, no repetition.
   Avoid filler such as: delve, in today's fast-paced world, game-changer, revolutionize, unleash, unlock the full potential, cutting-edge, in conclusion.

STRUCTURE:
- title: specific and benefit-led, Title Case, at most 70 characters.
- description: one plain sentence, 120–165 characters, for Google results.
- tags: 3–5 short keywords.
- service: the most relevant service link.
- cover: the illustration for this post's cover. Pick the scene that best shows what the post is about, then write its
  labels — short, specific to THIS post, plain words, no numbers, prices, brands or client names. Respect the max lengths:
${Object.entries(SCENES)
  .map(([k, v]) => `    ${k}: ${v.guide} — max ${v.labels.join(" / ")} characters`)
  .join("\n")}
- intro: 2 short paragraphs (Markdown) that set up the reader's problem.
- sections: 4–6 sections. heading = short sentence-case H2 text (no "#"). body = Markdown: paragraphs, "-" bullet lists, **bold** sparingly, optional "### " sub-headings. Never use "#" or "##" inside a body.
- visuals: add a visual to 1 or 2 sections where it genuinely helps the reader:
    steps     → a process (3–6 steps; step title max 5 words, text max 18 words)
    compare   → two options side by side (left/right, label max 4 words, 3–5 points, each max 10 words)
    checklist → practical to-dos (4–8 items, each max 10 words)
  Fill only the fields for the chosen kind.
- closing: 1–2 short paragraphs with a soft call to action that links to /contact.
- Total length: 1,000–1,400 words.`;

function writerPrompt(topic) {
  return `TOPIC
- Category: ${topic.pillar} (${pillars[topic.pillar].label})
- Working title: ${topic.title}
- Angle / what to cover: ${topic.angle}
- Reader: ${AUDIENCE[topic.pillar]}

FACTS (the only source for anything about Vinod):
${JSON.stringify(FACTS, null, 1)}

ALLOWED_LINKS:
${ALLOWED_LINKS.map((l) => `- ${l}`).join("\n")}

EXISTING ARTICLES (don't repeat them; you may link to them):
${published.map((p) => `- ${p.title}: ${p.description}`).join("\n") || "- none yet"}

STYLE EXAMPLE — an existing post; match its tone and clarity, don't copy its content:
"""
${styleExample.slice(0, 6000)}
"""

Write the post now as JSON.`;
}

const CHECKER_SYSTEM = `You are a strict fact-checker for a developer's portfolio blog. You compare a post with FACTS about the author (Vinod Keshariya).
Flag a sentence when it:
1. states something about Vinod — experience, years, clients, employers, projects, results, tools he uses, certifications, numbers, timelines, prices, availability — that FACTS do not support;
2. presents a concept project as real client work, or names a client or brand;
3. contains a statistic, percentage, multiplier, price or a specific example presented as something that really happened;
4. promises or guarantees an outcome;
5. makes a time-sensitive or version-specific claim about a tool (versions, release dates, "latest", pricing), or a claim about a tool that is likely wrong;
6. gives advice that is clearly incorrect or unsafe.
Do NOT flag general, widely accepted explanations of technology, opinions framed as opinions, or reasonable paraphrases of FACTS.
Return {"issues": []} when nothing breaks these rules. Quote the exact sentence for every issue.`;

/* ---------------- assemble + rule checks ---------------- */

function cleanVisual(v) {
  if (!v) return null;
  if (v.kind === "steps") return { kind: "steps", title: v.title, steps: v.steps };
  if (v.kind === "compare") return { kind: "compare", title: v.title, left: v.left, right: v.right };
  if (v.kind === "checklist") return { kind: "checklist", title: v.title, items: v.items };
  return v;
}

/** Markdown body; "##" inside a section body is demoted to "###" so sections stay the only H2s */
function toBody(post) {
  const demote = (md) => md.replace(/^#{1,2}\s+/gm, "### ").trim();
  const sections = post.sections.map((s) => {
    const v = cleanVisual(s.visual);
    return [`## ${s.heading.replace(/^#+\s*/, "").trim()}`, demote(s.body), v ? "```visual\n" + JSON.stringify(v) + "\n```" : ""].filter(Boolean).join("\n\n");
  });
  return [demote(post.intro), ...sections, demote(post.closing)].join("\n\n") + "\n";
}

/** Shortens a label at a word boundary */
function shorten(text, max) {
  const t = String(text ?? "").trim();
  if (t.length <= max) return t;
  const cut = t
    .slice(0, max + 1)
    .replace(/\s+\S*$/, "")
    .replace(/[\s,;:—–-]+$/, "");
  return cut || t.slice(0, max);
}

/** The writer's cover scene, made safe to draw; falls back to the category's scene */
function coverScene(post, pillar) {
  const kind = post.cover?.scene;
  if (!(kind in SCENES)) return defaultScenes[pillar];
  const labels = SCENES[kind].labels.map((max, i) => shorten(post.cover.labels?.[i], max));
  return labels.every(Boolean) ? { kind, labels } : defaultScenes[pillar];
}

function ruleCheck(post) {
  const issues = [];
  const body = toBody(post);
  const prose = body.replace(/```visual[\s\S]*?```/g, " ");
  const all = [post.title, post.description, ...(post.cover?.labels ?? []), body].join("\n");
  const words = prose.split(/\s+/).filter(Boolean).length;

  if (post.title.length < 20 || post.title.length > 80) issues.push(`Title is ${post.title.length} characters (needs 20–80).`);
  if (post.description.length < 90 || post.description.length > 170) issues.push(`Description is ${post.description.length} characters (needs 90–170).`);
  if (post.tags.length < 3 || post.tags.length > 6) issues.push(`Needs 3–6 tags (has ${post.tags.length}).`);
  if (post.sections.length < 3 || post.sections.length > 7) issues.push(`Needs 4–6 sections (has ${post.sections.length}).`);
  if (words < 750 || words > 1900) issues.push(`Length is ${words} words (needs about 1,000–1,400).`);

  const visuals = post.sections.map((s) => cleanVisual(s.visual)).filter(Boolean);
  if (visuals.length < 1 || visuals.length > 2) issues.push(`Needs 1–2 visuals (has ${visuals.length}).`);
  for (const v of visuals) {
    try {
      parseVisual(JSON.stringify(v));
    } catch (e) {
      issues.push(`Visual "${v.title}": ${e.message}.`);
    }
  }

  const banned = [
    [/\b\d+(\.\d+)?\s?%|\bpercent\b/i, "a percentage"],
    [/\b\d+(\.\d+)?\s?(x|×)\s+(faster|more|better|cheaper|quicker)/i, 'an "x times" claim'],
    [/[$€£₹]\s?\d|\b(USD|INR|rupees|dollars|euros)\b/i, "a price"],
    [/guarantee/i, "a guarantee"],
    [/\[Vinod:|TODO|lorem ipsum|\[insert/i, "a placeholder"],
    [/\bas an AI\b|\blanguage model\b/i, "a mention of being an AI"],
    [/\bdelve|fast-paced (digital )?world|game[- ]changer|revolutioni[sz]e|unleash|unlock (the|its|your) (full )?potential|cutting-edge|in conclusion\b/i, "filler wording"],
  ];
  for (const [re, what] of banned) {
    const m = all.match(re);
    if (m) issues.push(`Contains ${what}: "${m[0]}".`);
  }
  for (const brand of conceptBrands) if (all.includes(brand)) issues.push(`Names the concept brand "${brand}".`);

  const links = [...body.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]);
  for (const href of links) if (!allowedHrefs.has(href)) issues.push(`Link not allowed: ${href}`);
  if (!links.includes("/contact")) issues.push("The post must link to /contact.");
  if (published.some((p) => p.title.toLowerCase() === post.title.toLowerCase())) issues.push("A post with this title already exists.");
  return issues;
}

async function factCheck(post) {
  const { value } = await gemini({
    system: CHECKER_SYSTEM,
    prompt: `FACTS:\n${JSON.stringify(FACTS, null, 1)}\n\nPOST:\n# ${post.title}\n${post.description}\n\n${toBody(post)}`,
    schema: CHECK_SCHEMA,
    temperature: 0,
  });
  return (value.issues ?? []).map((i) => `Fact-check: "${String(i.quote).slice(0, 160)}" — ${i.problem}`);
}

/* ---------------- run ---------------- */

async function main() {
  if (!KEY) throw new Error("GEMINI_API_KEY is not set");
  if (!SECRET) throw new Error("BLOG_REVIEW_SECRET is not set");
  const topic = nextTopic();
  if (!topic) {
    finish("none", {}, ["The topic queue in content/blog/_topics.md is empty — add new topics."]);
    if (!dryRun) await api("POST", { action: "notify", result: "none", issues: [] });
    return;
  }
  log(`topic: [${topic.pillar}] ${topic.title}`);

  ({ site, facts: FACTS, allowedLinks: ALLOWED_LINKS, serviceLinks, conceptBrands, published, styleExample } = await api("GET"));
  allowedHrefs = new Set(ALLOWED_LINKS.map((l) => l.split(" ")[0]));
  log(`site content loaded from ${SITE} (${published.length} published posts)`);

  let { model, value: post } = await gemini({ system: writerSystem(), prompt: writerPrompt(topic), schema: postSchema(), temperature: 0.7 });
  log(`written by ${model}: "${post.title}"`);
  let issues = [...ruleCheck(post), ...(await factCheck(post))];

  if (issues.length) {
    log(`fixing ${issues.length} issue(s)…`);
    ({ model, value: post } = await gemini({
      system: writerSystem(),
      prompt: `${writerPrompt(topic)}\n\nYOUR PREVIOUS DRAFT:\n${JSON.stringify(post)}\n\nIt has these problems:\n${issues
        .map((i) => `- ${i}`)
        .join("\n")}\n\nReturn the complete corrected post as JSON. Fix every problem and keep everything else.`,
      schema: postSchema(),
      temperature: 0.4,
    }));
    issues = [...ruleCheck(post), ...(await factCheck(post))];
  }

  const draft = {
    pillar: topic.pillar,
    title: post.title.trim(),
    description: post.description.trim(),
    tags: post.tags.map((t) => t.trim()).slice(0, 6),
    service: post.service,
    scene: coverScene(post, topic.pillar),
    content: toBody(post),
  };

  if (dryRun) {
    const file = path.join(os.tmpdir(), "blog-autopost-dry-run.json");
    fs.writeFileSync(file, JSON.stringify({ ...draft, issues }, null, 2));
    finish(issues.length ? "review" : "publish", { title: draft.title, model }, issues);
    log(`dry run — nothing saved. The post is in ${file}`);
    return;
  }

  const saved = await api("POST", { action: "save", post: draft, issues, autoPublish });
  markTopicDone(topic);
  finish(saved.status, { id: saved.id, slug: saved.slug, title: draft.title, url: saved.url, model }, issues);
  log(saved.status === "published" ? `published: ${saved.url}` : `saved as draft #${saved.id} — approval email sent`);
}

main().catch(async (e) => {
  finish("failed", {}, [e.message]);
  if (!dryRun && SECRET) {
    const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;
    const runUrl = GITHUB_RUN_ID ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}` : undefined;
    await api("POST", { action: "notify", result: "failed", issues: [e.message], runUrl }).catch((err) => log(`could not send the failure email: ${err.message}`));
  }
  process.exit(1);
});
