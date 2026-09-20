/**
 * Barrel for the motion system. Components import from '@/motion', never from
 * the individual files, so the surface stays small enough to keep consistent.
 */
export * from './tokens';
export * from './useReducedMotion';
export * from './useDeviceTier';
export * from './gsapSetup';
export * from './useScrollScene';
