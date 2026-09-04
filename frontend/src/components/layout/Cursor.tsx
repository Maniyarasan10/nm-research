import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type CursorMode = "default" | "hover" | "label" | "view";

export function Cursor() {
  const isDesktop = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();
  const enabled = isDesktop && !reduced;

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<CursorMode>("default");
  const labelRef = useRef("");
  const [, forceRender] = useState(0);

  useEffect(() => {
    document.body.classList.toggle("has-custom-cursor", enabled);
    return () => document.body.classList.remove("has-custom-cursor");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });

    // rAF-batched state updates to avoid React re-render thrash
    let pending: CursorMode | null = null;
    let pendingLabel: string | null = null;
    let raf = 0;

    const applyMode = (mode: CursorMode, label: string) => {
      if (pending === mode && pendingLabel === label) return;
      pending = mode;
      pendingLabel = label;
      if (!raf) {
          raf = requestAnimationFrame(() => {
            raf = 0;
            if (pending) {
              modeRef.current = pending;
              labelRef.current = pendingLabel ?? "";
              forceRender((n) => n + 1);
            }
            pending = null;
            pendingLabel = null;
          });
      }
    };

    const onMove = (e: MouseEvent) => {
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest(
        "a, button, [data-cursor]",
      ) as HTMLElement | null;
      if (!t) {
        applyMode("default", "");
        return;
      }
      if (t.hasAttribute("data-cursor-label")) {
        applyMode("label", t.getAttribute("data-cursor-label") || "");
      } else if (t.hasAttribute("data-cursor-view")) {
        applyMode("view", "");
      } else {
        applyMode("hover", "");
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      if (raf) cancelAnimationFrame(raf);
      gsap.killTweensOf([dot, ring]);
    };
  }, [enabled]);

  if (!enabled) return null;

  const mode = modeRef.current;
  const label = labelRef.current;
  const ringSize = mode === "label" ? 84 : mode === "view" ? 64 : 40;

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "var(--accent-bright)",
          zIndex: "var(--z-cursor)",
          pointerEvents: "none",
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: ringSize,
          height: ringSize,
          borderRadius: "50%",
          border: "1px solid var(--border-strong)",
          zIndex: "var(--z-cursor)",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition:
            "width .3s var(--ease-out), height .3s var(--ease-out), background-color .3s var(--ease-out)",
          background:
            mode === "label" || mode === "view"
              ? "rgba(16,16,16,0.55)"
              : "transparent",
        }}
      >
        {mode === "label" && (
          <span
            className="mono"
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              color: "#f8f2e4",
            }}
          >
            {label}
          </span>
        )}
        {mode === "view" && (
          <span
            className="mono"
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              color: "#f8f2e4",
            }}
          >
            VIEW
          </span>
        )}
      </div>
    </>
  );
}