/**
 * Motion tokens — the single source of truth for timing across the site.
 *
 * Before this file, 31 components each invented their own duration and easing.
 * Anything that moves should pull its numbers from here so the whole forest
 * shares one sense of weight.
 */

/** Seconds. Named for how the movement should feel, not how long it lasts. */
export const DUR = {
  /** Hover states, focus rings, cursor — must feel instant. */
  instant: 0.18,
  /** Small UI transitions: badges, chips, nav items. */
  quick: 0.32,
  /** The default. Cards, reveals, most entrances. */
  base: 0.6,
  /** Larger elements travelling further: section headings, panels. */
  slow: 0.9,
  /** Set-pieces only. Trunk growth, canopy opening, preloader. */
  grand: 1.6,
} as const;

/**
 * Framer Motion easings (cubic-bezier arrays).
 * Plants accelerate slowly and settle without bouncing — except when they pop
 * open, which is what `sprout` is for. Nothing here uses a linear curve.
 */
export const EASE = {
  /** Default. Fast start, long organic settle. */
  grow: [0.16, 1, 0.3, 1],
  /** Slight overshoot for things that snap into existence: leaves, badges. */
  sprout: [0.34, 1.56, 0.64, 1],
  /** Symmetric — for things that drift rather than arrive. */
  drift: [0.45, 0, 0.55, 1],
  /** Gentle entrance without the long tail, for repeated small items. */
  soft: [0.33, 1, 0.68, 1],
} as const;

/** GSAP string equivalents of EASE, so both engines agree. */
export const GSAP_EASE = {
  grow: 'expo.out',
  sprout: 'back.out(1.7)',
  drift: 'sine.inOut',
  soft: 'power3.out',
} as const;

/** Pixels of travel. Deliberately small — long slides read as cheap. */
export const DIST = {
  /** Hover lift, magnetic pull. */
  nudge: 8,
  /** Standard reveal rise. */
  rise: 24,
  /** Large panels and section headings. */
  lift: 44,
} as const;

/** Seconds between staggered children. */
export const STAGGER = {
  /** Letters and other dense runs. */
  tight: 0.035,
  /** Cards, list items. */
  base: 0.08,
  /** A handful of large elements. */
  loose: 0.14,
} as const;

/**
 * Viewport margins for scroll-triggered reveals, as framer-motion `margin`
 * strings. Negative = wait until the element is further into view.
 */
export const VIEW = {
  early: '-40px',
  base: '-80px',
  late: '-140px',
} as const;

/** ScrollTrigger start/end shorthands, so scrub ranges stay consistent. */
export const SCROLL = {
  /** Begins as the element's top passes 85% down the viewport. */
  enter: 'top 85%',
  /** Begins when the element is centred-ish. */
  middle: 'top 55%',
  /** For pinned sections: run until the element's bottom hits the top. */
  through: 'bottom top',
} as const;

export type EaseName = keyof typeof EASE;
