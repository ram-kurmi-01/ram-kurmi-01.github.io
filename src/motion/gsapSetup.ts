/**
 * GSAP registration + the Lenis bridge.
 *
 * The bridge is the load-bearing part: Lenis was already smoothing the scroll,
 * but ScrollTrigger was measuring the *native* scroll position, so scrubbed and
 * pinned timelines would have lagged behind the content by a frame or three.
 * Handing Lenis the GSAP ticker and pushing its scroll events into
 * ScrollTrigger.update() puts both engines on one clock.
 *
 * GSAP 3.15 ships every plugin free, so DrawSVG / SplitText / MorphSVG are all
 * available — the vine draws, growing headlines, and canopy-to-root dividers
 * all lean on them.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { DUR, GSAP_EASE } from './tokens';
import { prefersReducedMotion } from './useReducedMotion';

let registered = false;

/**
 * Registers the GSAP plugins. Safe to call from anywhere — components that
 * animate on mount may run before App's smooth-scroll effect does.
 */
export function ensureGsap() {
  if (registered) return;
  registered = true;
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MorphSVGPlugin, SplitText);
  gsap.defaults({ duration: DUR.base, ease: GSAP_EASE.grow });
}

export interface SmoothScrollHandle {
  lenis: Lenis | null;
  destroy: () => void;
}

/**
 * Boots smooth scrolling and wires it to ScrollTrigger.
 * Returns a handle whose `destroy` fully unwinds everything — React StrictMode
 * mounts effects twice in development, so this has to be safe to run in pairs.
 */
export function initSmoothScroll(): SmoothScrollHandle {
  ensureGsap();

  // Reduced motion: no smoothing, but ScrollTrigger still needs to work so
  // that non-motion behaviour (nav highlighting, lazy media) keeps functioning.
  if (prefersReducedMotion()) {
    ScrollTrigger.refresh();
    return { lenis: null, destroy: () => {} };
  }

  const lenis = new Lenis({
    duration: 1.05,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  const onLenisScroll = () => ScrollTrigger.update();
  lenis.on('scroll', onLenisScroll);

  // Drive Lenis from GSAP's ticker rather than its own rAF, so there is exactly
  // one animation frame loop and the two never interleave out of order.
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.refresh();

  return {
    lenis,
    destroy: () => {
      gsap.ticker.remove(tick);
      lenis.off('scroll', onLenisScroll);
      lenis.destroy();
    },
  };
}

/**
 * Kills every ScrollTrigger created by a section. Call from a component's
 * effect cleanup — leaked triggers keep measuring unmounted DOM and quietly
 * corrupt every subsequent refresh.
 */
export function killTriggers(triggers: ScrollTrigger[]) {
  triggers.forEach((t) => t.kill());
}

export { gsap, ScrollTrigger, SplitText };
