import { lazy, Suspense, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Reveal } from "@/components/ui/Reveal";

const ResearchNetwork = lazy(() => import("@/components/3d/ResearchNetwork"));

const stages = [
  "RESEARCH",
  "EXPERIMENT",
  "PROTOTYPE",
  "VALIDATION",
  "DEPLOYMENT",
  "IMPACT",
];

export default function InnovationScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef({ value: 0 });
  const reduced = useReducedMotion();
  const { isLowPower, webgl } = useDeviceCapability();
  const show3D = webgl && !isLowPower && !reduced;
  const isDesktop = useMediaQuery("(min-width: 900px)");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      const words = el.querySelectorAll("[data-stage-word]");
      const counter = el.querySelector<HTMLElement>("[data-stage-progress]");
      const rail = el.querySelector<HTMLElement>("[data-stage-rail]");

      const tl = gsap.timeline({
        defaults: { force3D: true },
        scrollTrigger: {
          trigger: el,
          start: isDesktop ? "top 80px" : "top 25%",
          end: isDesktop ? "+=150%" : "+=130%",
          scrub: 1,
          pin: true,
          pinType: "transform",
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (counter)
              counter.textContent = String(Math.round(self.progress * 100)).padStart(2, "0");
            progressRef.current.value = self.progress;
          },
        },
      });

      const unit = (stages.length + 1) / 2;
      words.forEach((w, i) => {
        tl.fromTo(
          w,
          { autoAlpha: 0.16, y: 60 },
          { autoAlpha: 1, y: 0, duration: 1.4, ease: "power2.out" },
          i * unit,
        );
      });

      if (rail) {
        tl.fromTo(
          rail,
          { scaleY: 0 },
          { scaleY: 1, duration: 1, ease: "none", transformOrigin: "top" },
          0,
        );
      }
    }, el);

    return () => ctx.revert();
  }, [reduced, isDesktop]);

  return (
    <section
      id="innovation"
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "86vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        borderTop: "1px solid var(--hairline)",
        backgroundColor: "var(--bg-primary)",
        willChange: "transform",
      }}
    >
      {show3D ? (
        <div
          data-innovation-3d
          style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.8 }}
          aria-hidden="true"
        >
          <Suspense
            fallback={
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(133,21,9,0.09), transparent 70%)",
                }}
              />
            }
          >
            <ResearchNetwork progressRef={progressRef} />
          </Suspense>
        </div>
      ) : (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(133,21,9,0.1), transparent 70%)",
          }}
        />
      )}

      <div
        className="container"
        style={{ position: "relative", zIndex: 1, width: "100%" }}
      >
        <Reveal>
          <div
              className="mono eyebrow stage-head"
              style={{
                marginBottom: 40,
                justifyContent: "space-between",
                display: "flex",
                flexWrap: "wrap",
                rowGap: 8,
              }}
            >
            <span>From research to reality — scrubbed by scroll</span>
            <span style={{ color: "var(--text-faint)" }}>PHASE 01→06</span>
          </div>
        </Reveal>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <span
            data-stage-rail
            aria-hidden
            style={{
              width: 1,
              height: "min(240px, 30vh)",
              background: "var(--accent)",
              transform: "scaleY(0)",
              transformOrigin: "top",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {stages.map((s, i) => (
              <div
                key={s}
                className="stage-word-line"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "0.42em 0",
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.2em" }}
                >
                  PHASE 0{i + 1}
                </span>
                <span
                  data-stage-word
                  data-energy="0.55"
                  className="display-xl stage-word"
                  style={{
                    fontSize: "clamp(1.7rem, 4.5vw, 3.1rem)",
                    color: "var(--text-primary)",
                  }}
                >
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 44,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 32,
          }}
          className="stage-footer"
        >
          <p
            style={{
              maxWidth: 420,
              color: "var(--text-secondary)",
              fontSize: "0.98rem",
              lineHeight: 1.7,
            }}
          >
            Six working services carry an idea from a framed question to a
            published, measurable result — documented at every stage, never a
            black box.
          </p>

          <div style={{ textAlign: "right" }}>
            <div
              className="display-xl"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(3rem, 8vw, 5.5rem)",
                lineHeight: 0.9,
                color: "var(--accent)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span data-stage-progress>00</span>
              <span style={{ fontSize: "0.4em", color: "var(--text-faint)" }}>%</span>
            </div>
            <div className="mono" style={{ marginTop: 12, fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.2em" }}>
              IDEA COMPLETION
            </div>
          </div>
        </div>

        <Link
          to="/services"
          className="btn btn-line"
          data-cursor-label="OPEN"
          style={{ marginTop: 28, fontSize: 11.5, paddingInline: 0 }}
        >
          Trace the pipeline <span className="btn-arrow">→</span>
        </Link>

        <style>{`
          [data-innovation-3d] { }
          @media (max-width: 640px) {
            .stage-footer { flex-direction: column; align-items: flex-start !important; }
            [data-stage-rail] { height: min(210px, 24vh) !important; }
            .stage-word { font-size: clamp(1.2rem, 5.5vw, 1.8rem) !important; }
            .stage-word-line { gap: 14px !important; padding: 0.3em 0 !important; }
            .stage-head { margin-bottom: 24px !important; }
            .stage-footer { margin-top: 22px !important; }
            [data-stage-word] + .mono { display: none; }
            [data-innovation-3d] { opacity: 0.32 !important; }
            [data-innovation-3d]::after {
              content: "";
              position: absolute;
              inset: 0;
              background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(247,241,227,0.0), rgba(247,241,227,0.72) 78%);
            }
          }
        `}</style>
      </div>
    </section>
  );
}