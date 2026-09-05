import type { RefObject } from "react";
import { Reveal } from "@/components/ui/Reveal";
import SplitReveal from "@/components/ui/SplitReveal";
import { site } from "@/data/site";

export default function Introduction({
  triggerRef,
}: {
  triggerRef?: RefObject<HTMLElement | null>;
}) {
  return (
    <section className="container" style={{ paddingBlock: "7rem 6rem" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 10fr)",
          gap: 40,
        }}
        className="intro-head"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 24,
            paddingRight: 24,
            borderRight: "1px solid var(--border-subtle)",
          }}
          className="intro-meta"
        >
          <div>
            <div className="mono eyebrow">
              <span style={{ width: 28, height: 1, background: "var(--accent)" }} />
              IDENTITY — 001
            </div>
            <div
              className="mono"
              style={{ marginTop: 18, fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.14em", lineHeight: 2 }}
            >
              {site.founder.name}
              <br />
              {site.founder.credentials} — {site.founder.role}
            </div>
          </div>
          <div
            className="mono"
            style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text-faint)" }}
          >
            RESEARCH /{" "}
            <span style={{ color: "var(--accent-bright)" }}>DEVELOPMENT /</span>{" "}
            INNOVATION
          </div>
        </div>

        <SplitReveal as="h2" className="display-lg" triggerRef={triggerRef}>
          <span style={{ display: "block", textAlign: "right" }}>
            WE FORGE QUIETLY. WE DON'T
            <br />
            FOLLOW TECHNOLOGY —{" "}
            <span style={{ color: "var(--text-muted)", fontWeight: 300 }}>
              WE EXPLORE WHERE IT IS GOING.
            </span>
          </span>
        </SplitReveal>
      </div>

      <Reveal delay={0.1}>
        <div
          style={{
            marginTop: 64,
            display: "grid",
            gridTemplateColumns: "2fr 1.4fr",
            gap: 48,
          }}
          className="intro-body"
        >
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.25rem, 1.6vw, 1.6rem)",
              lineHeight: 1.55,
              color: "var(--text-primary)",
              maxWidth: 620,
            }}
          >
            {site.positioning}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              borderLeft: "1px solid var(--border-subtle)",
              paddingLeft: 28,
            }}
          >
            <span className="mono" style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.2em" }}>
              PRINCIPLES
            </span>
            {site.values.slice(0, 4).map((v, i) => (
              <div
                key={v}
                className="mono"
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  letterSpacing: "0.08em",
                  display: "flex",
                  alignItems: "baseline",
                  gap: 14,
                }}
              >
                <span style={{ color: "var(--accent)", fontSize: 10 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {v}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <style>{`
        @media (max-width: 900px) {
          .intro-head { grid-template-columns: 1fr !important; }
          .intro-meta { border-right: none !important; border-bottom: 1px solid var(--border-subtle); padding-bottom: 20px; }
          .intro-body { grid-template-columns: 1fr !important; gap: 32px; }
        }
        @media (max-width: 640px) {
          section:has(.intro-head) {
            padding-block: clamp(3.5rem, 13vh, 5rem) clamp(3rem, 10vh, 4rem) !important;
          }
        }
      `}</style>
    </section>
  );
}