import { UPI_CONFIG } from "./config";

export function buildUpiUri(amount: number): string {
  return (
    "upi://pay?pa=" +
    encodeURIComponent(UPI_CONFIG.upiId) +
    "&pn=" +
    encodeURIComponent(UPI_CONFIG.payeeName) +
    "&am=" +
    amount +
    "&cu=INR" +
    "&tn=" +
    encodeURIComponent("NM Membership")
  );
}
