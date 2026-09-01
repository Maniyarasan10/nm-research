"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, X, ExternalLink } from "lucide-react";
import dynamic from "next/dynamic";
import { UPI_CONFIG } from "@/lib/config";
import { buildUpiUri } from "@/lib/upi";
import { formatINR } from "@/data/plans";
import Image from "next/image";

const QRCode = dynamic(() => import("react-qr-code"), { ssr: false });

const appLogos = [
  { src: "/images/upi/gpay.png", alt: "Google Pay" },
  { src: "/images/upi/phonepe.png", alt: "PhonePe" },
  { src: "/images/upi/paytm.png", alt: "Paytm" },
  { src: "/images/upi/bhim.png", alt: "BHIM UPI" },
  { src: "/images/upi/upi.png", alt: "UPI" },
];

export default function PayModal({
  open,
  planName,
  amount,
  onClose,
}: {
  open: boolean;
  planName: string;
  amount: number;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const uri = buildUpiUri(amount);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(UPI_CONFIG.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/70 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-brand">
              Complete Payment
            </h3>
            <div className="mt-1 text-3xl font-extrabold text-brand">
              ₹{formatINR(amount)}
              <span className="text-sm font-semibold text-text-3">
                {" "}
                · {planName} Membership
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-text-3 hover:bg-surface-2 hover:text-brand"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 flex justify-center">
          <div className="rounded-xl border border-border-soft bg-white p-3 shadow-inner">
            <QRCode value={uri} size={176} />
          </div>
        </div>

        <div className="mt-3 text-center text-xs font-medium text-text-3">
          Scan with any UPI app
        </div>

        <div className="mt-3 flex items-center justify-center gap-3">
          {appLogos.map((l) => (
            <Image
              key={l.alt}
              src={l.src}
              alt={l.alt}
              width={36}
              height={16}
              className="h-4 w-auto object-contain opacity-80"
            />
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-surface-2 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-mono text-xs text-text-2">
              {UPI_CONFIG.upiId}
            </span>
            <button
              onClick={copy}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-mid"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <a
          href={uri}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-navy-mid"
        >
          Pay in UPI App
          <ExternalLink size={16} />
        </a>

        <ol className="mt-5 space-y-1.5 text-xs text-text-2">
          <li>1. Scan the QR or tap &quot;Pay in UPI App&quot;</li>
          <li>2. Confirm the amount and pay</li>
          <li>3. Note your UPI reference / transaction ID</li>
          <li>
            4. Email the screenshot to hello.nmassociation@gmail.com
          </li>
        </ol>

        <p className="mt-4 rounded-lg bg-accent-dim p-3 text-[11px] leading-relaxed text-accent">
          Your membership will be activated within 24 hours of payment
          confirmation. For instant help, call +91 8667334697.
        </p>
      </motion.div>
    </motion.div>
  );
}
