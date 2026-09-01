import type { ReactNode } from "react";
import TextReveal from "./TextReveal";
import { siteConfig } from "@/lib/config";

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
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[1px] w-10 bg-accent" aria-hidden="true" />
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-white/60">
                {label}
              </span>
            </div>
            <TextReveal as="h1" className="display text-4xl font-medium leading-[1.08] text-white sm:text-5xl">
              {title}
            </TextReveal>
            {subtitle && (
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/72">
                {subtitle}
              </p>
            )}
          </div>

          {refCode && (
            <span className="hidden shrink-0 pt-1 font-mono text-[11px] tracking-widest text-white/45 sm:block">
              {refCode}
            </span>
          )}
        </div>

        {/* Publication dateline — edition-style furniture under the banner */}
        <div className="mt-11 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/10 pt-4 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-white/40">
          <span>{label}</span>
          <span className="hidden sm:inline">{siteConfig.founded} · Independent research wing</span>
          <span>{refCode ?? "NM Research"}</span>
        </div>
      </div>
    </section>
  );
}
