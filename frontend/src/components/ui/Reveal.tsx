import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return;
    if (reduced) return;
    const el = ref.current;
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, reduced]);

  return (
    <div ref={ref} className={className} style={{ opacity: reduced ? 1 : 0 }}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      className="mono eyebrow"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 28,
      }}
    >
      <span style={{ width: 28, height: 1, background: "var(--accent)" }} />
      {children}
    </div>
  );
}
