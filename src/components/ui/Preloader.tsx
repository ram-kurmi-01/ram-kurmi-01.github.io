/**
 * Seed to sprout, then out of the way.
 *
 * A preloader is a tax on the visitor, so this one earns its place by stating
 * the site's premise: a seed cracks, a shoot comes up, the sapling and the
 * wordmark hold still long enough to be read, then the curtain splits like
 * soil and the forest is behind it.
 *
 * The hold is the point. Growth finishes around 1.6s and the curtain used to
 * start parting 0.2s later, so the finished sapling was never on screen as a
 * still image — and the 2.4s failsafe landed mid-part, snapping the curtain
 * away instead of lifting it. The beat is now a full second, and the failsafe
 * sits above the timeline's real length (~3.6s) rather than inside it.
 *
 * Hard rules it keeps: never longer than 4.2s even if something hangs, skipped
 * entirely for reduced motion, and it never traps focus or blocks the page —
 * the content underneath is already interactive when the curtain lifts.
 */
import { useEffect, useRef, useState } from 'react';
import { gsap, ensureGsap, prefersReducedMotion, ScrollTrigger } from '../../motion';

export function Preloader() {
  // Decided once, before first paint, so there is no flash of curtain for
  // someone who asked not to see one.
  const [done, setDone] = useState(() => prefersReducedMotion());
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) return;
    const el = root.current;
    if (!el) return;

    ensureGsap();
    document.body.style.overflow = 'hidden';

    const finish = () => {
      document.body.style.overflow = '';
      setDone(true);
      // Every ScrollTrigger created while the body was locked measured against
      // a page that couldn't scroll, so their starts are stale. Without this
      // refresh, sections below the fold sit at their "from" state forever.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });

      tl.fromTo('.pre-seed', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' })
        .to('.pre-seed', { scaleX: 1.35, scaleY: 0.7, duration: 0.16, ease: 'power2.in' }, '+=0.1')
        .to('.pre-seed', { opacity: 0, duration: 0.2 }, '-=0.05')
        .fromTo('.pre-shoot', { scaleY: 0 }, { scaleY: 1, duration: 0.55, ease: 'power2.out', transformOrigin: 'bottom center' }, '-=0.25')
        .fromTo(
          '.pre-leaf',
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2.2)', stagger: 0.1, transformOrigin: '0% 50%' },
          '-=0.3'
        )
        .to('.pre-word', { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 }, '-=0.3')
        // Holds here: this finished frame is the whole point of the preloader,
        // so it stays put long enough to register before the curtain moves.
        .to('.pre-plant, .pre-word', { opacity: 0, duration: 0.3 }, '+=1.2')
        // The curtain parts like soil rather than fading, so the forest looks
        // like it was always there behind it.
        .to('.pre-top', { yPercent: -100, duration: 0.65, ease: 'power3.inOut' }, '-=0.1')
        .to('.pre-bottom', { yPercent: 100, duration: 0.65, ease: 'power3.inOut' }, '<');
    }, el);

    // Whatever happens above, the page is usable by 4.2 seconds. This has to
    // stay clear of the timeline's own length, or it truncates the curtain lift
    // instead of catching a hang.
    const failsafe = window.setTimeout(finish, 4200);

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100] pointer-events-none" aria-hidden>
      <div className="pre-top absolute inset-x-0 top-0 h-1/2 bg-soil-950" />
      <div className="pre-bottom absolute inset-x-0 bottom-0 h-1/2 bg-soil-950" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
        <svg className="pre-plant" width="120" height="130" viewBox="0 0 120 130" fill="none">
          <ellipse className="pre-seed" cx="60" cy="112" rx="11" ry="8" fill="#7a4d21" />
          <rect className="pre-shoot" x="58" y="40" width="4" height="74" rx="2" fill="#63c24d" />
          <g className="pre-leaf" transform="translate(60 74)">
            <path d="M0 0 C -9 -10, -26 -11, -35 -3 C -26 6, -9 7, 0 0 Z" fill="#86e05a" />
          </g>
          <g className="pre-leaf" transform="translate(60 56)">
            <path d="M0 0 C 9 -10, 26 -11, 35 -3 C 26 6, 9 7, 0 0 Z" fill="#a7ea7d" />
          </g>
          <g className="pre-leaf" transform="translate(60 40)">
            <path d="M0 0 C -7 -12, -3 -26, 0 -32 C 5 -25, 8 -11, 0 0 Z" fill="#c3f58c" />
          </g>
        </svg>

        <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-mist-300">
          {['Rohit', 'Kurmi'].map((word) => (
            <span key={word} className="pre-word inline-block opacity-0 translate-y-2 mr-3">
              {word}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
