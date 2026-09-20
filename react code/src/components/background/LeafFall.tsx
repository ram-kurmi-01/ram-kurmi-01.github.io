/**
 * Leaves falling in front of the content.
 *
 * Deliberately CSS rather than another canvas: a dozen elements running a
 * compositor-only keyframe cost essentially nothing, and they can sit above
 * the text layer without a third stacking context fighting the other two.
 *
 * Each leaf gets its own drift distance so none of them fall straight down —
 * a vertical drop is what makes falling-particle effects look cheap.
 */
import { useMemo, type CSSProperties } from 'react';
import { useMotionProfile } from '../../motion';

const TINTS = ['#86e05a', '#c3f58c', '#63c24d', '#548a3c', '#ffd27a'];

export function LeafFall() {
  const profile = useMotionProfile();
  const count = profile.leaves;

  const leaves = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // Deterministic, so a re-render never reshuffles leaves mid-fall.
        const r = (n: number) => ((Math.sin(i * 37.31 + n * 11.7) * 43758.5453) % 1 + 1) % 1;
        return {
          left: r(1) * 100,
          size: 7 + r(2) * 9,
          duration: 11 + r(3) * 12,
          delay: -(r(4) * 20),
          drift: (r(5) - 0.5) * 160,
          tint: TINTS[Math.floor(r(6) * TINTS.length)],
          // Gold is a firefly, not a leaf — keep it rare and faint.
          opacity: r(6) > 0.82 ? 0.4 : 0.55 + r(7) * 0.3,
        };
      }),
    [count]
  );

  if (!count) return null;

  return (
    <div className="fixed inset-0 z-[3] pointer-events-none overflow-hidden" aria-hidden>
      {leaves.map((leaf, i) => (
        <span
          key={i}
          className="leaf"
          style={{
            left: `${leaf.left}%`,
            width: leaf.size,
            height: leaf.size,
            background: leaf.tint,
            opacity: leaf.opacity,
            animation: `leafFall ${leaf.duration}s linear infinite`,
            animationDelay: `${leaf.delay}s`,
            // The keyframe reads --drift, so sideways travel varies per leaf
            // without needing a keyframe per leaf.
            ['--drift']: `${leaf.drift.toFixed(0)}px`,
            filter: 'blur(0.2px)',
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
