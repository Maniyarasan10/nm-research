export interface Subject {
  slug: string;
  name: string;
}

export interface Domain {
  id: string;
  title: string;
  shortTitle: string;
  accent: string;
  icon: string;
  subjects: Subject[];
}

export const domains: Domain[] = [
  {
    id: "chemistry",
    title: "Chemistry & Materials Science",
    shortTitle: "Chemistry & Materials",
    accent: "#7C3AED",
    icon: "flask",
    subjects: [
      { slug: "nanotechnology", name: "Nanotechnology" },
      { slug: "nanoscience", name: "Nanoscience" },
      { slug: "material-science", name: "Material Science" },
      { slug: "material-chemistry", name: "Material Chemistry" },
      { slug: "applied-chemistry", name: "Applied Chemistry" },
      { slug: "organic-chemistry", name: "Organic Chemistry" },
      { slug: "inorganic-chemistry", name: "Inorganic Chemistry" },
      { slug: "physical-chemistry", name: "Physical Chemistry" },
      { slug: "analytical-chemistry", name: "Analytical Chemistry" },
      { slug: "green-chemistry", name: "Green Chemistry" },
      { slug: "industrial-chemistry", name: "Industrial Chemistry" },
      { slug: "polymer-science", name: "Polymer Science" },
      { slug: "surface-chemistry", name: "Surface Chemistry" },
      { slug: "computational-chemistry", name: "Computational Chemistry" },
      { slug: "environmental-chemistry", name: "Environmental Chemistry" },
      { slug: "photocatalysis", name: "Photocatalysis" },
    ],
  },
  {
    id: "biomedical",
    title: "Biomedical & Life Sciences",
    shortTitle: "Biomedical & Life Sciences",
    accent: "#0D9488",
    icon: "dna",
    subjects: [
      { slug: "biomedical-science", name: "Biomedical Science" },
      { slug: "biomedical-engineering", name: "Biomedical Engineering" },
      { slug: "biotechnology", name: "Biotechnology" },
      { slug: "microbiology", name: "Microbiology" },
      { slug: "molecular-biology", name: "Molecular Biology" },
      { slug: "cell-biology", name: "Cell Biology" },
      { slug: "genetics", name: "Genetics" },
      { slug: "cancer-biology", name: "Cancer Biology" },
      { slug: "drug-delivery-systems", name: "Drug Delivery Systems" },
      { slug: "pharmaceutical-science", name: "Pharmaceutical Science" },
      { slug: "pharmacology", name: "Pharmacology" },
      { slug: "toxicology", name: "Toxicology" },
      { slug: "biochemistry", name: "Biochemistry" },
      {
        slug: "medical-laboratory-technology",
        name: "Medical Laboratory Technology",
      },
      { slug: "clinical-research", name: "Clinical Research" },
      { slug: "nanomedicine", name: "Nanomedicine" },
      { slug: "bioinformatics", name: "Bioinformatics" },
      { slug: "molecular-diagnostics", name: "Molecular Diagnostics" },
    ],
  },
  {
    id: "environmental",
    title: "Environmental & Energy Sciences",
    shortTitle: "Environmental & Energy",
    accent: "#16A34A",
    icon: "turbine",
    subjects: [
      { slug: "environmental-science", name: "Environmental Science" },
      { slug: "environmental-engineering", name: "Environmental Engineering" },
      { slug: "wastewater-treatment", name: "Wastewater Treatment" },
      { slug: "pollution-control", name: "Pollution Control" },
      { slug: "air-quality-monitoring", name: "Air Quality Monitoring" },
      { slug: "water-purification", name: "Water Purification" },
      { slug: "climate-change", name: "Climate Change" },
      { slug: "sustainability-research", name: "Sustainability Research" },
      { slug: "renewable-energy", name: "Renewable Energy" },
      { slug: "solar-energy", name: "Solar Energy" },
      { slug: "green-energy", name: "Green Energy" },
      { slug: "renewable-energy-systems", name: "Renewable Energy Systems" },
    ],
  },
  {
    id: "agriculture",
    title: "Agricultural & Food Sciences",
    shortTitle: "Agricultural & Food Sciences",
    accent: "#CA8A04",
    icon: "sprout",
    subjects: [
      { slug: "agricultural-science", name: "Agricultural Science" },
      {
        slug: "agricultural-nanotechnology",
        name: "Agricultural Nanotechnology",
      },
      { slug: "soil-science", name: "Soil Science" },
      { slug: "plant-biotechnology", name: "Plant Biotechnology" },
      { slug: "food-technology", name: "Food Technology" },
      { slug: "crop-science", name: "Crop Science" },
      { slug: "biofertilizers", name: "Biofertilizers" },
      { slug: "precision-agriculture", name: "Precision Agriculture" },
      { slug: "hydroponics", name: "Hydroponics" },
      { slug: "iot-based-agriculture", name: "IoT-based Agriculture" },
    ],
  },
  {
    id: "engineering",
    title: "Engineering & Technology",
    shortTitle: "Engineering & Technology",
    accent: "#2563EB",
    icon: "gear",
    subjects: [
      { slug: "artificial-intelligence", name: "Artificial Intelligence" },
      { slug: "machine-learning", name: "Machine Learning" },
      { slug: "deep-learning", name: "Deep Learning" },
      { slug: "data-science", name: "Data Science" },
      { slug: "computer-science", name: "Computer Science" },
      { slug: "information-technology", name: "Information Technology" },
      { slug: "software-engineering", name: "Software Engineering" },
      { slug: "web-development", name: "Web Development" },
      { slug: "mobile-app-development", name: "Mobile App Development" },
      { slug: "cloud-computing", name: "Cloud Computing" },
      { slug: "cybersecurity", name: "Cybersecurity" },
      { slug: "blockchain-technology", name: "Blockchain Technology" },
      { slug: "internet-of-things", name: "Internet of Things (IoT)" },
      { slug: "embedded-systems", name: "Embedded Systems" },
      { slug: "robotics", name: "Robotics" },
      { slug: "automation", name: "Automation" },
      { slug: "electronics-engineering", name: "Electronics Engineering" },
      { slug: "electrical-engineering", name: "Electrical Engineering" },
      { slug: "mechanical-engineering", name: "Mechanical Engineering" },
      { slug: "civil-engineering", name: "Civil Engineering" },
      { slug: "chemical-engineering", name: "Chemical Engineering" },
      { slug: "industrial-engineering", name: "Industrial Engineering" },
      { slug: "manufacturing-technology", name: "Manufacturing Technology" },
      { slug: "3d-printing", name: "3D Printing" },
      { slug: "cad-cam", name: "CAD/CAM" },
      { slug: "mechatronics", name: "Mechatronics" },
    ],
  },
  {
    id: "energy-storage",
    title: "Energy Storage & Electrochemistry",
    shortTitle: "Energy Storage & Electrochemistry",
    accent: "#EA580C",
    icon: "battery",
    subjects: [
      { slug: "energy-storage-devices", name: "Energy Storage Devices" },
      { slug: "battery-technology", name: "Battery Technology" },
      { slug: "supercapacitors", name: "Supercapacitors" },
      { slug: "fuel-cell-technology", name: "Fuel Cell Technology" },
      { slug: "electrochemistry", name: "Electrochemistry" },
    ],
  },
  {
    id: "physics",
    title: "Physics, Mathematics & Data",
    shortTitle: "Physics, Maths & Data",
    accent: "#4338CA",
    icon: "atom",
    subjects: [
      { slug: "physics", name: "Physics" },
      { slug: "applied-physics", name: "Applied Physics" },
      { slug: "quantum-physics", name: "Quantum Physics" },
      { slug: "solid-state-physics", name: "Solid State Physics" },
      { slug: "computational-physics", name: "Computational Physics" },
      { slug: "mathematics", name: "Mathematics" },
      { slug: "applied-mathematics", name: "Applied Mathematics" },
      { slug: "statistics", name: "Statistics" },
      { slug: "computational-mathematics", name: "Computational Mathematics" },
      { slug: "data-analytics", name: "Data Analytics" },
    ],
  },
  {
    id: "management",
    title: "Management & Business Sciences",
    shortTitle: "Management & Business",
    accent: "#BE123C",
    icon: "chart",
    subjects: [
      { slug: "business-administration", name: "Business Administration" },
      { slug: "entrepreneurship", name: "Entrepreneurship" },
      { slug: "innovation-management", name: "Innovation Management" },
      { slug: "research-management", name: "Research Management" },
      {
        slug: "human-resource-management",
        name: "Human Resource Management",
      },
      { slug: "marketing", name: "Marketing" },
      { slug: "finance", name: "Finance" },
      { slug: "economics", name: "Economics" },
      { slug: "business-analytics", name: "Business Analytics" },
      { slug: "supply-chain-management", name: "Supply Chain Management" },
      { slug: "project-management", name: "Project Management" },
      { slug: "leadership-studies", name: "Leadership Studies" },
      { slug: "industrial-collaboration", name: "Industrial Collaboration" },
      { slug: "startup-ecosystem", name: "Startup Ecosystem" },
    ],
  },
  {
    id: "social",
    title: "Social Sciences & Humanities",
    shortTitle: "Social Sciences & Humanities",
    accent: "#DB2777",
    icon: "speech",
    subjects: [
      { slug: "psychology", name: "Psychology" },
      { slug: "education", name: "Education" },
      { slug: "english-literature", name: "English Literature" },
      { slug: "communication-skills", name: "Communication Skills" },
      { slug: "technical-writing", name: "Technical Writing" },
      { slug: "scientific-writing", name: "Scientific Writing" },
      { slug: "research-methodology", name: "Research Methodology" },
      { slug: "ethics-in-research", name: "Ethics in Research" },
      { slug: "sociology", name: "Sociology" },
      { slug: "public-policy", name: "Public Policy" },
      {
        slug: "women-empowerment-studies",
        name: "Women Empowerment Studies",
      },
      { slug: "rural-development", name: "Rural Development" },
    ],
  },
  {
    id: "law",
    title: "Law, IP & Entrepreneurship",
    shortTitle: "Law, IP & Entrepreneurship",
    accent: "#57534E",
    icon: "scale",
    subjects: [
      {
        slug: "entrepreneurship-development",
        name: "Entrepreneurship Development",
      },
      { slug: "patent-studies", name: "Patent Studies" },
      { slug: "research-ethics", name: "Research Ethics" },
      { slug: "ipr", name: "IPR" },
      { slug: "technology-transfer", name: "Technology Transfer" },
      { slug: "innovation-policy", name: "Innovation Policy" },
      {
        slug: "international-collaboration",
        name: "International Collaboration",
      },
      { slug: "law-intellectual-property", name: "Law & Intellectual Property" },
    ],
  },
  {
    id: "publication",
    title: "Publication & Academic Support",
    shortTitle: "Publication & Academic Support",
    accent: "#0891B2",
    icon: "book",
    subjects: [
      { slug: "sci-publications", name: "SCI Publications" },
      { slug: "scie-publications", name: "SCIE Publications" },
      { slug: "scopus-publications", name: "Scopus Publications" },
      {
        slug: "web-of-science-publications",
        name: "Web of Science Publications",
      },
      { slug: "ugc-care-publications", name: "UGC CARE Publications" },
      { slug: "book-chapters", name: "Book Chapters" },
      { slug: "conference-proceedings", name: "Conference Proceedings" },
      { slug: "patent-filing", name: "Patent Filing" },
      {
        slug: "research-proposal-writing",
        name: "Research Proposal Writing",
      },
      { slug: "grant-writing", name: "Grant Writing" },
      { slug: "journal-selection", name: "Journal Selection" },
      { slug: "manuscript-editing", name: "Manuscript Editing" },
      { slug: "plagiarism-checking", name: "Plagiarism Checking" },
      { slug: "citation-management", name: "Citation Management" },
    ],
  },
];

export const totalSubjects = domains.reduce(
  (sum, d) => sum + d.subjects.length,
  0,
);

export function getSubjectBySlug(slug: string): Subject | undefined {
  for (const d of domains) {
    const found = d.subjects.find((s) => s.slug === slug);
    if (found) return found;
  }
  return undefined;
}

export function getDomainById(id: string): Domain | undefined {
  return domains.find((d) => d.id === id);
}
