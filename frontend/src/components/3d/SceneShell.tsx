import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";

type SceneShellProps = {
  children: ReactNode;
  /**
   * Styling for the absolute stage. Give it explicit width/height so the
   * ScrollTrigger has a measurable box.
   */
  style?: CSSProperties;
  /** Target opacity after the in-view fade. */
  intensity?: number;
  /** Class used for shared (mobile) stage overrides. */
  className?: string;
};

/**
 * Mounts a lazy 3D canvas behind a section and eases it in with a scrubbed
 * fade + rise once it enters the viewport. On low-power devices, reduced
 * motion, or missing WebGL it renders a quiet radial-light fallback instead.
 */
export default function SceneShell({
  children,
  style,
  intensity = 0.9,
  className = "scene-stage",
}: SceneShellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const animRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { webgl, isLowPower } = useDeviceCapability();
  const allowed = webgl && !isLowPower && !reduced;

  useEffect(() => {
    const el = animRef.current;
    if (!el || !allowed) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 70 },
        {
          opacity: intensity,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "top 22%",
            scrub: 0.5,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [allowed, intensity]);

  return (
    <div
      ref={ref}
      data-3d-scene=""
      data-scene-host=""
      aria-hidden="true"
      className={className}
      style={{
        pointerEvents: "none",
        position: "absolute",
        ...style,
      }}
    >
      {allowed ? (
        <>
          <div
            ref={animRef}
            style={{ position: "absolute", inset: 0, willChange: "transform, opacity" }}
          >
            {children}
          </div>
        </>
      ) : (
        <div
          ref={animRef}
          style={{
            position: "absolute",
            inset: 0,
            willChange: "transform, opacity",
            background:
              "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(133,21,9,0.08), transparent 70%)",
          }}
        />
      )}
    </div>
  );
}