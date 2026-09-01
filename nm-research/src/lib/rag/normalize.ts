/**
 * Query normalisation pipeline for the NM RAG index.
 *
 * Turns messy, real-world user input into a canonical form before it reaches
 * the embedding + keyword matchers:
 *   1. Unicode NFC + lowercase, common abbreviations collapsed ("Ph.D." -> "phd"),
 *      digit-thousand commas merged ("2,999" -> "2999"), punctuation/hyphens into
 *      single spaces.
 *   2. Bounded typo correction ("assistence" -> "assistance", "coast" -> "cost")
 *      against the corpus vocabulary using edit-distance-1, requiring a unique
 *      candidate so we never rewrite an ambiguous token.
 *
 * Deterministic and dependency-free; fully unit-testable.
 */

import { knowledgeDocs } from "@/data/knowledge";

export function normalizeChars(text: string): string {
  return text
    .normalize("NFC")
    .toLowerCase()
    .replace(/\bph\s*\.\s*d\s*\.?\b/gi, "phd")
    .replace(/\u00b7/g, " ")
    .replace(/&/g, " and ")
    .replace(/[\u201c\u201d\u2018\u2019`]/g, "'")
    .replace(/[\u2012\u2013\u2014\u2015]/g, "-")
    .replace(/(\d),(\d)/g, "$1$2")
    .replace(/[\\/[\]{}(),:;]/g, " ")
    .replace(/[.\u2026!?~*^%$#@+=<>|_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normalised text for corpus-side features (docs + keywords + aliases). */
export function normalizeDocText(text: string): string {
  return normalizeChars(text);
}

/** Edit distance capped at 1: returns 1 for neighbors, 2 otherwise. */
export function editDistance01(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 1) return 2;
  if (a === b) return 0;

  const n = b.length;
  let prev: number[] = [];
  for (let j = 0; j <= n; j++) prev.push(j);

  for (let i = 1; i <= a.length; i++) {
    const cur: number[] = [i];
    let rowMin = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      cur.push(v);
      if (v < rowMin) rowMin = v;
    }
    prev = cur;
    if (rowMin > 1) return 2;
  }
  return prev[n];
}

function rawTokens(text: string): string[] {
  return normalizeChars(text)
    .split(/\s+/)
    .filter((t) => t.length >= 4 && /^[a-z0-9]+$/.test(t) && !/^\d+$/.test(t));
}

const IS_NUMERIC = /^\d+$/;

/** Corpus vocabulary bucketed by length for fast distance-1 lookup. */
let CACHED_VOCAB: Map<number, string[]> | null = null;

function buildVocab(): Map<number, string[]> {
  const byLen = new Map<number, string[]>();
  for (const doc of knowledgeDocs) {
    const text = `${doc.title} ${doc.content} ${doc.keywords.join(" ")} ${(doc.aliases ?? []).join(" ")}`;
    const words = new Set(rawTokens(text));
    for (const w of words) {
      const list = byLen.get(w.length) ?? [];
      list.push(w);
      byLen.set(w.length, list);
    }
  }
  return byLen;
}

function vocab(): Map<number, string[]> {
  if (!CACHED_VOCAB) CACHED_VOCAB = buildVocab();
  return CACHED_VOCAB;
}

/** Reset the vocab cache (mainly for tests). */
export function resetNormCache() {
  CACHED_VOCAB = null;
}

/**
 * Rewrite a token to its unique distance-1 corpus neighbour when there is one.
 * Returns null when the token is already known or the match is ambiguous.
 */
export function closestCorpusTerm(token: string): string | null {
  const byLen = vocab();
  let best: string | null = null;
  for (const len of [token.length - 1, token.length, token.length + 1]) {
    const candidates = byLen.get(len);
    if (!candidates) continue;
    for (const cand of candidates) {
      if (editDistance01(token, cand) === 1) {
        if (best && best !== cand) return null;
        best = cand;
      }
    }
  }
  return best;
}

/** Apply bounded typo correction to a normalised query string. */
export function fixTypos(q: string): string {
  return q
    .split(/\s+/)
    .map((t) => {
      if (t.length < 4 || t.length > 14 || IS_NUMERIC.test(t)) return t;
      if (vocab().get(t.length)?.includes(t)) return t;
      const fix = closestCorpusTerm(t);
      return fix ?? t;
    })
    .join(" ");
}

/** Full query pipeline: char normalisation then typo correction. */
export function normalizeQuery(text: string): string {
  return fixTypos(normalizeChars(text));
}