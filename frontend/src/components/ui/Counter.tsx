import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Counter({
  target,
  suffix = "",
  duration = 1600,
  locale = true,
}: {
  target: number;
  suffix?: string;
  duration?: number;
  locale?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? target : 0);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: target,
      duration: duration / 1000,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      onUpdate: () => {
        setDisplay(Math.round(obj.v));
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [target, reduced, duration]);

  const formatted = locale ? display.toLocaleString("en-IN") : String(display);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {formatted}
      {suffix}
    </span>
  );
}