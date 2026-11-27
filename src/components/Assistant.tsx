"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { site } from "@/lib/data";
import { Icon } from "./Icon";
import { LogoMark } from "./Logo";

/**
 * Floating "Ask my AI assistant" chat (bottom-right on every page) + a WhatsApp shortcut.
 * Answers come from /api/assistant (Gemini, limited to what the website says about Vinod).
 */

type Msg = { role: "user" | "assistant"; text: string };

const whatsapp = `${site.socials.whatsapp}?text=${encodeURIComponent("Hi Vinod, I found you on your website and would like to discuss a project.")}`;
const greeting: Msg = {
  role: "assistant",
  text: "Hi! I'm Vinod's AI assistant. Ask me about his services, how he works, or how to start a project.",
};
const suggestions = ["What services do you offer?", "Can you add AI to my website?", "How long does a website take?", "How do I start a project?"];

/** Renders **bold**, [links](/path) and "- " bullets from the assistant's reply — no raw HTML */
function Rich({ text }: { text: string }) {
  const inline = (line: string, key: string) =>
    line.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g).map((part, i) => {
      const bold = part.match(/^\*\*([^*]+)\*\*$/);
      if (bold) return <strong key={`${key}-${i}`}>{bold[1]}</strong>;
      const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (link) {
        const [, label, href] = link;
        const cls = "font-semibold text-accent underline decoration-lime decoration-2 underline-offset-2";
        if (href.startsWith("/")) return <Link key={`${key}-${i}`} href={href} className={cls}>{label}</Link>;
        if (/^(https:\/\/wa\.me\/|mailto:)/.test(href)) return <a key={`${key}-${i}`} href={href} target="_blank" rel="noopener noreferrer" className={cls}>{label}</a>;
        return label;
      }
      return part;
    });

  const lines = text.split("\n").filter((l) => l.trim());
  return (
    <div className="flex flex-col gap-1.5">
      {lines.map((l, i) =>
        /^\s*[-•*]\s+/.test(l) ? (
          <p key={i} className="flex gap-2">
            <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-leaf" />
            <span>{inline(l.replace(/^\s*[-•*]\s+/, ""), String(i))}</span>
          </p>
        ) : (
          <p key={i}>{inline(l, String(i))}</p>
        ),
      )}
    </div>
  );
}

export function Assistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([greeting]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // keep the newest message in view
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (pathname.startsWith("/blog/review")) return null;

  async function ask(question: string) {
    const q = question.trim().slice(0, 600);
    if (!q || pending) return;
    const next: Msg[] = [...messages, { role: "user", text: q }];
    setMessages(next);
    setInput("");
    setPending(true);
    track("assistant_message", { count: next.filter((m) => m.role === "user").length });
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1) }), // the greeting is local only
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.reply || "Sorry, something went wrong. Please try again." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: `I can't connect right now. You can message Vinod on [WhatsApp](${whatsapp}).` }]);
    } finally {
      setPending(false);
    }
  }

  const toggle = () => {
    setOpen((o) => {
      if (!o) track("assistant_open");
      return !o;
    });
  };

  return (
    <>
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="assistant-title"
        hidden={!open}
        className={`${open ? "flex" : "hidden"} fixed inset-x-3 bottom-3 z-50 max-h-[min(78dvh,620px)] flex-col overflow-hidden rounded-[22px] border border-line bg-paper shadow-[0_24px_60px_-20px_rgb(21_61_53/0.45)] sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[390px]`}
      >
        <div className="flex items-center gap-3 bg-[linear-gradient(135deg,#153d35,#204b41)] px-4 py-3.5 text-white">
          <LogoMark className="size-10 shrink-0" />
          <div className="min-w-0 flex-1 leading-tight">
            <p id="assistant-title" className="font-display text-[16px] font-bold">
              Vinod&apos;s AI assistant
            </p>
            <p className="flex items-center gap-1.5 text-[12.5px] text-night-muted">
              <span className="size-2 rounded-full bg-lime" /> Answers in seconds · AI
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              launcherRef.current?.focus();
            }}
            aria-label="Close assistant"
            className="grid size-9 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <Icon name="close" className="size-5" />
          </button>
        </div>

        <div ref={listRef} aria-live="polite" className="flex min-h-[220px] flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[88%] rounded-[16px] px-3.5 py-2.5 text-[14.5px] leading-relaxed ${
                m.role === "user" ? "self-end rounded-br-[5px] bg-accent text-white" : "self-start rounded-bl-[5px] border border-line bg-surface text-ink-2"
              }`}
            >
              {m.role === "user" ? m.text : <Rich text={m.text} />}
            </div>
          ))}
          {pending && (
            <div className="flex gap-1.5 self-start rounded-[16px] rounded-bl-[5px] border border-line bg-surface px-4 py-3.5" aria-label="Assistant is typing">
              {[0, 150, 300].map((d) => (
                <span key={d} className="size-2 animate-pulse rounded-full bg-leaf" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          )}
          {messages.length === 1 && !pending && (
            <div className="mt-1 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  className="rounded-full border border-accent-line bg-accent-soft px-3 py-1.5 text-[13px] font-medium text-accent transition hover:border-accent hover:bg-accent hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-line bg-surface px-3 pb-3 pt-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 rounded-full border border-line-2 bg-paper py-1 pl-4 pr-1 focus-within:border-accent focus-within:ring-4 focus-within:ring-lime/30"
          >
            <label htmlFor="assistant-input" className="sr-only">
              Ask a question
            </label>
            <input
              ref={inputRef}
              id="assistant-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={600}
              placeholder="Ask about services, process…"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent py-2 text-[14.5px] text-ink outline-none placeholder:text-placeholder"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              aria-label="Send"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-lime transition hover:bg-accent-hover disabled:opacity-40"
            >
              <Icon name="send" className="size-4" />
            </button>
          </form>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 flex items-center justify-center gap-2 rounded-full bg-[#1fa855] py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#178a45]"
          >
            <svg viewBox="0 0 24 24" className="size-4.5" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.15-1.35A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.06.8.82-2.98-.2-.31a8.22 8.22 0 1 1 6.92 3.82Zm4.5-6.15c-.25-.12-1.46-.72-1.69-.8-.22-.09-.39-.13-.55.12-.16.25-.63.8-.78.96-.14.17-.29.19-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.71-1.33.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.66.31 2.77 2.77 0 0 0-.86 2.06 4.8 4.8 0 0 0 1 2.55 11 11 0 0 0 4.2 3.7c1.57.68 2.18.73 2.97.62.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.17-.47-.29Z" />
            </svg>
            Prefer a human? WhatsApp Vinod
          </a>
          <p className="mt-2 text-center text-[11.5px] text-faint">AI answers can be imperfect · Powered by Gemini</p>
        </div>
      </div>

      {/* Launcher — sits above the mobile "Open for work" bar */}
      <button
        ref={launcherRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "Close AI assistant" : "Ask my AI assistant"}
        className={`group fixed bottom-[5.5rem] right-4 z-50 grid size-14 place-items-center rounded-full bg-lime text-accent shadow-[0_12px_30px_-8px_rgb(21_61_53/0.55)] ring-4 ring-paper transition duration-300 hover:-translate-y-0.5 hover:bg-[#c6e27f] md:bottom-6 md:right-6 ${
          open ? "max-sm:hidden" : ""
        }`}
      >
        {!open && <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-lime opacity-30 motion-reduce:hidden" />}
        <Icon name={open ? "close" : "spark"} className="relative size-6" />
        {!open && (
          <span className="pointer-events-none absolute right-[calc(100%+12px)] hidden whitespace-nowrap rounded-full bg-night px-3.5 py-2 text-[13px] font-semibold text-white opacity-0 shadow-(--shadow-float) transition group-hover:opacity-100 md:block">
            Ask my AI assistant
          </span>
        )}
      </button>
    </>
  );
}
