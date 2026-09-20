/**
 * Foreground SVG decoration on top of the 3D forest:
 *  ‣ Two parallax tree-silhouette ribbons that sway with CSS
 *  ‣ Animated grass blades along the bottom edge
 *  ‣ Two looping bird silhouettes flying across the sky
 *
 * All purely DOM/SVG so it costs almost nothing.
 */
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMemo } from 'react';

/* ── Single pine silhouette ───────────────────────── */
function PineSilhouette({
  width,
  height,
  color = '#020a04',
  delay = 0,
  duration = 4,
}: {
  width: number;
  height: number;
  color?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <div
      style={{
        width,
        height,
        animation: `treeSway ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        transformOrigin: '50% 100%',
        flex: '0 0 auto',
      }}
    >
      <svg viewBox="0 0 100 200" width={width} height={height}
        preserveAspectRatio="xMidYMax meet">
        <g fill={color}>
          <rect x="46" y="172" width="8" height="28" rx="2" />
          <polygon points="50,18 28,72 72,72" />
          <polygon points="50,52 22,104 78,104" />
          <polygon points="50,86 16,140 84,140" />
          <polygon points="50,118 10,176 90,176" />
        </g>
      </svg>
    </div>
  );
}

/* ── Reusable random-feel tree row ────────────────── */
function TreeRow({
  count,
  baseHeight,
  color,
  opacity,
  blur,
  swayMin,
  swayMax,
  bottom = 0,
}: {
  count: number;
  baseHeight: number;
  color: string;
  opacity: number;
  blur: number;
  swayMin: number;
  swayMax: number;
  bottom?: number;
}) {
  const trees = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // Deterministic pseudo-random so it doesn't change between renders
        const r = (n: number) => ((Math.sin(i * 12.9898 + n) * 43758.5453) % 1 + 1) % 1;
        const h = baseHeight + Math.floor(r(1) * baseHeight * 0.55);
        const w = h * (0.5 + r(2) * 0.18);
        return {
          width:  w,
          height: h,
          delay:  -(r(3) * 5),
          duration: swayMin + r(4) * (swayMax - swayMin),
          offset: (r(5) - 0.5) * 12,
        };
      }),
    [count, baseHeight, swayMin, swayMax]
  );

  return (
    <div
      className="absolute left-0 right-0 flex items-end justify-around pointer-events-none"
      style={{
        bottom,
        opacity,
        filter: `blur(${blur}px)`,
        height: baseHeight + baseHeight * 0.55,
      }}
      aria-hidden
    >
      {trees.map((t, i) => (
        <div key={i} style={{ transform: `translateY(${t.offset}px)`, marginInline: '-18px' }}>
          <PineSilhouette
            width={t.width}
            height={t.height}
            color={color}
            delay={t.delay}
            duration={t.duration}
          />
        </div>
      ))}
    </div>
  );
}

/* ── Grass blades ─────────────────────────────────── */
function GrassRow({ count = 60 }: { count?: number }) {
  const blades = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => ((Math.sin(i * 9.123 + n) * 12345.678) % 1 + 1) % 1;
        return {
          left:     (i / count) * 100 + r(1) * 1.5,
          height:   8 + r(2) * 14,
          duration: 2.5 + r(3) * 2.5,
          delay:    -(r(4) * 3),
          color:    r(5) > 0.5 ? '#0e3b1b' : '#143f1f',
        };
      }),
    [count]
  );

  return (
    <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none" aria-hidden>
      {blades.map((b, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${b.left}%`,
            bottom: 0,
            width: 2,
            height: `${b.height}px`,
            background: `linear-gradient(to top, ${b.color}, transparent)`,
            borderRadius: '2px 2px 0 0',
            transformOrigin: '50% 100%',
            animation: `grassWave ${b.duration}s ease-in-out infinite`,
            animationDelay: `${b.delay}s`,
            filter: 'blur(0.3px)',
          }}
        />
      ))}
    </div>
  );
}

/* ── Birds ────────────────────────────────────────── */
function Bird({
  top,
  duration,
  delay,
  size,
  reverse,
}: {
  top: string;
  duration: number;
  delay: number;
  size: number;
  reverse?: boolean;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 0,
        width: size,
        height: size * 0.55,
        animation: `${reverse ? 'birdFlyReverse' : 'birdFly'} ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
        opacity: 0.55,
      }}
      aria-hidden
    >
      <svg viewBox="0 0 40 22" width={size} height={size * 0.55}>
        <g fill="none" stroke="#0e3b1b" strokeWidth="2" strokeLinecap="round">
          <path d="M2 12 Q 10 2 18 12 Q 22 6 26 12 Q 32 4 38 10">
            <animate
              attributeName="d"
              dur="0.6s"
              repeatCount="indefinite"
              values="
                M2 12 Q 10 2 18 12 Q 22 6 26 12 Q 32 4 38 10;
                M2 8 Q 10 16 18 8 Q 22 14 26 8 Q 32 16 38 12;
                M2 12 Q 10 2 18 12 Q 22 6 26 12 Q 32 4 38 10
              "
            />
          </path>
        </g>
      </svg>
    </div>
  );
}

/* ── Export ───────────────────────────────────────── */
export function TreeOverlay() {
  const { scrollY } = useScroll();
  const yFar  = useTransform(scrollY, [0, 1500], [0,  -40]);
  const yMid  = useTransform(scrollY, [0, 1500], [0,  -90]);
  const yNear = useTransform(scrollY, [0, 1500], [0, -160]);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[2] pointer-events-none"
      style={{ height: '320px' }}
      aria-hidden
    >
      {/* Birds in the upper part (positioned relative to viewport, not bottom strip) */}
      <div className="fixed inset-x-0 top-0 pointer-events-none" style={{ height: '60vh', zIndex: 1 }}>
        <Bird top="14%" duration={45} delay={0}   size={26} />
        <Bird top="22%" duration={60} delay={-18} size={18} />
        <Bird top="30%" duration={55} delay={-32} size={22} reverse />
      </div>

      {/* Far / smaller / blurred trees */}
      <motion.div style={{ y: yFar }} className="absolute inset-x-0 bottom-0">
        <TreeRow
          count={26}
          baseHeight={70}
          color="#031509"
          opacity={0.55}
          blur={1.4}
          swayMin={4}
          swayMax={6.5}
          bottom={28}
        />
      </motion.div>

      {/* Mid trees */}
      <motion.div style={{ y: yMid }} className="absolute inset-x-0 bottom-0">
        <TreeRow
          count={20}
          baseHeight={110}
          color="#020c05"
          opacity={0.75}
          blur={0.6}
          swayMin={3.4}
          swayMax={5.2}
          bottom={14}
        />
      </motion.div>

      {/* Foreground / sharp trees */}
      <motion.div style={{ y: yNear }} className="absolute inset-x-0 bottom-0">
        <TreeRow
          count={14}
          baseHeight={150}
          color="#010604"
          opacity={0.9}
          blur={0}
          swayMin={2.8}
          swayMax={4.4}
          bottom={0}
        />
      </motion.div>

      {/* Grass on top */}
      <GrassRow count={70} />
    </div>
  );
}
