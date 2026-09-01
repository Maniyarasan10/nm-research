"use client";

import { useState, type FormEvent } from "react";
import { Phone, Mail, Globe, MapPin, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { siteConfig } from "@/lib/config";
import { submitWeb3Form } from "@/lib/web3forms";

const contactCards = [
  { icon: Phone, label: "Phone", values: siteConfig.contact.phones },
  { icon: Mail, label: "Email", values: siteConfig.contact.emails },
  { icon: Globe, label: "Website", values: [siteConfig.contact.website] },
  { icon: MapPin, label: "Global Offices", values: [siteConfig.contact.offices] },
  { icon: MapPin, label: "India — State Presence", values: [siteConfig.contact.indiaStates] },
];

const inputCls = "input";

export default function Contact({ showHeading = true }: { showHeading?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const subject = String(fd.get("subject") || "").trim();
    const domain = String(fd.get("domain") || "").trim();
    const msg = String(fd.get("message") || "").trim();
    const hp = String(fd.get("hp") || "");

    if (!name || !email || !subject || !msg) {
      setStatus("error");
      setMessage("Please complete all fields.");
      return;
    }

    // Honeypot
    if (hp) {
      setStatus("success");
      setMessage("Message sent — we'll reply soon.");
      form.reset();
      return;
    }

    setStatus("loading");
    const result = await submitWeb3Form(
      {
        name,
        email,
        subject: "NM Group Contact Form: " + subject,
        message: msg,
        "Research Domain": domain || "Not specified",
      },
      "NM Group Contact Form: " + subject,
      "NM Group of Industries — Website Contact Form",
    );

    if (result.success) {
      setStatus("success");
      setMessage("Message sent — we'll reply soon.");
      form.reset();
    } else {
      setStatus("error");
      setMessage(
        "Send failed — email hello.nmassociation@gmail.com instead.",
      );
    }
  }

  return (
    <section id="contact" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {showHeading && (
          <SectionHeading
            index={showHeading ? "05" : undefined}
            label="Get in touch"
            title={
              <>
                Start your <span className="emph">research journey</span>
              </>
            }
          />
        )}

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {/* Contact info */}
          <div className="space-y-4">
            {contactCards.map((card, i) => (
              <Reveal key={card.label} delay={i * 0.06}>
                <div className="card flex items-start gap-4 p-5">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border ${
                      i % 2 === 0
                        ? "border-accent/30 bg-accent-dim text-accent"
                        : "border-rule bg-surface-2 text-brand"
                    }`}
                  >
                    <card.icon size={18} strokeWidth={1.7} />
                  </div>
                  <div>
                    <div className="eyebrow uppercase">{card.label}</div>
                    <div className="mt-1 text-sm font-medium text-ink-2">
                      {card.values.join(" • ")}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Contact form */}
          <Reveal delay={0.15}>
            <form onSubmit={onSubmit} className="card p-6 sm:p-7">
              <div className="mb-5 display text-lg font-semibold text-ink">
                Send a message
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="name"
                  placeholder="Full Name *"
                  aria-label="Full Name"
                  aria-required="true"
                  className={inputCls}
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email *"
                  aria-label="Email"
                  aria-required="true"
                  className={inputCls}
                />
                <input
                  name="subject"
                  placeholder="Subject *"
                  aria-label="Subject"
                  aria-required="true"
                  className={`${inputCls} sm:col-span-2`}
                />
                <select
                  name="domain"
                  defaultValue=""
                  aria-label="Research Domain"
                  className={`${inputCls} sm:col-span-2`}
                >
                  <option value="">Select Research Domain</option>
                  <option>Chemistry & Materials</option>
                  <option>Biomedical & Life Sciences</option>
                  <option>Environmental & Energy</option>
                  <option>Agricultural & Food Sciences</option>
                  <option>Engineering & Technology</option>
                  <option>Physics, Mathematics & Data</option>
                  <option>Management & Business</option>
                  <option>Social Sciences & Humanities</option>
                </select>
                <textarea
                  name="message"
                  placeholder="Your Message *"
                  aria-label="Your Message"
                  aria-required="true"
                  rows={5}
                  className={`${inputCls} sm:col-span-2`}
                />
              </div>

              <input name="hp" className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn btn-primary mt-5 w-full"
              >
                {status === "loading" && <Loader2 size={16} className="animate-spin" />}
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>

              {status === "success" && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-soft px-4 py-3 text-sm font-medium text-green">
                  <CheckCircle2 size={18} /> {message}
                </div>
              )}
              {status === "error" && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  <AlertCircle size={18} /> {message}
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
