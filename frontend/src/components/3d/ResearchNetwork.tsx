import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSectionProgress } from "@/hooks/useSectionProgress";
import { sceneBus } from "@/lib/sceneBus";

/**
 * Scroll-linked research ecosystem map.
 *
 * A living constellation mapped on a Fibonacci sphere:
 *   - 130+ twinkling research nodes (per-vertex shader pulse)
 *   - wine-red hub nodes that anchor the network
 *   - three dashed orbit rings with travelling satellites
 *   - a slow radar sweep around the outermost shell
 *   - soft central glow + counter-rotating wireframe shells + dust
 *
 * The group rotates with scroll progress and the camera drifts on pointer
 * movement, so the map is scrubbed, not autonomous. Reduced-motion keeps a
 * single static, readable constellation.
 */

/* ---- shared geometry helpers --------------------------------------------- */

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

function ringGeo(radius: number, tilt: [number, number, number]) {
  const segments = 110;
  const pts = new Float32Array(segments * 3);
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts[i * 3] = Math.cos(a) * radius;
    pts[i * 3 + 1] = 0;
    pts[i * 3 + 2] = Math.sin(a) * radius;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
  geo.applyMatrix4(
    new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...tilt))
  );
  return geo;
}

/** small dots spaced around an orbit ring so ring rotation reads visually */
function ringDotsGeo(radius: number, tilt: [number, number, number], step = 7) {
  const segments = 110;
  const count = Math.floor(segments / step);
  const pts = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = ((i * step) / segments) * Math.PI * 2;
    pts[i * 3] = Math.cos(a) * radius;
    pts[i * 3 + 1] = 0;
    pts[i * 3 + 2] = Math.sin(a) * radius;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
  geo.applyMatrix4(
    new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...tilt))
  );
  return geo;
}

function arcGeo(radius: number, from: number, to: number) {
  const pts: number[] = [];
  const steps = 46;
  for (let i = 0; i <= steps; i++) {
    const a = from + ((to - from) * i) / steps;
    pts.push(Math.cos(a) * radius, 0, Math.sin(a) * radius);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
  return geo;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---- twinkling node points ---------------------------------------------- */

const TWINKLE_VERT = /* glsl */ `
  attribute float aPhase;
  uniform float uTime;
  uniform float uSize;
  varying float vA;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float pulse = 0.72 + 0.4 * sin(uTime * 1.7 + aPhase);
    gl_PointSize = uSize * pulse * (150.0 / -mv.z);
    vA = clamp(pulse, 0.0, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const TWINKLE_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vA;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.14, d);
    gl_FragColor = vec4(uColor, uOpacity * vA * alpha);
  }
`;

/* ---- orbital ring with a travelling satellite --------------------------- */

function OrbitRing({
  radius,
  tilt,
  speed,
  reduced,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  reduced: boolean;
}) {
  const spin = useRef<THREE.Group>(null);
  const geo = useMemo(() => ringGeo(radius, tilt), [radius, tilt]);
  const dots = useMemo(() => ringDotsGeo(radius, tilt), [radius, tilt]);

  useFrame((state) => {
    if (!spin.current || reduced) return;
    spin.current.rotation.y += state.clock.getDelta() * speed * (1 + sceneBus.pop * 1.6);
  });

  return (
    <group ref={spin}>
      <lineLoop geometry={geo}>
        <lineBasicMaterial
          color="#851509"
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </lineLoop>
      <points geometry={dots}>
        <pointsMaterial
          color="#851509"
          size={0.07}
          sizeAttenuation
          transparent
          opacity={0.75}
          depthWrite={false}
        />
      </points>
      <mesh position={[radius, 0, 0]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshBasicMaterial color="#851509" />
      </mesh>
      <mesh position={[-radius, 0, 0]}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <meshBasicMaterial color="#3a2a22" />
      </mesh>
    </group>
  );
}

/* ---- slow radar sweep ---------------------------------------------------- */

function RadarSweep({ reduced, radius = 4.35 }: { reduced: boolean; radius?: number }) {
  const spin = useRef<THREE.Group>(null);
  const radar = useMemo(() => {
    const geo = arcGeo(radius, -1.1, 1.1);
    const mat = new THREE.LineBasicMaterial({
      color: "#851509",
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    return new THREE.Line(geo, mat);
  }, [radius]);

  useFrame((state) => {
    if (!spin.current || reduced) return;
    spin.current.rotation.y += state.clock.getDelta() * 0.5 * (1 + sceneBus.pop * 2.6);
  });

  return (
    <group ref={spin} scale={1.02}>
      <primitive object={radar} />
      <mesh position={[radius, 0, 0]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshBasicMaterial color="#851509" />
      </mesh>
    </group>
  );
}

/* ---- the constellation --------------------------------------------------- */

function NeuralWeb({
  progressRef,
  reduced,
  isDesktop,
}: {
  progressRef: MutableRefObject<{ value: number }>;
  reduced: boolean;
  isDesktop: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const parallax = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const shellFar = useRef<THREE.Mesh>(null);
  const dust = useRef<THREE.Points>(null);
  const twinkle = useRef<THREE.ShaderMaterial>(null);
  const links = useRef<THREE.LineBasicMaterial>(null);
  const hubPoints = useRef<THREE.PointsMaterial>(null);
  const glow = useRef<THREE.Sprite>(null);
  const { value: focus } = useSectionProgress("#innovation");

  const nodeCount = isDesktop ? 132 : 70;
  const hubCount = isDesktop ? 7 : 5;
  const dustCount = isDesktop ? 120 : 40;

  const { positions, phases, linePositions, hubs, dustPositions } = useMemo(() => {
    const pts = fibonacciSphere(nodeCount, 2.4);
    const pos = new Float32Array(pts.length * 3);
    const ph = new Float32Array(pts.length);
    const rng = mulberry32(0x31c);
    pts.forEach((p, i) => {
      pos[i * 3] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = p.z;
      ph[i] = rng() * Math.PI * 2;
    });

    const segs = new Set<string>();
    const raw: number[] = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = pts[i].distanceTo(pts[j]);
        if (d < 0.95) {
          const k = `${Math.min(i, j)}-${Math.max(i, j)}`;
          if (!segs.has(k)) {
            segs.add(k);
            raw.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
          }
        }
      }
    }

    const hubsArr: number[] = [];
    const hubIdx: number[] = [];
    for (let i = 0; i < hubCount; i++) {
      const idx = Math.round(((i + 0.5) / hubCount) * (pts.length - 1));
      if (!hubIdx.includes(idx)) {
        hubIdx.push(idx);
        hubsArr.push(pts[idx].x, pts[idx].y, pts[idx].z);
      }
    }

    const dustPts = fibonacciSphere(dustCount, 1);
    const dustPos = new Float32Array(dustCount * 3);
    dustPts.forEach((p, i) => {
      const r = 4.7 + p.y * 0.6;
      const u = 1 + rng() * 0.0001;
      dustPos[i * 3] = p.x * r * u;
      dustPos[i * 3 + 1] = p.y * r * u * 0.7;
      dustPos[i * 3 + 2] = p.z * r * u;
    });

    return {
      positions: pos,
      phases: ph,
      linePositions: new Float32Array(raw),
      hubs: new Float32Array(hubsArr),
      dustPositions: dustPos,
    };
  }, [nodeCount, hubCount, dustCount]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = progressRef.current.value;
    const e = reduced ? 0 : sceneBus.step(delta);
    const pop = reduced ? 0 : sceneBus.pop;
    const f = 0.4 + 0.6 * focus.current;

    if (twinkle.current) {
      twinkle.current.uniforms.uTime.value = reduced ? 0 : t;
      twinkle.current.uniforms.uOpacity.value = 0.62 + (e * 0.28 + pop * 0.5) * f;
    }
    if (links.current) links.current.opacity = 0.18 + (e * 0.22 + pop * 0.35) * f;
    if (hubPoints.current) hubPoints.current.opacity = 0.8 + (e * 0.2 + pop * 0.4) * f;

    if (parallax.current && !reduced) {
      parallax.current.rotation.set(-sceneBus.py * 0.05 * f, sceneBus.px * 0.06 * f, 0);
    }

    if (group.current) {
      if (reduced) {
        group.current.rotation.y = p * 1.4;
      } else {
        group.current.rotation.y = t * 0.045 + p * 2.2;
        group.current.rotation.x = Math.sin(t * 0.1) * 0.08 + p * 0.45;
        group.current.position.y = Math.sin(t * 0.4) * 0.08;
        group.current.scale.setScalar(1 + pop * 0.08 * f);
      }
    }

    if (core.current && !reduced) {
      const s = 1 + Math.sin(t * 0.7) * 0.05 + pop * 0.3 * f;
      core.current.scale.setScalar(s);
      const mat = core.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.25 + Math.sin(t * 0.9) * 0.12 + pop * 0.6 * f;
    }

    if (shellFar.current && !reduced) {
      shellFar.current.rotation.y += state.clock.getDelta() * -0.08;
      shellFar.current.rotation.z += state.clock.getDelta() * 0.02;
    }

    if (dust.current && !reduced) {
      dust.current.rotation.y -= state.clock.getDelta() * 0.015;
    }

    if (glow.current && !reduced) {
      const s = 6.6 + Math.sin(t * 0.8) * 0.5;
      glow.current.scale.set(s, s, 1);
      (glow.current.material as THREE.SpriteMaterial).opacity =
        0.4 + Math.sin(t * 0.7) * 0.1;
    }

    // camera drifts deeper with scroll, follows pointer
    const z = 7.5 - p * 2.2;
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 0.5 + Math.sin(t * 0.06) * 0.2,
      0.04
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      -state.pointer.y * 0.35 + p * 0.6,
      0.04
    );
    state.camera.position.z = THREE.MathUtils.damp(
      state.camera.position.z,
      z,
      3,
      reduced ? 0 : 0.08
    );
    state.camera.lookAt(0, 0, 0);
  });

  const glowTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const cv = document.createElement("canvas");
    cv.width = cv.height = 256;
    const cx = cv.getContext("2d");
    if (!cx) return null;
    const g = cx.createRadialGradient(128, 128, 8, 128, 128, 124);
    g.addColorStop(0, "rgba(133,21,9,0.55)");
    g.addColorStop(0.5, "rgba(133,21,9,0.16)");
    g.addColorStop(1, "rgba(133,21,9,0)");
    cx.fillStyle = g;
    cx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(cv);
  }, []);

  return (
    <group ref={parallax}>
      <group ref={group}>
        {/* twinkling research nodes */}
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
          </bufferGeometry>
          <shaderMaterial
            ref={twinkle}
            vertexShader={TWINKLE_VERT}
            fragmentShader={TWINKLE_FRAG}
            transparent
            depthWrite={false}
            uniforms={{
              uTime: { value: 0 },
              uColor: { value: new THREE.Color("#3a2a22") },
              uOpacity: { value: 0.7 },
              uSize: { value: 0.26 },
            }}
          />
        </points>

        {/* wine hub nodes */}
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[hubs, 3]} />
          </bufferGeometry>
          <pointsMaterial
            ref={hubPoints}
            color="#851509"
            size={0.17}
            sizeAttenuation
            transparent
            opacity={0.95}
            depthWrite={false}
          />
        </points>

        {/* proximity links */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            ref={links}
            color="#851509"
            transparent
            opacity={0.22}
            depthWrite={false}
          />
        </lineSegments>

        {/* core artifact */}
        <mesh ref={core}>
          <icosahedronGeometry args={[0.85, 1]} />
          <meshStandardMaterial
            color="#851509"
            emissive="#a3362a"
            emissiveIntensity={0.25}
            roughness={0.35}
            metalness={0.5}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.35, 1]} />
          <meshBasicMaterial wireframe color="#851509" transparent opacity={0.25} />
        </mesh>
        <mesh ref={shellFar}>
          <icosahedronGeometry args={[3.0, 1]} />
          <meshBasicMaterial wireframe color="#851509" transparent opacity={0.08} />
        </mesh>
      </group>

      {/* orbit rings + satellites */}
      <OrbitRing radius={3.1} tilt={[0.55, 0.25, 0]} speed={0.32} reduced={reduced} />
      <OrbitRing radius={3.55} tilt={[0.3, -0.45, 0.15]} speed={-0.24} reduced={reduced} />
      <OrbitRing radius={4.0} tilt={[-0.4, 0.55, -0.1]} speed={0.18} reduced={reduced} />
      <RadarSweep reduced={reduced} />

      {/* central glow */}
      {glowTexture && (
        <sprite ref={glow} scale={[7, 7, 1]}>
          <spriteMaterial
            map={glowTexture}
            transparent
            opacity={0.45}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </sprite>
      )}

      {/* drifting dust */}
      <points ref={dust} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#9c8a7a"
          size={0.025}
          sizeAttenuation
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  );
}

export default function ResearchNetwork({
  progressRef,
}: {
  progressRef: MutableRefObject<{ value: number }>;
}) {
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 760px)");

  return (
    <Canvas
      dpr={[1, isDesktop ? 1.5 : 1.1]}
      camera={{ position: [0, 0, 7.5], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 3, 4]} intensity={0.7} color="#851509" />
      <NeuralWeb progressRef={progressRef} reduced={reduced} isDesktop={isDesktop} />
    </Canvas>
  );
}