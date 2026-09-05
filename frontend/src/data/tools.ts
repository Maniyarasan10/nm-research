export type AiTool = {
  id: string;
  title: string;
  desc: string;
  status: "live" | "soon";
};

export const aiTools: AiTool[] = [
  {
    id: "pdf-summarizer",
    title: "AI PDF Summarizer",
    desc: "Upload any paper and receive structured summaries and key findings.",
    status: "soon",
  },
  {
    id: "citation-generator",
    title: "AI Citation Generator",
    desc: "Auto-generate citations in APA, MLA, or IEEE from a DOI or URL.",
    status: "soon",
  },
  {
    id: "research-roadmap",
    title: "Research Roadmap",
    desc: "Build a step-by-step roadmap aligned to your goals and timeline.",
    status: "soon",
  },
];
