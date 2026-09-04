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
 * Atomic orbit — a single nucleus ringed by tilted electron shells.
 * Slow, deterministic motion: the whole atom spins, electrons trace their
 * own orbits, and the core breathes.
 */

function circlePoints(radius: number, segments = 64) {
  const pts = new Float32Array((segments + 1) * 3);
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts[i * 3] = Math.cos(a) * radius;
    pts[i * 3 + 1] = Math.sin(a) * radius;
    pts[i * 3 + 2] = 0;
  }
  return pts;
}

const ORBITS = [
  { r: 1.7, rot: [0.95, 0.1, 0], speed: 1.0, phase: 0 },
  { r: 2.35, rot: [0.3, 0.7, 0], speed: 0.7, phase: 2.1 },
  { r: 1.2, rot: [-1.2, 0.25, 0], speed: 1.45, phase: 4.2 },
] as const;

function Orbit({
  r,
  rot,
  speed,
  phase,
  reduced,
  energy,
}: {
  r: number;
  rot: readonly number[];
  speed: number;
  phase: number;
  reduced: boolean;
  energy: MutableRefObject<number>;
}) {
  const ring = useMemo(() => circlePoints(r), [r]);
  const electron = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!electron.current) return;
    const boost = energy.current;
    if (reduced) {
      electron.current.rotation.z = phase;
      return;
    }
    electron.current.rotation.z =
      phase + state.clock.elapsedTime * speed * (1 + boost * 1.6 + sceneBus.pop * 2.6);
  });

  return (
    <group rotation={[rot[0], rot[1], rot[2]]}>
      <lineLoop>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ring, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#851509" transparent opacity={0.28} />
      </lineLoop>
      <group ref={electron}>
        <mesh position={[r, 0, 0]}>
          <sphereGeometry args={[0.085, 16, 16]} />
          <meshBasicMaterial color="#f8f2e4" />
        </mesh>
      </group>
    </group>
  );
}

function Atom({ reduced }: { reduced: boolean }) {
  const spin = useRef<THREE.Group>(null);
  const parallax = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const energy = useRef(0);
  const scroll = useScrollProgress();
  const pointer = useScenePointer(!reduced);
  const motion = useSceneMotion(pointer, { enabled: !reduced, idleSpeed: 0.1 });
  const { value: focus } = useSectionProgress("[data-scene-host]");

  useFrame((state, delta) => {
    const m = motion.current;
    const e = sceneBus.step(delta);
    energy.current = reduced ? 0 : e;
    const s = scroll.current.value;
    const f = 0.4 + 0.6 * focus.current;
    const pop = reduced ? 0 : sceneBus.pop;
    if (parallax.current && !reduced) {
      parallax.current.rotation.set(-sceneBus.py * 0.05 * f, sceneBus.px * 0.06 * f, 0);
    }
    if (spin.current) {
      if (reduced) {
        spin.current.rotation.set(0, s * 0.6, 0);
      } else {
        spin.current.rotation.set(
          m.pitch + m.tiltY,
          m.spin + m.yaw + m.tiltX + s * 1.7,
          0
        );
        spin.current.scale.setScalar(1 + (e * 0.06 + pop * 0.12) * f);
      }
    }
    if (core.current) {
      const t = state.clock.elapsedTime;
      const k = 1 + Math.sin(t * 0.8) * (0.06 + e * 0.12) + pop * 0.25 * f;
      core.current.scale.setScalar(reduced ? 1 : k);
      (core.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.3 + (e * 0.55 + pop * 0.7) * f;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.8}>
      <group ref={parallax}>
        <group ref={spin}>
        <mesh ref={core}>
          <icosahedronGeometry args={[0.32, 1]} />
          <meshStandardMaterial
            color="#f8f2e4"
            emissive="#851509"
            emissiveIntensity={0.35}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.5, 1]} />
          <meshBasicMaterial wireframe color="#851509" transparent opacity={0.16} />
        </mesh>
        <mesh>
          <sphereGeometry args={[2.6, 16, 16]} />
          <meshBasicMaterial color="#851509" wireframe transparent opacity={0.045} />
        </mesh>
        {ORBITS.map((o) => (
          <Orbit key={o.r} {...o} reduced={reduced} energy={energy} />
        ))}
        </group>
      </group>
    </Float>
  );
}

export default function AtomOrbit() {
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Canvas
      dpr={[1, isDesktop ? 1.5 : 1.1]}
      camera={{ position: [0, 0, 5.6], fov: 48 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <pointLight position={[0, 3, 4]} intensity={0.7} color="#851509" />
      <Atom reduced={reduced} />
    </Canvas>
  );
}