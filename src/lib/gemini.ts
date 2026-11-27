import "server-only";

/**
 * Small Gemini client for quick chat replies (the site assistant).
 * Thinking is turned off — replies come back in ~2 seconds instead of 15–25.
 * Env: GEMINI_API_KEY (required), GEMINI_CHAT_MODELS (optional, comma list, best first).
 */

// Free-tier Flash models are often "busy"; the lighter flash-lite models usually still answer
const MODELS = (process.env.GEMINI_CHAT_MODELS || "gemini-3.1-flash-lite,gemini-3.5-flash,gemini-flash-lite-latest,gemini-3.8-flash,gemini-flash-latest")
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

export type Turn = { role: "user" | "model"; text: string };

/** Returns the model's reply; tries the next model when one is busy or unavailable */
export async function geminiChat({ system, turns, maxTokens = 450 }: { system: string; turns: Turn[]; maxTokens?: number }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");

  let problem = "";
  const deadline = Date.now() + 20_000; // the visitor never waits longer than this
  for (const model of MODELS) {
    const left = deadline - Date.now();
    if (left < 2_000) break;
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: turns.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
          generationConfig: { maxOutputTokens: maxTokens, temperature: 0.4, thinkingConfig: { thinkingBudget: 0 } },
        }),
        signal: AbortSignal.timeout(Math.min(8_000, left)), // a healthy model answers in 2–5 s
        cache: "no-store",
      });
      if (!res.ok) {
        problem = `${model}: HTTP ${res.status}`;
        continue;
      }
      const data = await res.json();
      const cand = data.candidates?.[0];
      const text = ((cand?.content?.parts ?? []) as { text?: string; thought?: boolean }[])
        .filter((p) => !p.thought)
        .map((p) => p.text ?? "")
        .join("")
        .trim();
      if (text) return text;
      problem = `${model}: no answer (${cand?.finishReason ?? data.promptFeedback?.blockReason ?? "empty"})`;
    } catch (e) {
      problem = `${model}: ${(e as Error).message}`;
    }
  }
  throw new Error(`Gemini unavailable — ${problem}`);
}
