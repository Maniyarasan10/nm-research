import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Globe } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { services } from "@/data/services";

const socials = [
  {
    label: "Facebook",
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.4 20.4h-3.5v-5.6c0-1.3 0-3-1.9-3-1.9 0-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6h.1c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2 2 0 1 1 0-4.1 2 2 0 0 1 0 4.1zM7.1 20.4H3.6V9h3.5v11.4z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L2.8 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L7.1 3.7H5.3L17.8 20z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
];

const navCol = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Research", href: "/research" },
  { label: "Membership", href: "/membership" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const serviceLinks = services.map((s) => ({ label: s.title, href: `/services/${s.slug}` }));
  return (    <footer className="relative overflow-hidden bg-navy-dark text-white">
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.webp"
                alt="NM Group logo"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <div className="font-display text-sm font-bold tracking-wide">
                NM GROUP OF INDUSTRIES AND RESEARCH FOUNDATION
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              &quot;Innovate. Research. Publish. Impact.&quot;
              <br />
              {siteConfig.fullName} — A globally recognized research ecosystem
              empowering the next generation of scientists.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/80 transition-colors hover:bg-accent hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Navigation
            </div>
            <ul className="space-y-2.5">
              {navCol.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="link-grow text-sm text-white/70 transition-colors hover:text-accent"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <div className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Services
            </div>
            <ul className="space-y-2.5">
              {serviceLinks.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="link-grow text-sm text-white/70 transition-colors hover:text-accent"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Contact
            </div>
            <ul className="space-y-3 text-sm text-white/70">
              {siteConfig.contact.phones.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Phone size={14} className="shrink-0 text-accent" />
                  {p}
                </li>
              ))}
              {siteConfig.contact.emails.map((e) => (
                <li key={e} className="flex items-center gap-2">
                  <Mail size={14} className="shrink-0 text-accent" />
                  {e}
                </li>
              ))}
              <li className="flex items-center gap-2">
                <Globe size={14} className="shrink-0 text-accent" />
                {siteConfig.contact.website}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {siteConfig.fullName}. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
