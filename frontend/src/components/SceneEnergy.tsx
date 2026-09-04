import { useEffect } from "react";
import { sceneBus } from "@/lib/sceneBus";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Invisible watcher that turns DOM interaction into 3D energy.
 *
 * Any element carrying a `data-energy` attribute (0..1) charges the scene
 * while hovered; otherwise well-known interactive elements are mapped by
 * class so scenes across the site react without annotation. Moving off an
 * interactive element discharges the bus back toward rest.
 *
 * It also owns the global channel every scene shares:
 * - `pointermove` → smoothed cursor parallax (`sceneBus.px/py`)
 * - taps/clicks → decaying `sceneBus.pop` bursts (click → stronger impression)
 * - tab visibility → `sceneBus.hidden` (scenes ease to rest while away)
 */
const FALLBACK_ENERGY: Array<[string, number]> = [
  ["a.btn", 0.55],
  [".stage-word", 0.5],
  [".eyebrow", 0.35],
  [".card-featured", 0.35],
  [".subject-chip", 0.4],
  [".service-card", 0.35],
  [".membership-card", 0.35],
  ["[data-cursor-label]", 0.45],
];

const INTERACTIVE = `${FALLBACK_ENERGY.map(([sel]) => sel).join(",")}`;

export default function SceneEnergy() {
  const reduced = useReducedMotion();

  useEffect(() => {
    let active: Element | null = null;
    let lastTap = 0;

    const resolve = (target: Element | null): number | null => {
      if (!target) return null;
      for (const [sel, v] of FALLBACK_ENERGY) {
        const el = target.closest(sel);
        if (el) {
          const raw = el.getAttribute("data-energy");
          if (raw != null) {
            const n = Number(raw);
            return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : v;
          }
          return v;
        }
      }
      return null;
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target instanceof Element ? e.target : null;
      const hit = resolve(t);
      if (hit == null) {
        if (active) {
          active = null;
          sceneBus.setTarget(0);
        }
        return;
      }
      const matched = t!.closest(INTERACTIVE);
      if (matched !== active) {
        active = matched;
        sceneBus.setTarget(hit);
      }
    };

    const onMove = (e: PointerEvent) => {
      sceneBus.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      );
    };

    const onLeave = () => {
      sceneBus.setPointer(0, 0);
    };

    const norm = (e: PointerEvent) => ({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: (e.clientY / window.innerHeight) * 2 - 1,
    });

    const onDown = (e: PointerEvent) => {
      const t = e.target instanceof Element ? e.target : null;
      const hit = resolve(t);
      const n = norm(e);
      if (hit != null) sceneBus.setTarget(Math.max(hit, 0.7));
      if (reduced) return;
      // Only emit a pop when interacting with an energy element or the scene
      // pad; a plain click on the page shouldn't whip every scene around.
      const interactive = t && t.closest(INTERACTIVE);
      const pad = document.querySelector<HTMLElement>("[data-scene-pad]");
      const onPad =
        pad &&
        e.clientX >= (pad.getBoundingClientRect().left) &&
        e.clientX <= (pad.getBoundingClientRect().right) &&
        e.clientY >= (pad.getBoundingClientRect().top) &&
        e.clientY <= (pad.getBoundingClientRect().bottom);
      const now = performance.now();
      if (now - lastTap > 120 && (interactive || onPad)) {
        sceneBus.trigger(n.x, n.y, hit != null ? 1 : 0.8);
        lastTap = now;
      }
    };

    const onClick = (e: PointerEvent) => {
      if (reduced) return;
      // Click bursts only for interactive / energy targets so casual clicks
      // don't charge the scene.
      const t = e.target instanceof Element ? e.target : null;
      if (!t || !t.closest(INTERACTIVE)) return;
      sceneBus.trigger(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
        0.9,
      );
    };

    const onVis = () => {
      sceneBus.setHidden(document.hidden);
    };

    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("click", onClick, { passive: true, capture: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onMove, { passive: true });
    onVis();

    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("click", onClick, { capture: true } as EventListenerOptions);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return null;
}