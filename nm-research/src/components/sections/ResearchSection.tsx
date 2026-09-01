"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  ChevronDown,
  BookOpen,
  X,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import DomainIcon from "@/components/ui/DomainIcon";
import AiTools from "@/components/sections/AiTools";
import { domains, totalSubjects } from "@/data/domains";

function ResearchSectionInner() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [activeDomain, setActiveDomain] = useState<string>("all");
  const [openDomain, setOpenDomain] = useState<string | null>(domains[0]?.id ?? null);
  const [selected, setSelected] = useState<{ name: string; slug: string } | null>(null);

  const q = query.trim().toLowerCase();

  // Functional filtering across subjects, retaining domain membership.
  const indexed = useMemo(() => {
    return domains.flatMap((d) =>
      d.subjects.map((s) => ({ ...s, domainId: d.id, domainTitle: d.title })),
    );
  }, []);

  const matchingSubjects = useMemo(() => {
    if (!q) return indexed;
    return indexed.filter((s) => s.name.toLowerCase().includes(q));
  }, [q, indexed]);

  const visibleDomains = useMemo(() => {
    return domains.filter(
      (d) => activeDomain === "all" || d.id === activeDomain,
    );
  }, [activeDomain]);

  return (
    <section id="research" className="py-16 lg:py-24 bg-surface-2/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Research Ecosystem & Domains"
          title={
            <>
              Find your subject across the <span className="emph">research index</span>
            </>
          }
          subtitle={`${totalSubjects} subjects across ${domains.length} research domains — searchable and fully supported by NM Foundation.`}
        />

        {/* Fielded subject search + domain filter */}
        <Reveal className="mt-10">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search subjects — e.g. Nanotechnology, Polymer, Virology…"
                aria-label="Search subjects"
                className="input h-[46px] pl-11 pr-10"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 border border-rule bg-white px-3 py-3 lg:w-56">
              <SlidersHorizontal size={15} className="shrink-0 text-ink-3" />
              <select
                value={activeDomain}
                onChange={(e) => setActiveDomain(e.target.value)}
                className="w-full bg-transparent text-sm text-ink focus:outline-none"
                aria-label="Filter by domain"
              >
                <option value="all">All domains</option>
                {domains.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.shortTitle}
                  </option>
                ))}
              </select>
            </div>

            <div className="border border-rule bg-white px-4 py-3 font-mono text-xs text-ink-2 tabular">
              {matchingSubjects.length} of {indexed.length} subjects
            </div>
          </div>
        </Reveal>

          {/* AI tools — interactive, functional row */}
          <div className="mt-8">
            <AiTools />
          </div>

        <Reveal className="mt-12">
          <div className="flex items-center gap-3">
            <span className="eyebrow">Core Subjects</span>
            <span className="hairline" aria-hidden="true" />
            <span className="eyebrow">
              {visibleDomains.length} domain{visibleDomains.length === 1 ? "" : "s"}
            </span>
          </div>
        </Reveal>

        {/* Domains accordion */}
        <div className="mt-6 space-y-3">
          {visibleDomains.map((domain) => {
            const domainSubjects = matchingSubjects.filter(
              (s) => s.domainId === domain.id,
            );
            if (q && domainSubjects.length === 0) return null;
            const open = openDomain === domain.id;
            const showCount = q ? domainSubjects.length : domain.subjects.length;

            return (
              <Reveal key={domain.id}>
                <div className="overflow-hidden border border-rule bg-white">
                  <button
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => setOpenDomain(open ? null : domain.id)}
                    aria-expanded={open}
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-rule bg-surface-2 text-brand">
                        <DomainIcon icon={domain.icon} className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="font-display text-[15px] font-semibold text-ink">
                          {domain.title}
                        </div>
                        <div className="font-mono text-[11px] text-ink-3 tabular">
                          {showCount} subject{showCount === 1 ? "" : "s"} · {domain.id.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-ink-3 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                      >
                        <div className="border-t border-rule px-5 py-4">
                          {domainSubjects.length === 0 ? (
                            <p className="text-sm text-ink-3">
                              No subjects match your search in this domain.
                            </p>
                          ) : (
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                              {domainSubjects.map((s) => (
                                <button
                                  key={s.slug}
                                  onClick={() => setSelected({ name: s.name, slug: s.slug })}
                                  className="flex items-center justify-between border border-rule bg-surface px-3 py-2 text-left text-[13px] font-medium text-ink transition-colors hover:border-navy hover:text-brand"
                                >
                                  {s.name}
                                  <span className="text-ink-3" aria-hidden="true">
                                    →
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}

          {q && matchingSubjects.length === 0 && (
            <Reveal>
              <div className="border border-dashed border-rule bg-white px-5 py-10 text-center">
                <div className="font-mono text-xs uppercase tracking-wider text-ink-3">
                  No matches
                </div>
                <p className="mx-auto mt-3 max-w-md text-sm text-ink-2">
                  Nothing in the index matches “{query}”. Try a broader keyword,
                  or contact us — subject coverage is expanded on request.
                </p>
              </div>
            </Reveal>
          )}
        </div>

        {/* Metric strip — no decorative glow */}
        <Reveal className="mt-10">
          <div className="grid grid-cols-2 border border-rule bg-navy text-white lg:grid-cols-4">
            {[
              { value: `${totalSubjects}+`, label: "Subjects covered" },
              { value: `${domains.length}`, label: "Research domains" },
              { value: "58", label: "Refereed journals" },
              { value: "24/7", label: "Support availability" },
            ].map((m, i) => (
              <div
                key={m.label}
                className={`px-5 py-6 ${
                  i % 2 === 0 ? "border-r border-white/15" : ""
                } ${i < 2 ? "border-b border-white/15 lg:border-b-0" : ""} ${
                  i === 1 ? "lg:border-r" : ""
                } ${i === 2 ? "lg:border-r" : ""}`}
              >
                <div className="font-display text-2xl font-semibold tabular text-gold-light">
                  {m.value}
                </div>
                <div className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-white/60">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Subject modal */}
      <AnimatePresence>
        {selected && <SubjectModal subject={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}

export default function ResearchSection() {
  return (
    <Suspense fallback={null}>
      <ResearchSectionInner />
    </Suspense>
  );
}

function SubjectModal({
  subject,
  onClose,
}: {
  subject: { name: string; slug: string };
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
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
        aria-label={`${subject.name} — research support`}
        className="w-full max-w-lg border border-rule bg-white p-6"
      >
        <div className="flex items-start justify-between border-b border-rule pb-4">
          <div>
            <div className="eyebrow">Research Subject</div>
            <h2 className="mt-1 font-display text-xl font-semibold text-ink">
              {subject.name}
            </h2>
            <p className="mt-1 font-mono text-[11px] text-ink-3">
              NM Group Research Foundation · {subject.slug.toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-ink-3 hover:bg-surface-2 hover:text-ink"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 flex items-start gap-4 border border-rule bg-surface-2 p-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center bg-navy text-white">
            <BookOpen size={26} />
          </span>
          <div>
            <div className="font-display text-[15px] font-semibold text-ink">
              Guidance & Support
            </div>
            <p className="mt-1 text-sm text-ink-2">
              Our experts can guide your research in{" "}
              {subject.name} — topic framing, methodology, publication and
              beyond. Tell us your goal and we&apos;ll respond with a tailored
              plan.
            </p>
            <Link
              href="/contact"
              onClick={onClose}
              className="mt-3 inline-flex items-center gap-2 bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-mid"
            >
              Request guidance
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex w-full items-center justify-between border border-rule bg-white px-4 py-3 text-left text-sm font-semibold text-ink transition-colors hover:bg-surface-2"
            aria-expanded={open}
          >
            What support is available for the {subject.name} domain?
            <ChevronDown
              size={16}
              className={`shrink-0 text-ink-3 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="border border-rule border-t-0 bg-surface px-4 py-3 text-sm leading-relaxed text-ink-2">
                  Research paper writing and editing, publication support (SCI,
                  Scopus, Web of Science), PhD assistance, methodology design,
                  literature review and analytical services — tailored to{" "}
                  {subject.name}.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
