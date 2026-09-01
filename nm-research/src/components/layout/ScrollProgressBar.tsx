"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export default function ScrollProgressBar() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReduced) return null;

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-green"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
