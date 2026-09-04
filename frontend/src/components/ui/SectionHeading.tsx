import type { ReactNode, RefObject } from "react";
import { Reveal } from "@/components/ui/Reveal";
import SplitReveal from "@/components/ui/SplitReveal";

export default function SectionHeading({
  index,
  label,
  title,
  subtitle,
  center = false,
  triggerRef,
}: {
  index?: string;
  label: string;
  title: ReactNode;
  subtitle?: string;
  center?: boolean;
  triggerRef?: RefObject<HTMLElement | null>;
}) {
  return (
    <div
      style={
        center
          ? { textAlign: "center", maxWidth: 720, marginInline: "auto" }
          : { maxWidth: 820 }
      }
    >
      <Reveal>
        {index && (
          <span
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              color: "var(--text-faint)",
              display: "block",
              marginBottom: 18,
            }}
          >
            {index} — {label.toUpperCase()}
          </span>
        )}
        <div
          className="mono eyebrow"
          style={{ marginBottom: 20, justifyContent: center ? "center" : "flex-start", display: "flex" }}
        >
          <span style={{ width: 28, height: 1, background: "var(--accent)" }} />
          {label}
        </div>
      </Reveal>
      <SplitReveal as="h2" className="display-lg" triggerRef={triggerRef}>
        {title}
      </SplitReveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p
            style={{
              marginTop: 22,
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              fontSize: "1rem",
              ...(center ? { marginInline: "auto" } : {}),
              maxWidth: 620,
            }}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}