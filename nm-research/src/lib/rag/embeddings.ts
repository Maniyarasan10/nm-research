/**
 * Deterministic offline embeddings + cosine similarity.
 *
 * Builds a fixed-dimension vector from the tokenized text using a hashed
 * feature bag (unigrams + char n-grams + bigrams) with sign-sensitive
 * terms, then measures relevance via cosine similarity. This reproduces
 * "embeddings + cosine" retrieval semantics with zero dependencies and no
 * external model — fully deterministic and unit-testable.
 */

import { normalizeQuery } from "./normalize";
import { stem, tokenize } from "./tokenizer";

export const EMBEDDING_DIM = 256;

export interface Weights {
  [feature: string]: number;
}

/** Distance-perturbing multiplier so ordering stays stable but distinct queries differ. */
function featurize(text: string, weights: Weights, weight: number): Weights {
  const tokens = tokenize(text);
  const seen = new Set<string>();

  for (const tok of tokens) {
    const ngrams = charNgrams(tok, 3);
    for (const ng of ngrams) {
      const key = "c:" + ng;
      add(weights, key, weight);
      seen.add(key);
    }
    const unigram = "u:" + tok;
    add(weights, unigram, weight * 1.5);
    seen.add(unigram);
  }

  // Word bigrams capture short phrase intent ("phd assistance").
  for (let i = 0; i < tokens.length - 1; i++) {
    const key = "b:" + tokens[i] + " " + tokens[i + 1];
    add(weights, key, weight * 1.2);
    seen.add(key);
  }

  return weights;
}

function add(weights: Weights, key: string, amount: number) {
  weights[key] = (weights[key] ?? 0) + amount;
}

function charNgrams(word: string, size: number): string[] {
  if (word.length <= size) return [`^${word}$`];
  const out: string[] = [];
  for (let i = 0; i <= word.length - size; i++) {
    out.push(word.slice(i, i + size));
  }
  return out;
}

/**
 * Produce the embedding vector for `text`, optionally weighted by an
 * IDF map (down-weighting common tokens for better discrimination).
 */
export function embed(
  text: string,
  idf: Record<string, number> = {},
): number[] {
  const weights: Weights = {};
  featurize(text, weights, 1);

  const vec = new Array(EMBEDDING_DIM).fill(0);
  for (const [feature, w] of Object.entries(weights)) {
    const score = idf[feature] !== undefined ? w * idf[feature] : w;
    const hash = hashString(feature);
    const idx = hash % EMBEDDING_DIM;
    vec[idx] += (hash % 2 === 0 ? 1 : -1) * score;
  }
  return vec;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function normalize(v: number[]): number[] {
  let norm = 0;
  for (const x of v) norm += x * x;
  norm = Math.sqrt(norm);
  if (norm === 0) return v;
  return v.map((x) => x / norm);
}

/** Small stable string hash (FNV-1a). */
export function hashString(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Normalise a free-text query before embedding: characters first, then bounded
 * typo correction against the corpus vocabulary (keeps keyword intent).
 */
export function prepareQuery(text: string): string {
  return normalizeQuery(text);
}

export { stem };
