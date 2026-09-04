import { domains } from "@/data/site";

export type ExpertiseLevel = "undergrad" | "postgrad" | "phd" | "postdoc";

export interface TopicInput {
  domainId?: string;
  focus?: string;
  level: ExpertiseLevel;
}

export interface GeneratedTopic {
  title: string;
  angle: string;
  why: string;
}

/**
 * Deterministic, offline research-topic generator.
 *
 * Combines a domain's real subjects with research genres, methodologies and
 * contexts to synthesise plausible, well-formed topic titles — plus a short
 * rationale for each. Fully testable (no RNG, no network).
 */

type Seed = ReadonlyArray<string>;

const LEVEL_PROFILE: Record<ExpertiseLevel, { label: string }> = {
  undergrad: { label: "Undergraduate" },
  postgrad: { label: "Postgraduate" },
  phd: { label: "PhD" },
  postdoc: { label: "Postdoctoral" },
};

const GENRES: Record<ExpertiseLevel, Seed> = {
  undergrad: [
    "A critical review of recent advances in {SUB}",
    "A comparative study of {SUB} approaches in {ZONE}",
    "Emerging trends in {SUB}: a scoping review",
  ],
  postgrad: [
    "Investigating the role of {SUB} in addressing {ZONE}",
    "An experimental study on {SUB} for {ZONE}",
    "Modelling {SUB}: methods, challenges and opportunities",
  ],
  phd: [
    "A novel framework for {SUB} applied to {ZONE}",
    "Mechanistic insights into {SUB} for {ZONE}",
    "Advancing {SUB} through data-driven and reproducible methods",
  ],
  postdoc: [
    "Toward a unified theory of {SUB} across {ZONE}",
    "Next-generation {SUB}: integrating multi-scale and real-world validation",
    "Transdisciplinary frontiers in {SUB} and {ZONE}",
  ],
};

const METHODS: Seed = [
  "machine-learning-assisted",
  "computational",
  "experimental",
  "mixed-method",
  "meta-analytic",
  "longitudinal",
];

const CONTEXTS: Seed = [
  "sustainable development",
  "real-world impact",
  "public health outcomes",
  "climate resilience",
  "industry adoption",
  "digital transformation",
  "regional application",
  "open-science workflows",
];

function pickIndex(seed: Seed, salt: number, roll: number): number {
  return (salt * 31 + roll) % seed.length;
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function generateTopics(input: TopicInput, count = 4): GeneratedTopic[] {
  const domain = domains.find((d) => d.id === input.domainId) ?? domains[0];
  if (!domain) return [];

  // A deterministic base intended to vary the result set per request.
  const base = input.focus ? input.focus.length * 7 + 1 : 0;

  const genres = GENRES[input.level] ?? GENRES.phd;
  const subjects = domain.subjects;

  const n = Math.max(0, Math.min(count, 6));

  const topics: GeneratedTopic[] = [];
  for (let i = 0; i < n; i++) {
    const subj = subjects[pickIndex(subjects, base + 1, i)];
    const genre = genres[pickIndex(genres, base + 2, i)];
    const context = CONTEXTS[pickIndex(CONTEXTS, base + 3, i)];
    const method = METHODS[pickIndex(METHODS, base + 4, i)];

    const focusTitle = input.focus
      ? `${domain.shortTitle} and ${input.focus.trim()}`
      : domain.shortTitle;
    const focusLower = input.focus ? input.focus.trim().toLowerCase() : context;

    const title = genre
      .replace(/\{SUB\}/g, subj)
      .replace(/\{ZONE\}/g, focusLower);
    const angle =
      input.level === "phd" || input.level === "postdoc"
        ? `${method} design · original contribution`
        : `${method} perspective · feasible scope`;

    topics.push({
      title: titleCase(title),
      angle,
      why: `A focused topic within ${focusTitle}, sized for ${LEVEL_PROFILE[
        input.level
      ].label.toLowerCase()} scope and aligned with ${subj} in ${domain.title}.`,
    });
  }

  return topics;
}