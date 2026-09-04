import { site, domains } from "@/data/site";
import { services } from "@/data/services";
import { plans, formatINR } from "@/data/plans";

export type ChatAction = { label: string; to: string };

export type ChatReply = {
  text: string;
  actions?: ChatAction[];
};

const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9+# ]/g, " ").replace(/\s+/g, " ").trim();

const has = (s: string, ...words: string[]) =>
  words.some((w) => {
    if (w.length <= 3) return new RegExp(`\\b${w}\\b`).test(s);
    return s.includes(w);
  });

/** Distinctive keywords per service so generic queries don't false-match. */
const svcTriggers: Record<string, string[]> = {
  "research-paper-writing": ["paper writing", "research paper", "write a paper", "writing"],
  "publication-support": ["publication", "journal", "scopus", "publish"],
  "phd-assistance": ["phd", "thesis", "doctorate", "synopsis", "ph.d"],
  "research-consulting": ["consult", "consulting", "guidance", "work plan"],
  "analytical-services": ["analytical", "characterization", "testing", "xrd", "sem", "tem"],
  "global-conferences": ["conference", "symposium", "webinar", "workshop"],
};

/** Loose reply for anything without a strong intent. */
const fallbackIntro = `I'm the NM Research assistant. I can help with our services, membership plans, research domains, publications and contact details. Try asking e.g. "What services do you offer?", "Membership plans and prices", "How to publish", or "Contact info".`;

export function ask(raw: string): ChatReply {
  const q = norm(raw);
  if (!q) return { text: "Please type a question — I'm here to help you explore NM Research." };

  // Greeting
  if (has(q, "hi", "hello", "hey", "namaste", "good morning", "good evening", "good afternoon")) {
    return {
      text: `Hello! Welcome to ${site.fullName} — ${site.slogan}. How can I help you today? You can ask about services, membership, publishing, research domains or contact.`,
    };
  }

  // A specific service
  const svc = services.find((s) => has(q, ...(svcTriggers[s.slug] ?? [])));
  if (svc) {
    return {
      text: `${svc.title} (${svc.index}):\n${svc.description}\n\n${svc.highlights.map((h) => "• " + h).join("\n")}`,
      actions: [{ label: "Open services", to: "/services" }],
    };
  }

  // Publication / publish / journal
  if (has(q, "publish", "publication", "journal", "scopus", "sci", "scie", "impact factor")) {
    return {
      text: `We support publication in SCI, SCIE, Scopus, Web of Science and UGC CARE journals — from journal shortlisting and submission to response-to-reviewers.`,
      actions: [{ label: "Publication support", to: "/services" }],
    };
  }

  // Membership / plans / price / cost / fee
  if (has(q, "member", "plan", "price", "cost", "fee", "subscription", "join")) {
    return {
      text: `We have three membership tiers (annual):\n` +
        plans.map((p) => `${p.tier} · ₹${formatINR(p.price)}/yr${p.featured ? " — Most Popular" : ""}`).join("\n") +
        `\n\nCommunity starts at ₹${formatINR(plans[0].price)} and Prime at ₹${formatINR(plans[2].price)}. Ask me "platinum benefits" for a breakdown.`,
      actions: [{ label: "See membership", to: "/membership" }],
    };
  }

  // A specific plan
  const plan = plans.find((p) => has(q, ...p.tier.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3)));
  if (plan) {
    return {
      text: `${plan.tier} · ₹${formatINR(plan.price)}/yr — ${plan.summary}\n\n${plan.benefits.map((b) => "• " + b).join("\n")}`,
      actions: [{ label: "Membership plans", to: "/membership" }],
    };
  }

  // Research domains
  if (has(q, "domain", "subject", "area", "field", "research on")) {
    return {
      text: `We cover ${domains.length} research domains (${domains.reduce((s, d) => s + d.subjects.length, 0)}+ supported subjects). Here they are:\n` +
        domains.map((d) => `• ${d.title}`).join("\n") +
        `\n\nAsk about any domain, e.g. "chemistry" or "biomedical".`,
      actions: [{ label: "Browse research", to: "/research" }],
    };
  }

  const domain = domains.find((d) => has(q, ...d.title.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 4)));
  if (domain) {
    const first = domain.subjects.slice(0, 8);
    const more = domain.subjects.length - first.length;
    return {
      text: `${domain.title}: sample subjects — ${first.join(", ")}${more > 0 ? ` and ${more} more.` : "."}`,
      actions: [{ label: "Open research", to: `/research?domain=${domain.id}` }],
    };
  }

  // Conference
  if (has(q, "conference", "symposium", "workshop", "webinar", "talk")) {
    return {
      text: `We organise international and national research conferences, workshops and webinars — with paper presentation and networking opportunities.`,
      actions: [{ label: "See services", to: "/services" }],
    };
  }

  // PhD
  if (has(q, "phd", "doctorate", "thesis", "synopsis")) {
    return {
      text: `Our PhD assistance covers topic selection, synopsis, literature review, research gap analysis, methodology design, thesis writing and defence preparation.`,
      actions: [{ label: "PhD assistance", to: "/services" }],
    };
  }

  // Founder / about
  if (has(q, "who", "founder", "about your", "about nm", "ceo", "team")) {
    return {
      text: `${site.founder.name} (${site.founder.credentials}) is the ${site.founder.role} of ${site.fullName}. ${site.positioning}`,
      actions: [{ label: "About NM", to: "/about" }],
    };
  }

  // Contact
  if (has(q, "contact", "phone", "call", "email", "reach", "whatsapp", "office", "address")) {
    return {
      text: `You can reach us at:\n• ${site.contact.emails[0]}\n• ${site.contact.phones[0]} / ${site.contact.phones[1]}\n• WhatsApp: ${site.whatsapp}\n\nOffices in: ${site.contact.offices}`,
      actions: [{ label: "Contact page", to: "/contact" }],
    };
  }

  // Analytical
  if (has(q, "analytical", "xrd", "sem", "tem", "characterization", "testing", "ftir")) {
    return {
      text: `We provide advanced characterization and analytical testing — XRD, SEM, TEM, FTIR, UV-Vis, BET, EIS, XPS and more — with professional data analysis and certified reports.`,
      actions: [{ label: "Analytical services", to: "/services" }],
    };
  }

  // Services (generic) — checked last so "do you offer <specific>" beats this list
  if (has(q, "service", "what do you", "offer", "help me with", "do you provide", "offerings")) {
    return {
      text: `We offer ${services.length} research services:\n` +
        services.map((s) => `${s.index} · ${s.title}`).join("\n") +
        `\n\nWant details on any one? Tell me, e.g. "publication support" or "phd assistance".`,
      actions: [{ label: "See all services", to: "/services" }],
    };
  }

  // Capabilities / help / what can you
  if (has(q, "what can you", "help", "capabilit", "commands", "what do you know", "available")) {
    return {
      text: fallbackIntro,
    };
  }

  // Thanks
  if (has(q, "thank", "great", "nice", "awesome", "cool", "perfect")) {
    return { text: `You're welcome! If you want to go deeper, I can explain any service, plan or research domain — just ask.` };
  }

  // Location
  if (has(q, "where", "location", "country", "india", "state")) {
    return { text: `NM Research operates across ${site.contact.offices}. In India we work across ${site.contact.indiaStates}.` };
  }

  // Default fallback
  return {
    text: `I couldn't find an exact answer for that. ${fallbackIntro}`,
  };
}

/** Quick suggestion chips shown at launch. */
export const starters: ChatAction[] = [
  { label: "What services do you offer?", to: "" },
  { label: "Membership plans & prices", to: "" },
  { label: "How to publish?", to: "" },
  { label: "Contact details", to: "" },
];