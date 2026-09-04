import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    // Keep GSAP ScrollTrigger (pins, scrubbers, reveal triggers) in sync
    // with Lenis by running both from the same ticker instead of a separate
    // rAF loop — this avoids the pinned section being pushed off-screen
    // while the smoothed scroll position catches up.
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Expose for anchors
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [reduced]);

  // Helpers for anchor scrolling
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = (target as HTMLAnchorElement).getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (el && lenisRef.current) {
        e.preventDefault();
        lenisRef.current.scrollTo(el as HTMLElement, { offset: -80 });
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <>{children}</>;
}
