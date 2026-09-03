"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { siteConfig } from "@/lib/config";
import { totalSubjects } from "@/data/domains";
import Counter from "@/components/ui/Counter";
import RotatingWords from "@/components/ui/RotatingWords";
import { MOTION } from "@/lib/motion";

const metrics = [
  { target: 500, suffix: "+", label: "SCI / Scopus publications" },
  { target: 150, suffix: "+", label: "Academic & industry partners" },
  { target: 15, suffix: "+", label: "Years of research excellence" },
  { target: 8, suffix: "", label: "Countries of operation" },
];

const ROTATIONS = ["measured,", "verified,", "quantified,", "peer-reviewed,"];

/* Whole-hero choreography: columns slot in left-then-right. */
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.06 } },
};

/* Left column: eyebrow → headline → lead → CTA. */
const column: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* Small row helpers for the eyebrow and headline accents. */
const row: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.slow, ease: MOTION.ease },
  },
};

const fadeUpSmall: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.base, ease: MOTION.ease },
  },
};

const growX: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.45, ease: MOTION.ease } },
};

const maskWord: Variants = {
  hidden: { y: "115%" },
  visible: { y: "0%", transition: { duration: MOTION.slow, ease: MOTION.ease } },
};

/* Word-by-word masked reveal so long lines wrap naturally on mobile. */
function MaskedWords({ words }: { words: string[] }) {
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="reveal-mask">
          <motion.span variants={maskWord} className="inline-block">
            {w}{" "}
          </motion.span>
        </span>
      ))}
    </>
  );
}

/* Fact sheet: cells rise in sequence while numbers count up. */
const panelStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const cell: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.base, ease: MOTION.ease },
  },
};

export default function Hero() {
  const reduce = useReducedMotion();

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

      <motion.div
        className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pt-36 pb-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-44 lg:pb-24"
        variants={container}
        initial={reduce ? false : "hidden"}
        animate={reduce ? undefined : "visible"}
      >
        {/* Masthead copy */}
        <motion.div
          variants={column}
          className="text-center lg:text-left"
        >
          <motion.div variants={row} className="mb-6 inline-flex items-center gap-3">
            <motion.span variants={growX} className="sig-rule origin-left" aria-hidden="true" />
            <motion.span variants={fadeUpSmall} className="eyebrow uppercase">
              {siteConfig.founded} · Global research network
            </motion.span>
          </motion.div>

          <motion.h1
            aria-label="An institute where research is measured, not merely claimed."
            variants={row}
            className="display text-[2.9rem] leading-[1.02] text-ink sm:text-[3.6rem] lg:text-[4.2rem]"
          >
            <MaskedWords words={["An", "institute", "where", "research", "is"]} />
            <RotatingWords
              words={ROTATIONS}
              delay={0.42}
              className="emph text-accent"
            />
            &nbsp;
            <MaskedWords words={["not", "merely", "claimed."]} />
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink-2 lg:mx-0"
          >
            {siteConfig.fullName} provides end-to-end research services,
            publication support, PhD assistance and global conferences — built
            on reproducible methods, verified metrics and open collaboration
            across 150+ institutions in 8 countries.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Link href="/research" className="btn btn-primary group">
              Explore the research index
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/membership" className="btn btn-ghost">
              View membership
            </Link>
          </motion.div>
        </motion.div>

        {/* Institutional fact sheet — data speaks, not decoration */}
        <motion.div variants={fadeUp} className="relative">
          <div className="border border-rule bg-surface shadow-[0_1px_2px_rgba(23,25,29,0.04),0_20px_50px_-24px_rgba(23,25,29,0.28)]">
            <div className="flex items-center justify-between border-b border-rule px-6 py-4">
              <span className="eyebrow uppercase">Institute overview</span>
              <span
                className="inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-wider text-green"
                aria-label="Verified"
              >
                {reduce ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-green" />
                    Verified
                  </>
                ) : (
                  <>
                    <span className="relative inline-flex h-1.5 w-1.5">
                      <motion.span
                        className="absolute inline-flex h-full w-full rounded-full bg-green opacity-75"
                        animate={{ scale: [1, 2.4], opacity: [0.55, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                        aria-hidden="true"
                      />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green" />
                    </span>
                    Verified
                  </>
                )}
              </span>
            </div>

            <motion.div variants={panelStagger} className="grid grid-cols-2">
              {metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  variants={cell}
                  className={`px-6 py-7 ${
                    i % 2 === 0 ? "border-r border-rule" : ""
                  } ${i < 2 ? "border-b border-rule" : ""}`}
                >
                  <div className="eyebrow text-accent tabular">
                    <Counter target={m.target} suffix={m.suffix} duration={1800} />
                  </div>
                  <div className="mt-1.5 text-[0.82rem] font-medium leading-snug text-ink-2">
                    {m.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="flex items-center justify-between border-t border-rule px-6 py-4">
              <span className="eyebrow uppercase">Subject index</span>
              <span className="font-mono text-[0.72rem] text-brand tabular">
                {totalSubjects.toLocaleString("en-IN")} subjects
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}