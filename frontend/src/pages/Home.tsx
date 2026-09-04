import Hero from "@/components/home/Hero";
import Introduction from "@/components/home/Introduction";
import ResearchAreas from "@/components/home/ResearchAreas";
import FeaturedResearch from "@/components/home/FeaturedResearch";
import ProcessTimeline from "@/components/home/ProcessTimeline";
import InnovationScene from "@/components/home/InnovationScene";
import ServicesStrip from "@/components/home/ServicesStrip";
import StatsBand from "@/components/home/StatsBand";
import InsightsSection from "@/components/home/InsightsSection";
import AboutSection from "@/components/home/AboutSection";
import CTASection from "@/components/home/CTASection";
import Marquee from "@/components/ui/Marquee";
import { usePageMeta } from "@/hooks/usePageMeta";

const marqueeItems = [
  "Chemistry & Materials",
  "Biomedical & Life Sciences",
  "Environmental & Energy",
  "Engineering & Technology",
  "Physics, Maths & Data",
  "Agricultural & Food Sciences",
  "Management & Business",
  "Social Sciences & Humanities",
  "Law, IP & Entrepreneurship",
];

export default function Home() {
  usePageMeta("NM Research | Research. Intelligence. Innovation.");
  return (
    <>
      <Hero />
      <Marquee items={marqueeItems} duration={42} />
      <Introduction />
      <ResearchAreas />
      <FeaturedResearch />
      <ProcessTimeline />
      <InnovationScene />
      <ServicesStrip />
      <StatsBand />
      <InsightsSection />
      <AboutSection />
      <CTASection />
    </>
  );
}