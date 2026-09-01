"use client";

import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";
import { SectionHeading } from "@/components/ui/Section";

const collabValues = [
  "Research Training",
  "Scientific Writing",
  "Publication Support",
  "Mentorship",
  "Interdisciplinary Projects",
  "Academic Skill Building",
  "Global Networking",
  "Career Development",
  "International Exposure",
];

export default function Collaborations({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section id="collaborations" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {showHeading && (
          <SectionHeading
            index="03"
            label="Global network"
            title={
              <>
                Collaborations &{" "}
                <span className="emph">global partnerships</span>
              </>
            }
          />
        )}

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="card flex h-full flex-col justify-center p-8">
              <div className="eyebrow uppercase text-accent">Network scale</div>
              <div className="mt-3 display text-6xl font-semibold tabular text-brand">
                <Counter target={150} suffix="+" />
              </div>
              <div className="mt-3 text-[0.95rem] font-semibold text-ink">
                Academic, research & industry partners
              </div>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-2">
                Universities, research organizations and industry collaborators
                across the world.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card p-8">
              <p className="text-[0.95rem] leading-relaxed text-ink-2">
                Our collaborations provide students and research scholars with
                opportunities for research training, scientific writing,
                publication support, mentorship, and interdisciplinary research
                projects. They also enhance academic skills, global networking,
                career development, and exposure to international research and
                innovation.
              </p>
              <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                {collabValues.map((v) => (
                  <div
                    key={v}
                    className="flex items-center gap-2 text-sm font-medium text-ink-2"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {v}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
