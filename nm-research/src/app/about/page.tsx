import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import About from "@/components/sections/About";
import Collaborations from "@/components/sections/Collaborations";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about NM Group of Industries and Research Foundation — our vision, founder, global presence, and commitment to research excellence.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About Us"
        title={
          <>
            A Vision for{" "}
            <span className="emph">
              Global Research Excellence
            </span>
          </>
        }
        subtitle="Become a globally recognized research and innovation foundation conducting high-impact research while empowering the next generation of researchers, scientists, and innovators."
      />
      <About />
      <Collaborations showHeading={false} />
    </>
  );
}
