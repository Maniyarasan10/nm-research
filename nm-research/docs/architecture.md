# Codebase Architecture

This document describes the structure and role of every significant directory and
file in the `nm-research` project.

## Overview

The project is a **Next.js 16 App Router** application with **TypeScript** and
**Tailwind CSS v4**. All routes are statically prerendered. The site is organised
around a strict separation of **data**, **logic/helpers**, and **presentation
components**, keeping sections reusable across the home page and their dedicated
route pages.

## Directory Map

```
src/
├── app/                     # Routing, layout, metadata, global styles
│   ├── layout.tsx           # Root layout — fonts, Navbar, Footer, LenisProvider
│   ├── globals.css          # Tailwind v4 tokens (@theme) + global styles
│   ├── page.tsx             # Home — assemblies all section components
│   ├── about/page.tsx       # About page
│   ├── services/page.tsx    # Services page
│   ├── research/page.tsx    # Research page
│   ├── membership/page.tsx  # Membership page
│   └── contact/page.tsx     # Contact page
│
├── components/
│   ├── layout/              # Persistent chrome shared across every route
│   │   ├── Navbar.tsx       # Sticky header, mega-dropdowns, mobile menu
│   │   ├── Footer.tsx       # Brand, nav, services, contact columns
│   │   ├── ScrollTop.tsx    # "Back to top" affordance (Lenis aware)
│   │   ├── ScrollProgressBar.tsx  # Fixed top scroll progress indicator
│   │   └── LenisProvider.tsx# Smooth-scroll provider (client)
│   │
│   ├── sections/            # Feature sections (reused at home + route pages)
│   │   ├── Hero.tsx         # Home hero — rotating word, animated atom, particles
│   │   ├── MarqueeRibbon.tsx# Auto-scrolling disciplines ribbon
│   │   ├── About.tsx        # Founder card, values, stats (Counter), CTA
│   │   ├── ServicesSection.tsx
│   │   ├── ResearchSection.tsx  # AI tools grid + domain accordion + modal
│   │   ├── Collaborations.tsx
│   │   ├── Membership.tsx   # Pricing cards → PayModal
│   │   ├── Registration.tsx # Registration / community tabs + Web3Forms
│   │   └── Contact.tsx      # Contact info cards + form
│   │
│   ├── modals/
│   │   └── PayModal.tsx     # UPI payment modal with lazy QR
│   │
│   └── ui/                  # Reusable primitives
│       ├── Reveal.tsx       # Scroll-triggered Framer Motion reveal
│       ├── TextReveal.tsx   # Signature masked typography reveal (reduced-motion safe)
│       ├── Counter.tsx      # Animated number counter
│       ├── Section.tsx      # SectionLabel / SectionTitle / SectionHeading
│       ├── PageHero.tsx     # Inner-page hero banner
│       └── DomainIcon.tsx   # SVG renderer for research domain icons
│
├── data/                    # Single source of truth for content
│   ├── domains.ts           # 11 domains + ~150 subjects (research universe)
│   ├── services.ts          # 6 service definitions
│   └── plans.ts             # 3 membership plans + INR formatter

├── lib/                     # Business helpers (no UI)
│   ├── config.ts            # Site config, Web3Forms key, UPI, nav lists
│   ├── upi.ts               # UPI payment link construction
│   └── web3forms.ts         # Web3Forms submission helper

├── e2e/                     # Playwright E2E specs (smoke, navigation, interactions)
├── vitest.config.ts         # Unit-test config (Vitest)
└── playwright.config.ts     # E2E config (Playwright)
```

## Key Concepts

### 1. App Router pages

Each route is a plain server component that composes section components. The **same
section component** renders on the home page and its dedicated route (e.g.
`ServicesSection` on both `/` and `/services`), controlled with props such as
`showHeading`.

### 2. Single source of truth

Content (domains/subjects, services, plans) lives in `src/data/`. Typed exports are
consumed by both sections and page-level metadata. There are **no duplicated data
structures** — a design goal inherited from the original single-file site that had
three copies of the same content.

### 3. Design tokens (Tailwind v4 `@theme`)

All colors, fonts, and spacing used by components are declared once in
`src/app/globals.css` as CSS variables exposed through `@theme inline`. Components
reference them as utilities such as `bg-navy`, `text-green`, `font-display`,
`font-mono`. See [`design-system.md`](design-system.md).

### 4. Client vs. server boundaries

Components that use hooks or browser APIs are marked `"use client"` (e.g. all
`sections/`, `Navbar`, `LenisProvider`, `Counter`, `Reveal`, `PayModal`). Layout,
page metadata, and pure data modules remain server-side.

### 5. Lenis smooth scrolling

`LenisProvider` (client) wraps the entire app in `ReactLenis` with a `root` instance,
so wheel scrolling is globally smoothed. `globals.css` includes the standard Lenis
helper classes (`.lenis`, `.lenis-smooth`, `.lenis-stopped`) and reduced-motion
support is preserved via the global `@media (prefers-reduced-motion: reduce)` block.

### 6. Lazy UPI modal

`react-qr-code` is loaded dynamically so the ~QR library chunk is only downloaded
when the user opens the payment modal (`src/components/modals/PayModal.tsx`).

### 7. Form handling

Web3Forms is used for all 3 forms. `src/lib/web3forms.ts` wraps the POST request; each
form includes a hidden honeypot field (`hp`) and client-side validation before
submission.

### 8. Testing

Two layers cover the codebase (see `docs/development.md`):

- **Vitest unit tests** (`src/**/*.test.ts`) for the pure logic in `src/lib/` and the
  data integrity of `src/data/`.
- **Playwright E2E tests** (`e2e/`) run against a rendered production server and cover
  all 6 routes plus key interactions.

Both the unit and E2E suites are independent of the Next build (`e2e/`, `vitest.config.ts`
and `playwright.config.ts` are excluded from the app type-check).

### 9. SEO & structured data

The root layout (`src/app/layout.tsx`) injects Schema.org `JSON-LD` for
**Organization**, **WebSite** (with a `SearchAction`) and **FAQPage**, plus
`openGraph`/`twitter` share metadata. The `/research` page reads an optional `?q=`
query parameter (via `useSearchParams` inside a `Suspense` boundary) so deep links
pre-fill the search without de-optimising the static route. See
`docs/enhancements.md` for details.
