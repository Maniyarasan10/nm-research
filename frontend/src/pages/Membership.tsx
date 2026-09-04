import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Counter from "@/components/ui/Counter";
import PayModal from "@/components/modals/PayModal";
import { Reveal } from "@/components/ui/Reveal";
import SceneShell from "@/components/3d/SceneShell";
import { plans, paymentNote } from "@/data/plans";
import { site } from "@/data/site";
import { usePageMeta } from "@/hooks/usePageMeta";

const AtomOrbit = lazy(() => import("@/components/3d/AtomOrbit"));

export default function Membership() {
  usePageMeta(
    "Membership | NM Research",
    "Choose your research journey — Community, Platinum, or Prime. Annual memberships unlock publications, conferences, mentorship and more.",
  );
  const [pay, setPay] = useState<{ plan: string; amount: number } | null>(null);

  return (
    <>
      <PageHero
        label="Membership"
        crumb="NM Research"
        title={
          <>
            CHOOSE YOUR{" "}
            <span style={{ color: "var(--accent)" }}>RESEARCH JOURNEY</span>
          </>
        }
        subtitle="Three annual plans unlock publications, conferences, mentorship and more — select the tier that matches your research ambitions."
      />

      <section style={{ paddingBlock: "4rem 3rem" }}>
        <div className="container">
          <SectionHeading
            index="01"
            label="Plans"
            title={
              <>
                COMMUNITY · PLATINUM ·{" "}
                <span style={{ color: "var(--accent)" }}>PRIME</span>
              </>
            }
            subtitle={`All plans are billed annually, cancel anytime, and valid for one year from activation. Payment is confirmed within 24 hours.`}
          />

          <div className="plans-grid" style={{ marginTop: 44, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {plans.map((plan, i) => (
              <Reveal key={plan.slug} delay={i * 0.08}>
                <div
                  className={plan.featured ? "card-featured" : "card"}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "2rem",
                    height: "100%",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div
                      className="mono"
                      style={{ fontSize: 11, letterSpacing: "0.18em", color: plan.featured ? "var(--accent-bright)" : "var(--text-muted)", textTransform: "uppercase" }}
                    >
                      {plan.tier}
                    </div>
                    {plan.badge && (
                      <span className={plan.featured ? "tag tag-accent" : "tag"}>{plan.badge}</span>
                    )}
                  </div>

                  <div className="display-md" style={{ marginTop: 18, fontSize: "2.1rem", color: plan.featured ? "var(--accent-bright)" : "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>
                    ₹<Counter target={plan.price} />
                    <span className="mono" style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 400 }}>
                      /year
                    </span>
                  </div>

                  <p style={{ marginTop: 12, fontSize: "0.88rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
                    {plan.summary}
                  </p>

                  <ul style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10, flex: 1, listStyle: "none", padding: 0 }}>
                    {plan.benefits.map((b) => (
                      <li key={b} style={{ display: "flex", gap: 12, fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: 400 }}>
                        <span
                          aria-hidden="true"
                          style={{
                            marginTop: 7,
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: plan.featured ? "var(--accent)" : "var(--text-faint)",
                            flexShrink: 0,
                          }}
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setPay({ plan: plan.tier, amount: plan.price })}
                    className={plan.featured ? "btn btn-primary" : "btn btn-ghost"}
                    style={{ marginTop: 26, width: "100%", justifyContent: "center", fontSize: 11.5 }}
                  >
                    {plan.featured ? "Join Platinum" : `Join ${plan.tier}`}{" "}
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Payment note */}
      <section style={{ position: "relative", paddingBlock: "3rem 6rem", borderTop: "1px solid var(--hairline)", overflow: "hidden" }}>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <SectionHeading
            index="02"
            label="How to join"
            title={
              <>
                THREE STEPS TO{" "}
                <span style={{ color: "var(--accent)" }}>ACTIVATION</span>
              </>
            }
          />
          <div
            className="payment-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem, 4vw, 4rem)", marginTop: 40, maxWidth: 760 }}
          >
            <div>
              <Reveal delay={0.1}>
                <ol className="mono" style={{ display: "flex", flexDirection: "column", gap: 14, listStyle: "none", padding: 0, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  {paymentNote.how.map((step, i) => (
                    <li key={step} style={{ display: "flex", gap: 14 }}>
                      <span
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          border: "1px solid var(--accent-line)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          color: "var(--accent-bright)",
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span style={{ paddingTop: 4 }}>{step}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>

            <Reveal delay={0.12}>
              <div
                style={{
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--surface)",
                  padding: "1.8rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  height: "100%",
                }}
              >
                <div>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>Terms</div>
                  <p className="mono" style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>{paymentNote.terms}</p>
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>Activation</div>
                  <p className="mono" style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>
                    {paymentNote.activation}
                  </p>
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>Created for</div>
                  <p style={{ fontSize: "0.93rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
                    {site.fullName}
                  </p>
                </div>
                <div style={{ marginTop: "auto", paddingTop: 8 }}>
                  <Link
                    to="/contact"
                    className="btn btn-ghost"
                    style={{ fontSize: 11.5 }}
                  >
                    Ask about membership <span className="btn-arrow">→</span>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          <style>{`
            @media (max-width: 860px) {
              .plans-grid { grid-template-columns: 1fr !important; }
              .payment-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>

        {/* 3D scene — right corner, full view */}
        <SceneShell
          className="scene-stage membership-scene"
          style={{
            width: "42vw",
            maxWidth: 620,
            height: 620,
            top: 0,
            right: 0,
            left: "auto",
            bottom: "auto",
          }}
        >
          <Suspense fallback={null}>
            <AtomOrbit />
          </Suspense>
        </SceneShell>
        <style>{`
          .membership-scene {
            opacity: 0.9;
            z-index: 0;
          }
          .membership-scene::after {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse 60% 55% at 55% 50%, rgba(247,241,227,0), rgba(247,241,227,0.6) 72%);
          }
          @media (max-width: 860px) {
            .membership-scene {
              width: 92vw !important;
              max-width: 92vw !important;
              height: 380px !important;
              top: auto !important;
              bottom: 0 !important;
              left: auto !important;
              right: 0 !important;
            }
          }
        `}</style>
      </section>

      {pay && (
        <PayModal
          planName={pay.plan}
          amount={pay.amount}
          onClose={() => setPay(null)}
        />
      )}
    </>
  );
}