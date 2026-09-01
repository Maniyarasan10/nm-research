/**
 * Optional grounded LLM answer generation.
 *
 * Disabled by default (deterministic templates win). When enabled via
 * `LLM_API_URL` + `NEXT_PUBLIC_USE_LLM=true`, it sends ONLY the retrieved
 * chunks plus a strict citation instruction to a compatible endpoint and
 * returns its text. Every error path returns null, so the caller always
 * falls back to the deterministic answer. Source citations are never LLM
 * authored — they come from retrieval and are attached by the caller.
 */

import type { RetrievalResult } from "./index";

const MAX_CHARS = 2000;

export async function groundedGenerate(
  query: string,
  results: RetrievalResult[],
): Promise<string | null> {
  const endpoint = process.env.LLM_API_URL;
  if (process.env.NEXT_PUBLIC_USE_LLM !== "true" || !endpoint) return null;

  const chunks = results
    .slice(0, 4)
    .map((r, i) => `[${i + 1}] ${r.doc.title}\n${r.doc.content}`)
    .join("\n\n");

  if (chunks.length > MAX_CHARS) {
    console.warn("[rag] grounded-generate skipped: context exceeds budget");
    return null;
  }

  const prompt = [
    "You are the NM Research assistant. Answer using ONLY the knowledge chunks below.",
    "If the knowledge needed is not in the chunks, reply exactly: \"I don't have that information in our knowledge base.\"",
    "Cite chunks inline like [1] and keep the answer concise. Do not invent facts.",
    "",
    "Knowledge chunks:",
    chunks,
    "",
    `Question: ${query}`,
  ].join("\n");

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.warn(`[rag] grounded-generate failed with ${res.status}`);
      return null;
    }
    const data: unknown = await res.json();
    const text = extractText(data);
    return text && text.length > 0 ? text : null;
  } catch (err) {
    console.warn("[rag] grounded-generate error:", err);
    return null;
  }
}

function extractText(data: unknown): string | null {
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    for (const key of ["text", "answer", "output", "message"]) {
      const v = d[key];
      if (typeof v === "string") return v;
      if (v && typeof v === "object") {
        const inner = v as Record<string, unknown>;
        if (typeof inner.content === "string") return inner.content;
      }
    }
  }
  return null;
}