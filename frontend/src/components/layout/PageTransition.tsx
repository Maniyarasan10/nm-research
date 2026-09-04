import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(ref.current, { opacity: 0, y: 26, duration: 0.5 });
      // Only animate child elements actually present; otherwise GSAP warns
      // "target not found" for the unused [data-pt-fade] stagger.
      const fadeTargets = ref.current?.querySelectorAll("[data-pt-fade]") ?? [];
      if (fadeTargets.length > 0) {
        tl.from(
          fadeTargets,
          { opacity: 0, y: 14, duration: 0.45, stagger: 0.045 },
          "-=0.32",
        );
      }
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={ref}
      style={{ opacity: reduced ? 1 : undefined }}
      data-page-transition
    >
      {children}
    </div>
  );
}