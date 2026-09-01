export interface Service {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;
}

export const services: Service[] = [
  {
    slug: "research-paper-writing",
    title: "Research Paper Writing",
    description:
      "Expert assistance in crafting high-quality original research papers and comprehensive review articles with proper methodology and citations.",
    tags: ["Original Research", "Review Papers", "Editing", "Plagiarism Check"],
    icon: "pen",
  },
  {
    slug: "publication-support",
    title: "Publication Support",
    description:
      "Complete guidance for publishing in internationally recognized journals including SCI, SCIE, Scopus, Web of Science, and UGC Care listed journals.",
    tags: ["SCI", "SCIE", "Scopus", "Web of Science", "UGC Care"],
    icon: "award",
  },
  {
    slug: "phd-assistance",
    title: "PhD Assistance",
    description:
      "Comprehensive doctoral research support from topic selection through thesis writing, including literature review, methodology design, and defence preparation.",
    tags: ["Topic Selection", "Literature Review", "Methodology", "Thesis Writing"],
    icon: "graduation",
  },
  {
    slug: "research-consulting",
    title: "Research Consulting",
    description:
      "Free initial topic guidance and work plan discussions. Personalized consultancy sessions with domain experts for early-stage and advanced researchers.",
    tags: ["Free Guidance", "Work Plan", "Book Publication"],
    icon: "lightbulb",
  },
  {
    slug: "analytical-services",
    title: "Analytical Services",
    description:
      "Access to advanced characterization and analytical testing services. Professional data analysis and interpretation included with all analytical reports.",
    tags: ["XRD", "SEM", "TEM", "FTIR", "UV-Vis", "BET", "EIS", "XPS"],
    icon: "microscope",
  },
  {
    slug: "global-conferences",
    title: "Global Conferences",
    description:
      "Organization and participation in international and national research conferences. Provide networking opportunities with researchers, industry leaders, and academics worldwide.",
    tags: ["International", "National", "Workshops", "Webinars"],
    icon: "globe",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
