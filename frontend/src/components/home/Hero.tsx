import { lazy, Suspense, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, SplitText } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { stats, site } from "@/data/site";
import Magnetic from "@/components/ui/Magnetic";

const ResearchCore = lazy(() => import("@/components/3d/ResearchCore"));

export default function Hero() {
  const reduced = useReducedMotion();
  const { isLowPower } = useDeviceCapability();
  const rootRef = useRef<HTMLElement>(null);
  const show3D = !isLowPower;

  useEffect(() => {
    const root = rootRef.current;
    if (reduced || !root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      const h1 = root.querySelector("[data-hero-title]") as HTMLElement | null;
      if (h1) {
        SplitText.create(h1, {
          type: "words, chars",
          mask: "words",
          wordsClass: "hero-word",
          charsClass: "hero-char",
        });
        tl.fromTo(
          h1.querySelectorAll(".hero-char"),
          { yPercent: 120 },
          { yPercent: 0, duration: 1.4, stagger: 0.018 }
        );
      }

      tl.fromTo(
        "[data-hero-fade]",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1 },
        "-=0.9"
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    const root = rootRef.current;
    if (reduced || !root) return;

    const ctx = gsap.context(() => {
      const content = root.querySelector("[data-hero-content]");
      const canvas = root.querySelector("[data-hero-canvas]");
      if (content) {
        gsap.to(content, {
          yPercent: -14,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom 20%",
            scrub: true,
          },
        });
      }
      if (canvas) {
        gsap.to(canvas, {
          scale: 1.14,
          opacity: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      data-hero-scene=""
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        paddingTop: 120,
      }}
    >
      {/* 3D object in the upper-right empty space */}
      {show3D && (
        <div
          data-hero-canvas
          style={{
            position: "absolute",
            top: 96,
            right: 0,
            width: "clamp(440px, 56%, 820px)",
            height: "74%",
            zIndex: 0,
            willChange: "transform",
            overflow: "hidden",
          }}
          aria-hidden="true"
        >
          <Suspense
            fallback={
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(133,21,9,0.1), transparent 70%)",
                }}
              />
            }
          >
            <ResearchCore />
          </Suspense>
        </div>
      )}

      {/* soft radial light */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 50% 40% at 50% 18%, rgba(133,21,9,0.13), transparent 70%)",
        }}
      />

      {/* scroll cue */}
      <div
        data-hero-fade
        style={{
          position: "absolute",
          left: "clamp(24px, 4vw, 56px)",
          bottom: "clamp(24px, 4vw, 56px)",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div className="scroll-cue-line" />
        <span className="mono" style={{ fontSize: 10, letterSpacing: "0.22em" }}>
          SCROLL
        </span>
      </div>

      <div
        className="container"
        style={{ position: "relative", zIndex: 1, paddingBottom: "5rem" }}
        data-hero-content
      >
        <div
          className="mono eyebrow"
          style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 12 }}
          data-hero-fade
        >
          <span
            style={{
              width: 22,
              height: 1,
              background: "var(--accent)",
              display: "inline-block",
            }}
          />
          {site.founded} · RESEARCH / DEVELOPMENT / INNOVATION
        </div>

        <h1
          className="display-xl"
          style={{ maxWidth: 920, fontWeight: 580 }}
          data-hero-title
        >
          <span style={{ display: "block" }}>WE RESEARCH</span>
          <span style={{ display: "block" }}>WHAT COMES</span>
          <span style={{ display: "block" }}>
            <span style={{ color: "var(--accent)" }}>NEXT.</span>
          </span>
        </h1>

        <div
          style={{
            maxWidth: 480,
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            lineHeight: 1.7,
          }}
          data-hero-fade
        >
          {site.positioning}
        </div>

        <div
          className="hero-cta"
          style={{ display: "flex", gap: 12, marginTop: 44 }}
          data-hero-fade
        >
          <Magnetic strength={0.35}>
            <Link to="/research" className="btn btn-primary" data-energy="0.6">
              Explore our research <span className="btn-arrow">→</span>
            </Link>
          </Magnetic>
          <Magnetic strength={0.35}>
            <Link to="/about" className="btn btn-ghost" data-energy="0.6">
              View our work
            </Link>
          </Magnetic>
        </div>

        {/* Stat strip */}
        <div className="hero-stats" style={{ marginTop: 64 }} data-hero-fade>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              borderTop: "1px solid var(--hairline)",
            }}
            className="hero-stats-grid"
          >
            {stats.slice(0, 4).map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: "1.6rem 1rem 0",
                  borderRight:
                    i % 4 === 3 ? "none" : "1px solid var(--hairline)",
                }}
                className="hero-stat-cell"
              >
                <div
                  className="display-md"
                  style={{
                    fontSize: "2rem",
                    color: "var(--text-primary)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {s.value}
                  <span style={{ color: "var(--accent)" }}>{s.suffix}</span>
                </div>
                <div
                  className="mono"
                  style={{
                    marginTop: 4,
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    color: "var(--text-muted)",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          [data-hero-canvas] {
            width: 64% !important;
            height: 46% !important;
            top: 110px !important;
          }
          .hero-stats-grid { grid-template-columns: repeat(2, 1fr) !important; row-gap: 28px; }
          .hero-stat-cell:nth-child(2) { border-right: 1px solid var(--hairline) !important; }
          .hero-stat-cell:nth-child(3) { border-right: none !important; }
        }
        @media (max-width: 560px) {
          .hero-cta { flex-direction: column !important; align-items: stretch; }
          .hero-cta .btn { width: 100%; justify-content: center; }
          [data-hero-canvas] {
            width: 62% !important;
            height: 38% !important;
            top: 100px !important;
            opacity: 0.9;
          }
          [data-hero-canvas] canvas {
            opacity: 0.6;
          }
        }
        @media (max-width: 480px) {
          .hero-stats-grid { grid-template-columns: 1fr !important; }
          .hero-stat-cell { border-right: none !important; }
        }
      `}</style>
    </section>
  );
}