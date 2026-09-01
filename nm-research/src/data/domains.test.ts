import { describe, expect, it } from "vitest";
import { domains, getSubjectBySlug, totalSubjects } from "./domains";

describe("domains data integrity", () => {
  it("has globally unique domain ids", () => {
    const ids = domains.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("matches the documented 11-domain universe", () => {
    expect(domains.length).toBe(11);
  });

  it("has non-empty titles, accents and icons per domain", () => {
    for (const d of domains) {
      expect(d.title.length).toBeGreaterThan(0);
      expect(d.shortTitle.length).toBeGreaterThan(0);
      expect(d.accent).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(d.icon.length).toBeGreaterThan(0);
    }
  });

  it("has at least one subject per domain and unique subject slugs", () => {
    const allSlugs = domains.flatMap((d) => d.subjects.map((s) => s.slug));
    expect(new Set(allSlugs).size).toBe(allSlugs.length);
    for (const d of domains) {
      expect(d.subjects.length).toBeGreaterThan(0);
    }
  });

  it("exposes the correct total subject count", () => {
    const manual = domains.reduce((sum, d) => sum + d.subjects.length, 0);
    expect(totalSubjects).toBe(manual);
  });
});

describe("getSubjectBySlug", () => {
  it("returns the matching subject", () => {
    const sub = getSubjectBySlug("nanotechnology");
    expect(sub).toEqual({ slug: "nanotechnology", name: "Nanotechnology" });
  });

  it("returns undefined for an unknown slug", () => {
    expect(getSubjectBySlug("not-a-real-subject")).toBeUndefined();
  });
});
