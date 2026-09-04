import { forwardRef } from "react";

const BASE = import.meta.env.BASE_URL;

/**
 * FounderPortrait — the cinematic founder image with atmospheric shadow,
 * warm halo glow and foreground separation.
 *
 * Two forwarded refs:
 *  - outer: `.founder-visual` used for the GSAP entrance reveal (y/scale)
 *  - inner: `.founder-portrait-inner` used for per-frame mouse parallax
 * This keeps the two transform systems from fighting over one element.
 */
export const FounderPortrait = forwardRef<
  HTMLDivElement,
  { innerRef?: React.Ref<HTMLDivElement> }
>(function FounderPortrait({ innerRef }, outerRef) {
  return (
    <div className="founder-visual" ref={outerRef}>
      <div className="founder-halo" aria-hidden="true" />
      <div className="founder-portrait">
        <div className="founder-portrait-inner" ref={innerRef}>
          <img
            src={`${BASE}images/founder.png`}
            alt="Dr. Mathivanan Nallathambi, Founder & CEO, NM Research"
            width={1024}
            height={1536}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
});
