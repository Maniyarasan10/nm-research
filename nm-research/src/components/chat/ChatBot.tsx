"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  Check,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MOTION, STAGE_LABELS, STAGE_MS } from "@/lib/motion";

type Citation = {
  title: string;
  source: string;
  linkLabel: string;
};

type TrustLevel = "verified" | "routed" | "matched" | "fallback";

type ChatResponse = {
  text: string;
  citations: Citation[];
  related: { title: string; source: string; linkLabel: string }[];
  suggestions: string[];
  answer: boolean;
  requestId: string;
  sessionId: string;
  latencyMs: number;
  confidence: number | null;
  trustLevel: TrustLevel | null;
  nearTie: boolean;
  matched: string | null;
  docId: string | null;
  turns: number;
  reset: boolean;
  usedContext: boolean;
  error?: string;
};

type Message = {
  id: number;
  role: "user" | "bot";
  text: string;
  citations?: Citation[];
  related?: { title: string; source: string; linkLabel: string }[];
  suggestions?: string[];
  answer?: boolean;
  confidence?: number | null;
  trustLevel?: TrustLevel | null;
  nearTie?: boolean;
  matched?: string | null;
  latencyMs?: number;
  requestId?: string;
  docId?: string | null;
  feedback?: "up" | "down";
  error?: boolean;
};

const QUICK_PROMPTS = [
  "What services do you offer?",
  "How much is Platinum membership?",
  "How do I pay?",
  "How can I contact you?",
];

const SESSION_KEY = "nm-assistant-session";
const MAX_LEN = 500;

function makeSessionId() {
  return (window.crypto?.randomUUID?.() ?? `s-${Date.now()}-${Math.random()}`).slice(0, 64);
}

function loadSessionId() {
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing && existing.length <= 128) return existing;
  const fresh = makeSessionId();
  window.sessionStorage.setItem(SESSION_KEY, fresh);
  return fresh;
}

function BotAvatar() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white">
      <Sparkles size={15} />
    </span>
  );
}

const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 4 },
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(
    () => (typeof window === "undefined" ? null : loadSessionId()),
  );
  const [stage, setStage] = useState(0);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(0);
  const reduceMotion = useReducedMotion();

  const openChat = useCallback(() => {
    idRef.current += 1;
    setMessages([
      {
        role: "bot",
        id: idRef.current,
        text: "Hi! I'm the NM Research assistant. Ask me about our services, membership plans, pricing, publications, research domains or how to get in touch.",
        suggestions: QUICK_PROMPTS,
      },
    ]);
    setOpen(true);
  }, []);

  const scrollToBottom = useCallback(() => {
    bodyRef.current?.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [reduceMotion]);

  // Compose anywhere from disconnected parents (e.g. plan cards).

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 100);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Stage-strip loader: cycles the current status label while a turn resolves.
  useEffect(() => {
    if (!loading) return;
    const iv = window.setInterval(
      () => setStage((s) => (s + 1) % STAGE_LABELS.length),
      STAGE_MS,
    );
    return () => window.clearInterval(iv);
  }, [loading]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || loading) return;
      const sid = sessionId ?? (loadSessionId() as string);

      idRef.current += 1;
      const userMsg: Message = { role: "user", text, id: idRef.current };
      setMessages((m) => [...m, userMsg]);
      setInput("");
      setLoading(true);
      setStage(0);
      window.setTimeout(scrollToBottom, 0);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, sessionId: sid }),
        });
        const data: ChatResponse = await res.json();
        idRef.current += 1;

        if (!res.ok || data.error) {
          setMessages((m) => [
            ...m,
            {
              role: "bot",
              text: data.error ?? "Something went wrong. Please try again.",
              error: true,
              id: idRef.current,
            },
          ]);
          return;
        }

        if (data.reset) {
          const fresh = makeSessionId();
          window.sessionStorage.setItem(SESSION_KEY, fresh);
          setSessionId(fresh);
        }

        setMessages((m) => [
          ...m,
          {
            role: "bot",
            text: data.text,
            citations: data.citations,
            related: data.related,
            suggestions: data.suggestions,
            answer: data.answer,
            confidence: data.confidence,
            trustLevel: data.trustLevel,
            nearTie: data.nearTie,
            matched: data.matched,
            latencyMs: data.latencyMs,
            requestId: data.requestId,
            docId: data.docId,
            id: idRef.current,
          },
        ]);
      } catch {
        idRef.current += 1;
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            text: "Could not reach the assistant. Please try again in a moment.",
            error: true,
            id: idRef.current,
          },
        ]);
      } finally {
        setLoading(false);
        window.setTimeout(scrollToBottom, 30);
        window.setTimeout(() => inputRef.current?.focus(), 60);
      }
    },
    [loading, sessionId, scrollToBottom],
  );

  const sendFeedback = useCallback(
    async (m: Message, helpful: boolean) => {
      setMessages((cur) =>
        cur.map((x) =>
          x.id === m.id ? { ...x, feedback: helpful ? "up" : "down" } : x,
        ),
      );
      try {
        await fetch("/api/chat/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestId: m.requestId,
            sessionId,
            message: m.text,
            answer: m.text,
            docId: m.docId,
            confidence: m.confidence,
            trustLevel: m.trustLevel,
            helpful,
          }),
        });
      } catch {
        // Offline analytics must never interrupt the conversation — ignore.
      }
    },
    [sessionId],
  );

  const newConversation = useCallback(() => {
    const fresh = makeSessionId();
    window.sessionStorage.setItem(SESSION_KEY, fresh);
    setSessionId(fresh);
    setMessages([]);
    openChat();
    window.setTimeout(() => inputRef.current?.focus(), 80);
  }, [openChat]);

  // Compose anywhere from disconnected parents (e.g. plan cards).
  useEffect(() => {
    const onCompose = (e: Event) => {
      const detail = (e as CustomEvent<{ message: string }>).detail;
      if (detail?.message) {
        openChat();
        window.setTimeout(() => void send(detail.message), 60);
      }
    };
    window.addEventListener("nm:compose", onCompose);
    return () => window.removeEventListener("nm:compose", onCompose);
  }, [openChat, send]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  return (
    <MotionConfig reducedMotion="user">
      {/* Floating launcher (one-shot ping on first appearance — no radar) */}
      <motion.button
        type="button"
        onClick={() => (open ? setOpen(false) : openChat())}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={open}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ ...MOTION.spring, delay: 0.3 }}
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_12px_30px_-8px_rgba(166,120,6,0.55)] sm:bottom-6 sm:right-6"
      >
        {!open && !reduceMotion && (
          <motion.span
            initial={{ scale: 1, opacity: 0.55 }}
            animate={{ scale: [1, 1.8, 2.1], opacity: [0.55, 0, 0] }}
            transition={{ duration: 1.4, times: [0, 0.55, 1], delay: 1.1 }}
            className="pointer-events-none absolute inset-0 rounded-full bg-accent"
            aria-hidden="true"
          />
        )}
        {open ? <X size={22} /> : <MessageCircle size={23} />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            role="dialog"
            aria-label="NM Research chat assistant"
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ duration: MOTION.base, ease: MOTION.ease }}
            className="fixed bottom-24 right-4 left-4 z-[60] flex h-[min(70vh,34rem)] flex-col overflow-hidden rounded-3xl border border-rule bg-surface shadow-[0_24px_70px_-24px_rgba(23,25,29,0.45)] sm:left-auto sm:right-6 sm:bottom-28 sm:w-[24rem]"
          >
            {/* Header */}
            <header className="flex items-center gap-3 border-b border-rule bg-brand px-4 py-3.5 text-white">
              <BotAvatar />
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">NM Assistant</p>
                <p className="flex items-center gap-1.5 text-[0.7rem] text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Answers from our knowledge base
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={newConversation}
                  aria-label="Start a new conversation"
                  title="New conversation"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <RefreshCw size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            {/* Messages */}
            <div
              ref={bodyRef}
              data-lenis-prevent
              role="log"
              aria-live="polite"
              className="flex-1 space-y-4 overflow-y-auto overscroll-contain p-4"
            >
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: MOTION.fast, ease: MOTION.ease }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex max-w-[85%] gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                      {m.role === "bot" && <BotAvatar />}
                      <div className={m.role === "bot" ? "space-y-2" : ""}>
                        <div
                          className={`whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-[0.85rem] leading-relaxed ${
                            m.role === "user"
                              ? "rounded-br-md bg-brand text-white"
                              : m.error
                                ? "rounded-tl-md bg-red-500/10 text-red-600"
                                : "rounded-tl-md border border-rule bg-surface-2 text-ink"
                          }`}
                        >
                          {m.text}
                        </div>

                        {/* Matched-terms microcopy for grounded answers (Step 5) */}
                        {m.role === "bot" && !m.error && m.answer && m.trustLevel === "verified" && m.matched && (
                          <p className="truncate pl-1 text-[0.62rem] text-ink-3">Matched: {m.matched}</p>
                        )}

                        {/* Primary page — direct link to the relevant page */}
                        {m.role === "bot" && !m.error && m.citations && m.citations[0] && (
                          <a
                            href={m.citations[0].source}
                            className="flex items-center justify-between rounded-xl bg-accent px-3.5 py-2.5 text-[0.82rem] font-semibold text-white no-underline transition-colors hover:bg-accent/90"
                          >
                            <span>View {m.citations[0].linkLabel}</span>
                            <ExternalLink size={14} />
                          </a>
                        )}

                        {/* Citations */}
                        {m.citations && m.citations.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pl-1">
                            {m.citations.map((c) => (
                              <a
                                key={c.source}
                                href={c.source}
                                className="inline-flex items-center gap-1 rounded-full border border-rule bg-paper px-2.5 py-1 text-[0.72rem] font-medium text-brand no-underline transition-colors hover:border-accent/50 hover:text-accent"
                              >
                                {c.linkLabel}
                                <ExternalLink size={11} />
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Related */}
                        {m.related && m.related.length > 0 && (
                          <div className="space-y-1 pl-1">
                            <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-ink-3">
                              Explore
                            </p>
                            {m.related.map((r) => (
                              <a
                                key={r.source}
                                href={r.source}
                                className="block rounded-lg px-2.5 py-1.5 text-[0.8rem] font-medium text-brand no-underline transition-colors hover:bg-primary-dim"
                              >
                                {r.title} →
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Suggestion chips */}
                        {m.suggestions && m.suggestions.length > 0 && !loading && (
                          <div className="flex flex-wrap gap-1.5 pl-1">
                            {m.suggestions.map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => void send(s)}
                                className="rounded-full border border-rule bg-paper px-2.5 py-1 text-[0.72rem] font-medium text-ink-2 transition-colors hover:border-accent/50 hover:text-accent"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Telemetry + feedback (answers only) */}
                        {m.role === "bot" && !m.error && m.answer && (
                          <div className="flex items-center justify-between pl-1">
                            <div className="flex items-center gap-2 font-mono text-[0.62rem] text-ink-3">
                              {m.answer && m.trustLevel === "verified" && (
                                <span className="inline-flex items-center gap-1 text-green">
                                  <Check size={10} strokeWidth={2.5} />
                                  verified
                                </span>
                              )}
                              {m.answer && m.trustLevel === "routed" && (
                                <span className="inline-flex items-center gap-1 text-accent">
                                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                                  routed
                                </span>
                              )}
                              {m.answer && m.trustLevel === "matched" && (
                                <span className="inline-flex items-center gap-1 text-ink-3">
                                  <span className="h-1.5 w-1.5 rounded-full bg-ink-3/60" />
                                  matched (thin)
                                </span>
                              )}
                              {m.latencyMs != null && (
                                <span className="tabular">{m.latencyMs}ms</span>
                              )}
                            </div>
                            {m.confidence != null && (
                              <div className="flex items-center gap-1">
                                {m.feedback ? (
                                  <span className="text-[0.62rem] font-medium text-ink-3">
                                    {m.feedback === "up" ? "Thanks!" : "Noted"}
                                  </span>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      aria-label="Mark helpful"
                                      onClick={() => void sendFeedback(m, true)}
                                      className="flex h-6 w-6 items-center justify-center rounded-full border border-rule text-ink-3 transition-colors hover:border-green/60 hover:text-green"
                                    >
                                      <ThumbsUp size={11} />
                                    </button>
                                    <button
                                      type="button"
                                      aria-label="Mark not helpful"
                                      onClick={() => void sendFeedback(m, false)}
                                      className="flex h-6 w-6 items-center justify-center rounded-full border border-rule text-ink-3 transition-colors hover:border-red-500/60 hover:text-red-500"
                                    >
                                      <ThumbsDown size={11} />
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Answer-composition loader — stage strip, calm and deterministic */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: MOTION.fast, ease: MOTION.ease }}
                  className="flex justify-start"
                >
                  <div className="flex max-w-[85%] gap-2">
                    <BotAvatar />
                    <div className="rounded-2xl rounded-tl-md border border-rule bg-surface-2 px-3.5 py-2.5">
                      <div className="flex items-center gap-2">
                        {STAGE_LABELS.map((label, i) => (
                          <span
                            key={label}
                            className="flex items-center gap-1 text-[0.68rem] font-medium text-ink-3"
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                                i < stage
                                  ? "bg-green"
                                  : i === stage
                                    ? "bg-accent"
                                    : "bg-ink-3/40"
                              }`}
                            />
                            <span
                              className={i === stage ? "text-ink-2" : i < stage ? "text-ink-3" : "text-ink-3/50"}
                            >
                              {label}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <footer className="border-t border-rule bg-paper p-3">
              <form onSubmit={onSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={MAX_LEN}
                  placeholder="Ask about services, plans, publishing…"
                  aria-label="Type your message"
                  autoComplete="off"
                  className="h-11 flex-1 rounded-full border border-rule bg-surface px-4 text-sm text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-all hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={17} />
                </button>
              </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}