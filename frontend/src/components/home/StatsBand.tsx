import { stats } from "@/data/site";
import Counter from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";

export default function StatsBand() {
  return (
    <section style={{ paddingBlock: "6rem 5rem", borderTop: "1px solid var(--hairline)" }}>
      <div className="container">
        <Reveal>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 24,
              paddingBottom: 18,
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <div className="mono eyebrow">
              <span style={{ width: 28, height: 1, background: "var(--accent)" }} />
              VERIFIED — QUANTIFIED — PEER-REVIEWED
            </div>
            <span
              className="mono"
              style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text-faint)" }}
            >
              INDEX / THE PROOF
            </span>
          </div>
        </Reveal>

        <div
          className="stats-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}
        >
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={(Math.floor(i / 4) + (i % 4)) * 0.05}>
              <div
                className="stats-cell"
                style={{
                  position: "relative",
                  padding: "2rem 1.2rem",
                  borderRight: i % 4 !== 3 ? "1px solid var(--hairline)" : "none",
                  borderBottom: "1px solid var(--hairline)",
                  background: "transparent",
                  overflow: "hidden",
                  transition:
                    "background-color .4s var(--ease-out), color .4s var(--ease-out)",
                }}
              >
                <span
                  aria-hidden
                  className="ghost-text"
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 14,
                    fontSize: "clamp(2.4rem, 4vw, 3.4rem)",
                    lineHeight: 1,
                    opacity: 0.22,
                    fontFamily: "var(--font-serif)",
                    WebkitTextStroke: "1px var(--border-strong)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  className="display-md stat-value"
                  style={{
                    fontSize: "clamp(2rem, 3.5vw, 2.9rem)",
                    color: "var(--text-primary)",
                    transition: "color .4s var(--ease-out)",
                  }}
                >
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <div
                  className="mono stat-label"
                  style={{
                    position: "relative",
                    marginTop: 10,
                    fontSize: 10.5,
                    letterSpacing: "0.12em",
                    color: "var(--text-muted)",
                    transition: "color .4s var(--ease-out)",
                  }}
                >
                  {s.label}
                </div>
                <span
                  className="stat-hairline"
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    height: 1,
                    width: "100%",
                    background: "var(--accent)",
                    transform: "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform .5s var(--ease-out)",
                  }}
                />
              </div>
            </Reveal>
          ))}
        </div>

        <style>{`
          .stats-cell:hover {
            background: var(--bg-tertiary);
          }
          .stats-cell:hover .stat-value { color: var(--accent-bright); }
          .stats-cell:hover .stat-label { color: var(--accent-bright); }
          .stats-cell:hover .stat-hairline { transform: scaleX(1); }
          @media (max-width: 900px) {
            .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .stats-cell:nth-child(2n) { border-right: none !important; }
          }
        `}</style>
      </div>
    </section>
  );
}