import { useState } from "react";
import { Link } from "react-router-dom";
import { researchAreas } from "@/data/insights";
import { Reveal, SectionLabel } from "@/components/ui/Reveal";

export default function ResearchAreas() {
  const [active, setActive] = useState(0);

  return (
    <section style={{ paddingBlock: "6rem" }} id="research-areas">
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <SectionLabel>Research areas</SectionLabel>
            <h2 className="display-lg">
              WHAT WE <span style={{ color: "var(--accent)" }}>STUDY</span>
            </h2>
          </div>
          <Link
            to="/research"
            className="btn btn-line"
            style={{ fontSize: 12, letterSpacing: "0.14em" }}
          >
            Full research index →
          </Link>
        </div>

        <div style={{ marginTop: 48 }}>
          {researchAreas.map((area, i) => {
            const isActive = i === active;
            return (
              <Reveal key={area.id} delay={i * 0.03}>
                <Link
                  to={`/research?domain=${area.domainId}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    width: "100%",
                    textAlign: "left",
                    padding: "1.7rem 0",
                    borderBottom: "1px solid var(--hairline)",
                    cursor: "pointer",
                    transition: "background-color .3s",
                    background: isActive ? "rgba(133,21,9,0.05)" : "transparent",
                    color: "inherit",
                  }}
                  className="research-area-row"
                >
                  <span className="mono" style={{ fontSize: 13, color: "var(--accent)" }}>
                    {area.id}
                  </span>
                  <span
                    className="display-md"
                    style={{
                      fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)",
                      color: isActive ? "var(--accent-bright)" : "var(--text-primary)",
                      flex: 1,
                      transition: "color .3s",
                    }}
                  >
                    {area.title}
                  </span>
                  <span
                    className="mono area-desc"
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      maxWidth: 440,
                      opacity: isActive ? 1 : 0.5,
                      transition: "opacity .3s",
                      textAlign: "right",
                    }}
                  >
                    {area.desc}
                  </span>
                  <span
                    style={{
                      color: "var(--accent)",
                      transform: isActive ? "translateX(0)" : "translateX(-8px)",
                      opacity: isActive ? 1 : 0,
                      transition: "all .3s var(--ease-out)",
                      fontSize: "1.4rem",
                    }}
                  >
                    →
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <style>{`
          @media (max-width: 860px) {
            .area-desc { display: none; }
            .research-area-row { padding: 1.2rem 0.4rem !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
