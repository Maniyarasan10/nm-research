import { useEffect, useRef, type MutableRefObject } from "react";

/**
 * Global scroll-progress bus. Each consumer holds a stable ref whose
 * `value` (0..1) tracks the whole-document scroll position, so any 3D
 * object can drive itself from scrolling with zero per-section wiring.
 *
 * Cheap: one passive scroll + resize listener per consumer, no rAF.
 * With Lenis (native window scroll) this stays in lockstep with the
 * smoothed scroll position.
 */
export function useScrollProgress(): MutableRefObject<{ value: number }> {
  const ref = useRef({ value: 0 });

  useEffect(() => {
    const update = () => {
      const max = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      ref.current.value = Math.min(1, Math.max(0, window.scrollY / max));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return ref;
}