"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import PayModal from "@/components/modals/PayModal";
import { plans, formatINR } from "@/data/plans";

export default function Membership() {
  const [pay, setPay] = useState<{ plan: string; amount: number } | null>(null);

  return (
    <section id="membership" className="py-16 lg:py-24 bg-surface-2/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          center
          index="04"
          label="Membership plans"
          title={
            <>
              Choose your <span className="emph">research journey</span>
            </>
          }
          subtitle="Select the membership that matches your research ambitions and unlock exclusive benefits."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.tier} delay={i * 0.1} className="h-full">
              <div
                className={`relative flex h-full flex-col ${
                  plan.featured ? "card-featured" : "card"
                } p-7`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow">
                    {plan.badge}
                  </span>
                )}
                {plan.featured && (
                  <span className="absolute inset-x-0 top-0 h-[3px] bg-accent" />
                )}

                <div
                  className={`eyebrow ${
                    plan.featured ? "text-accent" : "text-green"
                  }`}
                >
                  {plan.tier}
                </div>
                <div
                  className={`mt-3 display text-4xl font-semibold tabular ${
                    plan.featured ? "text-accent" : "text-brand"
                  }`}
                >
                  <span className="text-2xl">₹</span>
                  {formatINR(plan.price)}
                  <span className="text-base font-normal text-ink-3">/year</span>
                </div>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.benefits.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-sm text-ink-2"
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                          plan.featured
                            ? "bg-accent text-white"
                            : "bg-accent-dim text-accent"
                        }`}
                      >
                        <Check size={11} strokeWidth={3} />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setPay({ plan: plan.tier, amount: plan.price })}
                  className={`mt-7 w-full btn ${
                    plan.featured ? "btn-accent" : "btn-ghost"
                  }`}
                >
                  {plan.featured ? "Join Platinum" : `Join ${plan.tier}`}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {pay && (
          <PayModal
            open={!!pay}
            planName={pay.plan}
            amount={pay.amount}
            onClose={() => setPay(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
