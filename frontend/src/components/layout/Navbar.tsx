import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { site, domains } from "@/data/site";
import { services } from "@/data/services";
import { plans } from "@/data/plans";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const img = `${import.meta.env.BASE_URL}images/nm.png`;

const navCenter = [
  { label: "Home", href: "/" },
  { label: "Research", href: "/research" },
  { label: "Services", href: "/services" },
  { label: "Membership", href: "/membership" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [mega, setMega] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle("is-scrolled", window.scrollY > 40);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, isDesktop]);

  const lastPath = useRef(location.pathname);
  if (lastPath.current !== location.pathname) {
    lastPath.current = location.pathname;
    setMega(null);
    setMobileOpen(false);
  }

  const go = (href: string) => {
    setMega(null);
    setMobileOpen(false);
    navigate(href);
  };

  const active = (href: string) =>
    location.pathname === href ||
    (href !== "/" && location.pathname.startsWith(href));

  const megaDefs: Record<string, { title: string; items: { label: string; to: string }[]; foot: string }> = {
    research: {
      title: "Research Domains",
      items: domains.slice(0, 11).map((d) => ({
        label: d.shortTitle,
        to: `/research?domain=${d.id}`,
      })),
      foot: `${domains.reduce((s, d) => s + d.subjects.length, 0)}+ subjects across ${domains.length} domains`,
    },
    services: {
      title: "Services",
      items: services.map((s) => ({ label: s.title, to: "/services" })),
      foot: "Six working services — from topic to publication",
    },
    membership: {
      title: "Membership",
      items: plans.map((p) => ({
        label: `${p.tier} · ₹${p.price.toLocaleString("en-IN")}/yr`,
        to: "/membership",
      })),
      foot: "Community · Platinum · Prime",
    },
  };

  return (
    <>
      <header
        ref={headerRef}
        className="nav-header"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: "var(--z-nav)",
          transition: "background-color .5s var(--ease-out), border-color .5s var(--ease-out), backdrop-filter .5s",
          borderBottom: "1px solid var(--hairline)",
        }}
        onMouseLeave={() => isDesktop && setMega(null)}
      >
        <nav
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 76,
          }}
        >
          {/* Left: logo */}
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", gap: 12 }}
            onClick={() => setMega(null)}
          >
            <img
              src={img}
              alt={`${site.fullName} logo`}
              width={51}
              height={34}
              style={{ borderRadius: 6, objectFit: "contain" }}
            />
            <span
              style={{
                fontFamily: '"Manrope", "Space Grotesk", sans-serif',
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: "0.12em",
                color: "var(--text-primary)",
              }}
            >
              NM<span style={{ color: "var(--text-muted)" }}>·</span>RESEARCH
            </span>
          </Link>

          {/* Center nav (desktop) */}
          {isDesktop && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 4,
              }}
            >
              {navCenter.map((item) => (
                <span
                  key={item.href}
                  onMouseEnter={() => setMega(item.href)}
                >
                  <Link
                    to={item.href}
                    className="mono nav-link"
                    style={{
                      display: "inline-block",
                      padding: "0.6rem 1rem",
                      fontSize: 11.5,
                      letterSpacing: "0.12em",
                      color: active(item.href)
                        ? "var(--accent-bright)"
                        : "var(--text-secondary)",
                      borderBottom: active(item.href)
                        ? "1px solid var(--accent)"
                        : "1px solid transparent",
                    }}
                  >
                    {item.label}
                  </Link>
                </span>
              ))}
            </div>
          )}

          {/* Right: contact + menu */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isDesktop ? (
              <>
                <Link
                  to="/contact"
                  className="btn btn-ghost"
                  style={{ padding: "0.6rem 1.2rem", fontSize: 11 }}
                >
                  Contact
                </Link>
              </>
            ) : (
              <button
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                aria-haspopup="true"
                onClick={() => setMobileOpen((v) => !v)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  width: 40,
                  height: 40,
                  padding: 0,
                  color: "var(--text-primary)",
                }}
              >
                <span style={{ width: 20, height: 2, background: "currentColor", transition: "transform .3s var(--ease-out)", transform: mobileOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
                <span style={{ width: 20, height: 2, background: "currentColor", transition: "opacity .2s", opacity: mobileOpen ? 0 : 1 }} />
                <span style={{ width: 20, height: 2, background: "currentColor", transition: "transform .3s var(--ease-out)", transform: mobileOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
              </button>
            )}
          </div>
        </nav>

        {/* Mega dropdown */}
        {isDesktop && mega && megaDefs[mega] && (
          <div
            style={{
              position: "absolute",
              top: 76,
              left: 0,
              right: 0,
              background: "rgba(248,242,228,0.96)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderTop: "1px solid var(--hairline)",
              borderBottom: "1px solid var(--hairline)",
            }}
          >
            <div className="container" style={{ paddingBlock: "2.4rem" }}>
              <div className="eyebrow" style={{ marginBottom: 20 }}>
                {megaDefs[mega].title}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.4rem 2rem",
                }}
              >
                {megaDefs[mega].items.map((it) => (
                  <button
                    key={it.label}
                    onClick={() => go(it.to)}
                    className="link-underline"
                    style={{
                      textAlign: "left",
                      padding: "0.55rem 0",
                      fontSize: "0.95rem",
                      color: "var(--text-secondary)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--accent-bright)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--text-secondary)")
                    }
                  >
                    {it.label}
                  </button>
                ))}
              </div>
              <div
                className="mono"
                style={{
                  marginTop: 28,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: "var(--text-muted)",
                }}
              >
                {megaDefs[mega].foot}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {mobileOpen && !isDesktop && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: "var(--z-nav)",
            background: "var(--bg-primary)",
            paddingTop: "calc(96px + env(safe-area-inset-top))",
            paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom))",
            paddingInline: "var(--gutter)",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
              borderBottom: "1px solid var(--hairline)",
              paddingBottom: 10,
            }}
          >
            <span className="mono eyebrow" style={{ fontSize: 10, letterSpacing: "0.18em" }}>
              MENU
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              style={{
                display: "grid",
                placeItems: "center",
                width: 42,
                height: 42,
                border: "1px solid var(--border-strong)",
                borderRadius: "50%",
                color: "var(--text-primary)",
                background: "transparent",
                transition: "color .3s var(--ease-out), border-color .3s var(--ease-out), background-color .3s var(--ease-out)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent)";
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "#f8f2e4";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "var(--border-strong)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              ...navCenter.map((n) => ({ label: n.label, to: n.href })),
              { label: "Contact", to: "/contact" },
            ].map((item, i) => (
              <button
                key={item.to}
                onClick={() => go(item.to)}
                style={{
                  textAlign: "left",
                  display: "flex",
                  alignItems: "baseline",
                  gap: 16,
                  padding: "0.9rem 0",
                  borderBottom: "1px solid var(--hairline)",
                }}
              >
                <span className="mono" style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  0{i + 1}
                </span>
                <span
                  className="display-md"
                  style={{ fontSize: "1.8rem", color: "var(--text-primary)" }}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .nav-header.is-scrolled {
          background: rgba(248,242,228,0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .nav-header:not(.is-scrolled) {
          background: transparent;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
      `}</style>
    </>
  );
}
