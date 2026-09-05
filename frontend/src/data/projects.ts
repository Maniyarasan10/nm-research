export type Project = {
  index: string;
  name: string;
  statement: string;
  technology: string;
  status: string;
  href: string;
};

/**
 * Featured works, grounded in the real, live products of NM Research.
 * No invented results — every entry maps to a documented offering.
 */
export const featuredProjects: Project[] = [
  {
    index: "01",
    name: "The Research Index",
    statement:
      "A living, searchable catalogue of 250+ subjects across 11 research domains — the infrastructure that makes every NM engagement scoped, structured and reproducible from day one.",
    technology: "Knowledge infrastructure · 11 domains",
    status: "Live · Evolving",
    href: "/research",
  },
  {
    index: "02",
    name: "The Publication Pipeline",
    statement:
      "End-to-end publication guidance across 58 refereed journals — SCI, SCIE, Scopus, Web of Science and UGC CARE — from journal shortlisting to response-to-reviewers.",
    technology: "SCI · Scopus · Web of Science · UGC CARE",
    status: "Operational",
    href: "/services",
  },
  {
    index: "03",
    name: "Global Conference Program",
    statement:
      "International and national conferences, workshops and webinars connecting researchers, industry leaders and academics across 8 countries of operation.",
    technology: "Programme design · 8 countries · 150+ partners",
    status: "Ongoing",
    href: "/services",
  },
];