"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { services } from "@/data/services";
import { domains } from "@/data/domains";
import { plans } from "@/data/plans";

function NavLink({
  label,
  active,
  hasDropdown,
  open,
}: {
  label: string;
  active: boolean;
  hasDropdown?: boolean;
  open?: boolean;
}) {
  return (
    <span
      className={`inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-full px-3.5 text-sm font-medium transition-colors ${
        active
          ? "bg-primary-dim text-brand"
          : "text-ink-2 hover:bg-primary-dim/60 hover:text-brand"
      }`}
    >
      {label}
      {hasDropdown && (
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      )}
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setOpenDropdown(null);
  }

  // Home is intentionally omitted — the logo mark links back to "/".
  const navItems = [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services", dropdown: "services" },
    { label: "Research", href: "/research", dropdown: "domains" },
    { label: "Membership", href: "/membership", dropdown: "plans" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 sm:px-6">
      <nav
        className={`mx-auto mt-3 flex h-14 max-w-6xl items-center justify-between gap-2 rounded-full border bg-paper/85 py-2 pl-2.5 pr-2.5 backdrop-blur-md shadow-sm transition-shadow duration-300 ${
          scrolled
            ? "border-rule shadow-[0_10px_30px_-14px_rgba(23,25,29,0.28)]"
            : "border-rule"
        }`}
        aria-label="Main"
      >
        {/* Brand */}
        <Link href="/" className="flex h-9 shrink-0 items-center gap-2.5 pl-1">
          <Image
            src="/images/logo.webp"
            alt="NM Group Global Research Innovation"
            width={30}
            height={30}
            className="h-[30px] w-[30px] shrink-0 rounded-md"
            priority
          />
          <span className="flex flex-col justify-center leading-none">
            <span className="display text-[0.95rem] font-semibold tracking-tight text-ink">
              NM Research
            </span>
            <span className="mt-0.5 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-ink-3">
              Foundation
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden h-9 items-center gap-0.5 lg:flex">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.dropdown && setOpenDropdown(item.dropdown)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link href={item.href} aria-haspopup={item.dropdown ? "true" : undefined}>
                <NavLink
                  label={item.label}
                  active={pathname === item.href}
                  hasDropdown={!!item.dropdown}
                  open={openDropdown === item.dropdown}
                />
              </Link>

              <AnimatePresence>
                {item.dropdown && openDropdown === item.dropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 top-full mt-2 w-72 -translate-x-1/2 rounded-2xl border border-rule bg-paper p-1.5 shadow-[0_20px_50px_-20px_rgba(23,25,29,0.35)]"
                  >
                    {item.dropdown === "services" ? (
                      <div className="grid gap-0.5">
                        {services.map((s) => (
                          <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            className="rounded-xl px-3 py-2 text-[0.82rem] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-brand"
                          >
                            {s.title}
                          </Link>
                        ))}
                      </div>
                    ) : item.dropdown === "plans" ? (
                      <div className="grid gap-0.5">
                        {plans.map((p) => (
                          <Link
                            key={p.slug}
                            href={`/membership/${p.slug}`}
                            className="flex items-center justify-between rounded-xl px-3 py-2 text-[0.82rem] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-brand"
                          >
                            {p.tier}
                            {p.featured && (
                              <span className="rounded-full bg-accent-dim px-2 py-0.5 font-mono text-[0.58rem] font-semibold uppercase tracking-wider text-accent">
                                Popular
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto">
                        {domains.map((d) => (
                          <Link
                            key={d.id}
                            href={`/research/${d.id}`}
                            className="block rounded-xl px-3 py-2 text-[0.82rem] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-brand"
                          >
                            {d.shortTitle}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex h-9 shrink-0 items-center gap-1.5">
          <Link
            href="/contact"
            className="hidden h-9 items-center justify-center rounded-full bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent/90 sm:inline-flex"
          >
            Join Research
          </Link>
          <button
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-rule bg-paper text-ink"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="lg:hidden fixed inset-x-4 top-[4.25rem] z-40 rounded-2xl border border-rule bg-paper p-2 shadow-[0_24px_60px_-24px_rgba(23,25,29,0.4)]"
          >
            <nav className="grid gap-1" aria-label="Mobile">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-[0.95rem] font-medium text-ink transition-colors hover:bg-surface-2"
                >
                  {item.label}
                  {item.dropdown && <ChevronDown size={16} className="text-ink-3" />}
                </Link>
              ))}
              <Link
                href="/contact"
                className="btn btn-accent mt-2 w-full rounded-xl"
              >
                Join Research
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
