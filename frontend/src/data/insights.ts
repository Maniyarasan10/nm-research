export type Insight = {
  category: string;
  title: string;
  date: string;
  readTime: string;
  href: string;
};

export const insights: Insight[] = [
  {
    category: "Research Note",
    title: "The next frontier: from reproducible methods to measurable impact",
    date: "2026",
    readTime: "8 min read",
    href: "/contact",
  },
  {
    category: "Field Note",
    title: "Building a global research ecosystem across 8 countries",
    date: "2026",
    readTime: "6 min read",
    href: "/contact",
  },
  {
    category: "Perspective",
    title: "What postgraduate researchers need from a research foundation",
    date: "2026",
    readTime: "5 min read",
    href: "/contact",
  },
];

export const timeline = [
  { step: "01", label: "Frame the question", desc: "Pin down a question worth the time and effort." },
  { step: "02", label: "Prove it with method", desc: "Reproducible hypotheses, tested and recorded." },
  { step: "03", label: "Build the prototype", desc: "Turn findings into working systems." },
  { step: "04", label: "Verify against metrics", desc: "Check outcomes against the numbers." },
  { step: "05", label: "Release into the world", desc: "Ship it with clear, honest documentation." },
  { step: "06", label: "Empower the next cohort", desc: "Pass the knowledge and skills forward." },
];

export type ResearchArea = {
  id: string;
  title: string;
  desc: string;
  keywords: string[];
  domainId: string;
};

export const researchAreas: ResearchArea[] = [
  {
    id: "01",
    title: "Chemistry & Materials",
    desc: "Nanotechnology, materials, polymers and applied chemistry — building the substances of tomorrow.",
    keywords: ["Nanotechnology", "Polymer Science", "Applied Chemistry", "Photocatalysis"],
    domainId: "chemistry",
  },
  {
    id: "02",
    title: "Biomedical & Life Sciences",
    desc: "Biotechnology, pharmacology, cancer biology and diagnostics — advancing health through research.",
    keywords: ["Biotechnology", "Pharmacology", "Cancer Biology", "Diagnostics"],
    domainId: "biomedical",
  },
  {
    id: "03",
    title: "Environmental & Energy",
    desc: "Renewable energy, sustainability and climate — engineering a responsible future.",
    keywords: ["Renewable Energy", "Sustainability", "Water Purification", "Climate"],
    domainId: "environmental",
  },
  {
    id: "04",
    title: "Engineering & Technology",
    desc: "AI, machine learning, robotics, IoT and intelligent systems for the next generation.",
    keywords: ["Artificial Intelligence", "Machine Learning", "Robotics", "IoT"],
    domainId: "engineering",
  },
  {
    id: "05",
    title: "Physics, Maths & Data",
    desc: "Quantum physics, computational methods and data analytics — the mathematics of what's next.",
    keywords: ["Quantum Physics", "Computational Methods", "Data Analytics"],
    domainId: "physics",
  },
  {
    id: "06",
    title: "Agricultural & Food",
    desc: "Crop science, precision agriculture and food technology — feeding a sustainable world.",
    keywords: ["Crop Science", "Precision Agriculture", "Food Technology", "Hydroponics"],
    domainId: "agriculture",
  },
  {
    id: "07",
    title: "Social Sciences & Humanities",
    desc: "Education, research methodology and public policy — the human dimensions of science.",
    keywords: ["Education", "Research Methodology", "Public Policy"],
    domainId: "social",
  },
];
