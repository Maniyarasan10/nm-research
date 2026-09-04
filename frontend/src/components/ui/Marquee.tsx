import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type MarqueeProps = {
  items: string[];
  duration?: number;
  /** Ghost/outline text variant */
  outline?: boolean;
  /** Reverse direction */
  reverse?: boolean;
  /** Pause the scroll on hover */
  pauseOnHover?: boolean;
  /** Scroll-velocity skew on pointer devices */
  skew?: boolean;
};

export default function Marquee({
  items,
  duration = 34,
  outline = false,
  reverse = false,
  pauseOnHover = true,
  skew = true,
}: MarqueeProps) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const skewRef = useRef<HTMLDivElement>(null);
  const row = [...items, ...items];

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = skewRef.current;
    if (!wrap || !track || reduced || !skew) return;

    const prefersMouse = window.matchMedia("(hover: hover) and (pointer: fine)")
      .matches;

    if (prefersMouse) {
      const skewTo = gsap.quickTo(track, "skewX", {
        duration: 0.6,
        ease: "power3.out",
      });
      const st = ScrollTrigger.create({
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = Math.min(Math.max(self.getVelocity() / 180, -1), 1);
          skewTo(v * 8);
        },
      });
      const onLeave = () => skewTo(0);
      wrap.addEventListener("mouseleave", onLeave);
      return () => {
        st.kill();
        wrap.removeEventListener("mouseleave", onLeave);
        gsap.killTweensOf(track);
      };
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        track,
        { skewX: 0.35 },
        {
          skewX: -0.35,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.4,
          },
        },
      );
    }, wrap);
    return () => ctx.revert();
  }, [reduced, skew]);

  return (
    <div
      ref={wrapRef}
      className="marquee-wrap"
      style={{
        overflow: "hidden",
        borderTop: "1px solid var(--hairline)",
        borderBottom: "1px solid var(--hairline)",
        paddingBlock: "1.4rem",
        backgroundColor: outline ? "transparent" : "var(--bg-secondary)",
      }}
      aria-hidden="true"
    >
      <div
        ref={skewRef}
        style={{ width: "max-content", willChange: "transform" }}
      >
        <div
          className="marquee-track"
          style={{
            display: "flex",
            width: "max-content",
            whiteSpace: "nowrap",
            willChange: "transform",
          }}
        >
          {row.map((item, i) => (
            <span
              key={i}
              className="display-md"
              style={{
                fontSize: "1.4rem",
                color: outline ? "transparent" : "var(--text-muted)",
                WebkitTextStroke: outline
                  ? "1px var(--border-strong)"
                  : undefined,
                paddingInline: "1.5rem",
                letterSpacing: "0.02em",
              }}
            >
              {item} <span style={{ color: "var(--accent)" }}>◈</span>
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .marquee-wrap .marquee-track {
            animation: marquee ${duration}s linear infinite;
            animation-direction: ${reverse ? "reverse" : "normal"};
          }
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          ${pauseOnHover ? ".marquee-wrap:hover .marquee-track { animation-play-state: paused; }" : ""}
        }
      `}</style>
    </div>
  );
}