import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import SceneShell from "@/components/3d/SceneShell";
import { services, deliverySteps, trustPillars } from "@/data/services";
import { usePageMeta } from "@/hooks/usePageMeta";

const AtomOrbit = lazy(() => import("@/components/3d/AtomOrbit"));

export default function Services() {
  usePageMeta(
    "Services | NM Research",
    "Six end-to-end research services from NM Research — from topic to publication, delivered through a documented, reproducible process.",
  );
  const [open, setOpen] = useState<string | null>(services[0]?.slug ?? null);

  return (
    <>
      <PageHero
        label="Service catalogue"
        crumb="NM Research"
        title={
          <>
            SIX WORKING SERVICES,{" "}
            <span style={{ color: "var(--accent)" }}>ONE WORKFLOW</span>
          </>
        }
        subtitle="End-to-end research assistance — from topic to publication. Every engagement is a documented, reproducible process, not a vague promise."
      />

      <section style={{ paddingBlock: "5rem 3rem" }}>
        <div className="container">
          <SectionHeading
            index="01"
            label="The catalogue"
            title={
              <>
                EVERY SERVICE MAPS TO A{" "}
                <span style={{ color: "var(--accent)" }}>REAL OUTCOME</span>
              </>
            }
          />

          <div style={{ marginTop: 48 }}>
            {services.map((s, i) => {
              const isOpen = open === s.slug;
              return (
                <Reveal key={s.slug} delay={i * 0.03}>
                  <div
                    style={{
                      border: "1px solid var(--hairline)",
                      borderBottom: isOpen ? "1px solid var(--accent-line)" : "1px solid var(--hairline)",
                      background: isOpen ? "rgba(133,21,9,0.05)" : "transparent",
                      transition: "border-color .4s var(--ease-out), background-color .4s var(--ease-out)",
                    }}
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : s.slug)}
                      aria-expanded={isOpen}
                      className="service-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 24,
                        width: "100%",
                        textAlign: "left",
                        padding: "1.6rem 1.2rem",
                        cursor: "pointer",
                      }}
                    >
                      <span className="mono" style={{ fontSize: 13, color: "var(--accent)" }}>
                        {s.index}
                      </span>
                      <span
                        className="display-md"
                        style={{
                          flex: 1,
                          fontSize: "clamp(1.3rem, 3vw, 1.9rem)",
                          color: isOpen ? "var(--accent-bright)" : "var(--text-primary)",
                          transition: "color .3s",
                        }}
                      >
                        {s.title}
                      </span>
                      <span
                        className="mono service-meta"
                        style={{
                          fontSize: 10.5,
                          letterSpacing: "0.1em",
                          color: "var(--text-muted)",
                          display: isOpen ? "none" : "inline",
                        }}
                      >
                        {s.tags.slice(0, 3).join(" · ")}
                      </span>
                      <span
                        style={{
                          color: "var(--accent)",
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                          transition: "transform .4s var(--ease-out)",
                          fontSize: "1.3rem",
                        }}
                      >
                        +
                      </span>
                    </button>

                    {isOpen && (
                      <div style={{ padding: "0 1.2rem 1.8rem", maxWidth: 760 }}>
                        <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, fontSize: "0.98rem" }}>
                          {s.description}
                        </p>
                        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                          {s.highlights.map((h) => (
                            <div
                              key={h}
                              style={{ display: "flex", alignItems: "baseline", gap: 10, fontSize: "0.95rem", color: "var(--text-primary)" }}
                            >
                              <span className="status-dot" aria-hidden="true" />
                              {h}
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {s.tags.map((t) => (
                            <span key={t} className="tag tag-accent">{t}</span>
                          ))}
                        </div>
                        <Link
                          to="/contact"
                          className="btn btn-ghost"
                          style={{ marginTop: 22, fontSize: 11 }}
                        >
                          Discuss this service <span className="btn-arrow">→</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Delivery process */}
      <section style={{ position: "relative", paddingBlock: "5rem 4rem", borderTop: "1px solid var(--hairline)", overflow: "hidden" }}>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <SectionHeading
            index="02"
            label="Delivery process"
            title={
              <>
                CONSULT · PLAN ·{" "}
                <span style={{ color: "var(--accent)" }}>DELIVER</span>
              </>
            }
          />
          <div
            className="delivery-grid"
            style={{ marginTop: 44, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}
          >
            {deliverySteps.map((d, i) => (
              <Reveal key={d.step} delay={i * 0.08}>
                <div
                  style={{
                    padding: "2rem",
                    border: "1px solid var(--border-subtle)",
                    borderRight: i < 2 ? "none" : "1px solid var(--border-subtle)",
                    background: "var(--surface)",
                    height: "100%",
                  }}
                  className="delivery-cell"
                >
                  <span className="mono" style={{ fontSize: 12, color: "var(--accent)" }}>{d.step}</span>
                  <h3 className="display-md" style={{ marginTop: 14, fontSize: "1.5rem" }}>{d.title}</h3>
                  <p className="mono" style={{ marginTop: 12, fontSize: 11.5, lineHeight: 1.8, color: "var(--text-muted)" }}>
                    {d.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <style>{`
            @media (max-width: 860px) {
              .delivery-grid { grid-template-columns: 1fr !important; }
              .delivery-cell { border-right: 1px solid var(--border-subtle) !important; border-bottom: 1px solid var(--border-subtle); }
            }
            @media (max-width: 640px) {
              .service-meta { display: none !important; }
              .service-row { gap: 16px !important; }
            }
          `}</style>
        </div>

        <SceneShell
          style={{
            width: "40vw",
            maxWidth: 540,
            height: 480,
            top: "-13vw",
            right: 0,
          }}
        >
          <Suspense fallback={null}>
            <AtomOrbit />
          </Suspense>
        </SceneShell>
      </section>

      {/* Trust pillars */}
      <section style={{ paddingBlock: "4rem 6rem", borderTop: "1px solid var(--hairline)" }}>
        <div className="container">
          <SectionHeading
            index="03"
            label="Site-wide trust pillars"
            title={
              <>
                WHY THE WORK CAN BE{" "}
                <span style={{ color: "var(--accent)" }}>TRUSTED</span>
              </>
            }
          />
          <div className="pillars-grid" style={{ marginTop: 44, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {trustPillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div
                  style={{
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    background: "var(--surface)",
                    padding: "1.8rem",
                    height: "100%",
                  }}
                >
                  <span
                    className="mono"
                    style={{ fontSize: 11, letterSpacing: "0.16em", color: "var(--accent-bright)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display-md" style={{ marginTop: 14, fontSize: "1.3rem" }}>{p.title}</h3>
                  <p style={{ marginTop: 10, fontSize: "0.94rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
                    {p.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <style>{`
            @media (max-width: 860px) {
              .pillars-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </section>
    </>
  );
}