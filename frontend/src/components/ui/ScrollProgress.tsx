import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const tween = gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: 0.3,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 900,
        background: "var(--hairline)",
      }}
    >
      <div
        ref={ref}
        style={{
          height: "100%",
          width: "100%",
          transformOrigin: "left",
          transform: "scaleX(0)",
          background: "var(--accent)",
        }}
      />
    </div>
  );
}