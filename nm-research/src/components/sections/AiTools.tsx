"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  FileText,
  BookOpen,
  Map,
  RefreshCw,
  Check,
  X,
  ArrowRight,
  Wand2,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { domains } from "@/data/domains";
import {
  generateTopics,
  type ExpertiseLevel,
  type GeneratedTopic,
} from "@/lib/topicGenerator";

const TOOLS = [
  {
    id: "topic-generator",
    title: "AI Topic Generator",
    desc: "Generates novel research topics from your domain and expertise level.",
    icon: <Sparkles size={19} />,
    ready: true,
  },
  {
    id: "pdf-summarizer",
    title: "AI PDF Summarizer",
    desc: "Upload any paper and receive structured summaries and key findings.",
    icon: <FileText size={19} />,
    ready: false,
  },
  {
    id: "citation-generator",
    title: "AI Citation Generator",
    desc: "Auto-generate citations in APA, MLA, or IEEE from a DOI or URL.",
    icon: <BookOpen size={19} />,
    ready: false,
  },
  {
    id: "research-roadmap",
    title: "Research Roadmap",
    desc: "Build a step-by-step roadmap aligned to your goals and timeline.",
    icon: <Map size={19} />,
    ready: false,
  },
];

function TopicGeneratorPanel({ onClose }: { onClose: () => void }) {
  const [domainId, setDomainId] = useState<string>(domains[0].id);
  const [level, setLevel] = useState<ExpertiseLevel>("phd");
  const [focus, setFocus] = useState("");
  const [topics, setTopics] = useState<GeneratedTopic[] | null>(null);
  const [generating, setGenerating] = useState(false);

  const domainAccent = useMemo(
    () => domains.find((d) => d.id === domainId)?.accent ?? "#14243d",
    [domainId],
  );

  const run = () => {
    setGenerating(true);
    // Small artificial delay so the "generating" state is perceptible.
    window.setTimeout(() => {
      setTopics(generateTopics({ domainId, level, focus: focus || undefined }, 4));
      setGenerating(false);
    }, 450);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.2 }}
        role="dialog"
        aria-modal="true"
        aria-label="AI Topic Generator"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-rule bg-white p-6"
      >
        <div className="flex items-start justify-between border-b border-rule pb-4">
          <div>
            <div className="eyebrow">AI Research Tool</div>
            <h3 className="mt-1 font-display text-2xl font-semibold text-ink">
              AI Topic Generator
            </h3>
            <p className="mt-1 text-sm text-ink-2">
              Generate novel, scope-appropriate research topics across the NM
              subject index.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-ink-3 hover:bg-surface-2 hover:text-ink"
            aria-label="Close topic generator"
          >
            <X size={20} />
          </button>
        </div>

        {/* Inputs */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="eyebrow mb-1.5 block">Research domain</span>
            <select
              value={domainId}
              onChange={(e) => setDomainId(e.target.value)}
              className="input"
              aria-label="Research domain"
            >
              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="eyebrow mb-1.5 block">Expertise level</span>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as ExpertiseLevel)}
              className="input"
              aria-label="Expertise level"
            >
              <option value="undergrad">Undergraduate</option>
              <option value="postgrad">Postgraduate</option>
              <option value="phd">PhD</option>
              <option value="postdoc">Postdoctoral</option>
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className="eyebrow mb-1.5 block">
              Focus keyword <span className="normal-case text-ink-3">(optional)</span>
            </span>
            <input
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder="e.g. nanomaterials, machine learning, wastewater…"
              className="input"
              aria-label="Focus keyword"
            />
          </label>
        </div>

        <button
          onClick={run}
          disabled={generating}
          className="btn btn-primary mt-5 w-full"
        >
          {generating ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <Wand2 size={16} />
          )}
          {generating ? "Generating…" : "Generate topics"}
        </button>

        {/* Results */}
        <div className="mt-6">
          {topics ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="eyebrow">Generated topics</span>
                <span className="hairline" aria-hidden="true" />
              </div>
              {topics.map((t, i) => (
                <div
                  key={t.title}
                  className="border border-rule bg-surface-2 p-4"
                  style={{ borderLeft: `3px solid ${domainAccent}` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-display text-[15px] font-semibold leading-snug text-ink">
                      {t.title}
                    </div>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-ink-3">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-navy/10 px-2 py-0.5 font-mono text-[10px] text-brand">
                      {t.angle}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-ink-2">{t.why}</p>
                </div>
              ))}
              <Link
                href="/contact"
                onClick={onClose}
                className="mt-2 inline-flex items-center gap-2 bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-mid"
              >
                Discuss a topic with our experts
                <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="border border-dashed border-rule bg-surface-2/50 px-5 py-8 text-center">
              <Sparkles size={22} className="mx-auto text-accent" />
              <p className="mt-2 text-sm text-ink-2">
                Pick a domain and level, then generate — topics are synthesized
                from the NM subject index and scope guidance.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ComingSoonPanel({
  tool,
  onClose,
}: {
  tool: (typeof TOOLS)[number];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.2 }}
        role="dialog"
        aria-modal="true"
        aria-label={`${tool.title} — coming soon`}
        className="w-full max-w-md border border-rule bg-white p-6 text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center bg-navy text-white">
          {tool.icon}
        </div>
        <div className="eyebrow mt-4">AI Research Tool</div>
        <h3 className="mt-1 font-display text-xl font-semibold text-ink">
          {tool.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-2">
          This tool is in active development. Let us know you&apos;d like early
          access and we&apos;ll prioritise it for you.
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <Link
            href="/contact"
            onClick={onClose}
            className="btn btn-primary"
          >
            Request early access
          </Link>
          <button onClick={onClose} className="btn btn-ghost">
            Back
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AiTools() {
  const [active, setActive] = useState<null | "topic-generator" | string>(null);

  const activeTool = TOOLS.find((t) => t.id === active) ?? null;

  return (
    <Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map((tool, i) => (
          <Reveal key={tool.id} delay={i * 0.05} className="h-full">
            <button
              onClick={() => setActive(tool.id)}
              className="card group flex h-full w-full flex-col items-start gap-3 p-4 text-left"
              aria-label={`Open ${tool.title}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-rule bg-surface-2 text-brand transition-colors group-hover:bg-navy group-hover:text-white">
                {tool.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-semibold text-ink">
                    {tool.title}
                  </span>
                  {tool.ready ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-soft px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-green">
                      <Check size={9} strokeWidth={3} /> Live
                    </span>
                  ) : (
                    <span className="rounded-full bg-accent-dim px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent">
                      Soon
                    </span>
                  )}
                </div>
                <div className="mt-1 text-xs leading-relaxed text-ink-2">
                  {tool.desc}
                </div>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {active === "topic-generator" && (
          <TopicGeneratorPanel onClose={() => setActive(null)} />
        )}
        {activeTool && active !== "topic-generator" && (
          <ComingSoonPanel tool={activeTool} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </Reveal>
  );
}
