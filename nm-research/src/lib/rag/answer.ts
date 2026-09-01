/**
 * Rules-based answer assembly for the NM chatbot (Stage 4 of enhanceRag.txt).
 *
 *   Step 1 (B1 fix) — greetings/thanks are SIGNALS, not exclusive gates. A
 *     "hi what services do you offer?" composes the ack AND answers the real
 *     remainder; only a pure social turn returns with `answer: false`.
 *   Principle 4 — the trust label comes from Stage 3 (evidence TYPE), not the
 *     calibrated magnitude; the API/UI surfaces it so users and metrics treat
 *     "routed" results differently from grounded "verified" ones.
 *   Principle 5 — near-tie disambiguation asks the user to pick, instead of
 *     silently committing to a coin-flip top result.
 *   Principle 6 — every non-fallback answer exposes the matched terms.
 *
 * No LLM is required for the standard path; `groundedGenerate` may still
 * rephrase the top document on top of this structure.
 */

import { detectSignals, type RetrievalResult, type TrustLevel } from "./index";
import { SCORING } from "./config";
import { tokenize } from "./tokenizer";

/** Confidence floor for treating a result as answerable (re-exported for
    the route + UI; value locked by the confidence suite in quality.test.ts). */
export const CONFIDENT_SCORE = SCORING.confidentScore;

export interface Citation {
  title: string;
  source: string;
  linkLabel: string;
}

export interface ChatAnswer {
  text: string;
  citations: Citation[];
  related: {
    title: string;
    source: string;
    linkLabel: string;
  }[];
  suggestions: string[];
  /**
   * False only for pure social turn-arounds (greetings/thanks) and fallbacks.
   * The UI uses it to decide whether to show citations, confidence + feedback.
   */
  answer: boolean;
  /** Stage-3 trust label of the chosen result (Principle 2 / Step 7). */
  trustLevel?: TrustLevel | null;
  /** Near-tie decision was surfaced to the user (Principle 5). */
  nearTie?: boolean;
  /** "Matched: X, Y" terms for the chosen result (Principle 6 / Step 5). */
  matched?: string | null;
}

interface TextExample {
  match: RegExp;
  text: string;
}

const GREETING = "Hi there!";
const THANKS_ACK = "You're welcome!";

const GREETING_EXAMPLE: TextExample = {
  match: /^\s*(hi|hello|hey|good (morning|afternoon|evening)|namaste|yo)\b/i,
  text:
    `${GREETING} I'm the NM Research assistant. I can help with services, membership plans, payment, research domains, publications, conferences and contacting the team. What would you like to know?`,
};

const THANKS_EXAMPLE: TextExample = {
  match: /^\s*(thanks|thank you|thankyou|thx|cheers)\b/i,
  text:
    `${THANKS_ACK} If you need anything else about NM Research — services, membership, publications or research support — just ask.`,
};

/** Skip a leading phatic phrase and return the real remainder, if any. */
function stripPhatic(raw: string): string {
  let rest = raw.trim();
  const greet = GREETING_EXAMPLE.match.exec(rest);
  if (greet) {
    rest = rest.slice(greet[0].length).replace(/^[,\s]+/, "");
  } else {
    const thanks = THANKS_EXAMPLE.match.exec(rest);
    if (thanks) rest = rest.slice(thanks[0].length).replace(/^[,\s]+/, "");
  }
  return rest;
}

/**
 * A remainder is "significant" when it carries a real question after the ack —
 * an explicit question mark, a named plan, or enough tokens with a question cue.
 * "thanks for your help" stays social; "thanks, how much is platinum?" composes.
 */
const QUESTION_CUE =
  /\b(what|which|how|why|who|where|when|can|could|would|will|is|are|do|does|tell me|show me|about)\b/i;
const ACTION_CUE = /\b(help|need|want|publish|register|join|phd|book|contact|pay|buy)\b/i;

function remainderSignificant(remainder: string): boolean {
  if (!remainder || remainder.length < 4) return false;
  if (/\?\s*$/.test(remainder)) return true;
  if (detectSignals(remainder).plan) return true;
  const words = tokenize(remainder).length;
  if (words >= 3 && QUESTION_CUE.test(remainder)) return true;
  // A bare action request ("i need help") has no question word but is clearly
  // a question; a "for your help" closer (thanks-signoff) is excluded instead.
  if (ACTION_CUE.test(remainder) && !/^for\b/i.test(remainder)) return true;
  return false;
}

/**
 * Step 1: analyse the raw query once and decide whether it is pure social
 *     (greeting XOR thanks with nothing else), or carries a question after it.
 */
function analyzeSignals(raw: string): {
  greeting: boolean;
  thanks: boolean;
  ack: string;
  compose: boolean;
} {
  const trimmed = raw.trim();
  const greeting = GREETING_EXAMPLE.match.test(trimmed);
  const thanks = THANKS_EXAMPLE.match.test(trimmed);
  const remainder = stripPhatic(trimmed);
  // Pure "thanks" also matches THANKS? No — separate tests; both can't fire.
  const compose = (greeting || thanks) && remainderSignificant(remainder);
  const ack = greeting ? GREETING : THANKS_ACK;
  return { greeting, thanks, ack, compose };
}

export function buildAnswer(
  rawQuery: string,
  results: RetrievalResult[],
): ChatAnswer {
  const { compose, ack, greeting } = analyzeSignals(rawQuery);

  if (!compose && (greeting || rawQuery.trim().match(THANKS_EXAMPLE.match))) {
    // Pure social turn-around — ack only, no retrieval claims.
    const social = greeting ? GREETING_EXAMPLE : THANKS_EXAMPLE;
    return {
      text: social.text,
      citations:
        greeting
          ? [
              { title: "All Services", source: "/services", linkLabel: "Browse services" },
              { title: "Membership Plans", source: "/membership", linkLabel: "View membership" },
              { title: "Research Index", source: "/research", linkLabel: "Search research" },
            ]
          : [],
      related: [],
      suggestions: greeting
        ? ["What services do you offer?", "How much is Platinum membership?", "How do I publish a paper?"]
        : ["Tell me about membership", "What PhD help is available?"],
      answer: false,
      trustLevel: null,
      nearTie: false,
      matched: null,
    };
  }

  const top = results[0];
  const confident = !!top && top.trust !== "fallback" && top.confidence >= CONFIDENT_SCORE;

  if (!top || !confident) {
    const reason = top
      ? // An explicit missing-evidence note (4.4): the closest hit isn't grounded.
        ` (the closest topic "${top.doc.title}" doesn't well-match your words, so I'd rather not guess)`
      : "";
    return {
      text:
        "I couldn't find a confident match for that in the NM Research knowledge base. I can help with our services, membership plans and pricing, research domains and subjects, publications, conferences, and how to contact us — or I can connect you with our team directly." +
        reason,
      citations: [],
      related: [
        { title: "Contact the team", source: "/contact", linkLabel: "Contact us" },
        { title: "Research index", source: "/research", linkLabel: "Browse research" },
        { title: "All services", source: "/services", linkLabel: "See services" },
      ],
      suggestions: [
        "What services do you offer?",
        "How much is membership?",
        "How do I pay?",
        "How can I contact you?",
      ],
      answer: false,
      trustLevel: top?.trust ?? null,
      nearTie: false,
      matched: top?.matchedKeywords.join(", ") || null,
    };
  }

  const citation: Citation = {
    title: top.doc.title,
    source: top.doc.source,
    linkLabel: top.doc.linkLabel,
  };

  const related = results.slice(1, 4).map((r) => ({
    title: r.doc.title,
    source: r.doc.source,
    linkLabel: r.doc.linkLabel,
  }));

  const suggestions = buildSuggestions(top.doc.category);

  // Assemble the body: near-tie prompt (Principle 5) + doc content + a short
  // matched-terms line for the weaker trust levels (Principle 6).
  const second = results[1];
  const nearTieBody =
    top.nearTie && second
      ? `Could you clarify — do you mean "${second.doc.title}" or "${top.doc.title}"? Here's what I found for ${top.doc.title}:\n\n`
      : "";
  const matchedTerms = top.matchedKeywords.join(", ") || top.doc.title;
  const trustLine =
    top.trust === "verified"
      ? ""
      : `\n\nMatched via ${top.trust === "routed" ? "your naming of" : "terms like"}: ${matchedTerms}.`;

  const body = `${nearTieBody}${top.doc.content}${trustLine}`;
  const text = compose ? `${ack} ${body}` : body;

  return {
    text,
    citations: [citation],
    related,
    suggestions,
    answer: true,
    trustLevel: top.trust,
    nearTie: top.nearTie,
    matched: matchedTerms,
  };
}

function buildSuggestions(category?: string): string[] {
  switch (category) {
    case "Membership":
      return ["How do I pay?", "What's included in Platinum?", "Tell me about the Prime plan"];
    case "Services":
      return ["How much is it?", "Can I get PhD help?", "How do I publish?"];
    case "Research":
      return ["What domains do you cover?", "Find a subject", "How do conferences work?"];
    case "About":
      return ["Who is the founder?", "Where do you operate?", "What are your values?"];
    case "Contact":
      return ["How do I register?", "Join WhatsApp", "Phone and email"];
    default:
      return ["What services do you offer?", "How much is membership?", "How can I contact you?"];
  }
}