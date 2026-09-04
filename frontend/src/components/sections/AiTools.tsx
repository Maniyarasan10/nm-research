import { useState } from "react";
import { Link } from "react-router-dom";
import { domains } from "@/data/site";
import {
  generateTopics,
  type ExpertiseLevel,
  type GeneratedTopic,
} from "@/lib/topicGenerator";
import { Reveal } from "@/components/ui/Reveal";

type ToolId = "topic-generator" | "pdf-summarizer" | "citation-generator" | "research-roadmap";

const TOOLS: {
  id: ToolId;
  title: string;
  desc: string;
  mark: string;
  ready: boolean;
}[] = [
  {
    id: "topic-generator",
    title: "AI Topic Generator",
    desc: "Synthesises novel research topics from your domain, expertise level and focus keyword.",
    mark: "NM-01",
    ready: true,
  },
  {
    id: "pdf-summarizer",
    title: "AI PDF Summarizer",
    desc: "Upload any paper and receive structured summaries and key findings.",
    mark: "NM-02",
    ready: false,
  },
  {
    id: "citation-generator",
    title: "AI Citation Generator",
    desc: "Auto-generate citations in APA, MLA or IEEE from a DOI or URL.",
    mark: "NM-03",
    ready: false,
  },
  {
    id: "research-roadmap",
    title: "Research Roadmap",
    desc: "Build a step-by-step roadmap aligned to your goals and timeline.",
    mark: "NM-04",
    ready: false,
  },
];

export default function AiTools() {
  const [active, setActive] = useState<ToolId | null>(null);
  const activeTool = TOOLS.find((t) => t.id === active) ?? null;

  return (
    <Reveal>
      <div className="ai-tools-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActive(tool.id)}
            aria-label={`Open ${tool.title}`}
            style={{
              textAlign: "left",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              background: "var(--surface)",
              padding: "1.4rem",
              cursor: "pointer",
              transition: "border-color .4s var(--ease-out), background-color .4s var(--ease-out)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              height: "100%",
            }}
            className="ai-tool"
          >
            <span
              className="mono"
              style={{ fontSize: 10, letterSpacing: "0.16em", color: tool.ready ? "var(--accent-bright)" : "var(--text-faint)" }}
            >
              {tool.mark} · {tool.ready ? "LIVE" : "SOON"}
            </span>
            <span className="display-md" style={{ fontSize: "1.15rem", color: "var(--text-primary)", lineHeight: 1.2 }}>
              {tool.title}
            </span>
            <span style={{ fontSize: "0.86rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
              {tool.desc}
            </span>
          </button>
        ))}
      </div>

      {activeTool?.ready && <TopicGeneratorModal onClose={() => setActive(null)} />}
      {activeTool && !activeTool.ready && (
        <ComingSoonModal title={activeTool.title} onClose={() => setActive(null)} />
      )}

      <style>{`
        .ai-tool:hover { border-color: var(--accent-line) !important; background: rgba(133,21,9,0.05) !important; }
        @media (max-width: 980px) {
          .ai-tools-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .ai-tools-grid { grid-template-columns: 1fr !important; }
          .tg-grid { grid-template-columns: 1fr !important; }
          .modal-card { padding: 1.25rem !important; }
        }
      `}</style>
    </Reveal>
  );
}

/* ---------- Shared modal shell ---------- */
function ModalShell({
  onClose,
  label,
  title,
  children,
  width = 640,
}: {
  onClose: () => void;
  label: string;
  title: string;
  children: React.ReactNode;
  width?: number;
}) {
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
        background: "rgba(16,16,16,0.8)",
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
        aria-label={title}
        className="modal-card"
        style={{
          width: "100%",
          maxWidth: width,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "var(--bg-tertiary)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-md)",
          padding: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
          <div>
            <div className="mono eyebrow">{label}</div>
            <h3 className="display-md" style={{ marginTop: 8, fontSize: "1.5rem" }}>{title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="mono"
            style={{ fontSize: 14, color: "var(--text-muted)", padding: "0.4rem 0.6rem", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)" }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------- Topic generator ---------- */
function TopicGeneratorModal({ onClose }: { onClose: () => void }) {
  const [domainId, setDomainId] = useState<string>(domains[0]?.id ?? "");
  const [level, setLevel] = useState<ExpertiseLevel>("phd");
  const [focus, setFocus] = useState("");
  const [topics, setTopics] = useState<GeneratedTopic[] | null>(null);
  const [generating, setGenerating] = useState(false);

  const run = () => {
    setGenerating(true);
    window.setTimeout(() => {
      setTopics(generateTopics({ domainId, level, focus: focus || undefined }, 4));
      setGenerating(false);
    }, 500);
  };

  const label = { display: "block", fontSize: 10.5, letterSpacing: "0.14em", color: "var(--text-muted)", textTransform: "uppercase" as const, marginBottom: 8 };

  return (
    <ModalShell
      onClose={onClose}
      label="AI Research Tool"
      title="AI Topic Generator"
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="tg-grid">
        <label>
          <span style={label}>Research domain</span>
          <select value={domainId} onChange={(e) => setDomainId(e.target.value)} className="input" aria-label="Research domain">
            {domains.map((d) => (
              <option key={d.id} value={d.id}>{d.title}</option>
            ))}
          </select>
        </label>
        <label>
          <span style={label}>Expertise level</span>
          <select value={level} onChange={(e) => setLevel(e.target.value as ExpertiseLevel)} className="input" aria-label="Expertise level">
            <option value="undergrad">Undergraduate</option>
            <option value="postgrad">Postgraduate</option>
            <option value="phd">PhD</option>
            <option value="postdoc">Postdoctoral</option>
          </select>
        </label>
        <label style={{ gridColumn: "1 / -1" }}>
          <span style={label}>Focus keyword (optional)</span>
          <input
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            placeholder="e.g. nanomaterials, machine learning, wastewater…"
            className="input"
            aria-label="Focus keyword"
          />
        </label>
      </div>

      <button onClick={run} disabled={generating} className="btn btn-primary" style={{ marginTop: 20, width: "100%" }}>
        {generating ? "Generating…" : "Generate topics"}
      </button>

      <div style={{ marginTop: 28 }}>
        {topics ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="eyebrow">Generated topics</div>
            {topics.map((t, i) => (
              <div
                key={t.title}
                style={{
                  border: "1px solid var(--border-subtle)",
                  borderLeft: "2px solid var(--accent)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--surface)",
                  padding: "1.1rem 1.2rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ fontWeight: 500, lineHeight: 1.4 }}>{t.title}</span>
                  <span className="mono" style={{ fontSize: 10, color: "var(--text-faint)", whiteSpace: "nowrap" }}>0{i + 1}</span>
                </div>
                <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span className="tag tag-accent">{t.angle}</span>
                </div>
                <p className="mono" style={{ marginTop: 10, fontSize: 10.5, lineHeight: 1.7, color: "var(--text-muted)" }}>
                  {t.why}
                </p>
              </div>
            ))}
            <Link to="/contact" onClick={onClose} className="btn btn-line" style={{ marginTop: 8, fontSize: 11.5, paddingInline: 0, alignSelf: "flex-start" }}>
              Discuss a topic with our experts <span className="btn-arrow">→</span>
            </Link>
          </div>
        ) : (
          <div
            style={{
              border: "1px dashed var(--border-strong)",
              borderRadius: "var(--radius-sm)",
              padding: "2.2rem 1.5rem",
              textAlign: "center",
            }}
          >
            <div className="mono eyebrow" style={{ justifyContent: "center", display: "flex" }}>NM RESEARCH · ONLINE SYNTHESIS</div>
            <p style={{ marginTop: 14, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              Pick a domain and level, then generate — topics are synthesised from
              the NM subject index and scope guidance.
            </p>
          </div>
        )}
      </div>
    </ModalShell>
  );
}

/* ---------- Coming soon ---------- */
function ComingSoonModal({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <ModalShell onClose={onClose} label="AI Research Tool · In development" title={title} width={460}>
      <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
        This tool is being built. Let us know you'd like early access and we'll
        prioritise it for you.
      </p>
      <div className="early-access-row" style={{ marginTop: 22, display: "flex", gap: 12 }}>
        <Link to="/contact" onClick={onClose} className="btn btn-primary" style={{ fontSize: 11.5, flex: 1 }}>
          Request early access
        </Link>
        <button onClick={onClose} className="btn btn-ghost" style={{ fontSize: 11.5 }}>
          Back
        </button>
      </div>
      <style>{`
        @media (max-width: 480px) {
          .early-access-row { flex-direction: column; align-items: stretch !important; }
          .early-access-row .btn { text-align: center; width: 100%; }
        }
      `}</style>
    </ModalShell>
  );
}