import { Link } from "react-router-dom";
import { services } from "@/data/services";
import { Reveal, SectionLabel } from "@/components/ui/Reveal";

export default function ServicesStrip() {
  return (
    <section style={{ paddingBlock: "6rem 5rem" }} id="home-services">
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
            <SectionLabel>Working services</SectionLabel>
            <h2 className="display-lg">
              FROM TOPIC TO{" "}
              <span style={{ color: "var(--accent)" }}>PUBLICATION</span>
            </h2>
          </div>
          <Link to="/services" className="btn btn-line" style={{ fontSize: 12, letterSpacing: "0.14em" }}>
            All services →
          </Link>
        </div>

        <div className="services-grid" style={{ marginTop: 44, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 2) * 0.05}>
              <Link
                to="/services"
                data-cursor-label="VIEW"
                className="service-tile"
                style={{
                  display: "block",
                  padding: "1.8rem",
                  border: "1px solid var(--hairline)",
                  borderBottom: i < services.length - 2 ? "1px solid var(--hairline)" : "1px solid var(--hairline)",
                  background: "transparent",
                  transition: "background-color .4s var(--ease-out), border-color .4s var(--ease-out)",
                  position: "relative",
                }}
              >
                <div
                  className="mono"
                  style={{ fontSize: 11, letterSpacing: "0.16em", color: "var(--accent)" }}
                >
                  {s.index}
                </div>
                <h3 className="display-md" style={{ marginTop: 12, fontSize: "1.5rem", color: "var(--text-primary)" }}>
                  {s.title}
                </h3>
                <p
                  className="mono"
                  style={{
                    marginTop: 10,
                    fontSize: 10.5,
                    lineHeight: 1.7,
                    color: "var(--text-muted)",
                    letterSpacing: "0.03em",
                  }}
                >
                  {s.tags.join(" · ")}
                </p>
                <span
                  className="mono"
                  style={{
                    position: "absolute",
                    top: "1.8rem",
                    right: "1.8rem",
                    fontSize: 13,
                    color: "var(--accent)",
                    opacity: 0,
                    transform: "translateX(-8px)",
                    transition: "opacity .3s var(--ease-out), transform .3s var(--ease-out)",
                  }}
                >
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        .service-tile:hover { background: rgba(133,21,9,0.05) !important; border-color: var(--accent-line) !important; }
        .service-tile:hover > span { opacity: 1 !important; transform: translateX(0) !important; }
        .service-tile:hover h3 { color: var(--accent-bright) !important; }
        .service-tile h3 { transition: color .3s var(--ease-out); }
        @media (max-width: 760px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}