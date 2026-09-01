/**
 * In-memory retrieval index over the NM knowledge base.
 *
 * Implements the staged pipeline from docs/enhanceRag.txt:
 *
 *   Stage 1 — Query understanding: normalize → tokenize → detect ALL signals
 *             (greeting/thanks handled in answer.ts; intent + plan here).
 *             Signals never short-circuit retrieval on their own.
 *   Stage 2 — Evidence gathering: THREE separate numbers per document —
 *             `semantic` (cosine), `lexical` (keyword/alias overlap) and
 *             `routed` (the user's own words named a plan/intent). They are
 *             never blended into one number at this stage.
 *   Stage 3 — Trust gate: `trustLevel` decided from the evidence TYPE mix
 *             (verified / routed / matched / fallback), not just magnitude.
 *   Stage 4 — Response composition lives in answer.ts.
 *
 * A blended score is still computed for ORDERING only (and for the calibrated
 * `confidence` magnitude the API reports) — it no longer doubles as the trust
 * label. Everything stays in-process, offline and deterministic.
 */

import { knowledgeDocs, type KnowledgeDoc } from "@/data/knowledge";
import { cosineSimilarity, embed, normalize, prepareQuery } from "./embeddings";
import { normalizeDocText } from "./normalize";
import { stem, tokenize } from "./tokenizer";
import { INTENT_BOOSTS, SCORING } from "./config";

export type TrustLevel = "verified" | "routed" | "matched" | "fallback";

export interface Evidence {
  /** Cosine similarity of the query vs. document vector (0..1). */
  semantic: number;
  /** Keyword/alias overlap as today (capped at maxKeywordScore). */
  lexical: number;
  /** True when the user's own words named the plan/intent explicitly. */
  routed: boolean;
  /** Keyword/alias terms that matched — shown to the user as the "matched" line. */
  matchedKeywords: string[];
}

export interface RetrievalResult {
  doc: KnowledgeDoc;
  /** Blended score kept for ordering only (cosine + keyword + intent routing). */
  score: number;
  /** Calibrated magnitude in [0, 1]; ordering-compatible. */
  confidence: number;
  /** Raw cosine similarity (semantic evidence). */
  cosine: number;
  matchedKeywords: string[];
  /** Stage-2 evidence, kept separate by type. */
  evidence: Evidence;
  /** Stage-3 trust label. */
  trust: TrustLevel;
  /** True when the top two candidates are in a virtual tie (Stage 3). */
  nearTie: boolean;
}

interface IndexedDoc extends KnowledgeDoc {
  embedding: number[];
}

export interface SearchOptions {
  topK?: number;
  /** Minimum score to treat a result as retrievable. */
  minScore?: number;
}

let CACHED_INDEX: IndexedDoc[] | null = null;
let CACHED_IDF: Record<string, number> | null = null;

function docText(doc: KnowledgeDoc): string {
  return `${doc.title} ${doc.content} ${doc.keywords.join(" ")} ${(doc.aliases ?? []).join(" ")}`;
}

/** IDF-like down-weighting for common terms, computed once across the corpus. */
function getIDF(): Record<string, number> {
  if (CACHED_IDF) return CACHED_IDF;
  const df = new Map<string, number>();
  for (const d of knowledgeDocs) {
    const seen = new Set(tokenize(normalizeDocText(docText(d))));
    for (const t of seen) df.set(t, (df.get(t) ?? 0) + 1);
  }
  const idf: Record<string, number> = {};
  const n = knowledgeDocs.length;
  for (const [t, d] of df) {
    idf["u:" + t] = Math.log(1 + n / (1 + d));
  }
  CACHED_IDF = idf;
  return idf;
}

function buildIndex(): IndexedDoc[] {
  const idf = getIDF();
  return knowledgeDocs.map((doc) => ({
    ...doc,
    embedding: normalize(embed(normalizeDocText(docText(doc)), idf)),
  }));
}

export function getIndex(): IndexedDoc[] {
  if (!CACHED_INDEX) CACHED_INDEX = buildIndex();
  return CACHED_INDEX;
}

/** Force-refresh (mainly for tests). */
export function resetIndex() {
  CACHED_INDEX = null;
  CACHED_IDF = null;
}

/** Near-tie detector — exported pure so it gets its own unit test (Principle 5). */
export function isNearTie(
  results: Pick<RetrievalResult, "doc" | "score" | "confidence" | "trust">[],
  margin: number = SCORING.nearTieMargin,
): boolean {
  if (results.length < 2) return false;
  const [a, b] = results;
  if (a.doc.id === b.doc.id) return false;
  if (a.trust === "fallback" || b.trust === "fallback") return false;
  if (b.confidence < SCORING.nearTieRunnerUpFloor) return false;
  return Math.abs(a.score - b.score) <= margin;
}

export function retrieve(
  query: string,
  options: SearchOptions = {},
): RetrievalResult[] {
  const q = prepareQuery(query);
  if (!q) return [];
  const { topK = 4, minScore = 0 } = options;

  const index = getIndex();
  const qVec = normalize(embed(q, getIDF()));
  const qTerms = new Set(tokenize(q));
  const intent = classifyIntent(q, qTerms);

  const scored: RetrievalResult[] = index.map((doc) => {
    const semantic = cosineSimilarity(qVec, doc.embedding);
    const matched: string[] = [];
    const lexical = scoreKeywords(doc, q, qTerms, matched);
    const adj = intentAdjustment(doc.id, intent, q);
    const routed = isRouted(doc.id, intent);

    // Stage 2 keeps the evidence separate...
    const evidence: Evidence = { semantic, lexical, routed, matchedKeywords: matched };

    // ...and the saved score is ordering + calibration only.
    const score = semantic * SCORING.blend.semantic + lexical * SCORING.blend.lexical + adj;

    return {
      doc,
      score,
      confidence: calibrate(score),
      cosine: semantic,
      matchedKeywords: matched,
      evidence,
      trust: trustOf(evidence),
      nearTie: false,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, topK + 1).filter((r) => r.score >= minScore);
  const nearTie = isNearTie(top);
  return top.slice(0, topK).map((r) =>
    r.doc.id === (top[0] as RetrievalResult).doc.id ? { ...r, nearTie } : r,
  );
}

/**
 * Sigmoid-shaped calibration so confidence stays in [0, 1] with clean separation.
 * This is the magnitude; the trust LABEL comes from `trustOf`.
 */
function calibrate(raw: number): number {
  const x = Math.tanh((raw - SCORING.calibrate.center) / SCORING.calibrate.spread);
  return Math.min(1, Math.max(0, 0.5 + 0.5 * x));
}

/**
 * Stage 3 trust gate — evidence TYPE mix decides the label (Principle 2).
 *    verified: grounded — a verbatim keyword match AND semantic support.
 *    routed:   user named it explicitly, even when support is thin (B2 fix).
 *    matched:  exactly one evidence type (semantic-only or lexical-only).
 *    fallback: nothing clears a floor.
 */
function trustOf(e: Evidence): TrustLevel {
  if (
    e.semantic > SCORING.floors.semantic &&
    e.matchedKeywords.length > 0
  ) {
    return "verified";
  }
  if (e.routed) return "routed";
  if (e.semantic > SCORING.floors.semantic || e.lexical > SCORING.floors.lexical) {
    return "matched";
  }
  return "fallback";
}

type IntentKey =
  | "phd"
  | "publish"
  | "write"
  | "consult"
  | "analytical"
  | "conference"
  | "person"
  | "location"
  | "contact"
  | "whatsapp"
  | "register"
  | "aiTools"
  | "duration"
  | "book"
  | "handoff";

interface Intent {
  scores: Record<IntentKey, number>;
  plan: string | null;
}

function has(q: string, qTerms: Set<string>, term: string): boolean {
  return q.includes(term) || qTerms.has(term) || qTerms.has(stem(term));
}

function intents(
  q: string,
  qTerms: Set<string>,
): Record<IntentKey, number> {
  const score = (terms: [string, number][]): number =>
    terms.reduce((total, [term, w]) => (has(q, qTerms, term) ? total + w : total), 0);

  const scores: Record<IntentKey, number> = {
    phd: score([
      ["phd", 3], ["doctorate", 3], ["thesis", 3], ["dissertation", 3],
      ["defence", 2], ["research scholar", 3], ["doctoral", 2],
      ["literature review", 1],
    ]),
    publish: score([
      ["publish", 3], ["publication", 3], ["publishing", 3], ["journal", 2],
      ["impact factor", 2], ["accept", 1], ["scopus", 1],
    ]),
    write: score([
      ["writing", 3], ["write", 2], ["manuscript", 3], ["paper", 1.5],
      ["plagiarism", 2], ["review article", 2], ["edit", 2], ["editing", 2],
    ]),
    consult: score([
      ["consult", 3], ["consulting", 3], ["guidance", 2], ["mentor", 2],
      ["mentoring", 2], ["advisor", 2], ["topic selection", 2], ["work plan", 2],
    ]),
    analytical: score([
      ["analytical", 3], ["characterization", 3], ["xrd", 3], ["sem", 3],
      ["tem", 3], ["ftir", 3], ["bet", 3], ["eis", 3], ["xps", 3],
      ["testing", 2], ["data analysis", 2], ["uv", 1],
    ]),
    conference: score([
      ["conference", 3], ["conferences", 3], ["workshop", 3], ["webinar", 3],
      ["paper presentation", 2], ["networking", 2], ["event", 1], ["attend", 1],
      ["speak", 1],
    ]),
    person: score([
      ["founder", 3], ["ceo", 3], ["runs", 3], ["who is", 2], ["director", 2],
      ["owner", 2], ["behind", 2], ["leader", 1],
    ]),
    location: score([
      ["location", 3], ["located", 3], ["countries", 2], ["offices", 2],
      ["global presence", 2], ["operate", 1], ["where", 1], ["india", 1],
    ]),
    contact: score([
      ["contact", 3], ["email", 3], ["phone", 3], ["telephone", 3],
      ["call", 2], ["reach", 2], ["get in touch", 2], ["talk to", 2],
      ["message", 1], ["help", 1], ["support", 1],
    ]),
    whatsapp: score([["whatsapp", 3], ["group", 1]]),
    register: score([
      ["register", 3], ["registration", 3], ["sign up", 2], ["enroll", 2],
      ["enrol", 2], ["join community", 2],
    ]),
    aiTools: hasAiTools(q, qTerms) ? 3 : 0,
    duration: score([
      ["how long", 3], ["duration", 3], ["valid", 2], ["validity", 2],
      ["renew", 2], ["renewal", 2], ["expire", 2], ["expiry", 2], ["annual", 2],
      ["yearly", 2], ["per year", 2], ["year", 1],
    ]),
    book: score([
      ["book", 3], ["book publication", 3], ["monograph", 3], ["textbook", 2],
      ["publish a book", 3], ["chapter", 1], ["author", 1],
    ]),
    handoff: score([
      ["human", 3], ["real person", 3], ["talk to a person", 3],
      ["someone", 2], ["somebody", 2], ["agent", 3], ["operator", 3],
      ["customer care", 3], ["support team", 2], ["real human", 3],
    ]),
  };

  return scores;
}

function classifyIntent(q: string, qTerms: Set<string>): Intent {
  return { scores: intents(q, qTerms), plan: detectPlan(q) };
}

/** Intent signal summary used by the session layer ("is this question empty?"). */
export function detectSignals(query: string): { fired: IntentKey[]; plan: string | null } {
  const q = prepareQuery(query);
  const qTerms = new Set(tokenize(q));
  const intent = classifyIntent(q, qTerms);
  return {
    fired: (Object.keys(intent.scores) as IntentKey[]).filter((k) => intent.scores[k] > 0),
    plan: intent.plan,
  };
}

/** AI-tool detection must avoid matching bare "ai" inside words like "email". */
function hasAiTools(q: string, qTerms: Set<string>): boolean {
  if (/\bai\b/i.test(q + " ")) return true;
  if (q.includes("topic") && q.includes("generator")) return true;
  return (
    q.includes("summarizer") ||
    q.includes("citation generator") ||
    q.includes("research chatbot") ||
    q.includes("ai tool") ||
    qTerms.has("summariz")
  );
}

/**
 * Plan detection is comparison-aware: a "compare the plans" question routes to
 * the comparison document, while naming one plan (or a distinguishing benefit
 * like "2 publications") routes to that plan's dedicated document.
 */
function detectPlan(q: string): string | null {
  const lower = q.toLowerCase();

  if (/(compare|comparison|difference|differ|versus|\bvs\b|between|choose|decide|which (membership|plan))/.test(lower)) {
    if (lower.includes("2 publication") || lower.includes("two publication")) return "membership-prime";
    if (lower.includes("dedicated mentor") || lower.includes("mentor")) return "membership-prime";
    return "membership-comparison";
  }

  const community = lower.includes("community");
  const platinum = lower.includes("platinum");
  const prime = lower.includes("prime");
  const mentions = [community, platinum, prime].filter(Boolean).length;

  if (mentions === 1) {
    if (community) return "membership-community";
    if (platinum) return "membership-platinum";
    if (prime) return "membership-prime";
  }
  if (mentions > 1) return "membership-comparison";
  return null;
}

/**
 * Stage-2 `routed` evidence. True only when the user's own words name the
 * target explicitly — a stated plan (or a distinguishing plan benefit) or a
 * strong intent term (>= explicitIntentScore), not an inferred boost.
 * An explicit name counts as named support even when lexical overlap is thin,
 * which is exactly what keeps the plan gate from reading as "verified" (B2).
 */
const EXPLICIT_INTENT_DOC: Partial<Record<IntentKey, string>> = {
  phd: "service-phd",
  publish: "service-publication",
  write: "service-writing",
  consult: "service-consulting",
  analytical: "service-analytical",
  conference: "service-conferences",
  whatsapp: "community-whatsapp",
  register: "registration",
  aiTools: "ai-tools",
  book: "service-book-publication",
  location: "global-presence",
  contact: "contact-details",
  handoff: "quick-support",
};

function isRouted(docId: string, intent: Intent): boolean {
  if (intent.plan) {
    return docId === intent.plan || docId === "membership-comparison";
  }
  for (const [key, target] of Object.entries(EXPLICIT_INTENT_DOC)) {
    if (docId === target && intent.scores[key as IntentKey] >= SCORING.explicitIntentScore) {
      return true;
    }
  }
  return false;
}

const MEMBERSHIP_CUE = /(membership|member|plan|included|benefit|how many|i get|all members)/;

/** Document-aware boosts from the detected intent (Stage 2 routing evidence). */
function intentAdjustment(docId: string, intent: Intent, q: string): number {
  const s = intent.scores;
  const flag = (k: IntentKey) => s[k] > 0;
  let adj = 0;

  // A specific plan is named (or compared). Plan routing wins decisively: the
  // matched plan doc is boosted and competing service intents lose their
  // service boosts so "which plan has 2 publications" lands on Prime, not the
  // generic publication service.
  if (intent.plan) {
    if (docId === intent.plan) return INTENT_BOOSTS.plan.own;
    if (docId === "membership-overview") return INTENT_BOOSTS.plan.overview;
    if (docId.startsWith("membership-") || docId === "conference-participation") {
      return INTENT_BOOSTS.plan.membershipSibling;
    }
    return INTENT_BOOSTS.plan.nonMembership;
  }

  // --- Service intents (only when no plan is named) ---
  if (flag("phd") && docId === "service-phd") adj += INTENT_BOOSTS.phd;
  if (flag("publish") && docId === "service-publication") adj += INTENT_BOOSTS.publish.own;
  if (flag("publish") && docId === "service-writing") adj += INTENT_BOOSTS.publish.writing;
  if (flag("write") && !flag("publish") && docId === "service-writing") adj += INTENT_BOOSTS.write;
  if (flag("consult") && docId === "service-consulting") adj += INTENT_BOOSTS.consult;
  if (flag("analytical") && docId === "service-analytical") adj += INTENT_BOOSTS.analytical;

  // Conference routing distinguishes between "is there a conference service?"
  // and "can I present/attend?" so the two near-duplicate docs don't fight.
  if (flag("conference")) {
    const participate = /(present|speak|attend|participate|joining|taking part|going to)/.test(q);
    const organise = /(organi[sz]e|organi[sz]ing|hold|conduct|service|offer)/.test(q);
    if (docId === "service-conferences") {
      adj += organise && !participate ? INTENT_BOOSTS.conference.organise : INTENT_BOOSTS.conference.base;
    }
    if (docId === "conferences") {
      adj += participate && !organise ? INTENT_BOOSTS.conference.participate : INTENT_BOOSTS.conference.base;
    }
  }

  // Book-intent routing: "book publication" is its own service, not generic publication.
  if (flag("book")) {
    if (docId === "service-book-publication") adj += INTENT_BOOSTS.book.own;
    if (docId === "service-publication") adj += INTENT_BOOSTS.book.publication;
  }
  // Proposal/synopsis questions route to that sub-service unless PhD is explicit.
  if ((q.includes("synopsis") || q.includes("proposal")) && !flag("phd")) {
    if (docId === "service-research-proposal") adj += INTENT_BOOSTS.synopsis.own;
    if (docId === "service-phd") adj += INTENT_BOOSTS.synopsis.phdDemote;
  }
  // "How many subjects / what areas" -> the research domains index, not the search FAQ.
  if (/(subjects|subject areas|fields|domains|areas)/.test(q) && docId === "research-domains") {
    adj += INTENT_BOOSTS.domains;
  }
  // Duration facts about membership belong to the duration doc, overpowering the overview.
  if (flag("duration") && MEMBERSHIP_CUE.test(q)) {
    if (docId === "membership-duration") adj += INTENT_BOOSTS.duration.own;
    if (docId === "membership-overview") adj += INTENT_BOOSTS.duration.overview;
  }
  // "How many conferences / included in membership?" -> per-plan conference benefits.
  if (flag("conference") && MEMBERSHIP_CUE.test(q) && docId === "conference-participation") {
    adj += INTENT_BOOSTS.conferenceMembership;
  }
  // A leadership/person cue should surface the founder doc, not the org overview.
  if (flag("person")) {
    if (docId === "founder") adj += INTENT_BOOSTS.person.founder;
    if (docId === "about-org") adj += INTENT_BOOSTS.person.aboutOrg;
  }
  if (flag("whatsapp") && docId === "community-whatsapp") adj += INTENT_BOOSTS.whatsapp;
  if (flag("register") && docId === "registration") adj += INTENT_BOOSTS.register;
  if (flag("aiTools") && docId === "ai-tools") adj += INTENT_BOOSTS.aiTools;

  // Dead-intent consumption (Step 3): previously-computed intents now drive a
  // target. Gated so weak "help"/"where" mention (score 1) can't hijack the
  // human-support or location docs.
  if (s.location >= 2 && docId === "global-presence") adj += INTENT_BOOSTS.location;
  if (s.contact >= 2 && docId === "contact-details") adj += INTENT_BOOSTS.contact;
  if (s.handoff >= 2 && docId === "quick-support") adj += INTENT_BOOSTS.handoff;

  // Generic help/contact docs should not outrank a concrete service intent.
  const concreteService =
    flag("phd") || flag("publish") || flag("consult") || flag("analytical") ||
    flag("conference") || flag("write");
  if (concreteService && (docId === "quick-support" || docId === "contact-details")) {
    adj += INTENT_BOOSTS.concreteDemote;
  }

  // Explicitly publish-weighted intents lean further toward the publication doc.
  if (s.publish > 0 && s.write > 0 && s.publish >= s.write && docId === "service-publication") {
    adj += INTENT_BOOSTS.publish.publishOverWrite;
  }

  return adj;
}

/**
 * Lexical evidence: a keyword/alias that appears verbatim in the normalized
 * query scores highest; partial token overlap contributes proportionally.
 * Capped at maxKeywordScore (kept as before — only its destination changed).
 */
function scoreKeywords(
  doc: KnowledgeDoc,
  q: string,
  qTerms: Set<string>,
  matched: string[],
): number {
  const terms = [...doc.keywords, ...(doc.aliases ?? [])];
  let score = 0;
  for (const kw of terms) {
    const kwNorm = kw.toLowerCase().replace(/(\d),(\d)/g, "$1$2").replace(/[^a-z0-9\s]+/g, " ").trim();
    if (kwNorm.length > 0 && q.includes(kwNorm)) {
      score += 2;
      matched.push(kw);
      continue;
    }
    const kwTokens = tokenize(kwNorm);
    const overlap = kwTokens.filter((t) => qTerms.has(t));
    if (overlap.length > 0) score += overlap.length / Math.max(kwTokens.length, 1);
  }
  return Math.min(score, SCORING.maxKeywordScore);
}