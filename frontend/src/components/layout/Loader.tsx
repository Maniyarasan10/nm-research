import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const tickerWords = [
  "RESEARCH",
  "BUILD",
  "INDEX",
  "PROTOTYPE",
  "PUBLISH",
  "IMPACT",
];

const batches = [
  { label: "CORE SYSTEMS", at: 12 },
  { label: "KNOWLEDGE GRAPH", at: 38 },
  { label: "ARCHIVE INDEX", at: 63 },
  { label: "READY", at: 88 },
];

const COLS = Array.from({ length: 12 }, (_, i) => i);

export function Loader() {
  const reduced = useReducedMotion();
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef<HTMLDivElement>(null);
  const colsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) {
      setGone(true);
      return;
    }

    const el = rootRef.current;
    if (!el) return;

    // Cache batch elements once instead of querying per frame
    const batchEls = Array.from(el.querySelectorAll<HTMLElement>("[data-batch]"));

    const ctx = gsap.context(() => {
      const progress = { v: 0 };
      let lastWord = -1;

      gsap.to(progress, {
        v: 100,
        duration: 2.6,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.round(progress.v);
          if (percentRef.current)
            percentRef.current.textContent = String(v).padStart(3, "0");
          if (barRef.current)
            barRef.current.style.transform = `scaleX(${progress.v / 100})`;

          const wordIdx = Math.min(
            tickerWords.length - 1,
            Math.floor((progress.v / 100) * tickerWords.length),
          );
          if (wordIdx !== lastWord && tickRef.current) {
            lastWord = wordIdx;
            gsap.to(tickRef.current, {
              y: -wordIdx * 12,
              duration: 0.45,
              ease: "power3.out",
              overwrite: "auto",
            });
          }

          for (const row of batchEls) {
            const at = Number(row.dataset.batch);
            row.classList.toggle("is-done", progress.v >= at);
          }
        },
        onComplete: () => {
          const bg = el.querySelector<HTMLElement>("[data-loader-bg]");
          const content = el.querySelector<HTMLElement>("[data-loader-content]");
          const cols = colsRef.current;

          gsap
            .timeline({ onComplete: () => setGone(true) })
            .to(content, {
              autoAlpha: 0,
              yPercent: -14,
              duration: 0.4,
              ease: "power2.inOut",
            })
            .to(
              bg,
              { yPercent: -100, duration: 0.85, ease: "power2.inOut" },
              0.05,
            )
            .fromTo(
              cols,
              { yPercent: 100 },
              {
                yPercent: -102,
                duration: 1,
                ease: "power4.inOut",
                stagger: 0.04,
              },
              0.18,
            );
          if (percentRef.current)
            percentRef.current.style.color = "var(--accent-bright)";
        },
      });

      if (colsRef.current) {
        gsap.set(colsRef.current, { yPercent: 100 });
      }
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label="Loading NM Research"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--z-loader)",
        background: "transparent",
      }}
    >
      {/* opaque base layer */}
      <div
        data-loader-bg
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--bg-primary)",
          willChange: "transform",
        }}
      />

      {/* shutter slats that sweep up on exit */}
      <div
        ref={colsRef}
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          pointerEvents: "none",
        }}
      >
        {COLS.map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: "var(--bg-secondary)",
              borderRight: "1px solid var(--hairline)",
            }}
          />
        ))}
      </div>

      {/* content */}
      <div
        data-loader-content
        style={{
          position: "absolute",
          inset: 0,
          padding: "clamp(20px, 3.5vw, 48px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          className="mono eyebrow loader-topline"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 16,
            flexWrap: "wrap",
            rowGap: 8,
          }}
        >
          <span>NM·RESEARCH — ARCHIVE 001601</span>
          <span style={{ color: "var(--accent-bright)" }}>LOADING / EST. 2026</span>
        </div>

        <div
          className="loader-main"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "clamp(24px, 5vw, 72px)",
          }}
        >
          {/* batch checklist */}
          <div
            className="loader-checklist"
            style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 200 }}
          >
            {batches.map((b) => (
              <div
                key={b.label}
                data-batch={b.at}
                className="mono"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 10.5,
                  letterSpacing: "0.16em",
                  color: "var(--text-muted)",
                  transition: "color .35s var(--ease-out)",
                }}
              >
                <span
                  className="batch-glyph"
                  style={{
                    width: 14,
                    height: 14,
                    border: "1px solid var(--border-strong)",
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 9,
                    color: "var(--accent-bright)",
                  }}
                >
                  {String(batches.indexOf(b) + 1).padStart(2, "0")}
                </span>
                {b.label}
                <span
                  className="batch-check"
                  style={{
                    marginLeft: "auto",
                    color: "var(--accent-bright)",
                    fontSize: 10,
                  }}
                />
              </div>
            ))}
          </div>

          {/* wordmark + ticker */}
          <div
            style={{
              flex: 1,
              textAlign: "center",
              maxWidth: 760,
            }}
          >
            <div
              className="mono loader-wordmark-sub"
              style={{
                fontSize: 10,
                letterSpacing: "0.28em",
                color: "var(--text-faint)",
                marginBottom: 18,
              }}
            >
              INSTITUTE OF INNOVATION &amp; RESEARCH
            </div>
            <h1
              className="loader-wordmark"
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 400,
                fontSize: "clamp(3rem, 9vw, 7.5rem)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
              }}
            >
              NM <span style={{ color: "var(--accent)" }}>RESEARCH</span>
            </h1>

            <div
              style={{
                marginTop: 22,
                height: "1em",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                ref={tickRef}
                className="mono"
                style={{
                  fontSize: 12,
                  letterSpacing: "0.34em",
                  color: "var(--accent-bright)",
                  willChange: "transform",
                }}
              >
                {tickerWords.map((w) => (
                  <div key={w} style={{ height: "1em", lineHeight: 1, textAlign: "center" }}>
                    {w}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* percentage */}
          <div className="loader-progress" style={{ textAlign: "right", minWidth: 180 }}>
            <div
              className="loader-count"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(3rem, 8vw, 6.5rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span ref={percentRef}>000</span>
              <span style={{ color: "var(--accent)", fontSize: "0.35em" }}>%</span>
            </div>
            <div
              className="loader-progress-bar"
              style={{
                marginTop: 14,
                marginLeft: "auto",
                width: "min(200px, 100%)",
                height: 1,
                background: "var(--hairline)",
              }}
            >
              <div
                ref={barRef}
                style={{
                  height: "100%",
                  transformOrigin: "left",
                  transform: "scaleX(0)",
                  background: "var(--accent)",
                }}
              />
            </div>
            <div
              className="mono"
              style={{
                marginTop: 12,
                fontSize: 10,
                letterSpacing: "0.18em",
                color: "var(--text-faint)",
              }}
            >
              PROGRESS
            </div>
          </div>
        </div>

        <div
          className="mono loader-content-foot"
          style={{
            borderTop: "1px solid var(--hairline)",
            paddingTop: 14,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 10,
            fontSize: 10,
            letterSpacing: "0.14em",
            color: "var(--text-faint)",
          }}
        >
          <span>SCIENTIFIC SYSTEMS 04/04 · S/N 001-E2026</span>
          <span style={{ color: "var(--accent-bright)" }}>KERALA · INDIA — EST. 2026</span>
        </div>
      </div>

      <style>{`
        .loader-main [data-batch].is-done { color: var(--text-primary); }
        .loader-main [data-batch].is-done .batch-glyph { border-color: var(--accent); color: var(--bg-primary); background: var(--accent); }
        .loader-main .batch-check::before { content: "—"; }
        .loader-main [data-batch].is-done .batch-check::before { content: "✓"; }
        @media (max-width: 820px) {
          .loader-checklist { display: none !important; }
          .loader-main { flex-direction: column; justify-content: center; text-align: center; }
          .loader-main > div { width: 100%; }
          .loader-progress { text-align: center !important; }
          .loader-progress .loader-progress-bar { margin: 0 auto 6px auto !important; }
        }
        @media (max-width: 600px) {
          .loader-wordmark { font-size: clamp(2.2rem, 11vw, 3.2rem) !important; }
          .loader-wordmark-sub { font-size: 9px !important; margin-bottom: 14px !important; }
          .loader-count { font-size: clamp(2rem, 10vw, 3rem) !important; }
          .loader-main { gap: 30px 0 !important; }
          .loader-content-foot { display: none !important; }
          .loader-topline { font-size: 9px !important; letter-spacing: 0.14em !important; }
          .loader-progress .loader-progress-bar { width: 180px !important; }
        }
      `}</style>
    </div>
  );
}