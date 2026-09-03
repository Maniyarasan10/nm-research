import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import ServicesSection from "@/components/sections/ServicesSection";
import Registration from "@/components/sections/Registration";
import ResearchSection from "@/components/sections/ResearchSection";
import Marquee from "@/components/ui/Marquee";
import Collaborations from "@/components/sections/Collaborations";
import Membership from "@/components/sections/Membership";
import Contact from "@/components/sections/Contact";

const marqueeTags = [
  "Chemistry & Materials",
  "Biomedical & Life Sciences",
  "Environmental & Energy",
  "Engineering & Technology",
  "Physics, Maths & Data",
  "Agricultural & Food Sciences",
  "Management & Business",
  "Social Sciences & Humanities",
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <ServicesSection />
      <Registration />
      <ResearchSection />
      <Marquee items={marqueeTags} duration={42} />
      <Collaborations />
      <Membership />
      <Contact />
    </>
  );
}
