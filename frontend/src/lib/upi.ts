import { site } from "@/data/site";

/**
 * Build a UPI deep-link URI (upi://) for a given amount so the app can launch
 * the user's UPI app directly or feed a QR code.
 */
export function buildUpiUri(amount: number, note?: string): string {
  const params = new URLSearchParams({
    pa: site.upi.id,
    pn: site.upi.payeeName,
    am: amount.toFixed(2),
    cu: "INR",
  });
  if (note) params.set("tn", note);
  return `upi://pay?${params.toString()}`;
}
