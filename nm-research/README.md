# NM Research — Website

Multi-page website for **NM Group of Industries and Research Foundation**, a globally
recognised research ecosystem empowering the next generation of scientists through
research services, publication support, PhD assistance, and global conferences.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Framer
Motion**, **Lenis**, and **lucide-react**. Optimisations with **next/image**,
`next/font` (self-hosted), and route-level code splitting.

## ✨ Highlights

- **6 static, server-rendered pages** — `/`, `/about`, `/services`, `/research`,
  `/membership`, `/contact`
- **Design system** — hybrid **navy + green** identity (see `docs/design-system.md`)
- **Smooth scrolling** with Lenis (respects `prefers-reduced-motion`)
- **Animation** with Framer Motion (scroll reveals, counters, rotating hero word,
  animated atom graphic, accordions, modals)
- **Lazy-loaded UPI payment modal** (`react-qr-code` via `next/dynamic`)
- **3 Web3Forms-backed forms** (registration, community, contact) with honeypot
  spam protection
- **Self-hosted fonts** (Inter, Space Grotesk, JetBrains Mono) — no render-blocking
  external font requests
- **~700 KB of base64 images** replaced by optimised files (single 24 KB WebP logo)
- **Testing** — Vitest unit tests for `src/lib`/`src/data` + Playwright E2E smoke tests for all 6 routes
- **Accessible forms** — real `aria-label`s, `aria-required`, tab semantics and visible `focus-visible` rings
- **SEO** — Schema.org JSON-LD (Organization, WebSite, FAQ) + social-share image metadata
- **Deep-linkable research search** — `/research?q=<subject>` pre-fills the filter (route stays static)

> See [`docs/enhancements.md`](docs/enhancements.md) for the full "premium pass" log:
> the broken research-PDF fix, a11y labels, reveal-motion improvement, section
> rhythm, structured data, and build-hygiene fixes.

## 🧰 Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first config via `@theme`) |
| Animation | Framer Motion (`framer-motion` 13) |
| Smooth scroll | Lenis |
| Icons | lucide-react + inline SVGs for brand icons |
| QR codes | react-qr-code (lazy-loaded) |
| Fonts | next/font/google (self-hosted) |
| Unit tests | Vitest |
| E2E tests | Playwright |

## 🚀 Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest unit tests (once) |
| `npm run test:watch` | Run Vitest unit tests (watch mode) |
| `npm run test:e2e` | Run Playwright E2E tests (auto-starts production server) |

> **E2E prerequisite:** `npm run test:e2e` starts a production server on port 3100,
> so run `npm run build` first (or once after code changes). Install the Chromium
> browser once with `npx playwright install chromium`.

### Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
nm-research/
├── src/
│   ├── app/                 # Routes (App Router) + global layout/styles
│   │   ├── layout.tsx       # Root layout: fonts, Navbar, Footer, Lenis
│   │   ├── page.tsx         # Home
│   │   ├── about/           # About page
│   │   ├── services/        # Services page
│   │   ├── research/        # Research page
│   │   ├── membership/      # Membership page
│   │   ├── contact/         # Contact page
│   │   └── globals.css      # Design tokens + global styles (Tailwind v4)
│   ├── components/
│   │   ├── layout/          # Navbar, Footer, ScrollTop, LenisProvider
│   │   ├── sections/        # Hero, About, Services, Research, Membership, ...
│   │   ├── modals/          # PayModal (UPI QR)
│   │   └── ui/              # Reveal, Counter, Section, PageHero, DomainIcon
│   ├── data/                # domains, services, plans (single source of truth)
│   └── lib/                 # config, upi, web3forms helpers
├── e2e/                     # Playwright E2E specs (smoke, navigation, interactions)
├── vitest.config.ts         # Unit-test config (Vitest)
├── playwright.config.ts     # E2E config (Playwright)
├── public/
│   ├── images/              # Optimised logo + UPI app logos
│   └── favicons/            # Extracted favicon set
└── docs/                    # Architecture, design system, development docs
```

See [`docs/architecture.md`](docs/architecture.md), [`docs/development.md`](docs/development.md),
and [`docs/enhancements.md`](docs/enhancements.md) for the full codebase, process, and
premium-improvement reference.

## 🎨 Design System

The site follows a **hybrid navy + green** direction chosen for a scientific/research
brand. The full token reference, typography pairing, and rationale are documented in
[`docs/design-system.md`](docs/design-system.md).

## 🔑 Environment / Config Notes

Forms are delivered through **Web3Forms**; keys and the UPI payee are centralised in
`src/lib/config.ts`. WhatsApp community link is also configured there.

> ⚠️ Do not commit real access keys to public repositories.

## 📄 License

© NM Group of Industries and Research Foundation. All rights reserved.
