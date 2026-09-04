import { Link } from "react-router-dom";
import { insights } from "@/data/insights";
import { Reveal, SectionLabel } from "@/components/ui/Reveal";

export default function InsightsSection() {
  return (
    <section style={{ paddingBlock: "6rem 5rem", borderTop: "1px solid var(--hairline)" }}>
      <div className="container">
        <div
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}
        >
          <div>
            <SectionLabel>Insights</SectionLabel>
            <h2 className="display-lg">
              NOTES FROM THE{" "}
              <span style={{ color: "var(--accent)" }}>LABORATORY</span>
            </h2>
          </div>
          <span className="tag tag-accent">Field journal · Forthcoming</span>
        </div>

        <div style={{ marginTop: 44 }}>
          {insights.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.04}>
              <Link
                to={item.href}
                data-cursor-label="READ"
                className="insight-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "170px 1fr auto",
                  gap: "clamp(1rem, 3vw, 2.4rem)",
                  alignItems: "center",
                  padding: "1.7rem 0.5rem",
                  borderBottom: "1px solid var(--hairline)",
                  transition: "background-color .4s var(--ease-out)",
                }}
              >
                <div className="mono" style={{ fontSize: 10.5, letterSpacing: "0.16em", color: "var(--accent)" }}>
                  {item.category.toUpperCase()}
                </div>
                <div>
                  <h3
                    className="display-md"
                    style={{
                      fontSize: "clamp(1.25rem, 2.6vw, 1.85rem)",
                      color: "var(--text-primary)",
                      transition: "color .3s var(--ease-out)",
                    }}
                  >
                    {item.title}
                  </h3>
                  <div
                    className="mono"
                    style={{ marginTop: 10, fontSize: 10.5, letterSpacing: "0.1em", color: "var(--text-muted)" }}
                  >
                    {item.date} · {item.readTime}
                  </div>
                </div>
                <span
                  className="mono"
                  style={{
                    fontSize: "1.6rem",
                    color: "var(--accent)",
                    transition: "transform .3s var(--ease-out)",
                  }}
                >
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <p className="mono" style={{ marginTop: 28, fontSize: 11, letterSpacing: "0.12em", color: "var(--text-faint)" }}>
          Full manuscripts are being prepared for publication. Request early access to themes of interest.
        </p>
      </div>

      <style>{`
        .insight-row:hover { background: rgba(248,242,228,0.02); }
        .insight-row:hover h3 { color: var(--accent-bright); }
        .insight-row:hover > span:last-child { transform: translateX(6px); }
        @media (max-width: 720px) {
          .insight-row { grid-template-columns: 1fr !important; gap: 8px !important; padding: 1.4rem 0.25rem !important; }
          .insight-row > span:last-child { display: none; }
        }
      `}</style>
    </section>
  );
}