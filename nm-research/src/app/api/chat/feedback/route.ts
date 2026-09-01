/**
 * Feedback sink for chat answers.
 *
 * In-memory ring buffer (max 500 entries) for the app lifetime, drained via
 * `GET /api/chat/feedback?drain=1`. Step 8 of enhanceRag.txt: when the
 * `FEEDBACK_FILE` env var is set, every entry is ALSO appended as one NDJSON
 * line to that file, so feedback survives restarts for offline audit. The file
 * write is best-effort — analytics must never block a thumbs-up.
 *
 * Positive/negative thumbs are stored along with non-PII context (and the
 * trust level) so signal quality can be audited offline.
 */

import { appendFileSync } from "node:fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface FeedbackEntry {
  requestId: string;
  sessionId: string;
  message: string;
  answer: string;
  docId: string | null;
  confidence: number | null;
  trustLevel: string | null;
  helpful: boolean;
  ts: number;
}

const CAP = 500;
const buffer: FeedbackEntry[] = [];

export async function POST(request: Request) {
  let body: {
    requestId?: unknown;
    sessionId?: unknown;
    message?: unknown;
    answer?: unknown;
    docId?: unknown;
    confidence?: unknown;
    trustLevel?: unknown;
    helpful?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const { requestId, sessionId, message, answer, docId, confidence, trustLevel, helpful } = body;

  if (typeof helpful !== "boolean") {
    return Response.json(
      { error: "A boolean 'helpful' is required." },
      { status: 400 },
    );
  }

  const entry: FeedbackEntry = {
    requestId: typeof requestId === "string" ? requestId.slice(0, 64) : "",
    sessionId: typeof sessionId === "string" ? sessionId.slice(0, 128) : "",
    message: typeof message === "string" ? message.slice(0, 500) : "",
    answer: typeof answer === "string" ? answer.slice(0, 2000) : "",
    docId: typeof docId === "string" ? docId : null,
    confidence: typeof confidence === "number" && Number.isFinite(confidence) ? confidence : null,
    trustLevel: typeof trustLevel === "string" ? trustLevel.slice(0, 16) : null,
    helpful,
    ts: Date.now(),
  };

  if (buffer.length >= CAP) buffer.shift();
  buffer.push(entry);

  // Step 8: durable, best-effort NDJSON append when a file sink is configured.
  const sink = process.env.FEEDBACK_FILE;
  if (sink) {
    try {
      appendFileSync(sink, JSON.stringify(entry) + "\n", "utf8");
    } catch {
      // Analytics must never break the conversation or the thumbs flow.
    }
  }

  return Response.json({ ok: true });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const drain = url.searchParams.get("drain") === "1";
  const batch = drain ? buffer.splice(0, buffer.length) : [...buffer];
  return Response.json({ entries: batch, count: batch.length });
}