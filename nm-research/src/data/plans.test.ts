import { describe, expect, it } from "vitest";
import { formatINR, plans } from "./plans";

describe("formatINR", () => {
  it("formats Indian number grouping (lakhs)", () => {
    expect(formatINR(2999)).toBe("2,999");
    expect(formatINR(29999)).toBe("29,999");
    expect(formatINR(49999)).toBe("49,999");
  });

  it("formats zero and small values", () => {
    expect(formatINR(0)).toBe("0");
    expect(formatINR(500)).toBe("500");
  });
});

describe("plans data integrity", () => {
  it("has exactly three plans with unique tiers", () => {
    expect(plans).toHaveLength(3);
    const tiers = plans.map((p) => p.tier);
    expect(new Set(tiers).size).toBe(tiers.length);
  });

  it("has exactly one featured plan", () => {
    const featured = plans.filter((p) => p.featured);
    expect(featured).toHaveLength(1);
    expect(featured[0].badge).toBeDefined();
  });

  it("has positive prices and non-empty benefit lists", () => {
    for (const p of plans) {
      expect(p.price).toBeGreaterThan(0);
      expect(p.benefits.length).toBeGreaterThan(0);
    }
  });
});
