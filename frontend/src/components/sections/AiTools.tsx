import { useState } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/ui/Reveal";

type ToolId = "pdf-summarizer" | "citation-generator" | "research-roadmap";

const TOOLS: {
  id: ToolId;
  title: string;
  desc: string;
  mark: string;
  ready: boolean;
}[] = [
  {
    id: "pdf-summarizer",
    title: "AI PDF Summarizer",
    desc: "Upload any paper and receive structured summaries and key findings.",
    mark: "NM-01",
    ready: false,
  },
  {
    id: "citation-generator",
    title: "AI Citation Generator",
    desc: "Auto-generate citations in APA, MLA or IEEE from a DOI or URL.",
    mark: "NM-02",
    ready: false,
  },
  {
    id: "research-roadmap",
    title: "Research Roadmap",
    desc: "Build a step-by-step roadmap aligned to your goals and timeline.",
    mark: "NM-03",
    ready: false,
  },
];

export default function AiTools() {
  const [active, setActive] = useState<ToolId | null>(null);
  const activeTool = TOOLS.find((t) => t.id === active) ?? null;

  return (
    <Reveal>
      <div className="ai-tools-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
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