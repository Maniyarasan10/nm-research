import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ask, starters, type ChatAction, type ChatReply } from "@/lib/chatbot";
import { site } from "@/data/site";

type ChatMessage = { role: "user" | "bot"; text: string; actions?: ChatAction[] };

const BOT_NAME = "NM ASSISTANT";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [seeded, setSeeded] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Seed with a welcome message + starter chips
  useEffect(() => {
    if (seeded) return;
    setSeeded(true);
    setMessages([
      {
        role: "bot",
        text: `Hi — I'm ${BOT_NAME.toLowerCase()} for ${site.shortName}. I can answer about our services, membership, publishing, research domains and contact.`,
        actions: starters,
      },
    ]);
    // Falls through reliably even if effect re-runs.
  }, [seeded]);

  // Autoscroll to latest + focus input when opened
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, typing, open]);

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setTyping(true);
    const reply: ChatReply = ask(text);
    // Small typing delay for a natural feel.
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: reply.text, actions: reply.actions }]);
      setTyping(false);
    }, 550);
  };

  const runAction = (a: ChatAction) => {
    if (!a.to) {
      send(a.label);
      return;
    }
    navigate(a.to);
    setOpen(false);
  };

  return createPortal(
    <div className="chatbot" style={{ position: "fixed", right: "1rem", bottom: 0, zIndex: "var(--z-chat, 1600)" }}>
      {/* WhatsApp — floating above the assistant launcher */}
      <a
        href="https://wa.me/918667334697"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="whatsapp-fab"
        style={{
          position: "absolute",
          right: 0,
          bottom: "calc(0.9rem + 54px + 0.8rem + env(safe-area-inset-bottom))",
          width: 54,
          height: 54,
          borderRadius: "50%",
          border: "1px solid var(--border-strong)",
          background: "#25D366",
          color: "#fff",
          display: "grid",
          placeItems: "center",
          boxShadow: "0 10px 30px rgba(18, 140, 79, 0.35)",
          transition: "transform 0.25s var(--ease-out, ease)",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29z" />
        </svg>
      </a>

      {/* Panel */}
      {open && (
        <section
          role="dialog"
          aria-label="NM Research assistant"
          className="chatbot-panel"
          style={{
            position: "absolute",
            bottom: "calc(4.4rem + env(safe-area-inset-bottom))",
            right: 0,
            width: "min(400px, calc(100vw - 2rem))",
            height: "min(560px, calc(100dvh - 7rem))",
            background: "var(--bg-primary)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(16,16,16,0.22)",
          }}
        >
          {/* Header */}
          <header
            style={{
              padding: "1rem 1.1rem",
              borderBottom: "1px solid var(--hairline)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "var(--bg-secondary)",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "var(--radius-sm)",
                background: "var(--accent)",
                color: "#f8f2e4",
                display: "grid",
                placeItems: "center",
                fontFamily: "var(--font-serif)",
                fontSize: "1.05rem",
              }}
            >
              NM
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="mono eyebrow" style={{ fontSize: 9.5, letterSpacing: "0.18em" }}>
                {BOT_NAME}
              </div>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--text-muted)" }}>
                {site.slogan}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="mono"
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                padding: "0.35rem 0.6rem",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              ✕
            </button>
          </header>

          {/* Messages */}
          <div
            ref={listRef}
            onWheel={(e) => {
              const el = listRef.current;
              if (!el) return;
              const max = el.scrollHeight - el.clientHeight;
              if (max <= 0) return;
              e.preventDefault();
              el.scrollTop = Math.min(max, Math.max(0, el.scrollTop + e.deltaY));
            }}
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overscrollBehavior: "contain",
              padding: "1rem 0.9rem",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
              scrollbarColor: "var(--accent-line) transparent",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  className="chat-bubble"
                  style={{
                    maxWidth: "86%",
                    whiteSpace: "pre-line",
                    fontSize: "0.92rem",
                    lineHeight: 1.55,
                    padding: "0.65rem 0.9rem",
                    borderRadius: "var(--radius-sm)",
                    color: m.role === "user" ? "#f8f2e4" : "var(--text-primary)",
                    background: m.role === "user" ? "var(--accent)" : "var(--bg-secondary)",
                    border: m.role === "user" ? "none" : "1px solid var(--hairline)",
                  }}
                >
                  {m.text}
                  {m.actions && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                      {m.actions.map((a, ai) => (
                        <button
                          key={ai}
                          onClick={() => runAction(a)}
                          className="chat-chip"
                          style={{
                            textAlign: "left",
                            fontSize: 11,
                            letterSpacing: "0.06em",
                            padding: "0.55rem 0.75rem",
                            border: "1px solid var(--border-strong)",
                            borderRadius: "var(--radius-sm)",
                            color: "var(--accent)",
                            background: "transparent",
                          }}
                        >
                          {a.label}
                          {a.to ? " →" : ""}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div>
                <div
                  className="chat-bubble"
                  style={{
                    maxWidth: "86%",
                    fontSize: "0.92rem",
                    padding: "0.7rem 0.9rem",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--hairline)",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.12em",
                  }}
                >
                  …
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            style={{
              display: "flex",
              gap: 8,
              padding: "0.8rem 0.9rem",
              borderTop: "1px solid var(--hairline)",
              background: "var(--bg-primary)",
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about NM Research…"
              aria-label="Ask the assistant"
              className="input"
              style={{ flex: 1, minWidth: 0 }}
            />
            <button type="submit" className="btn btn-primary" aria-label="Send message" style={{ padding: "0.6rem 1rem", fontSize: 11 }}>
              Send
            </button>
          </form>
        </section>
      )}

      {/* Floating launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        aria-expanded={open}
        className="chatbot-fab"
        style={{
          position: "absolute",
          right: 0,
          bottom: "calc(0.9rem + env(safe-area-inset-bottom))",
          width: 54,
          height: 54,
          borderRadius: "50%",
          border: "1px solid var(--border-strong)",
          background: "var(--bg-secondary)",
          display: "grid",
          placeItems: "center",
          fontSize: "1.35rem",
          color: "var(--accent)",
          boxShadow: "0 10px 30px rgba(16,16,16,0.18)",
        }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="4" y="8" width="16" height="11" rx="3" />
            <path d="M12 4v4M8.5 3.5 12 5.5l3.5-2M2 12v4M22 12v4" />
            <circle cx="9" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
          </svg>
        )}
      </button>
    </div>,
    document.body,
  );
}