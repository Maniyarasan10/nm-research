import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScenePointer } from "@/hooks/useScenePointer";
import { useSceneMotion } from "@/hooks/useSceneMotion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { sceneBus } from "@/lib/sceneBus";

/**
 * Prism towers — three ascending hexagonal crystals, a quiet metaphor for
 * the Community → Platinum → Prime journey. Wireframe gold with a faint
 * translucent fill; each column breathes slightly out of phase.
 */

const TOWERS = [
  { y: 1.0, r: 0.52, phase: 0 },
  { y: 1.55, r: 0.6, phase: 2.1 },
  { y: 2.1, r: 0.68, phase: 4.2 },
] as const;

function Tower({
  y,
  r,
  phase,
  accent,
  reduced,
  energy,
  scroll,
  focus,
  isCenter,
}: {
  y: number;
  r: number;
  phase: number;
  accent: boolean;
  reduced: boolean;
  energy: MutableRefObject<number>;
  scroll: MutableRefObject<{ value: number }>;
  focus: MutableRefObject<number>;
  isCenter: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const fill = useRef<THREE.MeshStandardMaterial>(null);
  const wireframe = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const e = energy.current;
    const s = scroll.current.value;
    const t = state.clock.elapsedTime;
    if (reduced) {
      ref.current.scale.y = 0.85 + s * 0.35;
      return;
    }
    const pop = sceneBus.pop;
    const f = 0.4 + 0.6 * focus.current;
    const breathe = 1 + Math.sin(t * 0.5 + phase) * 0.02;
    ref.current.scale.y =
      breathe * (0.85 * (0.78 + 0.22 * f) + s * 0.4 + (e * 0.12 + pop * 0.15) * f);
    ref.current.scale.x = 1 + (e * 0.05 + pop * 0.06) * f;
    ref.current.scale.z = 1 + (e * 0.05 + pop * 0.06) * f;
    if (fill.current) fill.current.opacity = 0.07 + (e * 0.1 + pop * 0.12) * f;
    if (wireframe.current) {
      wireframe.current.opacity = (accent ? 0.42 : 0.2) + (e * 0.35 + pop * 0.4) * f;
    }
  });

  return (
    <group ref={ref} position={[0, y, 0]}>
      <mesh>
        <cylinderGeometry args={[r, r * 1.12, y * 2, 6, 1]} />
        <meshStandardMaterial
          ref={fill}
          color={accent ? "#851509" : "#f8f2e4"}
          transparent
          opacity={0.09}
          roughness={0.5}
          metalness={0.4}
        />
      </mesh>
      <mesh>
        <cylinderGeometry args={[r, r * 1.12, y * 2, 6, 1]} />
        <meshBasicMaterial
          ref={wireframe}
          wireframe
          color="#851509"
          transparent
          opacity={accent ? 0.5 : 0.24}
        />
      </mesh>
      {isCenter && (
        <mesh position={[0, y, 0.52]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshBasicMaterial color="#851509" />
        </mesh>
      )}
    </group>
  );
}

function BaseRing({ reduced }: { reduced: boolean }) {
  const ring = useMemo(() => {
    const pts = new Float32Array(73 * 3);
    for (let i = 0; i <= 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      pts[i * 3] = Math.cos(a) * 1.5;
      pts[i * 3 + 1] = 0;
      pts[i * 3 + 2] = Math.sin(a) * 1.5;
    }
    return pts;
  }, []);

  void reduced;

  return (
    <lineLoop>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[ring, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#851509" transparent opacity={0.3} />
    </lineLoop>
  );
}

function Cluster({ reduced }: { reduced: boolean }) {
  const spin = useRef<THREE.Group>(null);
  const parallax = useRef<THREE.Group>(null);
  const energy = useRef(0);
  const scroll = useScrollProgress();
  const pointer = useScenePointer(!reduced);
  const motion = useSceneMotion(pointer, { enabled: !reduced, idleSpeed: 0.18 });
  const { value: focus } = useSectionProgress("[data-scene-host]");

  useFrame((_, delta) => {
    const m = motion.current;
    const f = 0.4 + 0.6 * focus.current;
    if (parallax.current && !reduced) {
      parallax.current.rotation.set(-sceneBus.py * 0.05 * f, sceneBus.px * 0.06 * f, 0);
    }
    if (spin.current) {
      if (reduced) {
        spin.current.rotation.y = scroll.current.value * 0.6;
      } else {
        spin.current.rotation.set(
          m.pitch + m.tiltY,
          m.spin + m.yaw + m.tiltX + scroll.current.value * 0.9,
          Math.sin(performance.now() / 2000) * 0.02
        );
        const pop = sceneBus.pop;
        spin.current.scale.setScalar(1 + pop * 0.12 * f);
      }
    }
    energy.current = reduced ? 0 : sceneBus.step(delta);
  });

  return (
    <group ref={parallax}>
      <group ref={spin}>
        {TOWERS.map((t, i) => (
          <group key={t.y} position={[(i - 1) * 0.85, 0, 0]}>
            <Tower
              {...t}
              accent={i === 1}
              reduced={reduced}
              energy={energy}
              scroll={scroll}
              focus={focus}
              isCenter={i === 1}
            />
          </group>
        ))}
        <group position={[0, 0.04, 0]}>
          <BaseRing reduced={reduced} />
        </group>
      </group>
    </group>
  );
}

export default function PrismTowers() {
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Canvas
      dpr={[1, isDesktop ? 1.6 : 1.1]}
      camera={{ position: [0, 1.6, 6], fov: 48 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 4, 4]} intensity={0.7} color="#851509" />
      <Float speed={1.3} rotationIntensity={0.18} floatIntensity={0.5}>
        <Cluster reduced={reduced} />
      </Float>
    </Canvas>
  );
}