/**
 * Top-of-page scroll progress bar.
 * Driven by Framer Motion's `useScroll` so it tracks Lenis-smoothed scroll.
 */
import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] pointer-events-none"
    >
      <div
        className="h-full w-full"
        style={{
          background:
            'linear-gradient(90deg, rgba(125,211,252,0.85) 0%, rgba(56,189,248,0.95) 38%, rgba(52,211,153,0.9) 72%, rgba(245,208,138,0.95) 100%)',
          boxShadow: '0 0 14px rgba(125,211,252,0.35), 0 0 24px rgba(52,211,153,0.18)',
        }}
      />
    </motion.div>
  );
}
