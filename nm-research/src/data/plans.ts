export interface Plan {
  slug: string;
  tier: string;
  price: number;
  featured?: boolean;
  badge?: string;
  benefits: string[];
}

export const plans: Plan[] = [
  {
    slug: "community",
    tier: "Community",
    price: 2999,
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

export function getPlanBySlug(slug: string): Plan | undefined {
  return plans.find((p) => p.slug === slug);
}

export const formatINR = (n: number) => n.toLocaleString("en-IN");
