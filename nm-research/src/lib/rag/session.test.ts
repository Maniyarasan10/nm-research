import { describe, it, expect, beforeEach } from "vitest";
import {
  resetSessions,
  resolveQuery,
  commitTurn,
  MAX_TURNS,
} from "./session";

const platinum = {
  doc: { id: "membership-platinum", title: "Platinum membership plan", keywords: ["platinum"] },
};

describe("multi-turn session memory", () => {
  beforeEach(() => resetSessions());

  it("passes a standalone question through untouched", () => {
    const r = resolveQuery("s1", "how many research domains do you cover?");
    expect(r.usedContext).toBe(false);
    expect(r.query).toContain("research");
  });

  it("injects the previous topic for an uninformative follow-up", () => {
    commitTurn("s1", platinum);
    const r = resolveQuery("s1", "how much is it?");
    expect(r.usedContext).toBe(true);
    expect(r.query).toContain("platinum");
  });

  it("keeps the built resolved query sensible (headline + follow-up)", () => {
    commitTurn("s1", platinum);
    const r = resolveQuery("s1", "what about it?");
    expect(r.query.trim()).toBe("platinum what about it");
  });

  it("does not inject context when the follow-up carries its own intent", () => {
    commitTurn("s1", platinum);
    const r = resolveQuery("s1", "how much is the community plan?");
    expect(r.usedContext).toBe(false);
  });

  it("keeps the topic across non-answer turns", () => {
    commitTurn("s1", platinum);
    commitTurn("s1", null);
    const r = resolveQuery("s1", "how much is it?");
    expect(r.usedContext).toBe(true);
  });

  it("auto-resets after MAX_TURNS and clears context", () => {
    let res: { turns: number; reset: boolean } = { turns: 0, reset: false };
    for (let i = 0; i < MAX_TURNS; i++) {
      res = commitTurn("s1", platinum);
    }
    expect(res.reset).toBe(true);
    const r = resolveQuery("s1", "how much is it?");
    expect(r.usedContext).toBe(false);
  });
});