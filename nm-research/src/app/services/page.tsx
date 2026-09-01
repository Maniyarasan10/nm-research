import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ServicesSection from "@/components/sections/ServicesSection";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Research paper writing, publication support, PhD assistance, research consulting, analytical services, and global conferences from NM Group.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="What We Offer"
        title={
          <>
            Research{" "}
            <span className="emph">
              Services & Support
            </span>
          </>
        }
        subtitle="End-to-end research assistance — from topic selection to publication in top-ranked international journals."
      />
      <ServicesSection showHeading={false} />
      <Contact showHeading={false} />
    </>
  );
}
