/**
 * Motion tokens for the Light Editorial Scientific system.
 *
 * One calm set of durations and one easing curve everywhere. Fast = micro
 * interactions (hover, chips), base = panel/message in/out, slow = larger
 * reveals. All durations respect `prefers-reduced-motion` via MotionConfig.
 */

export const MOTION = {
  /** Micro-interactions: hover, press, chip, dot. */
  fast: 0.14,
  /** Panels, messages, suggestions, loader stage swaps. */
  base: 0.24,
  /** Larger reveals and page-level choreography. */
  slow: 0.38,
  /** Editorial ease — gentle fast-start, calm settle. */
  ease: [0.22, 1, 0.36, 1] as const,
  /** Launcher spring — quick, minimal bounce. */
  spring: { stiffness: 480, damping: 32, mass: 0.9 },
} as const;

/** Answer-composition loader stages, shown in order while a turn resolves. */
export const STAGE_LABELS = [
  "Reading question",
  "Searching knowledge base",
  "Composing answer",
] as const;

/** Milliseconds each loader stage stays active. */
export const STAGE_MS = 260;

export type EaseTuple = readonly [number, number, number, number];