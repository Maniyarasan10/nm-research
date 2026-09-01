import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft, BookOpen } from "lucide-react";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import ReusableSteps from "@/components/ui/ReusableSteps";
import Contact from "@/components/sections/Contact";
import { domains, getDomainById } from "@/data/domains";

export function generateStaticParams() {
  return domains.map((d) => ({ id: d.id }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  return params.then(({ id }) => {
    const domain = getDomainById(id);
    if (!domain) return { title: "Domain not found" };
    return {
      title: `${domain.title} | Research Subjects`,
      description: `Research subjects and support available across ${domain.title} — ${domain.subjects.length} subjects supported by NM Group.`,
    };
  });
}

export default async function DomainPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const domain = getDomainById(id);
  if (!domain) notFound();

  const others = domains.filter((d) => d.id !== domain.id);

  return (
    <>
      <PageHero
        label="Research Domain"
        refCode={`NM / ${domain.id.toUpperCase()}`}
        title={domain.title}
        subtitle={`${domain.subjects.length} supported subjects across this domain — each backed by full research, publication and support services.`}
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr]">
            {/* Subjects */}
            <div>
              <div className="mb-5 flex items-center justify-between">
                <span className="eyebrow uppercase text-accent">
                  Supported subjects
                </span>
                <span className="font-mono text-[0.72rem] text-ink-3 tabular">
                  {domain.subjects.length} of {domain.subjects.length}
                </span>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {domain.subjects.map((s) => (
                  <div key={s.slug} className="card flex items-center gap-3 p-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-rule bg-surface-2 text-brand">
                      <BookOpen size={15} strokeWidth={1.7} />
                    </span>
                    <span className="text-[0.88rem] font-medium text-ink-2">
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Aside: engage + other domains */}
            <aside className="space-y-6">
              <div className="card p-7">
                <div className="eyebrow uppercase text-accent">Guidance & support</div>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-2">
                  Our experts support {domain.title} research — topic framing,
                  methodology, publication and beyond. Share your goal and we&apos;ll
                  respond with a tailored plan.
                </p>
                <Link href="/contact" className="btn btn-primary group mt-5 w-full">
                  Request guidance
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="card p-7">
                <div className="mb-4 eyebrow uppercase">Other domains</div>
                <div className="space-y-1">
                  {others.map((d) => (
                    <Link
                      key={d.id}
                      href={`/research/${d.id}`}
                      className="flex items-center justify-between border-b border-rule px-2 py-3 text-sm font-medium text-ink-2 transition-colors last:border-b-0 hover:text-brand"
                    >
                      {d.shortTitle}
                      <ArrowRight size={15} className="text-ink-3" />
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-12">
            <Link
              href="/research"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-2 hover:text-brand"
            >
              <ArrowLeft size={14} /> All research domains
            </Link>
          </div>
        </div>
      </section>

      <ReusableSteps />
      <Contact showHeading={false} />
    </>
  );
}
