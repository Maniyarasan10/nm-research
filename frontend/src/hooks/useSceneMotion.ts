import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ScenePointerState } from "./useScenePointer";

export type SceneMotionState = {
  /** Smoothed parallax tilt (radians). */
  tiltX: number;
  tiltY: number;
  /** Drag rotation with elastic return to baseline. */
  yaw: number;
  pitch: number;
  yawV: number;
  pitchV: number;
  /** Continuous idle spin angle. */
  spin: number;
  active: boolean;
};

type SceneMotionOptions = {
  enabled?: boolean;
  /** Idle spin speed, rad/s. */
  idleSpeed?: number;
  /** How strongly the pointer position tilts the object. */
  tiltScale?: number;
};

/**
 * Consumes a `useScenePointer` ref inside the render loop and produces
 * frame-smoothed motion: pointer parallax (lerped), drag yaw/pitch that
 * springs back when released, and continuous idle spin.
 */
export function useSceneMotion(
  pointer: { current: ScenePointerState },
  options: SceneMotionOptions = {},
) {
  const motion = useRef<SceneMotionState>({
    tiltX: 0,
    tiltY: 0,
    yaw: 0,
    pitch: 0,
    yawV: 0,
    pitchV: 0,
    spin: 0,
    active: false,
  });
  const cfg = useRef({ enabled: true, idleSpeed: 0.1, tiltScale: 0.32 });
  cfg.current.enabled = options.enabled ?? true;
  cfg.current.idleSpeed = options.idleSpeed ?? 0.1;
  cfg.current.tiltScale = options.tiltScale ?? 0.32;

  useFrame((_, delta) => {
    const m = motion.current;
    const c = cfg.current;
    if (!c.enabled) return;

    const dt = Math.min(delta, 0.05);
    const p = pointer.current;

    const k = 1 - Math.exp(-dt * 4.5);
    m.tiltX += (p.x * c.tiltScale - m.tiltX) * k;
    m.tiltY += (p.y * c.tiltScale - m.tiltY) * k;
    m.active = p.active;

    if (p.active) {
      m.yaw = p.yaw;
      m.pitch = p.pitch;
      m.yawV = 0;
      m.pitchV = 0;
    } else {
      m.yawV += (-m.yaw * 9 - m.yawV * 4) * dt;
      m.yaw += m.yawV * dt;
      m.pitchV += (-m.pitch * 9 - m.pitchV * 4) * dt;
      m.pitch += m.pitchV * dt;
    }

    m.spin += dt * c.idleSpeed;
  });

  return motion;
}