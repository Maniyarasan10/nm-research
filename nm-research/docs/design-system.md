# Design System — "Light Editorial Scientific"

The site speaks in warm paper surfaces, crisp hairlines, serif editorial display
type, and data-dense layouts. One restrained accent for action, one for
verified/quantified states. No rainbow tints, no decorative gradients/orbs, no
generic "navy wall". Rules descend from
[`webdesing styleReferrance.txt`](webdesing%20styleReferrance.txt):

- **One layout family** — editorial/lite-broadsheet (kept softly rounded, 8px
  radius — never the zero-radius broadsheet AI-tell).
- **One card style** — Flat Bordered: hairline, near-white, no elevation.
- **One signature effect** — masked typography reveal (`TextReveal`).
- Everything else quiet, including motion (one duration scale + one ease).
- **Accessibility floor** — mobile-responsive, keyboard focus, and
  `prefers-reduced-motion` are never traded away.

## Tokens

Declared once in `src/app/globals.css` as runtime CSS variables in `@theme` (a
single `.dark` override re-themes the whole site):

- **Paper surfaces** — `paper #faf9f6`, `surface #ffffff`, `surface-2 #f4f2ed`,
  `surface-3 #edebe6`.
- **Ink** — `ink #17191d`, `ink-2 #4a4f58`, `ink-3 #8a8f98`.
- **Hairlines** — `rule` / `rule-strong` (structure, not decoration).
- **Brand authority** — `navy #14243d`, `navy-dark #0d1a2e`, `navy-mid #24466b`;
  text accent `brand` (lightens in dark mode to stay readable on cards).
- **Accent** (action, gold) — `accent #a67806`.
- **Verified** (green) — `green #14684a`.
- **Fonts** — Inter (body) / EB Garamond (display) / JetBrains Mono
  (eyebrow/stats), via `next/font`.
- **Motion** — `fast 0.14s`, `base 0.24s`, `slow 0.38s`, ease
  `cubic-bezier(0.22, 1, 0.36, 1)`. Centralised in `src/lib/motion.ts`.

Component classes (`.card`, `.btn`, `.input`, `.tag`, `.eyebrow`, `.display`,
`.sig-rule`, `.emph`, …) read these vars, so dark mode adapts automatically.

## Card system (flat editorial)

- `.card` — hairline, near-white, `1px` faint shadow, 8px radius. Hover **draws a
  2px accent rule across the top edge** (rule-draw) and hardens the border.
- `.card-featured` — gold border tint + a persistent top accent rule.
- `.card-plain` — quiet surface-2 tint for bands.
- Elevation is reserved for **floating layers** only (nav pill, dropdowns, mobile
  menu, modals).

## Signature effect — masked typography

`src/components/ui/TextReveal.tsx` — headlines rise out of a hairline mask on
scroll instead of fading:

- Plain-string children reveal **word by word** (small stagger); rich ReactNode
  headings reveal as one block.
- SSR-safe and fully static for reduced-motion users (content is never masked).

Wired into `Hero` (home h1), `PageHero` (inner-page title) and `SectionHeading`
(every `SectionTitle`), so the effect surfaces on every page/section with no
per-section opt-in. `SectionHeading` now orchestrates: eyebrow – headline – body.

## Interaction language

- `.link-grow` — underline-grow hover/focus on text links (footer columns,
  inline links).
- `.btn` — 1px lift on hover.
- Rule-draw cards, masked headlines, underline-grow links — one coherent
  "drawn lines" vocabulary.

## Surface & furniture

- `.film-grain` — a static full-page noise texture at ~4% multiply so the flat
  paper does not read as "too clean" (fixed, `pointer-events: none`, inert).
- `PageHero` — masked title + a publication "dateline" row under the banner
  (label · founded · ref code) in tracked mono.
- Reading progress handled by `ScrollProgressBar` (top hairline, hidden under
  reduced motion).

## Legacy tokens

`primary/secondary/text/border-soft/gold/…` aliases remain in `@theme` for
existing utilities and legacy classes; new work should use the canonical tokens.