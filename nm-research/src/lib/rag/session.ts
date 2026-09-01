/**
 * Short-TTL in-memory conversation memory for the NM assistant.
 *
 * Keeps the last confidently-answered document per session so follow-up
 * pronouns ("how much is it?", "what about it?") resolve against the active
 * topic instead of a generic fallback. Sessions expire after 30 minutes and
 * auto-reset after a bounded number of turns — no persistence, no accounts.
 */

import { prepareQuery } from "./embeddings";
import { detectSignals } from "./index";
import { tokenize } from "./tokenizer";

interface SessionState {
  lastDocId: string | null;
  lastHeadline: string | null;
  turns: number;
  createdAt: number;
}

const TTL_MS = 30 * 60 * 1000;
export const MAX_TURNS = 12;

const store = new Map<string, SessionState>();

export interface ResolvedQuery {
  /** The effective query after optional context injection. */
  query: string;
  /** True when the previous topic was woven into the query. */
  usedContext: boolean;
}

export interface CommitResult {
  turns: number;
  reset: boolean;
}

function get(id: string): SessionState {
  let s = store.get(id);
  if (!s) {
    s = { lastDocId: null, lastHeadline: null, turns: 0, createdAt: Date.now() };
    store.set(id, s);
  }
  return s;
}

function sweep(now: number) {
  for (const [id, s] of store) {
    if (now - s.createdAt > TTL_MS) store.delete(id);
  }
}

/** Clear all session memory (mainly for tests). */
export function resetSessions() {
  store.clear();
}

/** Drop a single session (UI "New conversation"). */
export function resetSession(id: string) {
  store.delete(id);
}

/**
 * Resolve the effective query for this turn. If the user's question carries
 * no intent of its own and a topic is active (network of confidence hits),
 * the previous topic headline is prepended so retrieval has something to aim at.
 */
export function resolveQuery(sessionId: string, rawQuery: string): ResolvedQuery {
  const q = prepareQuery(rawQuery);
  if (!q) return { query: q, usedContext: false };

  const s = get(sessionId);
  const { fired, plan } = detectSignals(rawQuery);

  const informative =
    fired.length > 0 || plan !== null || tokenize(q).length > 2;

  if (!informative && s.lastDocId && s.lastHeadline) {
    return { query: `${s.lastHeadline} ${q}`.trim(), usedContext: true };
  }

  return { query: q, usedContext: false };
}

/**
 * Commit a turn. When a confident answer was produced, the topic is remembered
 * for the next question. Bounded turn counts cause an automatic reset with the
 * `reset` flag surfaced to the UI ("start a new conversation").
 */
export function commitTurn(
  sessionId: string,
  top: { doc: { id: string; title: string; keywords: string[] } } | null,
): CommitResult {
  const now = Date.now();
  sweep(now);
  const s = get(sessionId);
  s.turns += 1;

  if (top) {
    s.lastDocId = top.doc.id;
    s.lastHeadline = top.doc.keywords[0] ?? top.doc.title;
  }

  if (s.turns >= MAX_TURNS) {
    resetSession(sessionId);
    return { turns: s.turns, reset: true };
  }
  return { turns: s.turns, reset: false };
}