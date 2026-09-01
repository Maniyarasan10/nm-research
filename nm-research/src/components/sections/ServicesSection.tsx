"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  PenTool,
  Award,
  GraduationCap,
  Lightbulb,
  Microscope,
  Globe,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { services } from "@/data/services";

const iconMap: Record<string, LucideIcon> = {
  pen: PenTool,
  award: Award,
  graduation: GraduationCap,
  lightbulb: Lightbulb,
  microscope: Microscope,
  globe: Globe,
};

export default function ServicesSection({
  showHeading = true,
}: {
  showHeading?: boolean;
}) {
  return (
    <section id="services" className="py-20 lg:py-28 bg-surface-2/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {showHeading && (
          <SectionHeading
            index="02"
            label="Service catalogue"
            title={
              <>
                Six working services,{" "}
                <span className="emph">one workflow</span> — from topic to
                publication.
              </>
            }
            subtitle="End-to-end research assistance. Every engagement is a documented, reproducible process — not a vague promise."
          />
        )}

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? PenTool;
            const index = String(i + 1).padStart(2, "0");
            return (
              <Reveal key={service.title} delay={(i % 3) * 0.06} className="h-full">
                <Link
                  href={`/services/${service.slug}`}
                  className="card group flex h-full flex-col p-6"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[0.68rem] tracking-widest text-ink-3">
                      {index}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-md border border-rule bg-surface-2 text-brand transition-colors group-hover:border-accent/40 group-hover:bg-accent-dim group-hover:text-accent">
                      <Icon size={19} strokeWidth={1.6} />
                    </span>
                  </div>

                  <h3 className="mt-5 display text-xl font-semibold text-ink">
                    {service.title}
                  </h3>
                  <div className="mt-3 hairline" aria-hidden="true" />
                  <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-2">
                    {service.description}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-5">
                    <span className="mr-auto inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-wider text-brand group-hover:text-accent">
                      View details
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                    {service.tags.slice(0, 2).map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
