import { describe, expect, it } from "vitest";
import { services } from "./services";

describe("services data integrity", () => {
  it("has the six documented services", () => {
    expect(services).toHaveLength(6);
  });

  it("has unique titles, non-empty descriptions and icons", () => {
    const titles = services.map((s) => s.title);
    expect(new Set(titles).size).toBe(titles.length);
    for (const s of services) {
      expect(s.description.length).toBeGreaterThan(10);
      expect(s.icon.length).toBeGreaterThan(0);
    }
  });

  it("has at least one tag per service", () => {
    for (const s of services) {
      expect(s.tags.length).toBeGreaterThan(0);
    }
  });
});
