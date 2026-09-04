import { useEffect, useRef, type MutableRefObject } from "react";

export type ScenePointerState = {
  /** Normalised pointer position, -1..1 (x right, y up). */
  x: number;
  y: number;
  /** Accumulated drag rotation (radians). */
  yaw: number;
  pitch: number;
  /** True while the user is pressing the scene's drag pad. */
  active: boolean;
};

const DRAG_SCALE = 0.008;

/**
 * Tracks the pointer globally (so it works under the site's custom cursor and
 * inside `pointer-events: none` stages) and converts drags over the scene's
 * interaction pad (`[data-scene-pad]`) into free rotation deltas.
 */
export function useScenePointer(enabled = true): MutableRefObject<ScenePointerState> {
  const ref = useRef<ScenePointerState>({ x: 0, y: 0, yaw: 0, pitch: 0, active: false });

  useEffect(() => {
    if (!enabled) return;

    let lastX = 0;
    let lastY = 0;
    let downOverPad = false;

    const hitPad = () => {
      const pad = document.querySelector<HTMLElement>("[data-scene-pad]");
      if (!pad) return null;
      return { pad, r: pad.getBoundingClientRect() };
    };

    const onMove = (e: PointerEvent) => {
      const s = ref.current;
      s.x = (e.clientX / window.innerWidth) * 2 - 1;
      s.y = -((e.clientY / window.innerHeight) * 2 - 1);
      if (downOverPad) {
        s.yaw += (e.clientX - lastX) * DRAG_SCALE;
        s.pitch += (e.clientY - lastY) * DRAG_SCALE;
      }
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onDown = (e: PointerEvent) => {
      const hit = hitPad();
      if (!hit) return;
      const inside =
        e.clientX >= hit.r.left &&
        e.clientX <= hit.r.right &&
        e.clientY >= hit.r.top &&
        e.clientY <= hit.r.bottom;
      if (!inside) return;
      downOverPad = true;
      ref.current.active = true;
      lastX = e.clientX;
      lastY = e.clientY;
      try {
        hit.pad.setPointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
      hit.pad.classList.add("is-dragging");
    };

    const onUp = () => {
      downOverPad = false;
      ref.current.active = false;
      document.querySelector<HTMLElement>("[data-scene-pad]")?.classList.remove("is-dragging");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [enabled]);

  return ref;
}