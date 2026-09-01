"use client";

import { motion } from "framer-motion";

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Flask() {
  return (
    <svg viewBox="0 0 44 44" fill="none" className="h-full w-full">
      <path
        d="M18 6h8M19 6v10l-8 16a3 3 0 0 0 2.7 4.3h16.6A3 3 0 0 0 33 32l-8-16V6"
        {...strokeProps}
      />
      <path d="M13.5 26h17" {...strokeProps} opacity={0.35} />
      {[{ cx: 19, cy: 30, delay: 0 }, { cx: 24, cy: 32, delay: 0.6 }, { cx: 21.5, cy: 34, delay: 1.2 }].map(
        (b) => (
          <motion.circle
            key={b.cx}
            cx={b.cx}
            cy={b.cy}
            r={1.4}
            fill="currentColor"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: b.delay }}
          />
        ),
      )}
    </svg>
  );
}

function Dna() {
  const ys = [8, 14, 20, 26, 32, 38];
  return (
    <svg viewBox="0 0 44 44" fill="none" className="h-full w-full">
      {ys.map((y, i) => {
        const w = i % 2 === 0 ? 16 : 8;
        const x = 22 - w / 2;
        return (
          <motion.rect
            key={y}
            x={x}
            y={y - 1}
            width={w}
            height={2}
            rx={1}
            fill="currentColor"
            animate={{ opacity: [0.35, 1, 0.35], scaleX: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.18 }}
          />
        );
      })}
    </svg>
  );
}

function Turbine() {
  return (
    <svg viewBox="0 0 44 44" fill="none" className="h-full w-full">
      <path d="M22 18v20" {...strokeProps} />
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ originX: "22px", originY: "18px" }}
      >
        <path d="M22 18c0-7-8-8-11-6 2 8 8 9 11 6Z" fill="currentColor" opacity={0.85} />
        <path d="M22 18c-.5-6-6-7.5-8.5-6 1.5 6 6 7 8.5 6Z" fill="currentColor" opacity={0.65} />
        <path d="M22 18c1 6 7 7 9 5-1.5-6-6.5-6.5-9-5Z" fill="currentColor" opacity={0.45} />
      </motion.g>
      <circle cx={22} cy={18} r={2} fill="currentColor" />
    </svg>
  );
}

function Sprout() {
  return (
    <svg viewBox="0 0 44 44" fill="none" className="h-full w-full">
      <path d="M22 36V20" {...strokeProps} />
      <path d="M22 20c0-7-8-8-11-6 2 8 8 9 11 6Z" fill="currentColor" opacity={0.75} />
      <path d="M22 24c0-7 8-8 11-6-2 8-8 9-11 6Z" fill="currentColor" opacity={0.55} />
      <path d="M15 36h14" {...strokeProps} opacity={0.3} />
    </svg>
  );
}

function Gear() {
  const teeth = [];
  for (let i = 0; i < 8; i++) {
    const a = i * 45;
    teeth.push(<rect key={i} x={20.5} y={4} width={3} height={6} rx={1} fill="currentColor" transform={`rotate(${a} 22 22)`} />);
  }
  return (
    <svg viewBox="0 0 44 44" fill="none" className="h-full w-full">
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ originX: "50%", originY: "50%" }}>
        {teeth}
        <circle cx={22} cy={22} r={10} {...strokeProps} />
        <circle cx={22} cy={22} r={3.4} fill="currentColor" />
      </motion.g>
    </svg>
  );
}

function Battery() {
  return (
    <svg viewBox="0 0 44 44" fill="none" className="h-full w-full">
      <rect x={6} y={15} width={28} height={14} rx={3} {...strokeProps} />
      <rect x={35} y={19} width={3} height={6} rx={1} fill="currentColor" />
      <motion.rect
        x={9}
        y={18}
        width={22}
        height={8}
        rx={1.5}
        fill="currentColor"
        opacity={0.85}
        animate={{ width: [10, 22, 10] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <path d="M23 14l-6 9h4l-2 7 7-10h-4l1-6z" fill="currentColor" opacity={0.9} />
    </svg>
  );
}

function Atom() {
  const orbits = [
    { rot: 0, dur: 5 },
    { rot: 60, dur: 6 },
    { rot: 120, dur: 7 },
  ];
  return (
    <svg viewBox="0 0 44 44" fill="none" className="h-full w-full">
      {orbits.map((o) => (
        <g key={o.rot} transform={`rotate(${o.rot} 22 22)`}>
          <ellipse cx={22} cy={22} rx={16} ry={6} {...strokeProps} opacity={0.55} />
          <motion.circle
            cx={6}
            cy={22}
            r={1.8}
            fill="currentColor"
            animate={{ rotate: 360 }}
            transition={{ duration: o.dur, repeat: Infinity, ease: "linear" }}
            style={{ originX: "22px", originY: "22px" }}
          />
        </g>
      ))}
      <circle cx={22} cy={22} r={3} fill="currentColor" />
    </svg>
  );
}

function Chart() {
  return (
    <svg viewBox="0 0 44 44" fill="none" className="h-full w-full">
      <path d="M8 34h28" {...strokeProps} opacity={0.3} />
      {[
        { x: 12, y: 18, h: 16, delay: 0 },
        { x: 20.5, y: 12, h: 22, delay: 0.3 },
        { x: 29, y: 8, h: 26, delay: 0.6 },
      ].map((bar) => (
        <motion.rect
          key={bar.x}
          x={bar.x}
          y={bar.y}
          width={5}
          height={bar.h}
          rx={1.5}
          fill="currentColor"
          opacity={0.75}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: bar.delay }}
        />
      ))}
    </svg>
  );
}

function Speech() {
  return (
    <svg viewBox="0 0 44 44" fill="none" className="h-full w-full">
      <path
        d="M8 12a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H18l-7 6v-6h-1a4 4 0 0 1-4-4V12Z"
        {...strokeProps}
      />
      {[16, 22, 28].map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy={18}
          r={1.8}
          fill="currentColor"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </svg>
  );
}

function Scale() {
  return (
    <svg viewBox="0 0 44 44" fill="none" className="h-full w-full">
      <path d="M22 8v26" {...strokeProps} />
      <path d="M15 34h14" {...strokeProps} opacity={0.4} />
      <motion.g
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "22px", originY: "16px" }}
      >
        <path d="M9 16h26" {...strokeProps} />
        <path d="M9 16l-4 9a4.2 4.2 0 0 0 8 0Z" {...strokeProps} opacity={0.7} />
        <path d="M35 16l-4 9a4.2 4.2 0 0 0 8 0Z" {...strokeProps} opacity={0.7} />
      </motion.g>
      <circle cx={22} cy={15} r={2} fill="currentColor" />
    </svg>
  );
}

function Book() {
  return (
    <svg viewBox="0 0 44 44" fill="none" className="h-full w-full">
      <motion.path
        d="M22 12c3-2.5 7-3 13-2v22c-6-1-10-0.5-13 2V12Z"
        {...strokeProps}
        fill="currentColor"
        opacity={0.15}
        animate={{ rotate: [0, -4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "22px", originY: "12px" }}
      />
      <path d="M22 12c-3-2.5-7-3-13-2v22c6-1 10-0.5 13 2V12Z" {...strokeProps} />
    </svg>
  );
}

const icons: Record<string, () => React.ReactElement> = {
  flask: Flask,
  dna: Dna,
  turbine: Turbine,
  sprout: Sprout,
  gear: Gear,
  battery: Battery,
  atom: Atom,
  chart: Chart,
  speech: Speech,
  scale: Scale,
  book: Book,
};

export default function DomainIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = icons[icon] ?? Flask;
  return <div className={className}>{Icon()}</div>;
}
