---
name: seo-copywriting
title: "SEO Copywriting"
catalogNumber: "No. 149"
tagline: "Content that ranks and converts"
description: "Write SEO-optimized content that ranks on page one — keyword research, search intent matching, content structure, internal linking, and E-E-A-T signals."
category: writing
version: "1.0.0"
license: "MIT"
triggers:
  - "writing SEO content"
  - "keyword research"
  - "optimizing content for search"
  - "improving search rankings"
  - "content structure for SEO"
downloadFile: "seo-copywriting.zip"
contents:
  - "SKILL.md"
  - "references/keyword-research.md"
  - "references/content-templates.md"
---

Google doesn't rank the "best" content — it ranks the content that
best satisfies search intent. Understanding intent is more important
than stuffing keywords.

## Search intent types

| Intent | Query pattern | Content type |
|--------|--------------|--------------|
| Informational | "how to", "what is", "guide" | Blog post, tutorial |
| Navigational | "brand name", "login" | Landing page |
| Commercial | "best", "review", "vs" | Comparison, listicle |
| Transactional | "buy", "price", "discount" | Product page |

## Keyword research framework

```markdown
## Step 1: Seed keywords
- Core topic: "react testing"
- Variants: react test, react unit test, react testing library

## Step 2: Intent mapping
- "how to test react components" → Informational → Tutorial
- "best react testing tools" → Commercial → Comparison
- "react testing library tutorial" → Informational → Step-by-step

## Step 3: Competitor analysis
- Page 1 result for "react testing" → What angle are they missing?
- People Also Ask → What questions aren't answered?

## Step 4: Selection criteria
- Search volume: 100+ monthly (realistic for new sites)
- KD (keyword difficulty): < 30 for quick wins
- Business relevance: Does this lead to our product?
```

## Content structure for ranking

```markdown
# [Primary keyword] — [Compelling hook] (H1, 50-60 chars)

**Meta description**: [150-160 chars with primary keyword, clear value prop]

## Introduction (100-150 words)
- Hook: State the problem or promise
- Credibility: Why this guide is different
- Preview: What they'll learn

## [Secondary keyword section] (H2)
### [Long-tail variation] (H3)
- Use keywords naturally in first 100 words
- Include 2-3 internal links per section
- Add images with descriptive alt text

## [Related topic] (H2)
- Answer People Also Ask questions
- Use structured data (FAQ, HowTo)
- Link to deeper resources

## Conclusion
- Summary of key points
- Clear next step or CTA
```

## On-page SEO checklist

```markdown
## Title tag (50-60 chars)
- Primary keyword near the front
- Compelling enough to click
- Include brand if space allows

## Meta description (150-160 chars)
- Summarize the page value
- Include primary keyword
- Call to action

## Headers (H1-H6)
- One H1 per page with primary keyword
- H2s for main sections (include secondary keywords)
- H3s for subsections (include long-tail variations)

## Content
- Primary keyword in first 100 words
- 1-2% keyword density (natural, not forced)
- Internal links to 3-5 related pages
- External links to 2-3 authoritative sources
- Images with descriptive alt text
- Short paragraphs (2-3 sentences)
```

## E-E-A-T signals

```markdown
## Experience
- Include personal examples and case studies
- Show before/after results
- Reference specific projects or clients

## Expertise
- Link to author bio with credentials
- Cite sources and reference data
- Include technical depth (code, diagrams)

## Authoritativeness
- Build topical authority through content clusters
- Get mentioned or linked from other authoritative sites
- Maintain consistent publishing schedule

## Trustworthiness
- Use HTTPS, show privacy policy
- Include contact information
- Display last updated date
```

## Content clustering

```
Pillar page: "React Testing Guide" (3000+ words)
  ├── Cluster: "Jest vs Vitest" (1500 words)
  ├── Cluster: "React Testing Library Best Practices" (2000 words)
  ├── Cluster: "Mocking API Calls in React" (1500 words)
  ├── Cluster: "E2E Testing with Playwright" (2000 words)
  └── Cluster: "Visual Regression Testing" (1500 words)

Internal linking: Every cluster links to pillar, pillar links to every cluster
```

## Anti-patterns

- Don't keyword stuff — write for humans first, search engines second
- Don't duplicate content — canonicalize or redirect
- Don't ignore search intent — match the content format to what ranks
- Don't skip meta descriptions — auto-generated ones underperform
- Don't neglect internal linking — every page should be reachable in 3 clicks
