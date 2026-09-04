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
 * Lattice globe — a wireframe celestial sphere with latitude rings and
 * pulsing "city" nodes. Reads as global reach without looking like a map.
 */

function fibonacciSphere(n: number, radius: number) {
  const pts: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push(
      new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius
      )
    );
  }
  return pts;
}

function ringPoints(radius: number, segments = 72) {
  const pts = new Float32Array((segments + 1) * 3);
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts[i * 3] = Math.cos(a) * radius;
    pts[i * 3 + 1] = 0;
    pts[i * 3 + 2] = Math.sin(a) * radius;
  }
  return pts;
}

function PulsingNode({
  position,
  reduced,
  phase,
  energy,
}: {
  position: [number, number, number];
  reduced: boolean;
  phase: number;
  energy: MutableRefObject<number>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const e = energy.current;
    const pop = reduced ? 0 : sceneBus.pop;
    const s = reduced ? 1 : 1 + Math.sin(t * 1.4 + phase) * (0.35 + e * 0.35 + pop * 0.5);
    ref.current.scale.setScalar(s);
    if (material.current) material.current.opacity = 0.55 + e * 0.45 + pop * 0.4;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.09, 12, 12]} />
      <meshBasicMaterial ref={material} color="#851509" transparent opacity={0.8} />
    </mesh>
  );
}

function Globe({ reduced }: { reduced: boolean }) {
  const spin = useRef<THREE.Group>(null);
  const parallax = useRef<THREE.Group>(null);
  const wire = useRef<THREE.MeshBasicMaterial>(null);
  const points = useRef<THREE.PointsMaterial>(null);
  const energy = useRef(0);
  const scroll = useScrollProgress();
  const pointer = useScenePointer(!reduced);
  const motion = useSceneMotion(pointer, { enabled: !reduced, idleSpeed: 0.14, tiltScale: 0.5 });
  const { value: focus } = useSectionProgress("[data-scene-host]");
  const { points: pointPos } = useMemo(() => {
    const pts = fibonacciSphere(48, 2.1);
    const arr = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    return { points: arr };
  }, []);

  const latRings = useMemo(
    () => [-1.1, -0.4, 0, 0.4, 1.1, 1.6, 2.1].map((y) => ringPoints(Math.sqrt(Math.max(2.1 * 2.1 - y * y, 0)))),
    []
  );
  const longRings = useMemo(
    () => [0, Math.PI / 3, (2 * Math.PI) / 3].map(() => ringPoints(2.1)),
    []
  );

  const cities: [number, number, number][] = [
    [1.9, 0.5, 0.4],
    [-1.7, 0.9, 0.6],
    [0.6, -1.5, 1.1],
    [-1.2, -0.4, -1.5],
    [1.4, 1.2, -0.8],
    [-0.5, 1.8, 0.5],
    [1.1, -1.1, -1.2],
    [-1.8, -1.0, -0.3],
  ];

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
        spin.current.rotation.y = s * 0.8;
      } else {
        spin.current.rotation.set(
          m.pitch + m.tiltY,
          m.spin + m.yaw + m.tiltX + s * 1.2,
          Math.sin(state.clock.elapsedTime * 0.1) * 0.05
        );
        spin.current.scale.setScalar(1 + (e * 0.06 + pop * 0.08) * f);
      }
    }
    if (wire.current) wire.current.opacity = 0.24 + (e * 0.4 + pop * 0.35) * f;
    if (points.current) points.current.opacity = 0.55 + (e * 0.35 + pop * 0.3) * f;
  });

  return (
    <group ref={parallax}>
      <group ref={spin}>
      <mesh>
        <icosahedronGeometry args={[2.1, 1]} />
        <meshBasicMaterial ref={wire} wireframe color="#851509" transparent opacity={0.3} />
      </mesh>

      {latRings.map((pts, i) => (
        <group key={`lat-${i}`} rotation={[-Math.PI / 2, 0, 0]}>
          <lineLoop>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[pts, 3]} />
            </bufferGeometry>
            <lineBasicMaterial color="#851509" transparent opacity={0.28} />
          </lineLoop>
        </group>
      ))}

      {longRings.map((pts, i) => (
        <group key={`lon-${i}`} rotation={[0, i, 0]}>
          <lineLoop>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[pts, 3]} />
            </bufferGeometry>
            <lineBasicMaterial color="#851509" transparent opacity={0.22} />
          </lineLoop>
        </group>
      ))}

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pointPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={points}
          color="#6b5c4d"
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.7}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </points>

      {cities.map((p, i) => (
        <PulsingNode key={i} position={p} reduced={reduced} phase={i * 0.9} energy={energy} />
      ))}
      </group>
    </group>
  );
}

export default function LatticeGlobe() {
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Canvas
      dpr={[1, isDesktop ? 1.6 : 1.1]}
      camera={{ position: [0, 0, 6], fov: 48 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.5}>
        <Globe reduced={reduced} />
      </Float>
    </Canvas>
  );
}