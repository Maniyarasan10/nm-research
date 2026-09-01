import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ResearchSection from "@/components/sections/ResearchSection";
import { totalSubjects, domains } from "@/data/domains";

export const metadata: Metadata = {
  title: "Research",
  description: `Explore ${totalSubjects}+ research subjects across ${domains.length} domains supported by NM Group — chemistry, biomedical, engineering, AI, and more.`,
};

export default function ResearchPage() {
  return (
    <>
      <PageHero
        label="Research Ecosystem"
        title={
          <>
            Explore the{" "}
            <span className="emph">
              Research Universe
            </span>
          </>
        }
        subtitle={`From fundamental science to applied technology — ${totalSubjects}+ subjects across ${domains.length} research domains, all supported by NM Foundation.`}
      />
      <ResearchSection />
    </>
  );
}
