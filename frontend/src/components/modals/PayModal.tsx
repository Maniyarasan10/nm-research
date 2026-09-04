import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { site } from "@/data/site";
import { buildUpiUri } from "@/lib/upi";
import { formatINR } from "@/data/plans";

export default function PayModal({
  planName,
  amount,
  onClose,
}: {
  planName: string;
  amount: number;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const uri = buildUpiUri(amount, `${planName} Membership`);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.upi.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--z-loader)",
        background: "rgba(16,16,16,0.78)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Complete ${planName} membership payment`}
        style={{
          width: "100%",
          maxWidth: 440,
          background: "var(--bg-tertiary)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-md)",
          padding: "1.8rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h3 className="display-md" style={{ fontSize: "1.3rem" }}>Complete payment</h3>
            <div className="display-md" style={{ marginTop: 10, fontSize: "1.9rem", color: "var(--accent-bright)", fontVariantNumeric: "tabular-nums" }}>
              ₹{formatINR(amount)}
              <span className="mono" style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 400 }}> · {planName} Membership</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close payment dialog"
            className="mono"
            style={{ fontSize: 14, color: "var(--text-muted)", padding: "0.4rem 0.6rem", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ padding: 12, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", background: "#ffffff" }}>
            <QRCode value={uri} size={188} />
          </div>
          <div className="mono" style={{ marginTop: 12, fontSize: 10, letterSpacing: "0.16em", color: "var(--text-muted)" }}>
            SCAN WITH ANY UPI APP
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-sm)",
            background: "var(--surface)",
            padding: "0.7rem 0.9rem",
          }}
        >
          <span className="mono" style={{ fontSize: 10.5, color: "var(--text-secondary)", wordBreak: "break-all" }}>
            {site.upi.id}
          </span>
          <button
            onClick={copy}
            className="btn btn-ghost"
            style={{ padding: "0.5rem 0.9rem", fontSize: 10, flexShrink: 0 }}
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>

        <a
          href={uri}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ marginTop: 12, width: "100%", justifyContent: "center" }}
        >
          Pay in UPI app ↗
        </a>

        <ol
          className="mono"
          style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8, fontSize: 10.5, lineHeight: 1.7, color: "var(--text-secondary)", paddingLeft: 0, listStyle: "none", counterReset: "steps" }}
        >
          {[
            "Scan the QR or tap \"Pay in UPI App\"",
            "Confirm the amount and pay",
            "Note your UPI reference / transaction ID",
            `Email the screenshot to ${site.contact.emails[0]}`,
          ].map((step, i) => (
            <li key={step} style={{ display: "flex", gap: 10 }}>
              <span style={{ color: "var(--accent)" }}>{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div
          style={{
            marginTop: 18,
            border: "1px solid var(--accent-line)",
            borderRadius: "var(--radius-sm)",
            background: "rgba(133,21,9,0.08)",
            padding: "0.8rem 1rem",
            fontSize: "0.86rem",
            lineHeight: 1.6,
            color: "var(--accent-bright)",
          }}
        >
          Membership activates within 24 hours of payment confirmation. For
          instant help, call {site.contact.phones[0]}.
        </div>
      </div>
    </div>
  );
}