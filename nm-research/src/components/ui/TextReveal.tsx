"use client";

import { motion, useReducedMotion } from "framer-motion";
import { createElement, type ReactNode } from "react";
import { MOTION } from "@/lib/motion";

interface TextRevealProps {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  /** Extra delay before the reveal starts (for orchestration). */
  delay?: number;
  /** Seconds between successive word masks (string children only). */
  stagger?: number;
}

/**
 * Signature reveal — masked typography.
 *
 * Headlines rise out of a hairline mask on scroll instead of fading:
 * plain-string children reveal word by word, rich (ReactNode) children
 * reveal as one block. Always SSR-safe, and fully static for
 * reduced-motion users (content is simply never masked).
 */
export default function TextReveal({
  children,
  as = "div",
  className,
  delay = 0,
  stagger = 0.035,
}: TextRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return createElement(as, { className }, children);
  }

  const base = {
    duration: MOTION.slow,
    ease: MOTION.ease,
    delay,
  } as const;

  let content: ReactNode;

  if (typeof children === "string") {
    const words = children.split(" ");
    content = words.map((word, i) => (
      <span key={i} className="reveal-mask">
        <motion.span
          className="inline-block"
          initial={{ y: "115%" }}
          whileInView={{ y: "0%" }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ ...base, delay: delay + i * stagger }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      </span>
    ));
  } else {
    content = (
      <span className="reveal-mask reveal-mask--block">
        <motion.span
          className="block"
          initial={{ y: "115%" }}
          whileInView={{ y: "0%" }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={base}
        >
          {children}
        </motion.span>
      </span>
    );
  }

  return createElement(as, { className }, content);
}