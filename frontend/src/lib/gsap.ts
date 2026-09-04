import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useLayoutEffect, type RefObject } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

/**
 * Animation easing used across the site.
 */
export const EASE = "power3.out";
export const EASE_INOUT = "power4.inOut";

/**
 * Reveal-on-scroll hook: fades + rises content as it enters the viewport.
 * Respects prefers-reduced-motion via the `enabled` flag.
 */
export function useSplitWords(text: string): string[] {
  return text.split(" ");
}

export function useReveal<T extends HTMLElement>(
  ref: RefObject<T>,
  enabled: boolean,
  options: { y?: number; stagger?: number } = {},
) {
  const { y = 32, stagger = 0.08 } = options;
  useLayoutEffect(() => {
    if (!ref.current) return;
    if (!enabled) {
      ref.current.style.opacity = "1";
      ref.current.style.transform = "none";
      return;
    }
    const el = ref.current;
    const targets = el.querySelectorAll("[data-reveal]");
    const tween = gsap.fromTo(
      targets.length ? targets : el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        stagger,
        ease: EASE,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ref, enabled, y, stagger]);
}
