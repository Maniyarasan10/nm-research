import { Link } from "react-router-dom";
import { site, stats } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import SplitReveal from "@/components/ui/SplitReveal";
import Magnetic from "@/components/ui/Magnetic";

const values = [
  "Scientific Integrity",
  "Research Excellence",
  "Innovation First",
  "Global Collaboration",
];

export default function AboutSection() {
  return (
    <section
      style={{ paddingBlock: "7rem 6rem", borderTop: "1px solid var(--hairline)" }}
      id="home-about"
    >
      <div className="container">
        <div
          className="about-grid"
          style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "clamp(2rem, 5vw, 5rem)" }}
        >
          <div>
            <Reveal>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 24,
                  paddingBottom: 18,
                  borderBottom: "1px solid var(--border-subtle)",
                  marginBottom: 30,
                }}
              >
                <div className="mono eyebrow">
                  <span style={{ width: 28, height: 1, background: "var(--accent)" }} />
                  THE FOUNDATION
                </div>
                <span
                  className="mono"
                  style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text-faint)" }}
                >
                  ABOUT / ORIGINS
                </span>
              </div>
            </Reveal>
            <SplitReveal as="h2" className="display-lg">
              <span style={{ maxWidth: 620, display: "inline-block" }}>
                BUILT FOR QUESTIONS{" "}
                <span style={{ color: "var(--accent)" }}>
                  THAT DON'T HAVE ANSWERS YET
                </span>
              </span>
            </SplitReveal>

            <Reveal delay={0.08}>
              <p
                style={{
                  marginTop: 30,
                  color: "var(--text-secondary)",
                  fontSize: "1.02rem",
                  lineHeight: 1.75,
                  maxWidth: 540,
                }}
              >
                {site.positioning}
              </p>
              <p
                className="mono"
                style={{ marginTop: 18, fontSize: 11, lineHeight: 1.9, letterSpacing: "0.06em", color: "var(--text-muted)" }}
              >
                An institute where research is measured, verified, quantified and
                peer-reviewed — not merely claimed.
              </p>
              <Magnetic strength={0.3}>
                <Link
                  to="/about"
                  className="btn btn-ghost"
                  style={{ marginTop: 34, fontSize: 11.5 }}
                >
                  About the foundation <span className="btn-arrow">→</span>
                </Link>
              </Magnetic>
            </Reveal>

            <Reveal delay={0.14}>
              <div
                className="about-values"
                style={{
                  marginTop: 48,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  borderTop: "1px solid var(--hairline)",
                }}
              >
                {values.map((v) => (
                  <div
                    key={v}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "1rem 0.5rem",
                      borderBottom: "1px solid var(--hairline)",
                      fontSize: "0.95rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span className="status-dot" aria-hidden="true" />
                    {v}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.1}>
              <div
                style={{
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--surface)",
                  padding: "1.8rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  className="mono eyebrow"
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span className="status-dot" aria-hidden="true" />
                  Founded {site.founded}
                </div>
                <div
                  className="display-xl"
                  style={{
                    marginTop: 22,
                    fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                    lineHeight: 1,
                  }}
                >
                  {site.slogan.split(".").map((w, i, arr) => (
                    <span key={w} style={{ display: "block" }}>
                      {w}
                      {i < arr.length - 1 && (
                        <span style={{ color: "var(--accent)" }}>.</span>
                      )}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 28,
                    paddingTop: 22,
                    borderTop: "1px solid var(--hairline)",
                  }}
                >
                  <div style={{ fontSize: "1rem", fontWeight: 500 }}>
                    {site.founder.name}
                  </div>
                  <div
                    className="mono"
                    style={{ marginTop: 4, fontSize: 10.5, letterSpacing: "0.12em", color: "var(--accent-bright)" }}
                  >
                    {site.founder.role.toUpperCase()}
                  </div>
                  <div className="mono" style={{ marginTop: 2, fontSize: 10.5, color: "var(--text-muted)" }}>
                    {site.founder.credentials}
                  </div>
                </div>
              </div>
            </Reveal>

            <div
              className="mono"
              style={{
                marginTop: 24,
                display: "flex",
                flexWrap: "wrap",
                gap: "6px 14px",
                fontSize: 10.5,
                letterSpacing: "0.1em",
                color: "var(--text-faint)",
              }}
            >
              {stats.slice(0, 4).map((s) => (
                <span key={s.label}>
                  {s.value}
                  {s.suffix} {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}