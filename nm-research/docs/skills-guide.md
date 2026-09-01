# Skills Guide & Enhancement Plan

This document explains how opencode's **skill system** works, how to use each of the
installed skills effectively, and proposes a structured plan for enhancing the NM
Research site with them.

## How the skill system works

Skills are packaged instructions + resources that opencode injects on demand. They
live in `.opencode/skills/<skill-name>/SKILL.md` plus any companion scripts, templates,
and reference files.

- Discovery requires a **`name:`** field in the SKILL.md frontmatter (some third-party
  packs ship `title:` only and must be patched).
- Skills are **loaded on demand** via the `skill` tool — they are not always active. The
  assistant activates one (or a small set) when a task matches its description.
- Skills are only visible **after opencode is restarted**. Newly installed skills in
  `.opencode/skills/` do not surface until the next launch.
- `.opencode/**` is excluded from ESLint (third-party tooling, not project source).
- Skills can reference local scripts (e.g. `ui-ux-pro-max/scripts/search.py`). Python
  3.12+ is available if scripts are needed.

### Activation rule of thumb

Activate the **minimum viable set**. Prefer:

| Situation | Activate |
|-----------|----------|
| Visual identity / full UI system | `ui-ux-pro-max`, `design`, `design-system`, `brand` |
| A single page or component layout | `frontend-design`, `responsive-design`, `ui-styling` |
| Any motion work | the matching `framer-motion-*` skill |
| Copy / metadata / ranking | `seo-copywriting` |
| A presentation | `slides`, `banner-design` |
| Automated tests | `playwright-e2e`, `jest-strategies` |

---

## Skill inventory

### Design & UI system

| Skill | What it does | Use when |
|-------|--------------|----------|
| `ui-ux-pro-max` | Flagship AI/UI design intelligence for web, mobile, desktop — design, review, fix interfaces. CLI: `npx ui-ux-pro-max-cli init \| update`. | Any interface design, review, or fix decision. The default starting point. |
| `design` | Brand identity, design tokens, UI styling, logo generation (55 styles), corporate identity program (50 deliverables + CIP mockups), HTML presentations. | Creating/reworking identity, logos, or full CIP deliverables. |
| `design-system` | Token architecture (primitive → semantic → component), CSS variables, spacing/typography scales, component specs, slide generation. | Building or extending the design-token layer and component specifications. |
| `brand` | Voice, visual identity, messaging frameworks, asset management, compliance, style guides. | Brand voice/messaging, tone-of-voice, marketing assets, style guides. |
| `ui-styling` | Beautiful accessible UIs with shadcn/ui (Radix + Tailwind), utility-first styling, canvas designs. | Styling components, adding accessible primitives, canvas mockups. |
| `frontend-design` | General UI layouts, design systems, responsive interfaces with modern frontend tools. | Broad layout/component design work. |
| `responsive-design` | Mobile-first fluid grids, container queries, breakpoint strategies, touch + performance-aware patterns. | Auditing/adjusting responsiveness at every breakpoint. |
| `banner-design` | Banners for social, ads, heroes, creative assets, print — multiple art directions with AI visuals. | Hero, ad, or promotional banner assets. |

### Motion

| Skill | What it does | Use when |
|-------|--------------|----------|
| `framer-motion-core` | Core API — `motion` components, `useMotionValue`, `useSpring`, `useTransform`. | Any React animation task. Foundation skill. |
| `framer-motion-react` | React integration — `AnimatePresence`, `useAnimation`, layout animations. | Enter/exit transitions and React orchestration. |
| `framer-motion-variants` | Variants, state machines, stagger, repeat, sequencing. | Orchestrated/staged reveals, staggered lists. |
| `framer-motion-scroll` | `useScroll`, `useTransform`, scroll-triggered + parallax. | Scroll progress, parallax, story-scroll patterns. |
| `framer-motion-layout` | Shared layout transitions, `layoutId`, exit animations. | Shared-element transitions, modals, accordions. |
| `framer-motion-gestures` | Drag, pan, tap, hover, focus, touch gestures. | Interactive/draggable elements. |

### Copy & content

| Skill | What it does | Use when |
|-------|--------------|----------|
| `seo-copywriting` | Keyword research, search-intent matching, content structure, internal linking, E-E-A-T signals. | Page copy, metadata/titles/descriptions, ranking content. |

### Testing

| Skill | What it does | Use when |
|-------|--------------|----------|
| `playwright-e2e` | End-to-end tests: interactions, visual regression, cross-browser. | Browser-level tests of routes, forms, modals. |
| `jest-strategies` | Jest mocking, snapshots, parameterized cases, organization. | Unit/component tests of data and UI logic. |

### Presentations & assets

| Skill | What it does | Use when |
|-------|--------------|----------|
| `slides` | Strategic HTML presentations with Chart.js, tokens, responsive layouts. | Building a slide deck as an HTML deliverable. |
| `banner-design` | (see design table above) | Banner/hero assets. |

---

## How to get the most out of a skill

1. **Activate explicitly** — mention the skill by name (e.g. "use `design-system`")
   or let the task description trigger it. Restart opencode first if it's new.
2. **Give the skill its needed context** — the design/UX skills read poorly from a
   vacuum. Paste the current tokens (`src/app/globals.css`), component file, or a link
   to the target page.
3. **Read before you overwrite** — skills sometimes suggest full reworks. In this
   repo, preserve `src/data/*` as the single source of truth and the institutional
   **navy + gold** identity (see `docs/design-system.md`).
4. **Chain, don't stack** — run `design-system` → `design`/`ui-styling` →
   `responsive-design` sequentially rather than activating all at once; each pass stays
   focused.
5. **Verify output** — every skill's output still has to clear `npm run lint` and
   `npm run build`. Skills author; the human/assistant validates.

---

## NM Research enhancement plan (structured)

A phased plan that applies the skills in dependency order. Each phase leaves the site
green (build + lint pass) before the next begins.

### Phase 0 — Baseline (foundation)
- `design-system` + `brand`: reconcile the current token set in `globals.css` with the
  institutional direction; produce a semantic-token map (primitive → semantic →
  component) and a style-guide entry in `docs/`.
- **Gate:** `npm run build` + `npm run lint` pass; visual QA at 375 / 768 / 1024 / 1440.

### Phase 1 — Responsive & accessibility audit
- `responsive-design` + `ui-styling`: audit all routes for fluid grids, touch targets,
  focus states, container queries. `frontend-design` for any layout reshape.
- **Gate:** Lighthouse a11y + responsiveness pass; keyboard walkthrough.

### Phase 2 — Motion refinement (subtle, institutional)
- `framer-motion-react` + `framer-motion-variants` + `framer-motion-scroll`: refine
  ScrollProgressBar (scroll), section reveals (variants/stagger), and modal/accordion
  enter-exit (react/layout) using spring physics — respecting `prefers-reduced-motion`.
- **Gate:** no new layout shift; reduced-motion still disables all ambient effects.

### Phase 3 — Research section data experience
- `design-system` + `design`: extend the ruled, mono-annotated data presentation of
  `ResearchSection` (subject search + domain filter) into a cohesive data language.
- **Gate:** search/filter live counts stable; single source of truth in `src/data/` kept.

### Phase 4 — Content & SEO
- `seo-copywriting`: draft metadata, headings, and internal links per route; align copy
  with the research audience and search intent.
- **Gate:** per-route title/description set; no duplicated content strings.

### Phase 5 — Testing ✅ completed
- `playwright-e2e`: route smoke tests (all 6 pages 200) + form/modal interactions.
- `jest-strategies`: unit tests for `src/lib/` helpers and `src/data/` formatters.
- **Gate:** CI-style run of both suites green.

> **Implemented (this repo):** `src/**/*.test.ts` via **Vitest** (23 tests across
> `upi`, `web3forms`, `plans`, `domains`, `services`) and `e2e/` via **Playwright**
> (11 tests across smoke/navigation/interactions). Run with `npm test` and
> `npm run test:e2e`.
>
> Note: `jest-strategies` was realised with **Vitest** instead of Jest (native TS/ESM,
> zero Babel config). Phase 6 (review loop) remains open.

### Phase 6 — Review loop
- `ui-ux-pro-max` (review mode): adversarial review of the final result against
  accessibility, consistency, and performance. Feed findings back into Phase 1–3 as
  needed.

---

## Extending / maintaining the skills themselves

- **Updating `ui-ux-pro-max`:** `npx ui-ux-pro-max-cli update` (or `init --ai opencode
  --force` to refresh a fresh install).
- **Adding a new skill:** place a folder in `.opencode/skills/<name>/SKILL.md` with at
  least `name:` + `description:` frontmatter; restart opencode.
- **Patching third-party packs:** some ship `title:` instead of `name:` — add `name:`
  so opencode discovers them (verify with a grep across `SKILL.md`).
- **Version note (Next.js 16):** skills may assume older React/Next conventions. Treat
  skill suggestions as inputs, not ground truth — verify against
  `node_modules/next/dist/docs/` and `AGENTS.md` before writing framework code.

---

## Quick reference

```bash
# Confirm every installed skill has a discoverable name:
for f in .opencode/skills/*/SKILL.md; do grep -qE "^name:" "$f" || echo "missing name: $f"; done

# List installed skills:
ls -1 .opencode/skills/

# Refresh the flagship design skill:
npx ui-ux-pro-max-cli update
```

**Remember:** install → **restart opencode** → activate via the `skill` tool → give it
context → validate against `npm run lint` / `npm run build`.
