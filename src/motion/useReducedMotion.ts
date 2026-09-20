/**
 * Live `prefers-reduced-motion` subscription.
 *
 * framer-motion ships its own hook, but it only reads the value once on some
 * versions and it isn't available to the plain-DOM/R3F code paths. Every
 * animated component in the site reads this one instead, so a visitor toggling
 * the OS setting sees the change without reloading.
 */
import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function readInitial(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(readInitial);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);

    // Safari < 14 only supports the deprecated listener API.
    if (mq.addEventListener) {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  return reduced;
}

/** Non-hook read, for module-level guards and imperative GSAP setup. */
export function prefersReducedMotion(): boolean {
  return readInitial();
}
