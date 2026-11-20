/**
 * "Designed visuals" for blog posts: small diagrams written as JSON in a Markdown code block
 * and rendered as styled HTML in the site's look (real text — always crisp, accessible and correct).
 *
 *   ```visual
 *   { "kind": "steps", "title": "How a migration runs", "steps": [{ "title": "Audit", "text": "…" }, …] }
 *   ```
 *
 * Kinds:
 *   steps      { title, steps: [{ title, text }] }                         3–6 steps
 *   compare    { title, left: { label, points[] }, right: { label, points[] } }   2–6 points each
 *   checklist  { title, items: [string] }                                   3–8 items
 *
 * No imports, so the blog auto-post script can use the same checks.
 */

export type Visual =
  | { kind: "steps"; title: string; steps: { title: string; text: string }[] }
  | { kind: "compare"; title: string; left: { label: string; points: string[] }; right: { label: string; points: string[] } }
  | { kind: "checklist"; title: string; items: string[] };

const isText = (v: unknown, max: number): v is string => typeof v === "string" && v.trim().length > 0 && v.length <= max;

/** Parses and validates a visual block; throws a readable message when something is off */
export function parseVisual(json: string): Visual {
  let v: Record<string, unknown>;
  try {
    v = JSON.parse(json);
  } catch {
    throw new Error("visual block is not valid JSON");
  }
  if (!isText(v.title, 90)) throw new Error("visual needs a `title` (max 90 characters)");

  if (v.kind === "steps") {
    const steps = v.steps as { title?: unknown; text?: unknown }[];
    if (!Array.isArray(steps) || steps.length < 3 || steps.length > 6) throw new Error("`steps` visual needs 3–6 steps");
    if (!steps.every((s) => isText(s?.title, 60) && isText(s?.text, 180))) throw new Error("each step needs a short `title` and `text`");
    return { kind: "steps", title: v.title, steps: steps as { title: string; text: string }[] };
  }

  if (v.kind === "compare") {
    const side = (s: unknown) => {
      const c = s as { label?: unknown; points?: unknown[] };
      return isText(c?.label, 50) && Array.isArray(c.points) && c.points.length >= 2 && c.points.length <= 6 && c.points.every((p) => isText(p, 110));
    };
    if (!side(v.left) || !side(v.right)) throw new Error("`compare` visual needs `left` and `right`, each with a `label` and 2–6 short `points`");
    return v as Visual;
  }

  if (v.kind === "checklist") {
    const items = v.items as unknown[];
    if (!Array.isArray(items) || items.length < 3 || items.length > 8 || !items.every((i) => isText(i, 120))) {
      throw new Error("`checklist` visual needs 3–8 short `items`");
    }
    return { kind: "checklist", title: v.title, items: items as string[] };
  }

  throw new Error("visual `kind` must be steps, compare or checklist");
}

/* ---------- HTML (hast) output ---------- */

type Node = { type: string; tagName?: string; value?: string; properties?: Record<string, unknown>; children?: Node[] };

const tx = (value: string): Node => ({ type: "text", value });
const el = (tagName: string, className: string, children: Node[], extra: Record<string, unknown> = {}): Node => ({
  type: "element",
  tagName,
  properties: { className: className.split(" "), ...extra },
  children,
});
const decor = (className: string, children: Node[] = []) => el("span", className, children, { ariaHidden: "true" });

/** Builds the HTML tree for a visual (class names are styled in globals.css under `.article .viz`) */
export function visualToHast(v: Visual): Node {
  const title = el("figcaption", "viz-title", [decor("viz-title-dot"), tx(v.title)]);

  if (v.kind === "steps") {
    return el("figure", "viz viz-steps", [
      title,
      el(
        "ol",
        "viz-steps-list",
        v.steps.map((s, i) =>
          el("li", "viz-step", [decor("viz-num", [tx(String(i + 1))]), el("span", "viz-step-body", [el("strong", "", [tx(s.title)]), el("span", "viz-step-text", [tx(s.text)])])]),
        ),
      ),
    ]);
  }

  if (v.kind === "compare") {
    const col = (side: { label: string; points: string[] }, cls: string) =>
      el("div", `viz-col ${cls}`, [
        el("p", "viz-col-label", [tx(side.label)]),
        el("ul", "viz-col-list", side.points.map((p) => el("li", "", [decor("viz-mark"), tx(p)]))),
      ]);
    return el("figure", "viz viz-compare", [title, el("div", "viz-compare-grid", [col(v.left, "viz-col-a"), col(v.right, "viz-col-b")])]);
  }

  return el("figure", "viz viz-checklist", [title, el("ul", "viz-check-list", v.items.map((item) => el("li", "", [decor("viz-check"), tx(item)])))]);
}
