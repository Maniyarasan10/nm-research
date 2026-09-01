import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import ServicesSection from "@/components/sections/ServicesSection";
import Registration from "@/components/sections/Registration";
import ResearchSection from "@/components/sections/ResearchSection";
import Collaborations from "@/components/sections/Collaborations";
import Membership from "@/components/sections/Membership";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <ServicesSection />
      <Registration />
      <ResearchSection />
      <Collaborations />
      <Membership />
      <Contact />
    </>
  );
}
