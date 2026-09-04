import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type SplitRevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Stagger between lines. Defaults to 0.14. */
  stagger?: number;
  /** Optional alternate trigger element (e.g. a sticky parent). */
  triggerRef?: React.RefObject<HTMLElement | null>;
};

export default function SplitReveal({
  children,
  as: Tag = "div",
  className,
  stagger = 0.14,
  triggerRef,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
      });

      // `triggerRef` may not be attached yet when this effect runs — resolve
      // it to real content or fall back to the element itself so GSAP never
      // receives a null / empty target.
      const trigger = triggerRef?.current ?? el;

      gsap.fromTo(
        el.querySelectorAll(".split-line"),
        { yPercent: 120 },
        {
          yPercent: 0,
          stagger,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger,
            start: "top 88%",
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reduced, stagger, triggerRef]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}