"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import TextReveal from "./TextReveal";
import { siteConfig } from "@/lib/config";
import { MOTION } from "@/lib/motion";

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.04 } },
};

const rowStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.slow, ease: MOTION.ease },
  },
};

const growX: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.45, ease: MOTION.ease } },
};

const labelItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.base, ease: MOTION.ease },
  },
};

export default function PageHero({
  label,
  refCode,
  title,
  subtitle,
}: {
  label: string;
  refCode?: string;
  title: ReactNode;
  subtitle?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-navy-dark pt-28 pb-14 text-white lg:pt-36 lg:pb-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 90% 100% at 50% 0%, black 55%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 100% at 50% 0%, black 55%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-start justify-between gap-6"
          variants={stagger}
          initial={reduce ? false : "hidden"}
          animate={reduce ? undefined : "visible"}
        >
          <div className="max-w-3xl">
            <motion.div
              variants={rowStagger}
              className="mb-5 flex items-center gap-3"
            >
              <motion.span
                variants={growX}
                className="h-[1px] w-10 bg-accent origin-left"
                aria-hidden="true"
              />
              <motion.span
                variants={labelItem}
                className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-white/60"
              >
                {label}
              </motion.span>
            </motion.div>

            <motion.div variants={fadeUp}>
              <TextReveal
                as="h1"
                delay={0.12}
                className="display text-4xl font-medium leading-[1.08] text-white sm:text-5xl"
              >
                {title}
              </TextReveal>
            </motion.div>

            {subtitle && (
              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/72"
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {refCode && (
            <motion.span
              variants={fadeUp}
              className="hidden shrink-0 pt-1 font-mono text-[11px] tracking-widest text-white/45 sm:block"
            >
              {refCode}
            </motion.span>
          )}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial={reduce ? false : "hidden"}
          animate={reduce ? undefined : "visible"}
          className="mt-11 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/10 pt-4 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-white/40"
        >
          <span>{label}</span>
          <span className="hidden sm:inline">
            {siteConfig.founded} · Independent research wing
          </span>
          <span>{refCode ?? "NM Research"}</span>
        </motion.div>
      </div>
    </section>
  );
}