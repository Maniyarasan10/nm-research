"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { submitWeb3Form } from "@/lib/web3forms";
import { WHATSAPP_GROUP_LINK } from "@/lib/config";

const QRCode = dynamic(() => import("react-qr-code"), { ssr: false });

type Tab = "registration" | "community";
type Status = "idle" | "loading" | "success" | "error";

const rf = (s: Status) =>
  s === "loading"
    ? "sending..."
    : s === "success"
      ? "Registration received — under review."
      : s === "error"
        ? "Registration failed — please try again."
        : "";

export default function Registration() {
  const [tab, setTab] = useState<Tab>("registration");
  const [regStatus, setRegStatus] = useState<Status>("idle");
  const [commStatus, setCommStatus] = useState<Status>("idle");

  async function submitReg(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const hp = String(fd.get("hp") || "");

    const required = ["name", "designation", "degree", "field", "contact", "email", "affiliation"];
    if (required.some((k) => !String(fd.get(k) || "").trim())) {
      setRegStatus("error");
      return;
    }
    if (hp) {
      setRegStatus("success");
      form.reset();
      return;
    }
    setRegStatus("loading");
    const result = await submitWeb3Form(
      {
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        Designation: String(fd.get("designation") || ""),
        "Highest Degree": String(fd.get("degree") || ""),
        "Research Field": String(fd.get("field") || ""),
        Experience: String(fd.get("experience") || "Not specified"),
        Publications: String(fd.get("publications") || "Not specified"),
        "Contact Number": String(fd.get("contact") || ""),
        "WhatsApp Number": String(fd.get("whatsapp") || "Not specified"),
        Affiliation: String(fd.get("affiliation") || ""),
      },
      "NM Group Researcher Registration: " + String(fd.get("name") || ""),
      "NM Group of Industries — Registration Form",
    );
    setRegStatus(result.success ? "success" : "error");
    if (result.success) form.reset();
  }

  async function submitComm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const hp = String(fd.get("hp") || "");
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const contact = String(fd.get("contact") || "").trim();

    if (!name || !email || !contact) {
      setCommStatus("error");
      return;
    }
    if (hp) {
      setCommStatus("success");
      form.reset();
      return;
    }
    setCommStatus("loading");
    const result = await submitWeb3Form(
      {
        name,
        email,
        "Contact Number": contact,
        Affiliation: String(fd.get("affiliation") || "Not specified"),
        "Area of Interest": String(fd.get("field") || "Not specified"),
      },
      "NM Group Community Join Request: " + name,
      "NM Group of Industries — Join Community Form",
    );
    setCommStatus(result.success ? "success" : "error");
    if (result.success) form.reset();
  }

  const inputCls =
    "input";

  return (
    <section id="registration" className="py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          center
          label="NM Global Research Innovations"
          title={
            <>
              Registration
            </>
          }
          subtitle="Join NM Group of Industries and Research Foundation as a registered researcher, or become part of our global research community."
        />

        {/* Tabs */}
        <Reveal className="mt-8">
          <div
            role="tablist"
            aria-label="Registration or community"
            className="mx-auto flex max-w-md gap-1 rounded-xl bg-surface-2 p-1"
          >
            {(
              [
                { id: "registration", label: "Registration" },
                { id: "community", label: "Join Research Community" },
              ] as { id: Tab; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  tab === t.id
                    ? "bg-white text-brand shadow-sm"
                    : "text-text-2 hover:text-brand"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-6">
          {tab === "registration" ? (
            <form
              role="tabpanel"
              id="panel-registration"
              aria-labelledby="tab-registration"
              onSubmit={submitReg}
              className="card p-6 sm:p-8"
            >
              <div className="mb-6 font-display text-lg font-bold text-brand">
                Researcher Registration
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="name" placeholder="Full Name *" aria-label="Full Name" aria-required="true" className={inputCls} />
                <input name="designation" placeholder="Designation *" aria-label="Designation" aria-required="true" className={inputCls} />
                <input name="degree" placeholder="Highest Degree *" aria-label="Highest Degree" aria-required="true" className={inputCls} />
                <select name="field" defaultValue="" aria-label="Research Field" className={`${inputCls} text-text-2`}>
                  <option value="">Research Field *</option>
                  <option>Chemistry & Materials</option>
                  <option>Biomedical & Life Sciences</option>
                  <option>Environmental & Energy</option>
                  <option>Engineering & Technology</option>
                  <option>Physics, Maths & Data</option>
                  <option>Social Sciences & Humanities</option>
                  <option>Management & Business</option>
                </select>
                <input name="experience" placeholder="Years of Experience" aria-label="Years of Experience" className={inputCls} />
                <input name="publications" placeholder="No. of Publications" aria-label="No. of Publications" className={inputCls} />
                <input name="contact" placeholder="Contact Number *" aria-label="Contact Number" aria-required="true" className={inputCls} />
                <input name="whatsapp" placeholder="WhatsApp Number" aria-label="WhatsApp Number" className={inputCls} />
                <input name="email" type="email" placeholder="Email *" aria-label="Email" aria-required="true" className={inputCls} />
                <input name="affiliation" placeholder="Affiliation *" aria-label="Affiliation" aria-required="true" className={`${inputCls} sm:col-span-2`} />
              </div>
              <input name="hp" className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <button
                type="submit"
                disabled={regStatus === "loading"}
                className="btn btn-primary mt-6 w-full"
              >
                {regStatus === "loading" && <Loader2 size={16} className="animate-spin" />}
                {rf(regStatus) || "Submit Registration"}
              </button>
              {regStatus === "success" && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  <CheckCircle2 size={18} /> Registration received — under review.
                </div>
              )}
              {regStatus === "error" && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  <AlertCircle size={18} /> Registration failed — please try again.
                </div>
              )}
            </form>
          ) : (
            <div
              role="tabpanel"
              id="panel-community"
              aria-labelledby="tab-community"
              className="grid gap-6 lg:grid-cols-2"
            >
              {/* WhatsApp box */}
              <div className="card flex flex-col items-center justify-center p-8 text-center">
                <div className="flex items-center gap-2 text-lg font-bold text-brand">
                  <MessageCircle size={22} className="text-green-600" />
                  Join Our WhatsApp Community
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-2">
                  Get instant updates on webinars, calls for papers, and
                  collaboration opportunities. Scan the QR code with your phone
                  camera or tap the button to join directly.
                </p>
                <span className="mt-4 rounded-xl border border-border-soft bg-white p-3">
                  <QRCode value={WHATSAPP_GROUP_LINK} size={180} />
                </span>
                <span className="mt-2 text-xs font-semibold text-text-3">
                  Scan to Join
                </span>
                <a
                  href={WHATSAPP_GROUP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-green-700"
                >
                  <MessageCircle size={16} /> Join WhatsApp Group
                </a>
              </div>

              <form
                onSubmit={submitComm}
                className="card p-6"
              >
                <div className="mb-6 font-display text-lg font-bold text-brand">
                  Join the NM Research Community
                </div>
                <div className="grid gap-4">
                  <input name="name" placeholder="Full Name *" aria-label="Full Name" aria-required="true" className={inputCls} />
                  <input name="contact" placeholder="Contact Number *" aria-label="Contact Number" aria-required="true" className={inputCls} />
                  <input name="email" type="email" placeholder="Email *" aria-label="Email" aria-required="true" className={inputCls} />
                  <input name="affiliation" placeholder="Affiliation" aria-label="Affiliation" className={inputCls} />
                  <select name="field" defaultValue="" aria-label="Area of Interest" className={`${inputCls} text-text-2`}>
                    <option value="">Area of Interest</option>
                    <option>Chemistry & Materials</option>
                    <option>Biomedical & Life Sciences</option>
                    <option>Environmental & Energy</option>
                    <option>Engineering & Technology</option>
                    <option>Physics, Maths & Data</option>
                    <option>Social Sciences & Humanities</option>
                  </select>
                </div>
                <input name="hp" className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <button
                  type="submit"
                  disabled={commStatus === "loading"}
                  className="btn btn-primary mt-6 w-full"
                >
                  {commStatus === "loading" && <Loader2 size={16} className="animate-spin" />}
                  {commStatus === "loading" ? "Sending..." : "Join Community"}
                </button>
                {commStatus === "success" && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    <CheckCircle2 size={18} /> Request received — welcome aboard.
                  </div>
                )}
                {commStatus === "error" && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    <AlertCircle size={18} /> Request failed — please try again.
                  </div>
                )}
              </form>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
