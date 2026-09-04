/**
 * Scene energy bus.
 *
 * DOM interactions (hovering a CTA, a stage word, a research chip…) set a
 * `target` through `setTarget`. Every 3D scene reads `energy` in its render
 * loop and eases toward the target, so events in the document visibly charge
 * the 3D objects — brightness, orbit speed, particle density — without any
 * React re-render.
 *
 * The bus also carries:
 * - `pop` — decaying burst from taps/clicks (`trigger`). A single decaying
 *   scalar so scenes can pulse without re-evaluating impulse lists.
 * - `px/py` — the smoothed, viewport-normalised pointer (-1..1), shared by
 *   every scene for cursor parallax.
 * - `hidden` — document visibility; while true the bus eases everything to
 *   rest so scenes freeze instead of snapping on resume.
 */
type Impulse = { x: number; y: number; born: number; strength: number };

export const sceneBus = {
  energy: 0,
  target: 0,
  pop: 0,
  px: 0,
  py: 0,
  hidden: false,

  setTarget(v: number) {
    const clamped = v < 0 ? 0 : v > 1 ? 1 : v;
    this.target = clamped;
  },

  /** Register a tap/click burst. `x,y` viewport normalised (-1..1). */
  trigger(x = 0, y = 0, strength = 1) {
    this.impulses.push({ x, y, born: performance.now(), strength });
    if (this.impulses.length > 8) this.impulses.shift();
    this.setTarget(Math.max(this.target, 0.85 * strength));
  },

  /** Feed the window cursor (normalised -1..1); smoothed in `step`. */
  setPointer(x: number, y: number) {
    this.pointerX = x;
    this.pointerY = y;
  },

  setHidden(v: boolean) {
    this.hidden = v;
  },

  /**
   * Frame smoothing helper for use inside `useFrame`. Pass the frame delta;
   * returns the current eased energy and advances the whole bus:
   * energy → target, impulses → pop, pointer → smoothed position.
   */
  step(delta: number, reduction = 3): number {
    const dt = Math.min(delta, 0.05);
    const k = 1 - Math.exp(-dt * reduction);

    if (this.hidden) {
      this.target = 0;
      this.pointerX = 0;
      this.pointerY = 0;
    }

    this.energy += (this.target - this.energy) * k;

    if (this.impulses.length > 0) {
      const now = performance.now();
      let sum = 0;
      for (let i = this.impulses.length - 1; i >= 0; i--) {
        const imp = this.impulses[i];
        const age = (now - imp.born) / 900;
        if (age >= 1) {
          this.impulses.splice(i, 1);
          continue;
        }
        const w = 1 - age;
        sum += imp.strength * w * w;
      }
      const pk = 1 - Math.exp(-dt * 9);
      this.pop += (sum - this.pop) * pk;
      if (this.pop < 0.002) this.pop = 0;
    } else {
      this.pop *= 1 - Math.exp(-dt * 9);
    }

    const p = 1 - Math.exp(-dt * 4);
    this.px += (this.pointerX - this.px) * p;
    this.py += (this.pointerY - this.py) * p;

    return this.energy;
  },

  impulses: [] as Impulse[],
  pointerX: 0,
  pointerY: 0,
};