import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with NM Group of Industries and Research Foundation — research consulting, publication support, and collaboration enquiries.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Get In Touch"
        title={
          <>
            Start Your{" "}
            <span className="emph">
              Research Journey
            </span>
          </>
        }
        subtitle="Have a research project, publication, or collaboration in mind? We're here to help."
      />
      <Contact showHeading={false} />
    </>
  );
}
