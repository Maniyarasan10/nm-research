"use client";

import type { ReactNode } from "react";
import Reveal from "./Reveal";
import TextReveal from "./TextReveal";

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
  return (
    <div
      className={`flex items-center gap-3 mb-5 ${
        center ? "justify-center" : ""
      } ${className}`}
    >
      {index && <span className="eyebrow text-accent">{index}</span>}
      <span className="sig-rule" aria-hidden="true" />
      <span className="eyebrow uppercase">{children}</span>
    </div>
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
      <Reveal direction="none">
        <SectionLabel index={index} center={center} className="uppercase">
          {label}
        </SectionLabel>
      </Reveal>
      <TextReveal
        as="h2"
        delay={0.06}
        className={`display text-[2rem] sm:text-[2.6rem] lg:text-[3rem] text-ink ${
          center ? "mx-auto text-center" : ""
        }`}
      >
        {title}
      </TextReveal>
      {subtitle && (
        <Reveal direction="none" delay={0.12}>
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
