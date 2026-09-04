import { forwardRef } from "react";

const BASE = import.meta.env.BASE_URL;

/**
 * NMBrandMark — the NM logo rendered as a physical premium brand mark with a
 * subtle warm burgundy illumination.
 *
 * Two forwarded refs:
 *  - outer: reveal wrapper used for the GSAP entrance fade/slide
 *  - inner: `.nm-brandmark` used for the gentle 3D parallax rotation
 */
export const NMBrandMark = forwardRef<
  HTMLDivElement,
  { innerRef?: React.Ref<HTMLDivElement> }
>(function NMBrandMark({ innerRef }, outerRef) {
  return (
    <div ref={outerRef}>
      <div className="nm-brandmark" ref={innerRef}>
        <img
          src={`${BASE}images/nm.png`}
          alt="NM Research mark"
          width={1536}
          height={1024}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
});
