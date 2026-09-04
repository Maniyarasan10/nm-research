import { lazy, Suspense, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FounderPortrait } from "./FounderPortrait";
import SceneShell from "@/components/3d/SceneShell";
import { site } from "@/data/site";
import "./founder.css";

const ResearchCore = lazy(() => import("@/components/3d/ResearchCore"));

/**
 * FounderSection — a cinematic founder showcase. One continuous architectural
 * scene with multiple depth planes. Mouse parallax is lerped (smooth
 * interpolation) and each layer moves at a different speed to create real
 * depth. GSAP drives the entrance reveals on outer wrappers, while per-frame
 * mouse parallax runs on inner elements — the two never write to the same node.
 */
export default function FounderSection() {
  const section = useRef<HTMLElement>(null);

  // GSAP entrance-reveal targets (outer wrappers)
  const founderRevealRef = useRef<HTMLDivElement>(null);
  const typeRevealRef = useRef<HTMLDivElement>(null);

  // Mouse-parallax targets (inner elements)
  const founderRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);

  const reduced = useReducedMotion();

  // Mouse parallax with per-layer speeds, lerped in the gsap ticker.
  useEffect(() => {
    const el = section.current;
    if (!el || reduced) return;

    const target = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    const speed = {
      founder: 10,
      type: 3,
      bg: 2,
      hex: 1.5,
    };

    const clearInlineTransforms = () => {
      for (const ref of [founderRef, brandRef, stageRef, coreRef]) {
        const node = ref.current;
        if (node) node.style.transform = "";
      }
    };

    const mq = window.matchMedia("(min-width: 901px)");
    const onBreakpoint = () => clearInlineTransforms();
    mq.addEventListener("change", onBreakpoint);

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      target.x = (e.clientX - cx) / (r.width / 2);
      target.y = (e.clientY - cy) / (r.height / 2);
    };

    const tick = () => {
      if (!mq.matches) return;
      smooth.x += (target.x - smooth.x) * 0.06;
      smooth.y += (target.y - smooth.y) * 0.06;
      const sx = smooth.x;
      const sy = smooth.y;

      const founder = founderRef.current;
      const brand = brandRef.current;
      const stage = stageRef.current;
      const core = coreRef.current;

      if (founder) {
        founder.style.transform = `translate3d(${sx * speed.founder}px, ${
          sy * speed.founder
        }px, 0)`;
      }
      if (brand) {
        brand.style.transform = `translate3d(${sx * speed.type}px, ${
          sy * speed.type
        }px, 0)`;
      }
      if (stage) {
        stage.style.transform = `translate3d(${sx * speed.bg}px, ${
          sy * speed.bg
        }px, 0)`;
      }
      if (core) {
        core.style.transform = `translate3d(${sx * speed.hex}px, ${
          sy * speed.hex
        }px, 0)`;
      }
    };

    const clear = gsap.ticker.add(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      mq.removeEventListener("change", onBreakpoint);
      gsap.ticker.remove(clear);
      window.removeEventListener("pointermove", onMove);
      clearInlineTransforms();
    };
  }, [reduced]);

  // Entrance reveals.
  useEffect(() => {
    const el = section.current;
    const founder = founderRevealRef.current;
    const type = typeRevealRef.current;
    if (!el || !founder || !type) return;

    if (reduced) {
      el.classList.add("is-ready");
      founder.style.opacity = "1";
      founder.style.transform = "none";
      type.style.opacity = "1";
      type.style.transform = "none";
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: el, start: "top 70%", once: true },
    });

    gsap.set(founder, { opacity: 0, y: 40, scale: 0.97 });
    gsap.set(type, { opacity: 0, y: 20 });

    tl.to(founder, { opacity: 1, y: 0, scale: 1, duration: 1.2 })
      .to(type, { opacity: 1, y: 0, duration: 1.0 }, "-=0.9")
      .add(() => el.classList.add("is-ready"));

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [reduced]);

  // Gentle scroll parallax — founder moves slightly slower than the page,
  // adding physical depth. Applied to the outer visual wrapper so it does not
  // fight the per-frame mouse parallax on the inner portrait.
  useEffect(() => {
    const el = section.current;
    const founder = founderRevealRef.current;
    if (!el || !founder || reduced) return;

    const tween = gsap.fromTo(
      founder,
      { yPercent: 3 },
      {
        yPercent: -3,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced]);

  return (
    <section
      ref={section}
      id="founder"
      className="founder-section"
      aria-label="About the founder"
    >
      {/* depth planes */}
      <div className="founder-atmosphere" ref={stageRef} aria-hidden="true" />
      <div className="founder-grid" aria-hidden="true" />
      <div className="founder-frame" aria-hidden="true" />

      <div
        ref={coreRef}
        className="founder-core-stage"
        style={{
          position: "absolute",
          top: "calc(50% - 460px)",
          right: "-12vw",
          left: "auto",
          width: 920,
          height: 920,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <SceneShell style={{ top: 0, right: 0, bottom: 0, left: 0, transform: "none" }}>
          <Suspense fallback={null}>
            <ResearchCore />
          </Suspense>
        </SceneShell>
      </div>

      <div className="founder-stage">
        <div className="founder-zones">
          <div className="founder-layout founder-layout-portrait">
            <FounderPortrait ref={founderRevealRef} innerRef={founderRef} />
          </div>

          <div className="founder-layout founder-layout-brand" ref={typeRevealRef}>
            <div className="founder-brand" ref={brandRef}>
              <div className="founder-identity">
                <div className="founder-name">{site.founder.name}</div>
                <div className="founder-role">{site.founder.role}</div>
                <div className="founder-creds">
                  {site.founder.credentials} · {site.fullName}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
