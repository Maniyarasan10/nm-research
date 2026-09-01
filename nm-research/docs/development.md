# Development Guide

This document covers the working process, conventions, quality gates, and how to
contribute to `nm-research`.

## Getting started

```bash
npm install          # install dependencies
npm run dev          # start dev server at http://localhost:3000
npm run build        # type-check + production build
npm run start        # serve the production build
npm run lint         # run ESLint
npm test             # run Vitest unit tests
npm run test:e2e     # run Playwright E2E tests
```

> **Note — Next.js 16:** This version has breaking changes vs. older Next.js. Refer
> to the generated docs under `node_modules/next/dist/docs/` (a marker is maintained
> in `AGENTS.md`). Check for deprecation notices before changing framework APIs.

## Workflow

1. **Understand scope** — read the relevant data module(s) and section component(s)
   before editing. Data lives in `src/data/`, logic in `src/lib/`, UI in
   `src/components/`.
2. **Edit in small, reviewable changes** — most work touches a single section
   component or token.
3. **Verify** — run `npm run lint` and `npm run build` before finishing.
4. **Unit tests** — extend `src/**/*.test.ts` alongside `src/lib/` or `src/data/`
   changes and run `npm test`.
5. **E2E tests** — extend specs in `e2e/` for route/form/modal behaviour and run
   `npm run test:e2e` (run `npm run build` first).
6. **Visual QA** — run `npm run dev` and confirm animations, the payment modal, and
   forms behave at `375 / 768 / 1024 / 1440` widths.

## Conventions

### Code style

- **No comments** unless the reasoning is non-obvious (project rule).
- Prefer existing utilities and design tokens over hard-coded hex/rgb values. If you
  need a new color, add it to `@theme` in `globals.css` first.
- Use `"use client"` only in components that need hooks/browser APIs.

### Data

- All display content comes from `src/data/*` — do not duplicate strings across
  components. `domains.ts`, `services.ts`, and `plans.ts` are the only content
  sources.
- Configuration (contact, Web3Forms key, UPI, WhatsApp, nav lists) is centralised in
  `src/lib/config.ts`.

### Testing

- **Unit tests** (`vitest`): live next to the code as `*.test.ts` in `src/lib/` and
  `src/data/`. They cover pure helpers (UPI URI, Web3Forms submission) and data
  integrity (unique slugs, plan/domain invariants). Run with `npm test`.
- **E2E tests** (`playwright`): live in `e2e/` and run against a production server on
  port 3100. Cover route smoke (all 6 pages 200), navigation, and key interactions
  (payment modal, research filters, contact form). Run `npm run build` once, then
  `npm run test:e2e`.
- `e2e/`, `vitest.config.ts` and `playwright.config.ts` are excluded from the Next.js
  app type-check (`tsconfig.json`) so they never break `npm run build`.

### Accessibility & responsiveness

- Provide visible focus states, `aria-expanded` on toggles, and unique `aria-label`s.
- Respect `prefers-reduced-motion` (already global in `globals.css`; `Reveal` and
  `Counter` opt out automatically).
- Keep text reflowing without clipping at narrow widths and browser zoom.

### Lint / type / build gates

- `npm run lint` must pass with **zero errors**.
- `npm run build` must complete for **all routes** with no type errors.
- `npm test` and `npm run test:e2e` must pass after relevant changes.
- ESLint ignores the installed AI skill tooling in `.opencode/**` (third-party, not
  project source).

## Common tasks

### Add a research domain / subject

1. Edit `src/data/domains.ts` (`id`, `title`, `icon`, `accent`, `subjects[]`).
2. The accordion, subject modal, and `/research` metadata update automatically.

### Add / change a service

Edit `src/data/services.ts`. The Services section and `/services` page stay in sync.

### Adjust the design system

Edit the `@theme` block in `src/app/globals.css` and/or the fonts in
`src/app/layout.tsx`. See [`design-system.md`](design-system.md).

## Deployment

The app is fully static for its 6 routes and can be deployed to any Next.js host
(Vercel, Node server, or a container). Ensure the `metadataBase` URL in
`src/app/layout.tsx` is set to the production origin.

## Notes on secrets

Web3Forms and UPI identifiers are referenced from `src/lib/config.ts`. Treat the
access key as a secret — do not commit real credentials to public repositories.

## AI tooling

The repo contains an installed copy of the **UI UX Pro Max** skill under
`.opencode/skills/ui-ux-pro-max` (plus brand/design companion skills). It is used at
design/authoring time and is excluded from linting. Regenerate/update it with:

```bash
npx ui-ux-pro-max-cli update
```
