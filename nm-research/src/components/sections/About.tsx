"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";
import { SectionHeading } from "@/components/ui/Section";
import { siteConfig } from "@/lib/config";

const stats = [
  { target: 150, suffix: "+", label: "Academic & industry partners" },
  { target: 15, suffix: "+", label: "Years of research excellence" },
  { target: 500, suffix: "+", label: "SCI / Scopus publications" },
  { target: 8, suffix: "", label: "Countries of operation" },
];

export default function About() {
  return (
    <section id="about" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Founder + presence column */}
          <div className="space-y-6">
            <Reveal>
              <div className="card p-7">
                <div className="flex items-center gap-5">
                  <Image
                    src="/images/logo.webp"
                    alt="Dr. Mathivanan Nallathambi"
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover ring-1 ring-rule"
                  />
                  <div>
                    <div className="display text-xl font-semibold text-ink">
                      Dr. Mathivanan Nallathambi
                    </div>
                    <div className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-green">
                      Founder & CEO
                    </div>
                    <div className="mt-0.5 font-mono text-[0.66rem] text-ink-3">
                      M.Sc. · Ph.D. · PDF
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3 border-t border-rule pt-5">
                  <a href="tel:+918667334697" className="flex items-center gap-3 text-sm text-ink-2 hover:text-brand">
                    <Phone size={15} className="text-accent" /> +91 8667334697
                  </a>
                  <a href="tel:+919578170536" className="flex items-center gap-3 text-sm text-ink-2 hover:text-brand">
                    <Phone size={15} className="text-accent" /> +91 9578170536
                  </a>
                  <a href="mailto:hello.nmassociation@gmail.com" className="flex items-center gap-3 text-sm text-ink-2 hover:text-brand">
                    <Mail size={15} className="text-accent" /> hello.nmassociation@gmail.com
                  </a>
                  <a href="mailto:mathichem777@gmail.com" className="flex items-center gap-3 text-sm text-ink-2 hover:text-brand">
                    <Mail size={15} className="text-accent" /> mathichem777@gmail.com
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="card p-7">
                <div className="mb-4 eyebrow uppercase">Global presence</div>
                <div className="flex flex-wrap gap-2">
                  {siteConfig.globalTags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="my-4 hairline" aria-hidden="true" />
                <div className="mb-4 eyebrow uppercase">India — state presence</div>
                <div className="flex flex-wrap gap-2">
                  {siteConfig.stateTags.map((t) => (
                    <span key={t} className="tag !border-accent/30 !text-accent">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Vision column */}
          <div>
            <SectionHeading
              index="01"
              label="About the foundation"
              title={
                <>
                  A vision for{" "}
                  <span className="emph">global research excellence</span>
                </>
              }
              subtitle="A globally recognized research and innovation foundation conducting high-impact research while empowering the next generation of researchers, scientists and innovators."
            />

            <Reveal delay={0.15}>
              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-rule bg-rule">
                {siteConfig.values.map((v) => (
                  <div
                    key={v}
                    className="flex items-center gap-2.5 bg-surface px-4 py-3 text-sm font-medium text-ink-2"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {v}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="bg-surface px-4 py-5 text-center">
                    <div className="display text-3xl font-semibold tabular text-brand">
                      <Counter target={s.target} suffix={s.suffix} />
                    </div>
                    <div className="mt-1 font-mono text-[0.62rem] uppercase tracking-wide text-ink-3">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-8 bg-navy-dark px-7 py-7 text-white">
                <div className="mb-3 inline-flex items-center gap-2 eyebrow text-green">
                  <span className="h-1.5 w-1.5 rounded-full bg-green" />
                  Global impact
                </div>
                <p className="text-[0.95rem] leading-relaxed text-white/80">
                  {siteConfig.fullName} has established collaborative
                  relationships with more than 150 academic institutions,
                  universities, research organizations, and industry partners
                  across the world.
                </p>
                <Link
                  href="/about"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-gold-light"
                >
                  Learn more about us
                  <ArrowRight size={15} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
