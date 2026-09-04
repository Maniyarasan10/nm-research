import { useState, type FormEvent } from "react";
import QRCode from "react-qr-code";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { site, domains } from "@/data/site";
import { submitWeb3Form } from "@/lib/web3forms";
import { usePageMeta } from "@/hooks/usePageMeta";

type Tab = "message" | "registration" | "community";
type Status = "idle" | "sending" | "success" | "error";

const TABS: { id: Tab; label: string }[] = [
  { id: "message", label: "Message" },
  { id: "registration", label: "Researcher Registration" },
  { id: "community", label: "Join Community" },
];

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 10.5,
  letterSpacing: "0.14em",
  color: "var(--text-muted)",
  textTransform: "uppercase",
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = { marginTop: 6 };

function StatusBox({ status, successMsg }: { status: Status; successMsg: string }) {
  if (status === "idle" || status === "sending") return null;
  const ok = status === "success";
  return (
    <div
      role="alert"
      style={{
        marginTop: 16,
        padding: "1rem 1.2rem",
        borderRadius: "var(--radius-sm)",
        fontSize: "0.92rem",
        lineHeight: 1.6,
        border: ok ? "1px solid #3f8f5f" : "1px solid #b3563a",
        background: ok ? "rgba(63,143,95,0.08)" : "rgba(179,86,58,0.08)",
        color: ok ? "#c9e6d2" : "#f0c4ae",
      }}
    >
      {ok ? successMsg : "Couldn't send — please check your details and try again."}
    </div>
  );
}

function buttonLabel(status: Status, idle: string) {
  if (status === "sending") return "Sending…";
  if (status === "success") return "Sent ✓";
  return idle;
}

export default function Contact() {
  usePageMeta(
    "Contact | NM Research",
    "Research questions, publication enquiries or membership — reach NM Research directly. We respond within 24 hours.",
  );

  const [tab, setTab] = useState<Tab>("message");
  const [msgStatus, setMsgStatus] = useState<Status>("idle");
  const [regStatus, setRegStatus] = useState<Status>("idle");
  const [commStatus, setCommStatus] = useState<Status>("idle");

  async function submitMsg(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("hp")) return;
    if (!["name", "email", "subject", "message"].every((k) => String(fd.get(k) || "").trim())) {
      setMsgStatus("error");
      return;
    }
    setMsgStatus("sending");
    const res = await submitWeb3Form(
      {
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || "Not specified"),
        subject: String(fd.get("subject") || "General"),
        message: String(fd.get("message") || ""),
      },
      `New enquiry — ${String(fd.get("subject") || "General")}`,
      "NM Research Website",
    );
    setMsgStatus(res.success ? "success" : "error");
    if (res.success) e.currentTarget.reset();
  }

  async function submitReg(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("hp")) {
      e.currentTarget.reset();
      setRegStatus("success");
      return;
    }
    if (!["name", "designation", "degree", "field", "contact", "email", "affiliation"].every((k) => String(fd.get(k) || "").trim())) {
      setRegStatus("error");
      return;
    }
    setRegStatus("sending");
    const res = await submitWeb3Form(
      {
        name: String(fd.get("name") || ""),
        Designation: String(fd.get("designation") || ""),
        "Highest Degree": String(fd.get("degree") || ""),
        "Research Field": String(fd.get("field") || ""),
        Experience: String(fd.get("experience") || "Not specified"),
        Publications: String(fd.get("publications") || "Not specified"),
        "Contact Number": String(fd.get("contact") || ""),
        "WhatsApp Number": String(fd.get("whatsapp") || "Not specified"),
        Affiliation: String(fd.get("affiliation") || ""),
        email: String(fd.get("email") || ""),
      },
      `NM Research Registration — ${String(fd.get("name") || "")}`,
      "NM Group of Industries — Registration Form",
    );
    setRegStatus(res.success ? "success" : "error");
    if (res.success) e.currentTarget.reset();
  }

  async function submitComm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("hp")) {
      e.currentTarget.reset();
      setCommStatus("success");
      return;
    }
    if (!["name", "contact", "email"].every((k) => String(fd.get(k) || "").trim())) {
      setCommStatus("error");
      return;
    }
    setCommStatus("sending");
    const res = await submitWeb3Form(
      {
        name: String(fd.get("name") || ""),
        "Contact Number": String(fd.get("contact") || ""),
        email: String(fd.get("email") || ""),
        Affiliation: String(fd.get("affiliation") || "Not specified"),
        "Area of Interest": String(fd.get("field") || "Not specified"),
      },
      `NM Research Community Join Request — ${String(fd.get("name") || "")}`,
      "NM Group of Industries — Join Community Form",
    );
    setCommStatus(res.success ? "success" : "error");
    if (res.success) e.currentTarget.reset();
  }

  const channels = [
    { label: "Phone", values: site.contact.phones, icon: "☏" },
    { label: "Email", values: site.contact.emails, icon: "✉" },
    { label: "Global offices", values: [site.contact.offices], icon: "◎" },
    { label: "India states", values: [site.contact.indiaStates], icon: "⚑" },
  ];

  return (
    <>
      <PageHero
        label="Contact"
        crumb="NM Research"
        title={
          <>
            START THE{" "}
            <span style={{ color: "var(--accent)" }}>CONVERSATION</span>
          </>
        }
        subtitle="Research questions, publication enquiries or membership — send a message and we'll respond within 24 hours."
      />

      <section style={{ paddingBlock: "4rem 6rem" }}>
        <div className="container">
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "clamp(2rem, 5vw, 5rem)" }}>
            {/* Channels */}
            <div>
              <SectionHeading
                index="01"
                label="Direct channels"
                title={
                  <>
                    REACH US{" "}
                    <span style={{ color: "var(--accent)" }}>DIRECTLY</span>
                  </>
                }
              />
              <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 18 }}>
                {channels.map((c, i) => (
                  <Reveal key={c.label} delay={i * 0.06}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <span
                        aria-hidden="true"
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          border: "1px solid var(--accent-line)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--accent-bright)",
                          fontSize: 14,
                          flexShrink: 0,
                        }}
                      >
                        {c.icon}
                      </span>
                      <div>
                        <div className="eyebrow" style={{ marginBottom: 6 }}>{c.label}</div>
                        {c.values.map((v) => (
                          <div key={v} className="mono" style={{ fontSize: 11.5, lineHeight: 1.9, color: "var(--text-primary)", wordBreak: "break-word" }}>
                            {v}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.2}>
                <div
                  style={{
                    marginTop: 30,
                    border: "1px solid var(--accent-line)",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(133,21,9,0.07)",
                    padding: "1.3rem 1.4rem",
                  }}
                >
                  <div className="eyebrow" style={{ marginBottom: 8 }}>Response time</div>
                  <p className="mono" style={{ fontSize: 11.5, lineHeight: 1.8, color: "var(--text-secondary)" }}>
                    Every message is answered within 24 hours, 7 days a week. For
                    urgent membership matters, call {site.contact.phones[0]}.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Tabs + panels */}
            <div>
              <SectionHeading
                index="02"
                label="Get in touch"
                title={
                  <>
                    MESSAGE · REGISTER ·{" "}
                    <span style={{ color: "var(--accent)" }}>JOIN</span>
                  </>
                }
              />

              <Reveal delay={0.06}>
<div
                  role="tablist"
                  aria-label="Contact options"
                  className="contact-tabs"
                  style={{
                    marginTop: 28,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--surface)",
                    padding: 4,
                  }}
                >
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      role="tab"
                      id={`tab-${t.id}`}
                      aria-selected={tab === t.id}
                      aria-controls={`panel-${t.id}`}
                      onClick={() => setTab(t.id)}
                      style={{
                        padding: "0.85rem 0.5rem",
                        borderRadius: "var(--radius-sm)",
                        fontSize: 11,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        color: tab === t.id ? "var(--bg-primary)" : "var(--text-muted)",
                        background: tab === t.id ? "var(--accent)" : "transparent",
                        transition: "color .3s, background-color .3s",
                        fontWeight: 500,
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </Reveal>

              {/* Message panel */}
              {tab === "message" && (
                <Reveal delay={0.08}>
                  <form
                    role="tabpanel"
                    id="panel-message"
                    aria-labelledby="tab-message"
                    onSubmit={submitMsg}
                    style={{ marginTop: 22 }}
                  >
                    <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <label>
                        <span style={labelStyle}>Full name *</span>
                        <input required name="name" placeholder="Your name" className="input" style={inputStyle} aria-label="Full name" />
                      </label>
                      <label>
                        <span style={labelStyle}>Email *</span>
                        <input required type="email" name="email" placeholder="you@example.com" className="input" style={inputStyle} aria-label="Email" />
                      </label>
                      <label>
                        <span style={labelStyle}>Phone / WhatsApp</span>
                        <input name="phone" placeholder="+91 …" className="input" style={inputStyle} aria-label="Phone or WhatsApp" />
                      </label>
                      <label>
                        <span style={labelStyle}>Topic *</span>
                        <select required name="subject" defaultValue="" className="input" style={inputStyle} aria-label="Topic">
                          <option value="" disabled>Select a topic…</option>
                          <option>Publication support</option>
                          <option>Conference participation</option>
                          <option>Membership enquiry</option>
                          <option>Research consultancy</option>
                          <option>PhD guidance</option>
                          <option>Collaboration / partnership</option>
                          <option>Other</option>
                        </select>
                      </label>
                      <label style={{ gridColumn: "1 / -1" }}>
                        <span style={labelStyle}>Message *</span>
                        <textarea
                          required
                          rows={5}
                          name="message"
                          placeholder="Describe your research goal or question…"
                          className="input"
                          style={{ ...inputStyle, resize: "vertical" }}
                          aria-label="Message"
                        />
                      </label>
                    </div>
                    <input name="hp" className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                    <button
                      type="submit"
                      disabled={msgStatus === "sending"}
                      className="btn btn-primary"
                      style={{ marginTop: 22, width: "100%", justifyContent: "center", fontSize: 11.5 }}
                    >
                      {buttonLabel(msgStatus, "Send message")} <span className="btn-arrow">→</span>
                    </button>
                    <StatusBox status={msgStatus} successMsg="Message sent. We'll get back to you within 24 hours." />
                  </form>
                </Reveal>
              )}

              {/* Registration panel */}
              {tab === "registration" && (
                <Reveal delay={0.08}>
                  <div
                    role="tabpanel"
                    id="panel-registration"
                    aria-labelledby="tab-registration"
                    style={{
                      marginTop: 22,
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      background: "var(--surface)",
                      padding: "1.6rem",
                    }}
                  >
                    <div className="display-md" style={{ fontSize: "1.15rem", color: "var(--accent-bright)" }}>
                      Register as an NM Researcher
                    </div>
                    <p style={{ marginTop: 8, fontSize: "0.9rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
                      Applications are reviewed, then you receive your researcher
                      profile and eligibility for publications and conferences.
                    </p>
                    <form onSubmit={submitReg} style={{ marginTop: 20 }}>
                      <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <label>
                          <span style={labelStyle}>Full name *</span>
                          <input required name="name" placeholder="Full name" className="input" style={inputStyle} aria-label="Full name" />
                        </label>
                        <label>
                          <span style={labelStyle}>Designation *</span>
                          <input required name="designation" placeholder="e.g. Research Scholar" className="input" style={inputStyle} aria-label="Designation" />
                        </label>
                        <label>
                          <span style={labelStyle}>Highest degree *</span>
                          <input required name="degree" placeholder="e.g. M.Sc, M.Tech, PhD" className="input" style={inputStyle} aria-label="Highest degree" />
                        </label>
                        <label>
                          <span style={labelStyle}>Research field *</span>
                          <select required name="field" defaultValue="" className="input" style={inputStyle} aria-label="Research field">
                            <option value="" disabled>Select a domain…</option>
                            {domains.map((d) => (
                              <option key={d.id} value={d.title}>{d.title}</option>
                            ))}
                          </select>
                        </label>
                        <label>
                          <span style={labelStyle}>Years of experience</span>
                          <input name="experience" placeholder="e.g. 3" className="input" style={inputStyle} aria-label="Years of experience" />
                        </label>
                        <label>
                          <span style={labelStyle}>No. of publications</span>
                          <input name="publications" placeholder="e.g. 5" className="input" style={inputStyle} aria-label="Number of publications" />
                        </label>
                        <label>
                          <span style={labelStyle}>Contact number *</span>
                          <input required name="contact" placeholder="+91 …" className="input" style={inputStyle} aria-label="Contact number" />
                        </label>
                        <label>
                          <span style={labelStyle}>WhatsApp number</span>
                          <input name="whatsapp" placeholder="+91 …" className="input" style={inputStyle} aria-label="WhatsApp number" />
                        </label>
                        <label>
                          <span style={labelStyle}>Email *</span>
                          <input required type="email" name="email" placeholder="you@example.com" className="input" style={inputStyle} aria-label="Email" />
                        </label>
                        <label style={{ gridColumn: "1 / -1" }}>
                          <span style={labelStyle}>Affiliation / institution *</span>
                          <input required name="affiliation" placeholder="University, institute or company" className="input" style={inputStyle} aria-label="Affiliation" />
                        </label>
                      </div>
                      <input name="hp" className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                      <button
                        type="submit"
                        disabled={regStatus === "sending"}
                        className="btn btn-primary"
                        style={{ marginTop: 20, width: "100%", justifyContent: "center", fontSize: 11.5 }}
                      >
                        {buttonLabel(regStatus, "Submit registration")} <span className="btn-arrow">→</span>
                      </button>
                      <StatusBox status={regStatus} successMsg="Registration received — under review." />
                    </form>
                  </div>
                </Reveal>
              )}

              {/* Community panel */}
              {tab === "community" && (
                <Reveal delay={0.08}>
                  <div
                    role="tabpanel"
                    id="panel-community"
                    aria-labelledby="tab-community"
                    className="comm-grid"
                    style={{
                      marginTop: 22,
                      display: "grid",
                      gridTemplateColumns: "0.9fr 1.1fr",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-md)",
                        background: "var(--surface)",
                        padding: "1.6rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: 14,
                      }}
                    >
                      <div className="display-md" style={{ fontSize: "1.05rem", color: "var(--accent-bright)" }}>
                        WhatsApp Community
                      </div>
                      <p style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
                        Instant updates on webinars, calls for papers and
                        collaboration opportunities.
                      </p>
                      <span style={{ padding: 10, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", background: "#ffffff" }}>
                        <QRCode value={site.whatsapp} size={164} />
                      </span>
                      <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.16em", color: "var(--text-muted)" }}>
                        SCAN TO JOIN
                      </span>
                      <a
                        href={site.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ fontSize: 11, justifyContent: "center", width: "100%" }}
                      >
                        Join WhatsApp group ↗
                      </a>
                    </div>

                    <form
                      role="tabpanel"
                      aria-label="Join the research community"
                      onSubmit={submitComm}
                      style={{
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-md)",
                        background: "var(--surface)",
                        padding: "1.6rem",
                      }}
                    >
                      <div className="display-md" style={{ fontSize: "1.05rem", color: "var(--accent-bright)" }}>
                        Join the NM Research Community
                      </div>
                      <p style={{ marginTop: 6, fontSize: "0.88rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
                        Be the first to hear about grants, events and partnerships.
                      </p>
                      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                        <label>
                          <span style={labelStyle}>Full name *</span>
                          <input required name="name" placeholder="Full name" className="input" style={inputStyle} aria-label="Full name" />
                        </label>
                        <label>
                          <span style={labelStyle}>Contact number *</span>
                          <input required name="contact" placeholder="+91 …" className="input" style={inputStyle} aria-label="Contact number" />
                        </label>
                        <label>
                          <span style={labelStyle}>Email *</span>
                          <input required type="email" name="email" placeholder="you@example.com" className="input" style={inputStyle} aria-label="Email" />
                        </label>
                        <label>
                          <span style={labelStyle}>Affiliation</span>
                          <input name="affiliation" placeholder="University, institute or company" className="input" style={inputStyle} aria-label="Affiliation" />
                        </label>
                        <label>
                          <span style={labelStyle}>Area of interest</span>
                          <select name="field" defaultValue="" className="input" style={inputStyle} aria-label="Area of interest">
                            <option value="">Select a domain…</option>
                            {domains.slice(0, 6).map((d) => (
                              <option key={d.id} value={d.title}>{d.title}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <input name="hp" className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                      <button
                        type="submit"
                        disabled={commStatus === "sending"}
                        className="btn btn-primary"
                        style={{ marginTop: 20, width: "100%", justifyContent: "center", fontSize: 11.5 }}
                      >
                        {buttonLabel(commStatus, "Join community")} <span className="btn-arrow">→</span>
                      </button>
                      <StatusBox status={commStatus} successMsg="Request received — welcome aboard." />
                    </form>
                  </div>
                </Reveal>
              )}
            </div>
          </div>

<style>{`
            @media (max-width: 900px) {
              .contact-grid { display: flex !important; flex-direction: column; }
              .form-grid { grid-template-columns: 1fr !important; }
              .comm-grid { grid-template-columns: 1fr !important; }
            }
            @media (max-width: 560px) {
              .contact-tabs { grid-template-columns: 1fr !important; }
              .contact-tabs button { min-height: 44px; white-space: normal; }
            }
          `}</style>
        </div>
      </section>
    </>
  );
}
