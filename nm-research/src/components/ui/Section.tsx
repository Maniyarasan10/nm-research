"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { MOTION } from "@/lib/motion";
import Reveal from "./Reveal";
import TextReveal from "./TextReveal";

/* SectionLabel choreography: index → rule draw → label text. */
const labelStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const growX: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.45, ease: MOTION.ease } },
};

const labelItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.base, ease: MOTION.ease },
  },
};

export function SectionLabel({
  index,
  children,
  center = false,
  className = "",
}: {
  index?: string;
  children: ReactNode;
  center?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const cls = `flex items-center gap-3 mb-5 ${
    center ? "justify-center" : ""
  } ${className}`;

  if (reduce) {
    return (
      <div className={cls}>
        {index && <span className="eyebrow text-accent">{index}</span>}
        <span className="sig-rule" aria-hidden="true" />
        <span className="eyebrow uppercase">{children}</span>
      </div>
    );
  }

  return (
    <motion.div
      className={cls}
      variants={labelStagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
    >
      {index && (
        <motion.span variants={labelItem} className="eyebrow text-accent">
          {index}
        </motion.span>
      )}
      <motion.span variants={growX} className="sig-rule origin-left" aria-hidden="true" />
      <motion.span variants={labelItem} className="eyebrow uppercase">
        {children}
      </motion.span>
    </motion.div>
  );
}

export function SectionTitle({
  children,
  center = false,
  className = "",
}: {
  children: ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <h2
      className={`display text-[2rem] sm:text-[2.6rem] lg:text-[3rem] text-ink ${
        center ? "mx-auto text-center" : ""
      } ${className}`}
    >
      {children}
    </h2>
  );
}

export function SectionHeading({
  index,
  label,
  title,
  subtitle,
  center = false,
}: {
  index?: string;
  label: string;
  title: ReactNode;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <SectionLabel index={index} center={center} className="uppercase">
        {label}
      </SectionLabel>
      <TextReveal
        as="h2"
        delay={0.1}
        className={`display text-[2rem] sm:text-[2.6rem] lg:text-[3rem] text-ink ${
          center ? "mx-auto text-center" : ""
        }`}
      >
        {title}
      </TextReveal>
      {subtitle && (
        <Reveal direction="none" delay={0.2}>
          <p
            className={`mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-ink-2 ${
              center ? "mx-auto" : ""
            }`}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* Ruled editorial divider row: label on left, hairline filling the rest */
export function RuledIntro({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-baseline gap-4 ${className}`}>
      <span className="eyebrow shrink-0">{label}</span>
      <span className="hairline" aria-hidden="true" />
      <span className="text-sm text-ink-2">{children}</span>
    </div>
  );
}
