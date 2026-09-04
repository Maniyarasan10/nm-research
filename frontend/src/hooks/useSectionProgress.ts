import { useEffect, useRef, type MutableRefObject, type RefObject } from "react";

export type SectionTarget = string | RefObject<HTMLElement | null>;

/**
 * Layout-driven occupancy of a page section, kept in a live ref (never
 * causes React re-renders). `value` is 0..1: how much of the section is
 * currently inside the viewport. Scenes use it to animate by their real
 * position on the page (a 3D stage lighting up as it scrolls into view and
 * quieting as it leaves) — the r3f-scroll-rig idea without fixed-100vh posts.
 *
 * The value is recomputed on scroll/resize plus a slow interval, because
 * lazily-mounted 3D sections can change layout after the initial pass.
 */
export function useSectionProgress(
  target: SectionTarget,
): { value: MutableRefObject<number> } {
  const value = useRef(0);

  useEffect(() => {
    const compute = () => {
      const el =
        typeof target === "string"
          ? document.querySelector(target)
          : target.current;
      if (!el) {
        value.current = 0;
        return;
      }
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      if (visible <= 0) {
        value.current = 0;
        return;
      }
      const span = Math.min(r.height, vh);
      value.current = Math.min(1, visible / Math.max(span, 1));
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute, { passive: true });
    const iv = window.setInterval(compute, 600);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
      window.clearInterval(iv);
    };
  }, [target]);

  return { value };
}