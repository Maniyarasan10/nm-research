import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { timeline } from "@/data/insights";
import { Reveal, SectionLabel } from "@/components/ui/Reveal";

export default function ProcessTimeline() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (reduced || !root) return;
    const ctx = gsap.context(() => {
      const line = root.querySelector("[data-progress-line]");
      if (!line) return;
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: {
            trigger: root.querySelector("[data-timeline]"),
            start: "top 75%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="process"
      ref={rootRef}
      style={{
        paddingBlock: "7rem 6rem",
        borderTop: "1px solid var(--hairline)",
        background: "var(--bg-secondary)",
      }}
    >
      <div className="container">
        <div
          className="timeline-grid"
          style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "clamp(2rem,5vw,5rem)" }}
        >
          <div>
            <SectionLabel>The method</SectionLabel>
            <h2 className="display-lg">
              FROM RESEARCH TO{" "}
              <span style={{ color: "var(--accent)" }}>REALITY</span>
            </h2>
            <Reveal delay={0.1}>
              <p
                style={{
                  marginTop: 28,
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  fontSize: "1rem",
                  maxWidth: 420,
                }}
              >
                Every NM engagement follows a documented arc — from the framing
                of a question to measurable impact. Six stages. No shortcuts.
              </p>
              <Link
                to="/services"
                className="btn btn-line"
                style={{ marginTop: 28, fontSize: 11.5, paddingInline: 0 }}
              >
                Our working method <span className="btn-arrow">→</span>
              </Link>
            </Reveal>
          </div>

          <div data-timeline style={{ position: "relative", paddingLeft: 56 }}>
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 2,
                top: 8,
                bottom: 8,
                width: 1,
                background: "var(--hairline)",
              }}
            />
            <div
              aria-hidden="true"
              data-progress-line
              style={{
                position: "absolute",
                left: 2,
                top: 8,
                bottom: 8,
                width: 1,
                background: "var(--accent)",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              {timeline.map((step, i) => (
                <Reveal key={step.step} delay={i * 0.04}>
                  <div
                    className="timeline-row"
                    style={{
                      display: "flex",
                      gap: 20,
                      padding: "1.35rem 0",
                      borderBottom: i < timeline.length - 1 ? "1px solid var(--hairline)" : "none",
                      position: "relative",
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        position: "absolute",
                        left: -40,
                        top: "1.5rem",
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        border: "1px solid var(--accent-line)",
                        background: "var(--bg-secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 9,
                        color: "var(--accent-bright)",
                      }}
                    >
                      {step.step}
                    </span>
                    <div className="display-md" style={{ fontSize: "1.5rem", minWidth: 240 }}>
                      {step.label}
                    </div>
                    <div
                      className="mono"
                      style={{
                        fontSize: 11.5,
                        color: "var(--text-muted)",
                        lineHeight: 1.7,
                        paddingTop: 6,
                      }}
                    >
                      {step.desc}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .timeline-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          [data-timeline] { padding-left: 48px !important; }
          .timeline-row { flex-direction: column; gap: 4px !important; }
          .timeline-row > .mono { left: -34px !important; }
        }
      `}</style>
    </section>
  );
}