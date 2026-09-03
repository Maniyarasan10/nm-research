import Image from "next/image";

/**
 * Research-domain iconography.
 *
 * Renders an optimised WebP brand icon (colour-matched to each domain's
 * accent) via next/image with a safe fallback. Lightweight, static and
 * theme-independent — the icons carry their own accent colour so they stay
 * legible inside bordered tiles on every surface.
 */
const ICON_PATHS: Record<string, string> = {
  flask: "/images/domains/flask.webp",
  dna: "/images/domains/dna.webp",
  turbine: "/images/domains/turbine.webp",
  sprout: "/images/domains/sprout.webp",
  gear: "/images/domains/gear.webp",
  battery: "/images/domains/battery.webp",
  atom: "/images/domains/atom.webp",
  chart: "/images/domains/chart.webp",
  speech: "/images/domains/speech.webp",
  scale: "/images/domains/scale.webp",
  book: "/images/domains/book.webp",
};

export default function DomainIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const src = ICON_PATHS[icon] ?? ICON_PATHS.flask;
  return (
    <Image
      src={src}
      alt=""
      width={40}
      height={40}
      className={className}
      data-domain-icon="true"
      unoptimized
    />
  );
}
