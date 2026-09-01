import { describe, expect, it, beforeEach } from "vitest";
import { retrieve, getIndex, resetIndex, isNearTie } from "./index";
import { buildAnswer, type ChatAnswer } from "./answer";
import { knowledgeDocs, type KnowledgeDoc } from "@/data/knowledge";

/**
 * Retrieval quality regression suite.
 *
 * Every query here encodes a real, natural user question. Keeping these green
 * guarantees the assistant keeps answering well as the knowledge base or the
 * retrieval engine evolve.
 */

describe("greetings and social intents", () => {
  beforeEach(() => resetIndex());

  it("greets the user", () => {
    for (const q of ["hi", "hello", "hey there", "good morning", "namaste"]) {
      const a: ChatAnswer = buildAnswer(q, retrieve(q, { topK: 4 }));
      expect(a.text).toContain("NM Research assistant");
    }
  });

  it("thanks the user", () => {
    const a = buildAnswer("thanks a lot", retrieve("thanks", { topK: 4 }));
    expect(a.text).toContain("welcome");
  });
});

describe("core company questions resolve to the right document", () => {
  beforeEach(() => resetIndex());

  const cases: [string, string][] = [
    // membership
    ["how much is platinum membership", "membership-platinum"],
    ["what is the price of all plans", "membership-overview"],
    ["what is community plan", "membership-community"],
    ["tell me about the prime plan", "membership-prime"],
    ["prime plan benefits", "membership-prime"],
    ["platinum plan cost", "membership-platinum"],
    ["how do i pay for membership", "membership-payment"],
    ["how does payment work", "membership-payment"],
    ["pricing", "membership-overview"],
    ["how do the membership plans compare", "membership-comparison"],
    ["whats the difference between community and platinum", "membership-comparison"],
    ["which membership plan should i choose", "membership-comparison"],
    ["which plan includes 2 publications", "membership-prime"],
    ["how long does membership last", "membership-duration"],
    ["can i renew my membership", "membership-duration"],
    ["are conferences included in membership", "conference-participation"],
    ["how many conferences do i get", "conference-participation"],
    // services
    ["what services do you offer", "services-overview"],
    ["do you help publish research papers", "service-publication"],
    ["what journals do you publish in", "service-publication"],
    ["what is publication support", "service-publication"],
    ["can you help me with phd", "service-phd"],
    ["do you do phd assistance", "service-phd"],
    ["do you provide language editing", "service-writing"],
    ["research paper writing help", "service-writing"],
    ["i want to write a paper", "service-writing"],
    ["help me prepare a manuscript", "service-writing"],
    ["publish my completed paper", "service-publication"],
    ["do you support book publication", "service-book-publication"],
    ["can you help me prepare a synopsis", "service-research-proposal"],
    ["do you do analytical testing xrd sem", "service-analytical"],
    ["do you organize conferences", "service-conferences"],
    ["research consulting and guidance", "service-consulting"],
    // about
    ["what is nm research", "about-org"],
    ["who runs nm research", "founder"],
    ["who is the founder", "founder"],
    ["what are your values", "mission-values"],
    ["where are you located", "global-presence"],
    // research
    ["what research areas do you cover", "research-domains"],
    ["how many subjects do you cover", "research-domains"],
    ["how do i find a research subject", "research-search"],
    ["what is a topic generator", "ai-tools"],
    ["what ai tools do you have", "ai-tools"],
    // contact / community
    ["how can I reach you", "contact-details"],
    ["what is your email", "contact-details"],
    ["email", "contact-details"],
    ["how do i join the whatsapp group", "community-whatsapp"],
    ["register as a researcher", "registration"],
  ];

  it.each(cases)("'%s' -> %s", (q, expectedId) => {
    const results = retrieve(q, { topK: 1 });
    expect(results[0]?.doc.id).toBe(expectedId);
  });
});

describe("typo tolerance", () => {
  beforeEach(() => resetIndex());

  const cases: [string, string][] = [
    ["phd assistence", "service-phd"],
    ["platinum plan coast", "membership-platinum"],
    ["how do i jouin the whatsapp group", "community-whatsapp"],
    ["help me publish in scoopus", "service-publication"],
    ["where are you locatd", "global-presence"],
  ];

  it.each(cases)("'%s' -> %s", (q, expectedId) => {
    const results = retrieve(q, { topK: 1 });
    expect(results[0]?.doc.id).toBe(expectedId);
  });
});

describe("every knowledge document is retrievable", () => {
  beforeEach(() => resetIndex());

  const docProbes: Record<string, string> = {
    "about-org": "what is nm group of industries",
    founder: "who is the founder and ceo",
    "mission-values": "what is your mission",
    "services-overview": "list all your services",
    "service-writing": "can you write my research paper",
    "service-publication": "help me publish in scopus",
    "service-phd": "support with my phd thesis",
    "service-consulting": "i need research guidance",
    "service-analytical": "do you test samples with sem and xrd",
    "service-conferences": "do you hold international conferences",
    "membership-overview": "list all membership plans and prices",
    "membership-community": "how much is the community membership",
    "membership-platinum": "what does platinum membership include",
    "membership-prime": "what is included in prime membership",
    "membership-payment": "how do i confirm my payment",
    "membership-comparison": "how do the plans differ from each other",
    "membership-duration": "how long is my membership valid",
    "research-domains": "which research fields do you cover",
    "research-search": "is there a search box on the research page",
    "ai-tools": "tell me about your ai tools",
    conferences: "can i present at a conference",
    "service-book-publication": "can nm help me publish a book",
    "service-research-proposal": "do you help write research proposals",
    "conference-participation": "does my plan include conference slots",
    "contact-details": "what is your phone number",
    registration: "how do i register myself",
    "community-whatsapp": "where can i find the whatsapp group",
    "global-presence": "which countries do you operate in",
    "quick-support": "i need urgent help",
  };

  it.each(Object.entries(docProbes))("probe for '%s' -> top-1", (docId, query) => {
    const results = retrieve(query, { topK: 1 });
    expect(results[0]?.doc.id, `query "${query}" did not hit ${docId}`).toBe(docId);
  });

  it("has a probe for every knowledge document (no orphans)", () => {
    const allIds = knowledgeDocs.map((d) => d.id);
    const probes = Object.keys(docProbes);
    for (const id of allIds) {
      expect(probes, `missing probe for ${id}`).toContain(id);
    }
  });
});

describe("no-match fallback", () => {
  beforeEach(() => resetIndex());

  it("returns a graceful fallback for gibberish", () => {
    const a = buildAnswer("zxqwpovnkqwe", retrieve("zxqwpovnkqwe", { topK: 4 }));
    expect(a.text).toContain("couldn't find");
    expect(a.related.length).toBeGreaterThan(0);
  });

  it("surfaces citations for confident answers", () => {
    const a = buildAnswer("how do i pay for membership", retrieve("how do i pay for membership", { topK: 4 }));
    expect(a.citations.length).toBeGreaterThan(0);
    expect(a.citations[0].source.startsWith("/")).toBe(true);
  });
});

describe("answer structure", () => {
  it("every chat answer has text, citations, related and suggestions", () => {
    for (const doc of knowledgeDocs) {
      const a = buildAnswer(doc.title, retrieve(doc.title, { topK: 3 }));
      expect(typeof a.text).toBe("string");
      expect(Array.isArray(a.citations)).toBe(true);
      expect(Array.isArray(a.related)).toBe(true);
      expect(Array.isArray(a.suggestions)).toBe(true);
    }
  });
});

describe("index integrity", () => {
  beforeEach(() => resetIndex());

  it("indexes exactly the authored knowledge documents", () => {
    const idx = getIndex();
    const ids = idx.map((d) => d.id).sort();
    const expected = knowledgeDocs.map((d) => d.id).sort();
    expect(ids).toEqual(expected);
  });

  it("returns nothing for an empty query", () => {
    expect(retrieve("   ")).toEqual([]);
  });

  it("ranks results by descending score", () => {
    const results = retrieve("membership plans and services", { topK: 6 });
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("exports a knowledge document type", () => {
    // compile-time sanity: a doc matches the KnowledgeDoc shape
    const doc: KnowledgeDoc = knowledgeDocs[0];
    expect(doc.id.length).toBeGreaterThan(0);
    expect(doc.source.startsWith("/")).toBe(true);
  });
});

describe("confidence calibration", () => {
  beforeEach(() => resetIndex());

  it("returns confidence bounded to [0, 1] with descending ordering", () => {
    const results = retrieve("how do i pay for membership", { topK: 4 });
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.confidence).toBeGreaterThanOrEqual(0);
      expect(r.confidence).toBeLessThanOrEqual(1);
    }
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].confidence).toBeGreaterThanOrEqual(results[i].confidence);
    }
  });

  it("scores a confident hit above the fallback threshold", () => {
    const hit = retrieve("what is the community plan", { topK: 1 });
    expect(hit[0].confidence).toBeGreaterThan(0.45);
  });

  it("leaves gibberish without a confident hit", () => {
    const miss = retrieve("zxqwpovnkqwe", { topK: 2 });
    expect(miss.every((r) => r.confidence < 0.45)).toBe(true);
  });
});

describe("signal-based greeting/thanks (B1 fix)", () => {
  beforeEach(() => resetIndex());

  it("answers the remainder after a greeting instead of swallowing it", () => {
    const a = buildAnswer(
      "hi what services do you offer?",
      retrieve("hi what services do you offer?", { topK: 4 }),
    );
    expect(a.answer).toBe(true);
    expect(a.text).toContain("Hi there!");
    expect(a.text).toContain("six main services");
  });

  it("answers the remainder after a thanks instead of swallowing it", () => {
    const a = buildAnswer(
      "thanks, how much is platinum?",
      retrieve("thanks, how much is platinum?", { topK: 4 }),
    );
    expect(a.answer).toBe(true);
    expect(a.text).toContain("You're welcome!");
    expect(a.text).toContain("Platinum membership plan");
  });

  it("keeps a pure greeting social (no retrieval claim)", () => {
    const a = buildAnswer("hi there", retrieve("hi there", { topK: 4 }));
    expect(a.answer).toBe(false);
    expect(a.text).toContain("NM Research assistant");
  });

  it("keeps a pure thanks social", () => {
    const a = buildAnswer("thanks a lot", retrieve("thanks a lot", { topK: 4 }));
    expect(a.answer).toBe(false);
    expect(a.text).toContain("You're welcome!");
  });

  it("does not treat a thanks-closer as a question", () => {
    const a = buildAnswer("thanks for your help", retrieve("thanks for your help", { topK: 4 }));
    expect(a.answer).toBe(false);
    expect(a.text).toContain("You're welcome!");
  });

  it("composes a greeting with a wordless help request", () => {
    const a = buildAnswer("hey i need help", retrieve("hey i need help", { topK: 4 }));
    expect(a.answer).toBe(true);
    expect(a.text).toContain("Hi there!");
    expect(a.text).toContain("For instant help");
  });
});

describe("dead-intent consumption + handoff (Step 3)", () => {
  beforeEach(() => resetIndex());

  it("routes an explicit human hand-off to quick-support, routed by the user's words", () => {
    const r = retrieve("i want to talk to a real person", { topK: 1 });
    expect(r[0]?.doc.id).toBe("quick-support");
    expect(r[0]?.trust).toBe("routed");
  });

  it("consumes the location intent onto global-presence", () => {
    const r = retrieve("where are you located", { topK: 1 });
    expect(r[0]?.doc.id).toBe("global-presence");
  });

  it("consumes the contact intent onto contact-details", () => {
    const r = retrieve("what is your email", { topK: 1 });
    expect(r[0]?.doc.id).toBe("contact-details");
  });

  it("does not let a generic help cue hijack quick-support", () => {
    const r = retrieve("i need help", { topK: 1 });
    expect(r[0]?.doc.id).toBe("quick-support");
  });
});

describe("trust ladder (B2 fix)", () => {
  beforeEach(() => resetIndex());

  it("marks a plan-gate hit as routed, not verified, when only semantic + routing evidence hold", () => {
    const r = retrieve("which plan includes 2 publications", { topK: 1 });
    expect(r[0]?.doc.id).toBe("membership-prime");
    expect(r[0]?.evidence.matchedKeywords).toEqual([]);
    expect(r[0]?.trust).toBe("routed");
    expect(r[0]?.confidence).toBeGreaterThan(0.45);
  });

  it("marks a lexically-grounded hit as verified", () => {
    const r = retrieve("how much is platinum membership", { topK: 1 });
    expect(r[0]?.doc.id).toBe("membership-platinum");
    expect(r[0]?.evidence.lexical).toBeGreaterThan(0);
    expect(r[0]?.trust).toBe("verified");
  });

  it("marks a gibberish miss as fallback", () => {
    const r = retrieve("zxqwpovnkqwe", { topK: 1 });
    expect(r[0]?.trust).toBe("fallback");
  });
});

describe("near-tie disambiguation (Principle 5)", () => {
  const mk = (
    doc: Partial<KnowledgeDoc>,
    score: number,
    confidence: number,
    trust: "verified" | "routed" | "matched" | "fallback",
  ) => ({
    doc: { ...knowledgeDocs[0], ...doc },
    score,
    confidence,
    trust,
  });

  it("flags a near-tie between two answerable candidates", () => {
    const a = mk({ id: "a" }, 0.6, 0.85, "verified");
    const b = mk({ id: "b" }, 0.55, 0.8, "verified");
    expect(isNearTie([a, b])).toBe(true);
  });

  it("does not flag a clear gap", () => {
    const a = mk({ id: "a" }, 0.9, 0.95, "verified");
    const b = mk({ id: "b" }, 0.55, 0.8, "verified");
    expect(isNearTie([a, b])).toBe(false);
  });

  it("ignores near-ties when a candidate is fallback", () => {
    const a = mk({ id: "a" }, 0.5, 0.8, "verified");
    const b = mk({ id: "b" }, 0.45, 0.5, "fallback");
    expect(isNearTie([a, b])).toBe(false);
  });

  it("surfaces a disambiguation prompt in the answer text", () => {
    const results = retrieve("which plan should i choose", { topK: 4 });
    results[0].nearTie = true;
    const a = buildAnswer("which plan should i choose", results);
    expect(a.text).toContain("Could you clarify");
  });
});
