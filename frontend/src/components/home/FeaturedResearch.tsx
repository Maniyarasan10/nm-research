import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { featuredProjects } from "@/data/projects";
import { Reveal } from "@/components/ui/Reveal";
import SplitReveal from "@/components/ui/SplitReveal";

export default function FeaturedResearch() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (reduced || !root) return;

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(
      () => {
        gsap.utils.toArray<HTMLElement>("[data-project-index]").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: 30, opacity: 0.25 },
            {
              yPercent: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: el.closest("[data-project-row]"),
                start: "top bottom",
                end: "top 35%",
                scrub: true,
              },
            }
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-project-row]").forEach((row) => {
          const line = row.querySelector<HTMLElement>("[data-row-line]");
          if (!line) return;
          const xTo = gsap.quickTo(line, "x", {
            duration: 0.5,
            ease: "power3.out",
          });
          const onMove = (e: PointerEvent) => {
            const r = row.getBoundingClientRect();
            xTo(e.clientX - r.left);
            gsap.to(line, { autoAlpha: 1, duration: 0.25, overwrite: true });
          };
          const onLeave = () => {
            gsap.to(line, { autoAlpha: 0, duration: 0.3 });
          };
          row.addEventListener("pointermove", onMove);
          row.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            row.removeEventListener("pointermove", onMove);
            row.removeEventListener("pointerleave", onLeave);
            gsap.killTweensOf(line);
          });
        });
      },
      root,
    );
    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      style={{ paddingBlock: "7rem 5rem", borderTop: "1px solid var(--hairline)" }}
      id="featured-research"
    >
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
              marginBottom: 32,
            }}
          >
            <div className="mono eyebrow">
              <span style={{ width: 28, height: 1, background: "var(--accent)" }} />
              FEATURED RESEARCH &amp; WORK
            </div>
            <span
              className="mono"
              style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text-faint)" }}
            >
              INDEX / FIELD NOTES
            </span>
          </div>
        </Reveal>
        <SplitReveal as="h2" className="display-lg">
          SIGNALLING WORK,{" "}
          <span style={{ color: "var(--accent)" }}>MEASURED IN OUTPUT</span>
        </SplitReveal>
      </div>

      <div className="container" style={{ marginTop: 56 }}>
        {featuredProjects.map((p) => (
          <Reveal key={p.index}>
            <Link
              to={p.href}
              data-project-row
              data-cursor-label="EXPLORE"
              className="project-panel"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.4fr",
                gap: "clamp(1.5rem, 4vw, 4rem)",
                alignItems: "center",
                padding: "clamp(2rem, 5vw, 3.4rem) 0.5rem",
                borderBottom: "1px solid var(--hairline)",
                position: "relative",
                transition: "background-color .5s var(--ease-out)",
              }}
            >
              <span
                data-row-line
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  top: "12%",
                  bottom: "12%",
                  width: 1,
                  background: "var(--accent)",
                  opacity: 0,
                  pointerEvents: "none",
                }}
              />
              <div style={{ display: "flex", alignItems: "baseline", gap: "clamp(1rem, 2.5vw, 2.2rem)" }}>
                <span
                  data-project-index
                  className="display-xl mono"
                  style={{
                    fontSize: "clamp(3rem, 7vw, 5.5rem)",
                    color: "var(--text-faint)",
                    fontVariantNumeric: "tabular-nums",
                    display: "inline-block",
                    willChange: "transform",
                  }}
                  aria-hidden="true"
                >
                  {p.index}
                </span>
                <span
                  className="display-md"
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2.4rem)",
                    color: "var(--text-primary)",
                    lineHeight: 1.15,
                  }}
                >
                  {p.name}
                </span>
              </div>

              <div>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.98rem",
                    lineHeight: 1.7,
                    maxWidth: 520,
                  }}
                >
                  {p.statement}
                </p>
                <div
                  className="mono"
                  style={{
                    marginTop: 20,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 18,
                    fontSize: 10.5,
                    letterSpacing: "0.12em",
                    color: "var(--text-muted)",
                  }}
                >
                  <span style={{ color: "var(--accent-bright)" }}>● {p.status}</span>
                  <span>{p.technology}</span>
                </div>
                <div
                  className="btn btn-line"
                  style={{ marginTop: 22, fontSize: 11.5, paddingInline: 0, display: "inline-flex" }}
                >
                  View case study <span className="btn-arrow">→</span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <style>{`
        .project-panel:hover { background: rgba(248,242,228,0.02); }
        .project-panel:hover [data-project-index] { color: var(--accent); }
        @media (max-width: 820px) {
          .project-panel { grid-template-columns: 1fr !important; padding-left: 0.25rem !important; padding-right: 0.25rem !important; }
        }
      `}</style>
    </section>
  );
}