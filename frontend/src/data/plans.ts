import { site } from "./site";

export type Plan = {
  slug: string;
  tier: string;
  price: number;
  featured?: boolean;
  badge?: string;
  benefits: string[];
  summary: string;
};

export const plans: Plan[] = [
  {
    slug: "community",
    tier: "Community",
    price: 2999,
    badge: "Entry",
    summary:
      "Free authorships in a Scopus journal, conference participation and monthly webinars — a starting point for every researcher.",
    benefits: [
      "Free Authorships in Scopus Journal",
      "1 International Conference Participation",
      "1 National Conference Participation",
      "Monthly Research Webinars",
      "NM Member Certificate",
    ],
  },
  {
    slug: "platinum",
    tier: "Platinum",
    price: 29999,
    featured: true,
    badge: "Most Popular",
    summary:
      "Publication support, more conferences, consultancy and PhD guidance — the balanced tier for active researchers.",
    benefits: [
      "1 SCI/Scopus Publication Support",
      "2 International Conferences",
      "Research Consultancy Sessions",
      "Priority Publication Review",
      "PhD Guidance Sessions",
      "All Community Benefits Included",
    ],
  },
  {
    slug: "prime",
    tier: "Prime",
    price: 49999,
    badge: "Top Tier",
    summary:
      "The fullest plan — dedicated mentor, more publications and conferences, book assistance and more.",
    benefits: [
      "2 SCI/Scopus Publications Support",
      "3 International Conferences",
      "Dedicated Research Mentor",
      "Book Publication Assistance",
      "Analytical Services Discount",
      "All Platinum Benefits Included",
    ],
  },
];

export const formatINR = (n: number) => n.toLocaleString("en-IN");

export const paymentNote = {
  how: [
    "Scan the QR or tap “Pay in UPI App”",
    "Confirm the amount and pay",
    "Note your UPI reference / transaction ID",
    "Email the screenshot to " + site.contact.emails[0],
  ],
  activation: "Activated within 24 hours of payment confirmation.",
  terms: "Billed annually · Cancel anytime",
};
