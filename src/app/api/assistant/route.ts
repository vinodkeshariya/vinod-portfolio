import { assistantPrompt, readyAnswer, whatsappLink } from "@/lib/assistant";
import { getContent } from "@/lib/content";
import { geminiChat, type Turn } from "@/lib/gemini";

/**
 * POST /api/assistant — the site's AI assistant.
 * Body: { messages: [{ role: "user" | "assistant", text }] } (the conversation so far, last one from the visitor)
 * Only accepts requests from this site, limits each visitor, and falls back to a WhatsApp suggestion if Gemini is busy.
 */

const MAX_TURNS = 12;
const MAX_USER_CHARS = 600;
const WINDOW = 10 * 60 * 1000;
const LIMIT = 20;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (recent.length >= LIMIT) return true;
  hits.set(ip, [...recent, now]);
  if (hits.size > 2000) hits.clear();
  return false;
}

const fallback = (wa: string) =>
  `Sorry, I can't answer right now. You can message Vinod directly on [WhatsApp](${wa}) or use the [contact form](/contact) — he usually replies within 0–4 hours.`;

export async function POST(req: Request) {
  // same-site requests only
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) return Response.json({ error: "Not allowed" }, { status: 403 });

  const wa = whatsappLink((await getContent()).site);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return Response.json({ reply: `You've sent a lot of questions in a short time. Please try again in a few minutes, or message Vinod on [WhatsApp](${wa}).` });
  }

  let messages: { role?: unknown; text?: unknown }[];
  try {
    messages = (await req.json())?.messages;
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_TURNS * 2) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const turns: Turn[] = messages
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.text === "string" && m.text.trim())
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role === "user" ? "user" : "model", text: String(m.text).slice(0, m.role === "user" ? MAX_USER_CHARS : 2000) }));
  // Gemini expects the conversation to start with the visitor and end with their question
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== "user") return Response.json({ error: "Invalid request" }, { status: 400 });

  // the suggestion chips are answered straight from the site's FAQ — instant and always available
  const question = turns[turns.length - 1].text;
  const instant = await readyAnswer(question);
  if (instant) return Response.json({ reply: instant });

  try {
    const reply = await geminiChat({ system: await assistantPrompt(), turns });
    return Response.json({ reply });
  } catch (e) {
    console.error("[assistant]", (e as Error).message);
    return Response.json({ reply: fallback(wa), unavailable: true });
  }
}
