/**
 * The hero's focal element: a sapling that draws itself on load.
 *
 * This replaces the old Hero3D orb, which opened a second WebGL context to
 * render a sphere that read as a flat green disc in front of the forest. An
 * SVG costs no GPU context, stays sharp at any size, and — more to the point —
 * a plant growing is the site's whole thesis, where a glowing ball was not.
 *
 * Load sequence: soil settles, stem draws upward, leaves unfurl in the order
 * the stem reaches them, then everything hands over to a looping wind sway.
 */
import { useEffect, useRef } from 'react';
import { gsap, ensureGsap, useReducedMotion } from '../../motion';

/** Attachment points measured along the stem path, ordered bottom to top. */
const LEAVES = [
  { x: 203, y: 356, rot: -22, scale: 1.0, tint: '#4aa544' },
  { x: 205, y: 302, rot: 202, scale: 0.94, tint: '#63c24d' },
  { x: 202, y: 250, rot: -18, scale: 0.98, tint: '#63c24d' },
  { x: 198, y: 199, rot: 196, scale: 0.86, tint: '#86e05a' },
  { x: 203, y: 149, rot: -14, scale: 0.78, tint: '#86e05a' },
  { x: 200, y: 104, rot: 192, scale: 0.66, tint: '#a7ea7d' },
];

/** A single blade plus its midrib, drawn from the attachment point outward. */
function Leaf({ tint }: { tint: string }) {
  return (
    <g>
      <path d="M0 0 C 14 -16, 44 -20, 62 -4 C 44 14, 14 12, 0 0 Z" fill={tint} />
      <path
        d="M2 0 C 20 -4, 40 -5, 58 -4"
        fill="none"
        stroke="#07130a"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.42"
      />
    </g>
  );
}

export function HeroSapling() {
  const root = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    ensureGsap();

    const stem = el.querySelector('.sapling-stem');
    const leaves = el.querySelectorAll<SVGGElement>('.sapling-leaf');
    const bud = el.querySelector('.sapling-bud');
    const soil = el.querySelector('.sapling-soil');
    const plant = el.querySelector('.sapling-plant');
    const flies = el.querySelectorAll<SVGGElement>('.sapling-fly');

    // Reduced motion still gets the finished plant — just not the growing.
    if (reduced) {
      gsap.set([stem, soil], { drawSVG: '100%' });
      gsap.set(leaves, { scale: 1, opacity: 1 });
      gsap.set(bud, { scale: 1, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(stem, { drawSVG: '0%' });
      gsap.set(soil, { drawSVG: '50% 50%' });
      // Leaves scale from where they meet the stem, not from their own centre,
      // so they unfurl outward instead of ballooning in place.
      gsap.set(leaves, { scale: 0, opacity: 0, transformOrigin: '0% 50%' });
      gsap.set(bud, { scale: 0, opacity: 0, transformOrigin: '50% 100%' });

      const tl = gsap.timeline({ delay: 0.35 });

      tl.to(soil, { drawSVG: '0% 100%', duration: 0.7, ease: 'power2.out' })
        .to(stem, { drawSVG: '100%', duration: 2.1, ease: 'power1.inOut' }, '-=0.35')
        // Each leaf lands as the stem passes its attachment point.
        .to(
          leaves,
          {
            scale: (i) => LEAVES[i].scale,
            opacity: 1,
            duration: 0.75,
            ease: 'back.out(1.9)',
            stagger: 0.24,
          },
          '-=1.85'
        )
        .to(bud, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2.4)' }, '-=0.35')
        // Hand over to the wind, which never stops.
        .add(() => {
          gsap.to(plant, {
            rotation: 2.1,
            duration: 4.2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            transformOrigin: '200px 420px',
          });
          leaves.forEach((leafEl, i) => {
            gsap.to(leafEl, {
              rotation: `+=${i % 2 === 0 ? 5 : -5}`,
              duration: 2.6 + i * 0.35,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              transformOrigin: '0% 50%',
            });
          });
        });

      // Fireflies drift on their own clocks so they never look choreographed.
      flies.forEach((fly, i) => {
        gsap.to(fly, {
          x: `random(-34, 34)`,
          y: `random(-30, 30)`,
          opacity: `random(0.25, 1)`,
          duration: 3 + i * 0.9,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          repeatRefresh: true,
          delay: i * 0.6,
        });
      });
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="relative w-full flex items-center justify-center" aria-hidden>
      <svg
        ref={root}
        viewBox="0 0 400 460"
        className="w-[280px] h-[320px] md:w-[380px] md:h-[430px] overflow-visible"
        fill="none"
      >
        <defs>
          <radialGradient id="saplingGlow" cx="50%" cy="62%" r="52%">
            <stop offset="0%" stopColor="#86e05a" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#86e05a" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#86e05a" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="200" cy="290" rx="180" ry="180" fill="url(#saplingGlow)" />

        {/* Soil the sapling comes out of. */}
        <path
          className="sapling-soil"
          d="M96 424 C 130 414, 180 412, 200 412 C 232 412, 276 416, 306 424"
          stroke="#4a2c12"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <g className="sapling-plant">
          <path
            className="sapling-stem"
            d="M200 420 C 196 352, 214 300, 202 246 C 190 192, 212 142, 200 72"
            stroke="#548a3c"
            strokeWidth="5.5"
            strokeLinecap="round"
          />

          {LEAVES.map((leaf, i) => (
            <g
              key={i}
              className="sapling-leaf"
              transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rot})`}
            >
              <Leaf tint={leaf.tint} />
            </g>
          ))}

          {/* The tip bud — the newest growth, so the brightest green. */}
          <g className="sapling-bud" transform="translate(200 72)">
            <path d="M0 0 C -13 -14, -9 -34, 0 -44 C 9 -34, 13 -14, 0 0 Z" fill="#c3f58c" />
            <path d="M0 -4 L 0 -38" stroke="#07130a" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" />
          </g>
        </g>

        {/* Fireflies, the site's one gold accent, orbiting the plant. */}
        {[
          { x: 108, y: 214, r: 3.4 },
          { x: 296, y: 168, r: 2.6 },
          { x: 268, y: 320, r: 3 },
          { x: 132, y: 356, r: 2.2 },
        ].map((f, i) => (
          <g key={i} className="sapling-fly" transform={`translate(${f.x} ${f.y})`}>
            <circle r={f.r * 5.5} fill="#ffd27a" opacity="0.07" />
            <circle r={f.r * 2.4} fill="#ffd27a" opacity="0.16" />
            <circle r={f.r} fill="#ffe0a3" />
          </g>
        ))}
      </svg>
    </div>
  );
}
