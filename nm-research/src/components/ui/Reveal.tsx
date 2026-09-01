"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { MOTION } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
}

export default function Reveal({
  children,
  delay = 0,
  className,
  direction = "up",
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  // Reduced-motion users get static content — no transform, no fade-in.
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "none" ? 0 : direction === "left" || direction === "right" ? 0 : 40,
      x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: MOTION.slow, delay, ease: MOTION.ease }}
    >
      {children}
    </motion.div>
  );
}
