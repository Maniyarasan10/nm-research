import Link from "next/link";
import { ShieldCheck, FileCheck2, Users, ArrowRight } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Reproducible methods",
    desc: "Every engagement follows a documented, auditable process.",
  },
  {
    icon: FileCheck2,
    title: "Verified metrics",
    desc: "Reported outcomes map to real journals and measurable results.",
  },
  {
    icon: Users,
    title: "Named experts",
    desc: "Work directly with domain specialists — never a black box.",
  },
];

export default function ReusableSteps() {
  return (
    <section className="border-y border-rule bg-surface-2/50 py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="grid gap-8 sm:grid-cols-3">
            {items.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-rule bg-surface text-brand">
                  <item.icon size={19} strokeWidth={1.6} />
                </span>
                <div>
                  <div className="display text-base font-semibold text-ink">
                    {item.title}
                  </div>
                  <p className="mt-1 text-[0.85rem] leading-relaxed text-ink-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/contact" className="btn btn-ghost shrink-0 group">
            Discuss your project
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
