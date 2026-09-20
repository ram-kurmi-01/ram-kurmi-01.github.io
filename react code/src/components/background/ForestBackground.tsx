/**
 * The forest. One fixed canvas behind the whole site.
 *
 * Replaces the old blue particle wall. Three things changed from the previous
 * forest that was sitting here unused:
 *
 *  1. Trees are instanced. Five InstancedMeshes cover the entire treeline
 *     instead of five meshes per tree, so 150 trees cost fewer draw calls than
 *     the old 32 did.
 *  2. Wind runs in the vertex shader (see forest/wind.ts), so gusts travel
 *     across the treeline and the CPU does nothing per frame.
 *  3. Scroll drives a descent — canopy, understory, forest floor — and writes
 *     that depth back to CSS so the DOM gradients travel with the camera.
 *
 * Everything scales off the device tier. On `low` this component renders
 * nothing at all and TreeOverlay carries the atmosphere on its own.
 */
import { useRef, useMemo, useEffect, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { applyWind, windUniforms } from './forest/wind';
import { useMotionProfile, type MotionProfile } from '../../motion';

/* ── Tree layers ─────────────────────────────────────
   Each layer is one InstancedMesh. `y` is where the layer sits up the tree
   before instance scaling; `sway` is how hard the wind moves it — the trunk
   is nearly rigid, the crown whips.                                        */
const LAYERS = [
  { geo: 'trunk', y: 0.75, sway: 0.02, color: '#4a2c12', rough: 0.95 },
  { geo: 'cone0', y: 2.20, sway: 0.10, color: '#123a1c', rough: 0.85 },
  { geo: 'cone1', y: 3.10, sway: 0.17, color: '#17512a', rough: 0.80 },
  { geo: 'cone2', y: 3.90, sway: 0.25, color: '#1d6b35', rough: 0.75 },
  { geo: 'cone3', y: 4.60, sway: 0.34, color: '#248040', rough: 0.70 },
] as const;

const CONE_ARGS: Record<string, [number, number, number]> = {
  cone0: [1.05, 2.1, 7],
  cone1: [0.82, 1.9, 7],
  cone2: [0.58, 1.65, 7],
  cone3: [0.32, 1.15, 6],
};

interface TreeData {
  x: number;
  z: number;
  scale: number;
  rot: number;
}

function makeTrees(count: number): TreeData[] {
  const trees: TreeData[] = [];
  if (count <= 0) return trees;

  // A corridor the camera descends through, plus a dense far wall that reads
  // as depth once fog bites. Ratios rather than fixed counts so every tier
  // gets the same composition, just thinner.
  const corridor = Math.round(count * 0.42);
  const far = count - corridor;

  for (let i = 0; i < corridor; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    trees.push({
      x: side * (5.5 + Math.random() * 9),
      z: -2 - (i / corridor) * 36 - Math.random() * 3,
      scale: 0.75 + Math.random() * 1.1,
      rot: Math.random() * Math.PI * 2,
    });
  }
  for (let i = 0; i < far; i++) {
    trees.push({
      x: (Math.random() - 0.5) * 76,
      z: -26 - Math.random() * 34,
      scale: 1.1 + Math.random() * 1.9,
      rot: Math.random() * Math.PI * 2,
    });
  }
  return trees;
}

function InstancedForest({ count }: { count: number }) {
  const trees = useMemo(() => makeTrees(count), [count]);
  const refs = useRef<(THREE.InstancedMesh | null)[]>([]);

  // Instance matrices never change after mount — the wind is a shader effect,
  // not a transform — so this runs once rather than every frame.
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const pos = new THREE.Vector3();
    const scl = new THREE.Vector3();

    LAYERS.forEach((layer, li) => {
      const mesh = refs.current[li];
      if (!mesh) return;
      trees.forEach((t, ti) => {
        pos.set(t.x, layer.y * t.scale, t.z);
        q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), t.rot);
        scl.setScalar(t.scale);
        m.compose(pos, q, scl);
        mesh.setMatrixAt(ti, m);
      });
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    });
  }, [trees]);

  const materials = useMemo(
    () =>
      LAYERS.map((layer) =>
        applyWind(
          new THREE.MeshStandardMaterial({ color: layer.color, roughness: layer.rough, flatShading: true }),
          layer.sway
        )
      ),
    []
  );

  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  if (!trees.length) return null;

  return (
    <>
      {LAYERS.map((layer, li) => (
        <instancedMesh
          key={layer.geo}
          ref={(el) => (refs.current[li] = el)}
          args={[undefined, undefined, trees.length]}
          material={materials[li]}
          frustumCulled={false}
        >
          {layer.geo === 'trunk' ? (
            <cylinderGeometry args={[0.11, 0.17, 1.5, 6]} />
          ) : (
            <coneGeometry args={CONE_ARGS[layer.geo]} />
          )}
        </instancedMesh>
      ))}
    </>
  );
}

/* ── Fireflies ───────────────────────────────────────
   A radial-gradient sprite does the glow. The obvious alternative was a bloom
   pass, but @react-three/postprocessing v3 needs React 19 and this project is
   on 18 — and a full-screen render target is poor value for 200 small points
   that are already additively blended over a near-black scene.              */
function makeGlowTexture(): THREE.Texture {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0.0, 'rgba(255,255,240,1)');
  g.addColorStop(0.18, 'rgba(255,224,163,0.7)');
  g.addColorStop(0.45, 'rgba(255,210,122,0.18)');
  g.addColorStop(1.0, 'rgba(255,210,122,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function Fireflies({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const texture = useMemo(makeGlowTexture, []);
  useEffect(() => () => texture.dispose(), [texture]);

  const { positions, drift, phase } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const d = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 58;
      p[i * 3 + 1] = 0.3 + Math.random() * 9;
      p[i * 3 + 2] = (Math.random() - 0.5) * 38 - 4;
      d[i * 3] = (Math.random() - 0.5) * 0.009;
      d[i * 3 + 1] = (Math.random() - 0.5) * 0.007;
      d[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: p, drift: d, phase: ph };
  }, [count]);

  useFrame((state) => {
    const points = ref.current;
    if (!points) return;
    const attr = points.geometry.attributes.position;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      arr[i * 3] += drift[i * 3] + Math.sin(t * 0.4 + phase[i]) * 0.0026;
      arr[i * 3 + 1] += drift[i * 3 + 1] + Math.cos(t * 0.3 + phase[i] * 0.7) * 0.0031;
      arr[i * 3 + 2] += drift[i * 3 + 2];

      // Wrap rather than respawn, so the swarm never visibly thins out.
      if (arr[i * 3] > 30) arr[i * 3] = -30;
      else if (arr[i * 3] < -30) arr[i * 3] = 30;
      if (arr[i * 3 + 1] > 9.5) arr[i * 3 + 1] = 0.3;
      else if (arr[i * 3 + 1] < 0.2) arr[i * 3 + 1] = 9.4;
    }
    attr.needsUpdate = true;

    const mat = points.material as THREE.PointsMaterial;
    mat.opacity = 0.62 + Math.sin(t * 1.7) * 0.22;
  });

  if (count <= 0) return null;

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={0.44}
        color="#ffd27a"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Drifting spores ──────────────────────────────── */
function Spores({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, fall, phase } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const f = new Float32Array(count);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 52;
      p[i * 3 + 1] = Math.random() * 15;
      p[i * 3 + 2] = (Math.random() - 0.5) * 28;
      f[i] = 0.004 + Math.random() * 0.009;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: p, fall: f, phase: ph };
  }, [count]);

  useFrame((state) => {
    const points = ref.current;
    if (!points) return;
    const attr = points.geometry.attributes.position;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      // Horizontal wander is what separates a falling leaf from falling dust.
      arr[i * 3] += Math.sin(t * 0.7 + phase[i]) * 0.011;
      arr[i * 3 + 1] -= fall[i];
      if (arr[i * 3 + 1] < -1) {
        arr[i * 3 + 1] = 15;
        arr[i * 3] = (Math.random() - 0.5) * 52;
      }
    }
    attr.needsUpdate = true;
  });

  if (count <= 0) return null;

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.16} color="#a7ea7d" transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ── Ground & mist ───────────────────────────────── */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow={false}>
      <planeGeometry args={[160, 120]} />
      <meshStandardMaterial color="#08170b" roughness={1} />
    </mesh>
  );
}

function MistBands() {
  return (
    <>
      {[0, -9, -19, -31].map((z, i) => (
        <mesh key={z} position={[0, 0.4 + i * 0.28, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[110, 7]} />
          <meshStandardMaterial color="#1a4a28" transparent opacity={0.07 - i * 0.012} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

/* ── The descent ─────────────────────────────────────
   One continuous move from the canopy down to the forest floor, tied to page
   progress. It also publishes that progress as `--depth` on <html>, so the
   CSS gradients shift colour temperature in step with the camera.          */
function ScrollCamera({ reduced }: { reduced: boolean }) {
  const { camera } = useThree();
  const target = useRef(0);
  const smooth = useRef(0);

  useEffect(() => {
    camera.position.set(0, 7.2, 15);
    camera.lookAt(0, 5.4, 0);

    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      target.current = Math.min(1, Math.max(0, window.scrollY / max));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [camera]);

  useFrame((state) => {
    // Lerping the scroll rather than reading it raw is what keeps the descent
    // from snapping when a visitor flicks the wheel.
    smooth.current += (target.current - smooth.current) * (reduced ? 1 : 0.062);
    const p = smooth.current;

    document.documentElement.style.setProperty('--depth', p.toFixed(3));

    // A slow idle drift so the forest is alive even before anyone scrolls.
    const t = reduced ? 0 : state.clock.elapsedTime * 0.04;

    state.camera.position.x = Math.sin(t) * 1.7 + p * 1.4;
    state.camera.position.y = 7.2 - p * 5.9 + Math.sin(t * 0.65) * 0.3;
    state.camera.position.z = 15 - p * 10.5;
    state.camera.lookAt(p * 0.7, 5.4 - p * 4.4, -p * 7);
  });

  return null;
}

/** Advances the shared wind clock. One uniform write for the whole forest. */
function WindClock({ strength }: { strength: number }) {
  useFrame((state) => {
    windUniforms.uTime.value = state.clock.elapsedTime;
    windUniforms.uWind.value = strength;
  });
  return null;
}

function ForestScene({ profile }: { profile: MotionProfile }) {
  return (
    <>
      <fog attach="fog" args={['#07130a', 15, 58]} />
      <ambientLight intensity={0.16} color="#1a4a20" />
      <directionalLight position={[6, 20, 6]} intensity={0.3} color="#86e05a" />
      <pointLight position={[0, 11, 4]} intensity={0.55} color="#63c24d" />
      <pointLight position={[-13, 4, -5]} intensity={0.18} color="#c3f58c" />
      <pointLight position={[13, 4, -5]} intensity={0.18} color="#c3f58c" />
      <pointLight position={[0, 2, 12]} intensity={0.14} color="#ffd27a" />

      <WindClock strength={profile.reduced ? 0 : 1} />
      <ScrollCamera reduced={profile.reduced} />
      <Ground />
      <MistBands />
      <InstancedForest count={profile.trees} />
      <Fireflies count={profile.fireflies} />
      <Spores count={Math.round(profile.fireflies * 0.35)} />
    </>
  );
}

/**
 * Mounted only when the profile allows WebGL — App checks first so the
 * three.js chunk is never even fetched on a device that won't render it.
 */
export default function ForestBackgroundDefault() {
  return <ForestBackground />;
}

export function ForestBackground() {
  const profile = useMotionProfile();

  if (!profile.webgl) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      <Canvas
        camera={{ position: [0, 7.2, 15], fov: 65 }}
        dpr={profile.dpr}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        // Transparent, so the CSS canopy gradients read through the scene
        // instead of being painted over the way the old background did.
        style={{ background: 'transparent' }}
        frameloop={profile.reduced ? 'demand' : 'always'}
      >
        <ForestScene profile={profile} />
      </Canvas>
    </div>
  );
}
