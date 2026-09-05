import { Link } from "react-router-dom";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { domains } from "@/data/site";
import SplitReveal from "@/components/ui/SplitReveal";
import Magnetic from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";

const cols: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Company",
    links: [
      { label: "Home", to: "/" },
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Research",
    links: domains.slice(0, 5).map((d) => ({
      label: d.shortTitle,
      to: `/research?domain=${d.id}`,
    })),
  },
  {
    title: "Services",
    links: services.slice(0, 6).map((s) => ({ label: s.title, to: "/services" })),
  },
  {
    title: "Global",
    links: site.tags.map((t) => ({ label: t, to: "/about" })),
  },
];

export default function Footer() {
  const toTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } })
      .__lenis;
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{
        borderTop: "1px solid var(--hairline)",
        background: "var(--bg-secondary)",
        paddingTop: "6rem",
        paddingBottom: "2rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 40,
            paddingBottom: 52,
            borderBottom: "1px solid var(--border-subtle)",
          }}
          className="footer-contact"
        >
          <div>
            <Reveal>
              <span className="mono eyebrow" style={{ marginBottom: 20 }}>
                <span style={{ width: 28, height: 1, background: "var(--accent)" }} />
                START A CONVERSATION
              </span>
            </Reveal>
            <Magnetic strength={0.06}>
              <a
                href={`mailto:${site.contact.emails[0]}`}
                data-cursor-label="WRITE"
                className="footer-mail"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.4rem, 4vw, 2.6rem)",
                  color: "var(--text-primary)",
                  lineHeight: 1.15,
                  display: "inline-block",
                }}
              >
                {site.contact.emails[0]}
              </a>
            </Magnetic>
          </div>

          <Magnetic strength={0.3}>
            <button
              onClick={toTop}
              data-cursor-label="TOP"
              className="btn btn-ghost"
              style={{ cursor: "pointer", fontSize: 11, flexShrink: 0 }}
            >
              Back to top ↑
            </button>
          </Magnetic>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr",
            gap: 40,
            paddingTop: "3rem",
          }}
          className="footer-grid"
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src={`${import.meta.env.BASE_URL}images/nm.png`}
                alt={`${site.fullName} logo`}
                width={60}
                height={40}
                style={{ borderRadius: 6, objectFit: "contain" }}
              />
              <span
                className="mono"
                style={{
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  color: "var(--text-primary)",
                }}
              >
                NM·RESEARCH
              </span>
            </div>
            <SplitReveal as="p" className="serif" stagger={0.05}>
              <span style={{ display: "block", maxWidth: 320 }}>
                "Innovate. Research. Publish. Impact."
              </span>
            </SplitReveal>
            <Reveal delay={0.1}>
              <p
                style={{
                  marginTop: 16,
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                  maxWidth: 320,
                }}
              >
                {site.positioning}
              </p>
            </Reveal>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <div className="eyebrow" style={{ marginBottom: 20 }}>
                {col.title}
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none" }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="link-underline"
                      style={{
                        fontSize: "0.92rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mono"
          style={{
            marginTop: 64,
            paddingTop: 24,
            borderTop: "1px solid var(--hairline)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 12,
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--text-faint)",
          }}
        >
          <span>© {new Date().getFullYear()} {site.fullName}. All rights reserved.</span>
          <span>RESEARCH / BUILD / DISCOVER</span>
          <span>{site.contact.website}</span>
        </div>
      </div>

      <Reveal>
        <div
          aria-hidden
          className="display-xl ghost-text"
          style={{
            marginTop: "3.5rem",
            textAlign: "center",
            fontSize: "min(14rem, 12.5vw)",
            lineHeight: 0.8,
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
            opacity: 1,
          }}
        >
          NM RESEARCH
        </div>
      </Reveal>

      <style>{`
        .footer-mail { position: relative; }
        .footer-mail::after {
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: -4px;
          height: 1px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .5s var(--ease-out);
        }
        .footer-mail:hover::after { transform: scaleX(1); }
        .footer-mail:hover { color: var(--accent-bright); }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 700px) {
          .footer-contact { flex-direction: column; }
          .footer-contact .btn.btn-ghost {
            align-self: flex-end;
            margin-top: -6px;
          }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}