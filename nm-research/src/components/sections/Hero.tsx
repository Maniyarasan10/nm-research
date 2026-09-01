"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { totalSubjects } from "@/data/domains";
import TextReveal from "@/components/ui/TextReveal";

const metrics = [
  { value: "500+", label: "SCI / Scopus publications" },
  { value: "150+", label: "Academic & industry partners" },
  { value: "15+", label: "Years of research excellence" },
  { value: "8", label: "Countries of operation" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      {/* restrained paper texture — barely-there grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(23,25,29,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(23,25,29,0.05) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 90% 90% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 90% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pt-36 pb-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-44 lg:pb-24">
        {/* Masthead copy */}
        <div className="text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-3">
            <span className="sig-rule" aria-hidden="true" />
            <span className="eyebrow uppercase">
              {siteConfig.founded} · Global research network
            </span>
          </div>

          <TextReveal
            as="h1"
            className="display text-[2.9rem] leading-[1.02] text-ink sm:text-[3.6rem] lg:text-[4.2rem]"
          >
            An institute where research is{" "}
            <span className="emph text-accent">measured,</span> not merely
            claimed.
          </TextReveal>

          <p className="mx-auto mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink-2 lg:mx-0">
            {siteConfig.fullName} provides end-to-end research services,
            publication support, PhD assistance and global conferences — built
            on reproducible methods, verified metrics and open collaboration
            across 150+ institutions in 8 countries.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link href="/research" className="btn btn-primary group">
              Explore the research index
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/membership" className="btn btn-ghost">
              View membership
            </Link>
          </div>
        </div>

        {/* Institutional fact sheet — data speaks, not decoration */}
        <div className="relative">
          <div className="border border-rule bg-surface shadow-[0_1px_2px_rgba(23,25,29,0.04),0_20px_50px_-24px_rgba(23,25,29,0.28)]">
            <div className="flex items-center justify-between border-b border-rule px-6 py-4">
              <span className="eyebrow uppercase">Institute overview</span>
              <span className="inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-wider text-green">
                <span className="h-1.5 w-1.5 rounded-full bg-green" />
                Verified
              </span>
            </div>

            <div className="grid grid-cols-2">
              {metrics.map((m, i) => (
                <div
                  key={m.label}
                  className={`px-6 py-7 ${
                    i % 2 === 0 ? "border-r border-rule" : ""
                  } ${i < 2 ? "border-b border-rule" : ""}`}
                >
                  <div className="eyebrow text-accent tabular">{m.value}</div>
                  <div className="mt-1.5 text-[0.82rem] font-medium leading-snug text-ink-2">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-rule px-6 py-4">
              <span className="eyebrow uppercase">Subject index</span>
              <span className="font-mono text-[0.72rem] text-brand tabular">
                {totalSubjects.toLocaleString("en-IN")} subjects
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
