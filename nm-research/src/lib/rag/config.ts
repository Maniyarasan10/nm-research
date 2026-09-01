/**
 * Centralised scoring configuration for the NM RAG pipeline.
 *
 * Every hand-tuned number in the retrieval pipeline lives here, named and
 * documented, each with a pointer to the test that locks its current value
 * (Step 6 of docs/enhanceRag.txt). Change a constant → the referenced test is
 * the contract you are responsible for.
 */

export const SCORING = {
  /** Blend weights on the evidence components — locked by `retrieve` in
      quality.test.ts (golden routing still pins identical top docs). */
  blend: {
    semantic: 0.6, // cosine similarity
    lexical: 0.4, // keyword/alias overlap
  },

  /** tanh calibration of the blended score into `confidence` 0..1 —
      locked by "confidence calibration" suite in quality.test.ts. */
  calibrate: {
    center: 0.35,
    spread: 0.25,
  },

  /**
   * Trust-ladder floors (Principle 2 — evidence TYPE, not magnitude).
   *  - semantic floor: cosine similarity must clear 0.3 — pure-noise queries
   *    deterministically hover around 0.22 so anything above is real signal
   *    (locked by the trust-ladder tests in quality.test.ts).
   *  - verified additionally requires a VERBATIM keyword/alias match
   *    (`matchedKeywords` non-empty), not just incidental token overlap.
   *    This is the B2 fix: a plan gate like "which plan has 2 publications"
   *    never reads as verified because no keyword matched verbatim.
   *  - matched: semantic-only or lexical-only support.
   */
  floors: {
    semantic: 0.3,
    lexical: 0,
  },

  /**
   * Answer-ability floor on the calibrated confidence. Results below this
   * produce the honest fallback instead of a confident answer.
   * Locked by "scores a confident hit above the fallback threshold" and
   * "leaves gibberish without a confident hit" in quality.test.ts.
   */
  confidentScore: 0.45,

  /** Cap on the keyword/alias overlap contribution. */
  maxKeywordScore: 3,

  /**
   * Near-tie margin on the blended score: when the top two candidates land
   * within this margin (and both are answerable), the composer asks the user
   * to disambiguate instead of silently committing (Principle 5).
   * Locked by the near-tie test in quality.test.ts.
   */
  nearTieMargin: 0.12,

  /**
   * A routed branch additionally requires both candidates to be at least
   * weak-answerable; a runner-up far below confidence is not a "tie".
   */
  nearTieRunnerUpFloor: 0.4,

  /**
   * Intent strength that counts as an EXPLICIT name ("publish", "thesis",
   * "whatsapp", "register" are 3-weight terms). Anything at or above this is
   * treated as the user naming the intent, feeding the `routed` evidence.
   */
  explicitIntentScore: 3,
} as const;

/**
 * Intent-routing boost magnitudes (Stage 2 → routed evidence + score adj).
 * Each entry's inline comment names the golden test that exercises it.
 */
export const INTENT_BOOSTS = {
  /** Plan gate early-return ("which plan includes 2 publications" → Prime;
      quality.test.ts golden). */
  plan: {
    own: 1.5,
    overview: -0.4,
    membershipSibling: 0.1,
    nonMembership: -0.7,
  },
  /** Service intent boosts (service goldens in quality.test.ts). */
  phd: 0.6,
  publish: { own: 0.9, writing: -0.5, publishOverWrite: 0.2 },
  write: 0.3,
  consult: 0.4,
  analytical: 0.5,
  /** Conference participate-vs-organise split (conferences goldens). */
  conference: {
    organise: 0.5,
    participate: 0.5,
    base: 0.2,
  },
  book: { own: 0.9, publication: -0.4 },
  synopsis: { own: 0.9, phdDemote: -0.3 },
  domains: 0.3,
  duration: { own: 0.9, overview: -0.3 },
  conferenceMembership: 0.9,
  person: { founder: 1, aboutOrg: -0.5 },
  whatsapp: 0.4,
  register: 0.4,
  aiTools: 0.5,
  /** Dead-intent consumption (Step 3): location → global-presence,
      contact → contact-details, handoff → quick-support. Locked by their
      golden cases. */
  location: 0.6,
  contact: 0.6,
  handoff: 1,
  /** Generic contact/help docs must not outrank a concrete service intent. */
  concreteDemote: -0.7,
} as const;