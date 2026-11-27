import Link from "next/link";
import { Fragment } from "react";

/**
 * Turns a CMS text into page content, using the small writing rules of the "Page texts" fields:
 *   *words*            → <span className={hl}>        (accent-coloured part of a heading)
 *   **words**          → <strong className={strong}>
 *   [label](/page)     → <Link> (internal) or <a> (mailto:, https://…), className={link}
 *   a new line         → <br />
 *   {name} {role} …    → values from `vars`
 * Plain text comes back as a plain string, so the HTML is the same as hand-written JSX.
 */

export type Vars = Record<string, string>;

/** Text with the {tokens} filled in (for places that need a plain string) */
export function plain(text: string | null | undefined, vars: Vars = {}) {
  return (text ?? "").replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? vars[k] : m));
}

type Opts = { hl?: string; strong?: string; link?: string; vars?: Vars };

const TOKEN = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

function line(text: string, o: Opts, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${n++}`;
    if (m[1] !== undefined) out.push(<strong key={k} className={o.strong}>{m[1]}</strong>);
    else if (m[2] !== undefined) out.push(<span key={k} className={o.hl}>{m[2]}</span>);
    else {
      const [label, href] = [m[3], m[4]];
      out.push(
        href.startsWith("/") ? (
          <Link key={k} href={href} className={o.link}>{label}</Link>
        ) : (
          <a key={k} href={href} className={o.link}>{label}</a>
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function rich(text: string | null | undefined, o: Opts = {}): React.ReactNode {
  const filled = plain(text, o.vars);
  if (!/[*[\n]/.test(filled)) return filled;
  const lines = filled.split(/\r?\n/);
  const nodes = lines.flatMap((l, i) => [...(i > 0 ? [<br key={`br-${i}`} />] : []), ...line(l, o, `l${i}`)]);
  return nodes.length === 1 && typeof nodes[0] === "string" ? nodes[0] : <Fragment>{nodes}</Fragment>;
}

/** Paragraphs separated by an empty line */
export const paragraphs = (text: string | null | undefined, vars?: Vars) =>
  plain(text, vars)
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\s*\r?\n\s*/g, " ").trim())
    .filter(Boolean);
