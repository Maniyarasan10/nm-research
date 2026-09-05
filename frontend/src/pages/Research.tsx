import { lazy, Suspense, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHero from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import SceneShell from "@/components/3d/SceneShell";
import { domains, totalSubjects } from "@/data/site";
import { usePageMeta } from "@/hooks/usePageMeta";

const DNAHelix = lazy(() => import("@/components/3d/DNAHelix"));

/** Slim kebab-case slugify matching the source site's per-subject PDF naming. */
function subjectSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/[&+/.,·#]+/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const pdfUrl = (name: string) =>
  `${import.meta.env.BASE_URL}pdfs/${subjectSlug(name)}-detailed.pdf`;

export default function Research() {
  usePageMeta(
    "Research Index | NM Research",
    "Search the NM research index — 11 domains and 250+ subjects fully supported from topic framing to publication and beyond.",
  );
  const [params] = useSearchParams();
  const initialDomain = params.get("domain") ?? "all";
  const [query, setQuery] = useState("");
  const [activeDomain, setActiveDomain] = useState<string>(initialDomain);
  const [openDomain, setOpenDomain] = useState<string | null>(initialDomain !== "all" ? initialDomain : domains[0]?.id ?? null);
  const [selected, setSelected] = useState<string | null>(null);

  const q = query.trim().toLowerCase();

  const indexed = useMemo(
    () =>
      domains.flatMap((d) =>
        d.subjects.map((s) => ({ name: s, domainId: d.id, domainTitle: d.title })),
      ),
    []
  );

  const matching = useMemo(() => {
    if (!q) return indexed;
    return indexed.filter((s) => s.name.toLowerCase().includes(q));
  }, [q, indexed]);

  const visibleDomains = useMemo(
    () => domains.filter((d) => activeDomain === "all" || d.id === activeDomain),
    [activeDomain]
  );

  const selectedSubject = selected ? indexed.find((s) => s.name === selected) : null;

  return (
    <>
      <PageHero
        label="Research index"
        crumb="NM Research"
        title={
          <>
            {`${domains.length} DOMAINS ·`}
            <span style={{ color: "var(--accent)" }}>
              {`${totalSubjects}+ SUBJECTS`}
            </span>
          </>
        }
        subtitle={`Every subject in the NM index is searchable and fully supported by the foundation — from topic framing to publication and beyond.`}
      />

      <section style={{ position: "relative", paddingBlock: "4rem 6rem", overflow: "hidden" }}>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* Search + filter */}
          <Reveal>
            <div
              className="research-controls"
              style={{ marginTop: 40, display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 12, alignItems: "stretch" }}
            >
              <div style={{ position: "relative" }}>
                <span
                  aria-hidden="true"
                  className="mono"
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-faint)" }}
                >
                  ⌕
                </span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search subjects — e.g. Nanotechnology, Polymer, Virology…"
                  aria-label="Search subjects"
                  className="input"
                  style={{ paddingLeft: 40 }}
                />
              </div>
              <select
                value={activeDomain}
                onChange={(e) => setActiveDomain(e.target.value)}
                aria-label="Filter by domain"
                className="input"
              >
                <option value="all">All domains</option>
                {domains.map((d) => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
              <div
                className="mono"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 1.4rem",
                  fontSize: 11.5,
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  whiteSpace: "nowrap",
                }}
              >
                {matching.length} of {indexed.length} subjects
              </div>
            </div>
          </Reveal>

          {/* Domains */}
          <Reveal>
            <div style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 14 }}>
              <span className="eyebrow">Core subjects</span>
              <span style={{ flex: 1, height: 1, background: "var(--hairline)" }} aria-hidden="true" />
              <span className="eyebrow">{visibleDomains.length} domain{visibleDomains.length === 1 ? "" : "s"}</span>
            </div>
          </Reveal>

          <div style={{ marginTop: 16 }}>
            {visibleDomains.map((domain) => {
              const domainSubjects = matching.filter((s) => s.domainId === domain.id);
              if (q && domainSubjects.length === 0) return null;
              const open = openDomain === domain.id;

              return (
                <Reveal key={domain.id}>
                  <div
                    style={{
                      border: "1px solid var(--border-subtle)",
                      marginBottom: 10,
                      borderRadius: "var(--radius-sm)",
                      background: open ? "var(--surface)" : "transparent",
                      transition: "background-color .3s, border-color .3s",
                    }}
                  >
                    <button
                      onClick={() => setOpenDomain(open ? null : domain.id)}
                      aria-expanded={open}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 18,
                        width: "100%",
                        textAlign: "left",
                        padding: "1.2rem 1.4rem",
                        cursor: "pointer",
                      }}
                    >
                      <span className="mono" style={{ fontSize: 11, color: "var(--text-faint)", width: 40 }}>
                        {String(domains.indexOf(domain) + 1).padStart(2, "0")}
                      </span>
                      <span className="display-md" style={{ flex: 1, fontSize: "clamp(1.05rem, 2.4vw, 1.45rem)", color: open ? "var(--accent-bright)" : "var(--text-primary)", transition: "color .3s" }}>
                        {domain.title}
                      </span>
                      <span className="mono" style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                        {domainSubjects.length} subjects
                      </span>
                      <span
                        style={{
                          color: "var(--accent)",
                          transform: open ? "rotate(45deg)" : "rotate(0)",
                          transition: "transform .3s var(--ease-out)",
                          fontSize: "1.2rem",
                        }}
                      >
                        +
                      </span>
                    </button>

                    {open && (
                      <div style={{ borderTop: "1px solid var(--hairline)", padding: "1.4rem" }}>
                        <div className="tags-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                          {domainSubjects.map((s) => (
                            <button
                              key={s.name}
                              onClick={() => setSelected(s.name)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 10,
                                textAlign: "left",
                                background: "var(--bg-secondary)",
                                border: "1px solid var(--border-subtle)",
                                borderRadius: "var(--radius-sm)",
                                padding: "0.7rem 0.9rem",
                                fontSize: "0.84rem",
                                color: "var(--text-secondary)",
                                cursor: "pointer",
                                transition: "border-color .3s, color .3s",
                              }}
                              className="subject-chip"
                            >
                              {s.name}
                              <span style={{ color: "var(--text-faint)" }} aria-hidden="true">→</span>
                            </button>
                          ))}
                        </div>
                        <style>{`
                          @media (max-width: 860px) { .tags-grid { grid-template-columns: 1fr 1fr !important; } }
                          @media (max-width: 520px) { .tags-grid { grid-template-columns: 1fr !important; } }
                        `}</style>
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}

            {q && matching.length === 0 && (
              <div
                style={{
                  border: "1px dashed var(--border-strong)",
                  borderRadius: "var(--radius-md)",
                  padding: "3rem 1.5rem",
                  textAlign: "center",
                }}
              >
                <div className="mono eyebrow" style={{ justifyContent: "center", display: "flex" }}>No matches</div>
                <p style={{ marginTop: 12, maxWidth: 420, marginInline: "auto", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  Nothing in the index matches "{query}". Try a broader keyword, or
                  contact us — subject coverage is expanded on request.
                </p>
              </div>
            )}
          </div>

          {/* Metric strip */}
          <Reveal>
            <div
              style={{
                marginTop: 48,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
              }}
              className="research-metrics"
            >
              {[
                { value: `${totalSubjects}+`, label: "Subjects covered" },
                { value: `${domains.length}`, label: "Research domains" },
                { value: "58", label: "Refereed journals" },
                { value: "24/7", label: "Support availability" },
              ].map((m, i) => (
                <div
                  key={m.label}
                  style={{
                    padding: "1.7rem 1.4rem",
                    background: i === 0 ? "rgba(133,21,9,0.08)" : "var(--surface)",
                    borderRight: i < 3 ? "1px solid var(--hairline)" : "none",
                    textAlign: "center",
                  }}
                >
                  <div className="display-md" style={{ fontSize: "1.6rem", color: "var(--accent-bright)" }}>{m.value}</div>
                  <div className="mono" style={{ marginTop: 6, fontSize: 9.5, letterSpacing: "0.1em", color: "var(--text-muted)" }}>{m.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <style>{`
            @media (max-width: 860px) {
              .research-controls { grid-template-columns: 1fr !important; }
              .research-metrics { grid-template-columns: 1fr 1fr !important; }
            }
          `}</style>
        </div>

        <SceneShell
          style={{
            width: "42vw",
            maxWidth: 560,
            height: 540,
            top: "6vw",
            right: "-6vw",
          }}
        >
          <Suspense fallback={null}>
            <DNAHelix />
          </Suspense>
        </SceneShell>
      </section>

      {/* Subject modal */}
      {selectedSubject && (
        <div
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
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
            aria-label={`${selectedSubject.name} — research support`}
            style={{
              width: "100%",
              maxWidth: 560,
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius-md)",
              padding: "1.8rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, borderBottom: "1px solid var(--hairline)", paddingBottom: 16 }}>
              <div>
                <div className="mono eyebrow">Research subject</div>
                <h3 className="display-md" style={{ marginTop: 8, fontSize: "1.4rem" }}>{selectedSubject.name}</h3>
                <div className="mono" style={{ marginTop: 6, fontSize: 10, color: "var(--text-muted)" }}>
                  {selectedSubject.domainTitle.toUpperCase()}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close dialog"
                className="mono"
                style={{ fontSize: 14, color: "var(--text-muted)", padding: "0.4rem 0.6rem", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", height: 36 }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop: 20, border: "1px solid var(--border-subtle)", background: "var(--surface)", borderRadius: "var(--radius-sm)", padding: "1.4rem" }}>
              <div className="display-md" style={{ fontSize: "1rem" }}>Guidance &amp; support</div>
              <p style={{ marginTop: 8, fontSize: "0.92rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
                Our experts can guide your research in {selectedSubject.name} — topic
                framing, methodology, publication and beyond. Tell us your goal and
                we'll respond with a tailored plan.
              </p>
              <Link
                to="/contact"
                onClick={() => setSelected(null)}
                className="btn btn-primary"
                style={{ marginTop: 18, fontSize: 11.5 }}
              >
                Request guidance <span className="btn-arrow">→</span>
              </Link>
            </div>

            <div style={{ marginTop: 20, border: "1px solid var(--accent-line)", background: "linear-gradient(160deg, rgba(133,21,9,0.10), var(--surface) 60%)", borderRadius: "var(--radius-sm)", padding: "1.4rem" }}>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Detailed theory &amp; case studies</div>
              <p style={{ marginTop: 6, fontSize: "0.88rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
                A structured deep-dive PDF for {selectedSubject.name} — theory,
                methodology and applied case studies, ready to read or download.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                <a
                  href={pdfUrl(selectedSubject.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ fontSize: 11.5, display: "inline-flex", alignItems: "center", gap: 8 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M2 8V6a2 2 0 0 1 2-2h4l2 2h10a2 2 0 0 1 2 2v0" />
                    <path d="M2 9h20v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9z" />
                  </svg>
                  View PDF
                </a>
                <a
                  href={pdfUrl(selectedSubject.name)}
                  download={`${selectedSubject.name} - Detailed.pdf`}
                  className="btn btn-line"
                  style={{ fontSize: 11.5, display: "inline-flex", alignItems: "center", gap: 8 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 3v12M7 11l5 5 5-5M5 20h14" />
                  </svg>
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}