import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import PlanJoinButton from "@/components/modals/PlanJoinButton";
import Contact from "@/components/sections/Contact";
import { plans, getPlanBySlug, formatINR } from "@/data/plans";

export function generateStaticParams() {
  return plans.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const plan = getPlanBySlug(slug);
    if (!plan) return { title: "Plan not found" };
    return {
      title: `${plan.tier} Membership | ${formatINR(plan.price)}/year`,
      description: `${plan.tier} membership — ${formatINR(
        plan.price,
      )}/year with ${plan.benefits.length} benefits from NM Group of Industries and Research Foundation.`,
    };
  });
}

export default async function PlanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plan = getPlanBySlug(slug);
  if (!plan) notFound();

  const index = plans.findIndex((p) => p.slug === plan.slug);
  const next = plans[(index + 1) % plans.length];
  const prev = plans[(index - 1 + plans.length) % plans.length];

  return (
    <>
      <PageHero
        label="Membership Plan"
        refCode={`NM / ${plan.tier.toUpperCase()}`}
        title={plan.tier}
        subtitle={`${plan.benefits.length} membership benefits — ${formatINR(
          plan.price,
        )}/year. Annual research support crafted for your journey.`}
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Benefits */}
            <div>
              <div className="mb-5 eyebrow uppercase text-accent">
                Everything included
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {plan.benefits.map((b) => (
                  <li
                    key={b}
                    className="card flex items-start gap-3 p-4 text-[0.92rem] font-medium text-ink-2"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-dim text-accent">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <div className="mb-4 eyebrow uppercase text-accent">
                  Compare plans
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[prev, next].map((p) => (
                    <Link key={p.slug} href={`/membership/${p.slug}`} className="card group p-6">
                      <div className="flex items-center justify-between">
                        <span className={`eyebrow ${plan.slug === p.slug ? "text-accent" : "text-ink-3"}`}>
                          {p.tier}
                        </span>
                        <ArrowRight size={16} className="text-ink-3 transition-transform group-hover:translate-x-1" />
                      </div>
                      <div className="mt-2 display text-2xl font-semibold tabular text-brand">
                        {formatINR(p.price)}
                        <span className="text-sm font-normal text-ink-3">/year</span>
                      </div>
                      <div className="mt-2 text-[0.85rem] text-ink-2">
                        {p.benefits.length} benefits
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Price card */}
            <aside>
              <div className={`${plan.featured ? "card-featured" : "card"} p-7`}>
                {plan.badge && (
                  <span className="tag !bg-accent !text-white !border-transparent !mb-4">
                    {plan.badge}
                  </span>
                )}
                <div className="eyebrow uppercase">{plan.tier}</div>
                <div className="mt-2 display text-4xl font-semibold tabular text-brand">
                  ₹{formatINR(plan.price)}
                  <span className="text-base font-normal text-ink-3">/year</span>
                </div>
                <p className="mt-3 text-[0.88rem] leading-relaxed text-ink-2">
                  Pay securely by UPI. Your membership activates after payment
                  confirmation.
                </p>
                <div className="mt-5">
                  <PlanJoinButton
                    plan={plan.tier}
                    amount={plan.price}
                    label={plan.featured ? "Join Platinum" : `Join ${plan.tier}`}
                  />
                </div>
                <p className="mt-4 text-center font-mono text-[0.68rem] uppercase tracking-wider text-ink-3">
                  Billed annually · Cancel anytime
                </p>
              </div>
            </aside>
          </div>

          <div className="mt-12">
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-2 hover:text-brand"
            >
              <ArrowLeft size={14} /> All membership plans
            </Link>
          </div>
        </div>
      </section>

      <div className="mb-6">
        <Contact showHeading={false} />
      </div>
    </>
  );
}
