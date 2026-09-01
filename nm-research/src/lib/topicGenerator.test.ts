import { describe, expect, it } from "vitest";
import { generateTopics } from "./topicGenerator";

describe("generateTopics", () => {
  it("returns the requested number of topics within bounds", () => {
    const out = generateTopics({ level: "phd", domainId: "chemistry" }, 4);
    expect(out.length).toBe(4);
  });

  it("caps output at 6 topics", () => {
    const out = generateTopics({ level: "phd", domainId: "engineering" }, 20);
    expect(out.length).toBe(6);
  });

  it("returns at least one topic when count is zero or negative", () => {
    expect(generateTopics({ level: "phd" }, 0).length).toBe(0);
    expect(generateTopics({ level: "phd" }, -3).length).toBe(0);
  });

  it("falls back to the first domain for an unknown domain id", () => {
    const out = generateTopics({ level: "phd", domainId: "not-a-domain" }, 2);
    expect(out.length).toBe(2);
    for (const t of out) {
      expect(t.why).toContain("Chemistry");
    }
  });

  it("produces well-formed topic objects with a rationale", () => {
    const out = generateTopics({ level: "phd", domainId: "physics" }, 3);
    for (const t of out) {
      expect(t.title.length).toBeGreaterThan(10);
      expect(t.angle.length).toBeGreaterThan(0);
      expect(t.why).toContain("sized for phd scope");
    }
  });

  it("is deterministic for identical input", () => {
    const input = { level: "phd" as const, domainId: "biomedical", focus: "cancer" };
    const a = generateTopics(input, 4).map((t) => t.title);
    const b = generateTopics(input, 4).map((t) => t.title);
    expect(a).toEqual(b);
  });

  it("varies output when the focus term changes", () => {
    const a = generateTopics({ level: "phd", domainId: "chemistry", focus: "nanomaterials" }, 4);
    const b = generateTopics({ level: "phd", domainId: "chemistry", focus: "catalysis" }, 4);
    const titlesA = a.map((t) => t.title).join("|");
    const titlesB = b.map((t) => t.title).join("|");
    expect(titlesA).not.toBe(titlesB);
  });

  it("uses domain subjects within the generated titles/rationales", () => {
    const out = generateTopics({ level: "phd", domainId: "energy-storage" }, 4);
    for (const t of out) {
      expect(t.why).toContain("Energy Storage");
    }
  });
});
