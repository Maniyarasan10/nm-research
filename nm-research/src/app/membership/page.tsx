import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Membership from "@/components/sections/Membership";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Choose your research journey — Community, Platinum, and Prime membership plans from NM Group of Industries and Research Foundation.",
};

export default function MembershipPage() {
  return (
    <>
      <PageHero
        label="Membership Plans"
        title={
          <>
            Choose Your{" "}
            <span className="emph">
              Research Journey
            </span>
          </>
        }
        subtitle="Select the membership that matches your research ambitions and unlock exclusive benefits."
      />
      <Membership />
    </>
  );
}
