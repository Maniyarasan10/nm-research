import { describe, expect, it } from "vitest";
import { buildUpiUri } from "./upi";
import { UPI_CONFIG } from "./config";

describe("buildUpiUri", () => {
  it("builds a valid upi:// payment URI", () => {
    const uri = buildUpiUri(29999);
    expect(uri.startsWith("upi://pay?")).toBe(true);
    expect(uri).toContain("pa=" + encodeURIComponent(UPI_CONFIG.upiId));
    expect(uri).toContain("pn=" + encodeURIComponent(UPI_CONFIG.payeeName));
    expect(uri).toContain("am=29999");
    expect(uri).toContain("cu=INR");
    expect(uri).toContain("tn=" + encodeURIComponent("NM Membership"));
  });

  it("encodes special characters in payee name", () => {
    const uri = buildUpiUri(1000);
    expect(uri).toContain(
      encodeURIComponent("NM Group of Industries and Research Foundation"),
    );
    expect(uri).not.toContain("%26");
  });

  it("preserves the amount exactly as provided", () => {
    expect(buildUpiUri(0)).toContain("am=0");
    expect(buildUpiUri(123456.5)).toContain("am=123456.5");
  });
});
