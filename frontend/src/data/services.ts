export type Service = {
  slug: string;
  title: string;
  index: string;
  description: string;
  tags: string[];
  highlights: string[];
};

export const services: Service[] = [
  {
    slug: "research-paper-writing",
    title: "Research Paper Writing",
    index: "01",
    description:
      "Expert assistance in crafting high-quality original research papers and comprehensive review articles with proper methodology and citations.",
    tags: ["Original Research", "Review Papers", "Editing", "Plagiarism Check"],
    highlights: [
      "Research paper writing & review articles",
      "Methodology design and proper citations",
      "Editing, proofreading & APA/IEEE formatting",
      "Plagiarism check and originality report",
    ],
  },
  {
    slug: "publication-support",
    title: "Publication Support",
    index: "02",
    description:
      "Complete guidance for publishing in internationally recognised journals including SCI, SCIE, Scopus, Web of Science, and UGC CARE listed journals.",
    tags: ["SCI", "SCIE", "Scopus", "Web of Science", "UGC Care"],
    highlights: [
      "Targeted journal shortlisting (SCI/SCIE/Scopus)",
      "Submission readiness & formatting per journal",
      "Response-to-reviewers collaboration",
      "UGC CARE and Web of Science support",
    ],
  },
  {
    slug: "phd-assistance",
    title: "PhD Assistance",
    index: "03",
    description:
      "Comprehensive doctoral research support from topic selection through thesis writing, including literature review, methodology design, and defence preparation.",
    tags: ["Topic Selection", "Literature Review", "Methodology", "Thesis Writing"],
    highlights: [
      "Topic selection and synopsis support",
      "Literature review & research gap analysis",
      "Methodology design for your study",
      "Thesis writing and defence preparation",
    ],
  },
  {
    slug: "research-consulting",
    title: "Research Consulting",
    index: "04",
    description:
      "Free initial topic guidance and work-plan discussions. Personalised consultancy sessions with domain experts for early-stage and advanced researchers.",
    tags: ["Free Guidance", "Work Plan", "Book Publication"],
    highlights: [
      "Free initial topic and work-plan discussion",
      "1:1 sessions with domain experts",
      "Personalised research roadmaps",
      "Book publication guidance",
    ],
  },
  {
    slug: "analytical-services",
    title: "Analytical Services",
    index: "05",
    description:
      "Access to advanced characterization and analytical testing services. Professional data analysis and interpretation included with all analytical reports.",
    tags: ["XRD", "SEM", "TEM", "FTIR", "UV-Vis", "BET", "EIS", "XPS"],
    highlights: [
      "Advanced characterization (XRD, SEM, TEM, FTIR)",
      "Surface area, UV-Vis, EIS and more",
      "Professional data analysis & interpretation",
      "Certified analytical reports",
    ],
  },
  {
    slug: "global-conferences",
    title: "Global Conferences",
    index: "06",
    description:
      "Organization and participation in international and national research conferences. Provide networking opportunities with researchers, industry leaders, and academics worldwide.",
    tags: ["International", "National", "Workshops", "Webinars"],
    highlights: [
      "International & national conference organization",
      "Workshops and webinars",
      "Paper presentation opportunities",
      "Networking with researchers & industry leaders",
    ],
  },
];

export const deliverySteps = [
  {
    step: "01",
    title: "Consult",
    desc: "Share your topic, stage and goals for a free initial discussion.",
  },
  {
    step: "02",
    title: "Plan",
    desc: "Receive a defined scope, timeline and deliverable roadmap.",
  },
  {
    step: "03",
    title: "Deliver",
    desc: "Work with named experts to a documented, reproducible process.",
  },
];

export const trustPillars = [
  {
    title: "Reproducible methods",
    desc: "Every engagement follows a documented, auditable process.",
  },
  {
    title: "Verified metrics",
    desc: "Reported outcomes map to real journals and measurable results.",
  },
  {
    title: "Named experts",
    desc: "Work directly with domain specialists — never a black box.",
  },
];
