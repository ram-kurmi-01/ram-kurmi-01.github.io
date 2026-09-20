/**
 * One place to build a scroll-driven scene.
 *
 * Every section that scrubs or pins needs the same four things: plugins
 * registered, a gsap.context scoped to the section so selectors can't reach
 * outside it, a full revert on unmount so triggers don't leak, and a way to opt
 * out entirely when the visitor asked for less motion or the device can't take
 * it. Writing that by hand seven times is how ScrollTrigger leaks start.
 *
 *   const ref = useScrollScene<HTMLElement>((root, ctx) => {
 *     ctx.timeline({ scrollTrigger: { trigger: root, scrub: true } })
 *        .to('.thing', { y: 100 });
 *   });
 */
import { useEffect, useRef, type RefObject } from 'react';
import { gsap, ensureGsap, ScrollTrigger } from './gsapSetup';
import { useMotionProfile, type MotionProfile } from './useDeviceTier';

export interface SceneContext {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  profile: MotionProfile;
  /** Scoped timeline factory — every timeline made here is reverted on cleanup. */
  timeline: typeof gsap.timeline;
}

export interface ScrollSceneOptions {
  /**
   * Skip the scene when the device can't support pinning or scrubbing.
   * Sections that pin or scroll horizontally should set this; a section whose
   * scene is only a nicer reveal can leave it off.
   */
  requireCinematic?: boolean;
  /** Extra values that should rebuild the scene when they change. */
  deps?: unknown[];
}

export function useScrollScene<T extends HTMLElement>(
  build: (root: T, ctx: SceneContext) => void,
  options: ScrollSceneOptions = {}
): RefObject<T> {
  const ref = useRef<T>(null);
  const profile = useMotionProfile();
  const { requireCinematic = false, deps = [] } = options;

  // Held in a ref so a changing closure doesn't rebuild the scene on every
  // render — scenes are expensive and rebuilding one mid-scroll is visible.
  const buildRef = useRef(build);
  buildRef.current = build;

  const enabled = !profile.reduced && (!requireCinematic || profile.cinematic);

  useEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;

    ensureGsap();

    const ctx = gsap.context(() => {
      buildRef.current(root, {
        gsap,
        ScrollTrigger,
        profile,
        timeline: gsap.timeline.bind(gsap),
      });
    }, root);

    // Sections below the fold are measured before their images have height.
    // One refresh after the first paint settles keeps every start/end honest.
    const settle = window.setTimeout(() => ScrollTrigger.refresh(), 120);

    return () => {
      window.clearTimeout(settle);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, profile.tier, ...deps]);

  return ref;
}
