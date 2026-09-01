import { retrieve } from "@/lib/rag/index";
import { buildAnswer, CONFIDENT_SCORE, type ChatAnswer } from "@/lib/rag/answer";
import { resolveQuery, commitTurn } from "@/lib/rag/session";
import { groundedGenerate } from "@/lib/rag/generate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatRequestBody {
  message?: unknown;
  sessionId?: unknown;
}

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return Response.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const { message, sessionId: sessionIdIn } = body;

  if (typeof message !== "string" || message.trim().length === 0) {
    return Response.json(
      { error: "A non-empty 'message' is required." },
      { status: 400 },
    );
  }

  if (message.trim().length > 500) {
    return Response.json(
      { error: "Message is too long (max 500 characters)." },
      { status: 400 },
    );
  }

  const requestId = crypto.randomUUID();
  const sessionId =
    typeof sessionIdIn === "string" && sessionIdIn.length > 0 && sessionIdIn.length <= 128
      ? sessionIdIn
      : crypto.randomUUID();

  const startedAt = performance.now();

  try {
    const { query, usedContext } = resolveQuery(sessionId, message);
    const results = retrieve(query, { topK: 4 });

    const grounded = await groundedGenerate(query, results);
    let answer: ChatAnswer = buildAnswer(message, results);
    if (answer.answer && grounded) {
      answer = { ...answer, text: grounded, suggestions: [] };
    }

    const latencyMs = Math.round(performance.now() - startedAt);
    const top = results.find((r) => r.confidence >= CONFIDENT_SCORE) ?? null;

    const topRecord = top
      ? { doc: { id: top.doc.id, title: top.doc.title, keywords: top.doc.keywords } }
      : null;
    const { turns, reset } = commitTurn(sessionId, answer.answer ? topRecord : null);

    return Response.json({
      ...answer,
      requestId,
      sessionId,
      latencyMs,
      confidence: top?.confidence ?? null,
      trustLevel: answer.trustLevel ?? null,
      nearTie: answer.nearTie ?? false,
      matched: answer.matched ?? null,
      docId: top?.doc.id ?? null,
      turns,
      reset,
      usedContext,
    });
  } catch (err) {
    console.error("Chat retrieval failed:", err);
    return Response.json(
      { error: "Something went wrong while answering. Please try again." },
      { status: 500 },
    );
  }
}