import type { ReactNode } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";

type MagneticProps = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

export default function Magnetic({
  children,
  strength = 0.4,
  className,
}: MagneticProps) {
  const ref = useMagnetic<HTMLDivElement>(strength);
  return (
    <div
      ref={ref}
      className={className}
      style={{ display: "inline-flex", willChange: "transform" }}
    >
      {children}
    </div>
  );
}