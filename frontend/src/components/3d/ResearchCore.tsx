import { Suspense, useEffect, useMemo, useRef } from "react";
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
 * Research core — an icosahedral knot inside a drifting particle field.
 *
 * Lives, scrolls and reacts, not sits:
 *  - scroll drills the camera into the field (cinematic fly-in)
 *  - the drag pad + pointer parallax tilt the whole scene
 *  - hovering interactive UI charges `sceneBus.energy`, which brightens the
 *    core, speeds the particles and nudges the camera
 * Under reduced motion it renders a static, legible constellation.
 */

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Field({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  const positions = useMemo(() => {
    const rng = mulberry32(0x4e4d);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 6 + rng() * 5;
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  // A soft radial sprite so the points render as soft circles regardless of
  // size — otherwise texture-less points become harsh squares when energy/pop
  // makes them grow.
  const sprite = useMemo(() => {
    if (typeof document === "undefined") return null;
    const size = 64;
    const cv = document.createElement("canvas");
    cv.width = cv.height = size;
    const g = cv.getContext("2d");
    if (!g) return null;
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.6)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(cv);
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    if (reduced) {
      ref.current.rotation.y = 0.3;
      if (material.current) material.current.opacity = 0.35;
      return;
    }
    // energy/pop stepped once per frame in <Core>, read here so the field
    // and the core agree on one bus value.
    const energy = sceneBus.energy;
    const pop = sceneBus.pop;
    ref.current.rotation.y += delta * (0.04 + energy * 0.1);
    ref.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.15) * 0.05 + energy * 0.06;
    if (material.current) {
      material.current.opacity = 0.35 + energy * 0.2 + pop * 0.15;
      material.current.size = 0.035 + energy * 0.012 + pop * 0.012;
    }
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        transparent
        color="#8a7a68"
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.NormalBlending}
        opacity={0.35}
        map={sprite ?? undefined}
      />
    </points>
  );
}

function Core({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const knot = useRef<THREE.Mesh>(null);
  const pointer = useScenePointer(!reduced);
  const motion = useSceneMotion(pointer, {
    enabled: !reduced,
    idleSpeed: 0.1,
    tiltScale: 0.4,
  });
  const scroll = useScrollProgress();
  const { value: focus } = useSectionProgress("[data-hero-scene]");

  // Monotonic hero-local scroll: grows 0 -> 1 as the hero scrolls up past the
  // top of the viewport. Unlike the global normalized progress, this never
  // snaps down when the page's total scrollHeight changes (e.g. when the
  // pinned innovation section below engages a pin-spacer), so the camera
  // fly-in size eases in and stays — no sudden "reposition to original".
  const heroScroll = useRef({ s: 0 });
  useEffect(() => {
    const update = () => {
      const root = document.querySelector<HTMLElement>("[data-hero-scene]");
      if (!root) return;
      const h = root.offsetHeight || 1;
      heroScroll.current.s = Math.min(1, Math.max(0, -root.getBoundingClientRect().top / h));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useFrame((state, delta) => {
    const m = motion.current;
    const s = scroll.current.value;
    const f = 0.35 + 0.65 * focus.current;
    const energy = reduced ? 0 : sceneBus.step(delta);
    const pop = reduced ? 0 : sceneBus.pop;
    // Cap the reactive strength so hover/taps don't whip the scene around.
    const amp = Math.min(0.5 + 0.5 * focus.current, 1);

    if (group.current) {
      if (reduced) {
        group.current.rotation.y = s * 0.4;
        return;
      }
      group.current.rotation.y = m.spin + m.yaw + m.tiltX + s * Math.PI * 0.7;
      group.current.rotation.y += energy * 0.1 * amp + pop * 0.08 * amp;
      group.current.rotation.x =
        m.pitch + m.tiltY + Math.sin(state.clock.elapsedTime * 0.1) * 0.04;
      group.current.scale.setScalar(1 + (energy * 0.05 + pop * 0.06) * f);
    }

    if (shell.current) {
      const t = state.clock.elapsedTime;
      shell.current.rotation.x += delta * 0.1;
      shell.current.rotation.y += delta * (0.14 + energy * 0.04 + pop * 0.05);
      const s2 =
        1 + Math.sin(t * 0.6) * 0.03 + (energy * 0.05 + pop * 0.12) * f;
      shell.current.scale.setScalar(s2);
      (shell.current.material as THREE.MeshBasicMaterial).opacity =
        0.25 + (energy * 0.12 + pop * 0.15) * f;
    }

    if (knot.current) {
      const mat = knot.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.18 + (energy * 0.3 + pop * 0.3) * f;
      knot.current.scale.setScalar(1 + (energy * 0.1 + pop * 0.12) * f);
    }

    // cinematic fly-in: scrolling the hero pushes the camera into the field.
    // use the monotonic hero-local progress so the size change is smooth and
    // never snaps back from layout/pin-driven scrollHeight shifts.
    const fly = Math.min(1, heroScroll.current.s * 3);
    // scene-wide pointer parallax (shared, smoothed) instead of the canvas-local one
    const tx = sceneBus.px * 0.7;
    const ty = -sceneBus.py * 0.45;
    const k = 1 - Math.exp(-delta * 3);
    state.camera.position.x += (tx - state.camera.position.x) * k;
    state.camera.position.y += (ty - state.camera.position.y) * k;
    // keep the z-drive purely scroll-driven; avoid pop/energy jumps that read
    // as a sudden fast zoom (the reported "fast spin").
    state.camera.position.z +=
      (THREE.MathUtils.lerp(7, 4.6, fly) - state.camera.position.z) *
      Math.min(1, delta * 4);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      <Float speed={0.6} rotationIntensity={0.16} floatIntensity={0.35}>
        <mesh ref={shell}>
          <icosahedronGeometry args={[1.6, 1]} />
          <meshBasicMaterial wireframe color="#851509" transparent opacity={0.25} />
        </mesh>
        <mesh ref={knot}>
          <icosahedronGeometry args={[0.4, 1]} />
          <meshStandardMaterial
            color="#16130f"
            emissive="#a3362a"
            emissiveIntensity={0.18}
            roughness={0.35}
            metalness={0.5}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function ResearchCore() {
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const count = !isDesktop ? 1400 : 3600;

  return (
    <Canvas
      dpr={[1, isDesktop ? 1.5 : 1.1]}
      camera={{ position: [0, 0, 7], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Core reduced={reduced} />
        {!reduced && <Field count={count} reduced={reduced} />}
      </Suspense>
    </Canvas>
  );
}