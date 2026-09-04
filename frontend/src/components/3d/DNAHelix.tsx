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
 * DNA double helix — two cream strands, gold rungs, pulsing base pairs.
 * Rotates slowly and sways subtly so it always reads as organic.
 */

const N = 26;
const R = 1.25;
const H = 3.4;

function helixArrays() {
  const strandA: number[] = [];
  const strandB: number[] = [];
  const rungs: number[] = [];
  const accents: number[] = [];
  for (let i = 0; i <= N; i++) {
    const a = i * 0.42;
    const y = (i / N) * 2 * H - H;
    const x = Math.cos(a) * R;
    const z = Math.sin(a) * R;
    strandA.push(x, y, z);
    strandB.push(-x, y, -z);
    rungs.push(x, y, z, -x, y, -z);
    if (i % 4 === 0) accents.push(x, y, z);
  }
  return {
    points: new Float32Array([...strandA, ...strandB]),
    rungs: new Float32Array(rungs),
    accents: new Float32Array(accents),
  };
}

function Helix({
  reduced,
  energy,
  scroll,
}: {
  reduced: boolean;
  energy: MutableRefObject<number>;
  scroll: MutableRefObject<{ value: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  const parallax = useRef<THREE.Group>(null);
  const strands = useRef<THREE.PointsMaterial>(null);
  const rungs = useRef<THREE.LineBasicMaterial>(null);
  const accents = useRef<THREE.PointsMaterial>(null);
  const { points, rungs: rungPos, accents: accentPos } = useMemo(() => helixArrays(), []);
  const pointer = useScenePointer(!reduced);
  const motion = useSceneMotion(pointer, { enabled: !reduced, idleSpeed: 0.22 });
  const { value: focus } = useSectionProgress("[data-scene-host]");

  useFrame((state) => {
    const m = motion.current;
    if (!group.current || reduced) return;
    const e = energy.current;
    const s = scroll.current.value;
    const t = state.clock.elapsedTime;
    const pop = sceneBus.pop;
    const f = 0.4 + 0.6 * focus.current;
    group.current.rotation.set(
      m.pitch + m.tiltY + Math.sin(m.spin * 0.6) * 0.08,
      m.spin + m.yaw + m.tiltX + s * Math.PI * 0.9 + e * 0.25,
      Math.sin(t * 0.12) * 0.06
    );
    group.current.scale.setScalar(1 + (e * 0.08 + pop * 0.1) * f);
    if (parallax.current) {
      parallax.current.rotation.set(-sceneBus.py * 0.05 * f, sceneBus.px * 0.06 * f, 0);
    }
    if (strands.current) strands.current.opacity = 0.75 + (e * 0.22 + pop * 0.3) * f;
    if (rungs.current) {
      rungs.current.opacity = 0.28 + s * 0.15 + (e * 0.3 + pop * 0.4) * f;
    }
    if (accents.current) {
      accents.current.opacity = 0.75 + (e * 0.25 + pop * 0.3) * f;
      accents.current.size = 0.15 + e * 0.05 + pop * 0.05;
    }
  });

  return (
    <group ref={parallax}>
      <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={strands}
          color="#4c443b"
          size={0.07}
          sizeAttenuation
          transparent
          opacity={0.85}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[rungPos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={rungs}
          color="#851509"
          transparent
          opacity={0.32}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[accentPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={accents}
          color="#851509"
          size={0.16}
          sizeAttenuation
          transparent
          opacity={0.9}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </points>
      </group>
    </group>
  );
}

function HelixWrapper({ reduced }: { reduced: boolean }) {
  const energy = useRef(0);
  const scroll = useScrollProgress();

  useFrame((_, delta) => {
    energy.current = sceneBus.step(delta);
  });

  return <Helix reduced={reduced} energy={energy} scroll={scroll} />;
}

export default function DNAHelix() {
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Canvas
      dpr={[1, isDesktop ? 1.5 : 1.1]}
      camera={{ position: [0, 0, 6.4], fov: 48 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.5}>
        <HelixWrapper reduced={reduced} />
      </Float>
    </Canvas>
  );
}