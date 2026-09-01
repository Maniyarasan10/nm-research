---
name: responsive-design
title: "Responsive Design"
catalogNumber: "No. 148"
tagline: "One codebase, every screen"
description: "Build mobile-first responsive layouts — fluid grids, container queries, breakpoint strategies, touch interactions, and performance-aware responsive patterns."
category: design
version: "1.0.0"
license: "MIT"
triggers:
  - "making a website responsive"
  - "mobile-first design"
  - "container queries vs media queries"
  - "responsive typography"
  - "touch-friendly interface"
downloadFile: "responsive-design.zip"
contents:
  - "SKILL.md"
  - "references/breakpoint-strategies.md"
---

Mobile-first isn't a buzzword — it's a constraint that forces clarity.
If your layout works on a 320px screen, it works everywhere. The
reverse is rarely true.

## Fluid grids with CSS Grid

```css
/* Intrinsic layout — no breakpoint math needed */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
  gap: 1.5rem;
}

/* Sidebar layout that collapses gracefully */
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .layout {
    grid-template-columns: 250px 1fr;
  }
}

@media (min-width: 1024px) {
  .layout {
    grid-template-columns: 300px 1fr;
  }
}
```

## Container queries (modern approach)

```css
/* Parent container */
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* Responsive to container, not viewport */
@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}

@container card (min-width: 700px) {
  .card {
    grid-template-columns: 300px 1fr;
  }
}
```

## Fluid typography

```css
/* Clamp between min and max — no breakpoint jumps */
h1 {
  font-size: clamp(1.75rem, 4vw + 1rem, 3.5rem);
  line-height: 1.2;
}

body {
  font-size: clamp(0.875rem, 1vw + 0.5rem, 1rem);
  line-height: 1.6;
}

/* Use calc() for spacing that scales with viewport */
.section {
  padding-block: clamp(2rem, 5vw, 6rem);
  padding-inline: clamp(1rem, 3vw, 4rem);
}
```

## Breakpoint strategy

```typescript
// Use a mobile-first breakpoint system
const breakpoints = {
  sm: '640px',   // Large phones
  md: '768px',   // Tablets
  lg: '1024px',  // Small laptops
  xl: '1280px',  // Desktops
  '2xl': '1536px', // Large screens
} as const;

// Avoid fixed breakpoints when possible — use fluid ranges
// Bad: padding: 16px on mobile, 32px on desktop
// Good: padding: clamp(1rem, 3vw, 2rem)
```

## Touch targets

```css
/* Minimum 44x44px touch target (WCAG 2.5.5) */
.button, .link, [role="button"] {
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem 1rem;
}

/* On touch devices, increase hit area */
@media (pointer: coarse) {
  .nav-link {
    padding: 1rem;
    margin: -0.5rem;
  }
}
```

## Responsive images

```html
<!-- artDirection: different crops for different sizes -->
<picture>
  <source media="(min-width: 1024px)" srcset="hero-wide.jpg" />
  <source media="(min-width: 640px)" srcset="hero-medium.jpg" />
  <img src="hero-narrow.jpg" alt="Description" loading="lazy" />
</picture>

<!-- srcset: same crop, different resolutions -->
<img
  src="image-800.jpg"
  srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(min-width: 768px) 50vw, 100vw"
  alt="Description"
  loading="lazy"
/>
```

## Testing checklist

1. Chrome DevTools device toolbar (320px to 2560px)
2. Real devices: iPhone SE, iPhone 14, iPad, Android phone
3. Touch vs pointer: `@media (pointer: coarse)` vs `fine`
4. Orientation: landscape mode on phones
5. Text: 200% zoom, check for overflow and truncation
6. Network: test on slow 3G (Chrome DevTools throttling)

## Anti-patterns

- Don't use `display: none` to hide content — restructure layout
- Don't rely on `position: fixed` on mobile — it's unreliable
- Don't use `px` for font sizes — use `rem` or `clamp()`
- Don't ignore landscape mode on phones
- Don't hide the keyboard on iOS by preventing scroll
