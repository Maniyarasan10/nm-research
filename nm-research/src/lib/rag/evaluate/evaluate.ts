/**
 * Curated retrieval evaluation set for the NM assistant.
 *
 * One assertion-backed quality gate (quality.test.ts) and this measurable,
 * report-producing harness (npm run eval). Each case lists the acceptable
 * top documents — typically a single exact answer, sometimes an ordered pair
 * for comparison prose.
 */

import type { RetrievalResult } from "../index";
import { retrieve } from "../index";

export interface EvalCase {
  q: string;
  hits: string[];
}

export const EVAL_CASES: EvalCase[] = [
  // Company / identity
  { q: "what services do you offer", hits: ["services-overview"] },
  { q: "what is nm research", hits: ["about-org"] },
  { q: "who is the founder", hits: ["founder"] },
  { q: "what are your values", hits: ["mission-values"] },
  { q: "which countries do you operate in", hits: ["global-presence"] },

  // Membership ladder
  { q: "how much is the community plan", hits: ["membership-community"] },
  { q: "how much is platinum membership", hits: ["membership-platinum"] },
  { q: "tell me about the prime plan", hits: ["membership-prime"] },
  { q: "what is the price of all plans", hits: ["membership-overview"] },
  { q: "which plan includes 2 publications", hits: ["membership-prime"] },
  { q: "how do the membership plans compare", hits: ["membership-comparison"] },
  { q: "which membership plan should i choose", hits: ["membership-comparison"] },
  { q: "how long does membership last", hits: ["membership-duration"] },
  { q: "are conferences included in membership", hits: ["conference-participation"] },

  // Payment
  { q: "how do i pay for membership", hits: ["membership-payment"] },
  { q: "how does payment work", hits: ["membership-payment"] },
  { q: "how do i confirm my payment", hits: ["membership-payment"] },

  // Research domains & analytics
  { q: "how many subjects do you cover", hits: ["research-domains"] },
  { q: "what research areas do you cover", hits: ["research-domains"] },
  { q: "how do i find a research subject", hits: ["research-search"] },

  // Publishing ladder
  { q: "research paper writing help", hits: ["service-writing"] },
  { q: "i want to write a paper", hits: ["service-writing"] },
  { q: "publish my completed paper", hits: ["service-publication"] },
  { q: "what journals do you publish in", hits: ["service-publication"] },
  { q: "do you support book publication", hits: ["service-book-publication"] },
  { q: "help me prepare a synopsis", hits: ["service-research-proposal"] },
  { q: "what is a topic generator", hits: ["ai-tools"] },

  // Conferences vs conference organisation
  { q: "do you organize conferences", hits: ["service-conferences"] },
  { q: "can i present at a conference", hits: ["conferences"] },
  { q: "are conferences included in membership", hits: ["conference-participation"] },

  // Services
  { q: "do you do analytical testing xrd sem", hits: ["service-analytical"] },
  { q: "research consulting and guidance", hits: ["service-consulting"] },
  { q: "can you help me with phd", hits: ["service-phd"] },

  // Contact & join
  { q: "how can i reach you", hits: ["contact-details"] },
  { q: "how do i join the whatsapp group", hits: ["community-whatsapp"] },
  { q: "register as a researcher", hits: ["registration"] },
  { q: "i need urgent help", hits: ["quick-support"] },

  // Typos (should be recovered by normalization)
  { q: "phd assistence", hits: ["service-phd"] },
  { q: "platinum plan coast", hits: ["membership-platinum"] },
  { q: "how do i jouin the whatsapp group", hits: ["community-whatsapp"] },
  { q: "help me publish in scoopus", hits: ["service-publication"] },
  { q: "where are you locatd", hits: ["global-presence"] },

  // Restructure goldens (enhanceRag.txt)
  { q: "hi what services do you offer", hits: ["services-overview"] },
  { q: "thanks how much is platinum", hits: ["membership-platinum"] },
  { q: "i want to talk to a real person", hits: ["quick-support"] },
  { q: "talk to a human", hits: ["quick-support"] },
  { q: "what is your email", hits: ["contact-details"] },
  { q: "where are you located", hits: ["global-presence"] },
  { q: "how can i contact you for help with phd", hits: ["service-phd"] },
];

export function evaluate(cases: EvalCase[]): EvalReport {
  const rows = cases.map((c) => {
    const results: RetrievalResult[] = retrieve(c.q, { topK: 5 });
    const top = results.map((r) => r.doc.id);

    const best = c.hits
      .map((h) => top.indexOf(h))
      .filter((p) => p >= 0)
      .sort((a, b) => a - b)[0];

    return {
      q: c.q,
      expected: c.hits,
      top,
      hitAt1: best === 0,
      rank: best === undefined ? -1 : best + 1,
      reciprocal: best === undefined ? 0 : 1 / (best + 1),
    };
  });

  const total = rows.length;
  const hitAt1 = rows.filter((r) => r.hitAt1).length;
  const hitAt3 = rows.filter((r) => r.rank > 0 && r.rank <= 3).length;
  const mrr = rows.reduce((acc, r) => acc + r.reciprocal, 0) / total;

  return {
    total,
    hitAt1,
    hitAt3,
    mrr,
    hitAt1Rate: hitAt1 / total,
    hitAt3Rate: hitAt3 / total,
    rows,
  };
}

export interface EvalReport {
  total: number;
  hitAt1: number;
  hitAt3: number;
  mrr: number;
  hitAt1Rate: number;
  hitAt3Rate: number;
  rows: {
    q: string;
    expected: string[];
    top: string[];
    hitAt1: boolean;
    rank: number;
    reciprocal: number;
  }[];
}