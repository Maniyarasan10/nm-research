import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScenePointer } from "@/hooks/useScenePointer";
import { useSceneMotion } from "@/hooks/useSceneMotion";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { sceneBus } from "@/lib/sceneBus";

/**
 * HexagonalObject — a precision-engineered hexagonal scientific structure.
 *
 * There is no shipped 3D model asset in the project (all other "objects" are
 * procedural geometry inside r3f/three), so this builds the hexagonal form
 * procedurally with 6-sided cylindrical prisms and rings — consistent with the
 * codebase convention (PrismTowers, LatticeGlobe). It reads as dark graphite
 * metalwork with a low-intensity burgundy accent, floats slowly, and responds
 * to the shared pointer with gentle inertia-based parallax.
 */

function hexRingPoints(radius: number, segments = 6, flip = false) {
  const pts = new Float32Array((segments + 1) * 3);
  const off = flip ? Math.PI / 6 : 0;
  for (let i = 0; i <= segments; i++) {
    const a = off + (i / segments) * Math.PI * 2;
    pts[i * 3] = Math.cos(a) * radius;
    pts[i * 3 + 1] = 0;
    pts[i * 3 + 2] = Math.sin(a) * radius;
  }
  return pts;
}

function HexPrism({
  radius,
  height,
  position,
  rotation,
  accent,
  wireOpacity,
  reduced,
  focus,
}: {
  radius: number;
  height: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  accent?: boolean;
  wireOpacity?: number;
  reduced: boolean;
  focus: MutableRefObject<number>;
}) {
  const fill = useRef<THREE.MeshStandardMaterial>(null);
  const wire = useRef<THREE.MeshBasicMaterial>(null);
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const e = sceneBus.step(delta, 2.2) * (reduced ? 0 : 1);
    const f = 0.35 + 0.65 * focus.current;
    if (fill.current) {
      fill.current.opacity = 0.06 + e * 0.1 * f;
    }
    if (wire.current) {
      wire.current.opacity = (accent ? 0.4 : 0.2) + e * 0.3 * f;
    }
    if (group.current && !reduced) {
      const t = state.clock.elapsedTime;
      group.current.rotation.z = Math.sin(t * 0.6 + radius) * 0.01;
    }
  });

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation ? [rotation[0], rotation[1], rotation[2] ?? 0] : undefined}
    >
      <mesh>
        <cylinderGeometry args={[radius, radius * 1.06, height, 6, 1]} />
        <meshStandardMaterial
          ref={fill}
          color="#6e6a63"
          metalness={0.72}
          roughness={0.32}
          transparent
          opacity={0.06}
        />
      </mesh>
      <mesh>
        <cylinderGeometry args={[radius, radius * 1.06, height, 6, 1]} />
        <meshBasicMaterial
          ref={wire}
          wireframe
          color={accent ? "#7A171C" : "#b8b3ac"}
          transparent
          opacity={wireOpacity ?? 0.2}
        />
      </mesh>
    </group>
  );
}

function HexObject({ reduced }: { reduced: boolean }) {
  const spin = useRef<THREE.Group>(null);
  const parallax = useRef<THREE.Group>(null);
  const pointer = useScenePointer(!reduced);
  const motion = useSceneMotion(pointer, { enabled: !reduced, idleSpeed: 0.12, tiltScale: 0.5 });
  const { value: focus } = useSectionProgress(".founder-section");

  const rings = useMemo(() => {
    return [1.0, 1.55, 2.1].map((r, i) => ({
      pts: hexRingPoints(r, i % 2 === 0 ? 6 : 6),
      r,
    }));
  }, []);

  const coreRing = useMemo(() => hexRingPoints(1.22, 6, true), []);
  const outerDots = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);
  const struts = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);

  useFrame((state, delta) => {
    const m = motion.current;
    const f = 0.35 + 0.65 * focus.current;
    const e = sceneBus.step(delta, 2.2) * (reduced ? 0 : 1);

    if (parallax.current && !reduced) {
      parallax.current.rotation.set(
        -sceneBus.py * 0.06 * f,
        sceneBus.px * 0.07 * f,
        0
      );
    }

    if (spin.current) {
      const t = state.clock.elapsedTime;
      const float = reduced ? 0 : Math.sin(t * 0.8) * 0.05;
      if (reduced) {
        spin.current.rotation.y = t * 0.12;
        return;
      }
      spin.current.rotation.set(
        m.pitch * 0.4 + m.tiltY * 0.5,
        m.spin + m.yaw * 0.6 + m.tiltX * 0.5,
        Math.sin(t * 0.3) * 0.02
      );
      spin.current.position.y = float + e * 0.02 * f;
      spin.current.scale.setScalar(1 + e * 0.03 * f);
    }
  });

  return (
    <group ref={parallax} position={[0, 0, 0]}>
      <group ref={spin} position={[0, 0, 0]}>
        {/* Outer hex frame */}
        <group rotation={[Math.PI / 2, 0, 0]}>
          {rings.map((ring, i) => (
            <group key={i} position={[0, -0.18 * i, 0]}>
              <lineLoop>
                <bufferGeometry>
                  <bufferAttribute attach="attributes-position" args={[ring.pts, 3]} />
                </bufferGeometry>
                <lineBasicMaterial
                  color="#b8b3ac"
                  transparent
                  opacity={0.24 + i * 0.06}
                  depthWrite={false}
                />
              </lineLoop>
            </group>
          ))}
        </group>

        {/* Central hexagonal prism */}
        <HexPrism
          radius={0.9}
          height={0.9}
          position={[0, 0, 0]}
          accent
          wireOpacity={0.42}
          reduced={reduced}
          focus={focus}
        />

        {/* Core ring */}
        <group rotation={[-Math.PI / 2, 0, Math.PI / 6]}>
          <lineLoop>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[coreRing, 3]} />
            </bufferGeometry>
            <lineBasicMaterial color="#7A171C" transparent opacity={0.5} depthWrite={false} />
          </lineLoop>
        </group>

        {/* Vertex dots */}
        {outerDots.map((i) => {
          const a = (i / 6) * Math.PI * 2;
          const x = Math.cos(a) * 2.1;
          const z = Math.sin(a) * 2.1;
          return (
            <mesh key={i} position={[x, 0, z]}>
              <sphereGeometry args={[0.05, 10, 10]} />
              <meshBasicMaterial color="#6e6a63" transparent opacity={0.6} />
            </mesh>
          );
        })}

        {/* Radial struts */}
        {struts.map((i) => {
          const a = (i / 6) * Math.PI * 2;
          const x = Math.cos(a) * 1.6;
          const z = Math.sin(a) * 1.6;
          return (
            <mesh key={i} position={[x, 0, z]} rotation={[0, 0, -a]}>
              <boxGeometry args={[1.4, 0.018, 0.018]} />
              <meshBasicMaterial color="#b8b3ac" transparent opacity={0.16} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export default function HexagonalObject() {
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Canvas
      dpr={[1, isDesktop ? 1.6 : 1.1]}
      camera={{ position: [0, 0.6, 5.4], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 3]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-3, -2, 3]} intensity={0.5} color="#7A171C" />
      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.35}>
        <HexObject reduced={reduced} />
      </Float>
    </Canvas>
  );
}
