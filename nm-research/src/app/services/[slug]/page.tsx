import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import ReusableSteps from "@/components/ui/ReusableSteps";
import Contact from "@/components/sections/Contact";
import { services, getServiceBySlug } from "@/data/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const service = getServiceBySlug(slug);
    if (!service) return { title: "Service not found" };
    return {
      title: service.title,
      description: service.description,
    };
  });
}

const highlights: Record<string, string[]> = {
  "research-paper-writing": [
    "Research paper writing & review articles",
    "Methodology design and proper citations",
    "Editing, proofreading & APA/IEEE formatting",
    "Plagiarism check and originality report",
  ],
  "publication-support": [
    "Targeted journal shortlisting (SCI/SCIE/Scopus)",
    "Submission readiness & formatting per journal",
    "Response-to-reviewers collaboration",
    "UGC CARE and Web of Science support",
  ],
  "phd-assistance": [
    "Topic selection and synopsis support",
    "Literature review & research gap analysis",
    "Methodology design for your study",
    "Thesis writing and defence preparation",
  ],
  "research-consulting": [
    "Free initial topic and work-plan discussion",
    "1:1 sessions with domain experts",
    "Personalized research roadmaps",
    "Book publication guidance",
  ],
  "analytical-services": [
    "Advanced characterization (XRD, SEM, TEM, FTIR)",
    "Surface area, UV-Vis, EIS and more",
    "Professional data analysis & interpretation",
    "Certified analytical reports",
  ],
  "global-conferences": [
    "International & national conference organization",
    "Workshops and webinars",
    "Paper presentation opportunities",
    "Networking with researchers & industry leaders",
  ],
};

const steps: { label: string; title: string; desc: string }[] = [
  {
    label: "01",
    title: "Consult",
    desc: "Share your topic, stage and goals for a free initial discussion.",
  },
  {
    label: "02",
    title: "Plan",
    desc: "Receive a defined scope, timeline and deliverable roadmap.",
  },
  {
    label: "03",
    title: "Deliver",
    desc: "Work with named experts to a documented, reproducible process.",
  },
];

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const h = highlights[service.slug] ?? service.tags;
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero
        label="Service Detail"
        refCode={`NM / ${service.slug.replace(/-/g, " ").toUpperCase()}`}
        title={service.title}
        subtitle={service.description}
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Highlights */}
            <div>
              <div className="mb-5 eyebrow uppercase text-accent">
                What this service covers
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {h.map((item) => (
                  <li
                    key={item}
                    className="card flex items-start gap-3 p-4 text-[0.92rem] font-medium text-ink-2"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-dim text-accent">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-2">
                {service.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>

              {/* Shared delivery process */}
              <div className="mt-12">
                <div className="mb-6 eyebrow uppercase text-accent">
                  How we deliver
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {steps.map((s) => (
                    <div key={s.label} className="card p-5">
                      <span className="font-mono text-xs tracking-widest text-accent">
                        {s.label}
                      </span>
                      <div className="mt-2 display text-lg font-semibold text-ink">
                        {s.title}
                      </div>
                      <p className="mt-1.5 text-[0.85rem] leading-relaxed text-ink-2">
                        {s.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/contact"
                className="btn btn-primary mt-10 group"
              >
                Start with {service.title.split(" ")[0]}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Related services */}
            <aside>
              <div className="card p-7">
                <div className="mb-4 eyebrow uppercase">Other services</div>
                <div className="space-y-1">
                  {others.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="flex items-center justify-between border-b border-rule px-2 py-3 text-sm font-medium text-ink-2 transition-colors last:border-b-0 hover:text-brand"
                    >
                      {s.title}
                      <ArrowRight size={15} className="text-ink-3" />
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-2 hover:text-brand"
            >
              <ArrowLeft size={14} /> All services
            </Link>
          </div>
        </div>
      </section>

      <ReusableSteps />
      <Contact showHeading={false} />
    </>
  );
}
