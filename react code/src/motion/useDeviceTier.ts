/**
 * Device capability tiering.
 *
 * The forest is expensive: instanced trees, a bloom pass, and particle layers.
 * Rather than shipping the same scene everywhere and hoping, every heavy effect
 * asks for a tier first and scales itself down.
 *
 *   high — discrete/modern GPU, plenty of cores: full 3D forest + bloom
 *   mid  — capable but not generous: fewer trees, no post-processing
 *   low  — phones, save-data, no WebGL: SVG parallax forest only, zero WebGL
 *
 * Tier is measured once on mount. Deliberately not reactive to resize: swapping
 * renderers mid-scroll is worse than a slightly wrong guess.
 */
import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export type DeviceTier = 'high' | 'mid' | 'low';

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

function measureTier(): DeviceTier {
  if (typeof window === 'undefined') return 'low';

  const nav = navigator as NavigatorWithHints;

  // Explicit user/network signals win outright.
  if (nav.connection?.saveData) return 'low';
  if (nav.connection?.effectiveType && /(^|-)2g$/.test(nav.connection.effectiveType)) return 'low';
  if (!hasWebGL()) return 'low';

  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const width = window.innerWidth;
  const dpr = window.devicePixelRatio || 1;

  // Phones stay on the SVG forest. A flagship could render the 3D scene, but
  // it would cost ~810 KB of three.js over cellular for a background, and the
  // DOM treeline already carries the atmosphere. Tablets (>= 900px, coarse)
  // are wide enough and usually on wifi, so they fall through to the checks
  // below like any other machine.
  if (coarse && width < 900) return 'low';

  if (cores >= 8 && memory >= 8 && dpr <= 2) return 'high';
  if (cores >= 4 && memory >= 4) return 'mid';
  return 'low';
}

export function useDeviceTier(): DeviceTier {
  // Start at 'low' and upgrade after mount: the cheap scene is the safe first
  // paint, and upgrading is far less jarring than tearing a heavy one down.
  const [tier, setTier] = useState<DeviceTier>('low');
  useEffect(() => setTier(measureTier()), []);
  return tier;
}

/** What each tier is actually allowed to render. */
export interface MotionProfile {
  tier: DeviceTier;
  reduced: boolean;
  /** Render the 3D forest canvas at all? */
  webgl: boolean;
  /** Run the SelectiveBloom post-processing pass? */
  bloom: boolean;
  /** Instanced tree count. */
  trees: number;
  /** Firefly point count. */
  fireflies: number;
  /** Drifting pollen/spore count in the DOM layer. */
  pollen: number;
  /** Falling leaf count. */
  leaves: number;
  /** Cap the renderer's pixel ratio here. */
  dpr: [number, number];
  /** Allow pinned / scroll-scrubbed set-pieces? */
  cinematic: boolean;
}

const PROFILES: Record<DeviceTier, Omit<MotionProfile, 'tier' | 'reduced'>> = {
  high: { webgl: true,  bloom: true,  trees: 150, fireflies: 220, pollen: 40, leaves: 14, dpr: [1, 1.75], cinematic: true },
  mid:  { webgl: true,  bloom: false, trees: 70,  fireflies: 110, pollen: 24, leaves: 9,  dpr: [1, 1.25], cinematic: true },
  low:  { webgl: false, bloom: false, trees: 0,   fireflies: 0,   pollen: 12, leaves: 5,  dpr: [1, 1],    cinematic: false },
};

const STILL: Omit<MotionProfile, 'tier' | 'reduced'> = {
  webgl: false, bloom: false, trees: 0, fireflies: 0, pollen: 0, leaves: 0, dpr: [1, 1], cinematic: false,
};

/**
 * The one hook animated components should call. Combines capability with the
 * visitor's stated preference — reduced motion always wins.
 */
export function useMotionProfile(): MotionProfile {
  const tier = useDeviceTier();
  const reduced = useReducedMotion();
  return { tier, reduced, ...(reduced ? STILL : PROFILES[tier]) };
}
