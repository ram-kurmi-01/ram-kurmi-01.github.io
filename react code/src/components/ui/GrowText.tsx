/**
 * Headline type that grows up out of its own baseline.
 *
 * SplitText's `mask` option gives each line a clipping wrapper, so characters
 * can start fully below the line and rise into it — the letters appear to push
 * up out of soil rather than fade in from nowhere. That's the "grow" verb from
 * the motion vocabulary, applied to type.
 *
 * Falls back to plain text with no split at all when motion is reduced, which
 * also keeps the markup screen-reader-clean (SplitText shreds text into a span
 * per character, so the un-split path is the accessible one).
 */
import { useEffect, useRef, createElement } from 'react';
import { gsap, ensureGsap, SplitText, useReducedMotion, STAGGER, GSAP_EASE } from '../../motion';

interface GrowTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  /** Wait this long after the trigger before the first character moves. */
  delay?: number;
  /** Run on mount instead of when scrolled into view. For above-the-fold type. */
  immediate?: boolean;
  stagger?: number;
}

export function GrowText({
  children,
  className = '',
  as = 'span',
  delay = 0,
  immediate = false,
  stagger = STAGGER.tight,
}: GrowTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    ensureGsap();
    let split: SplitText | null = null;

    const ctx = gsap.context(() => {
      split = new SplitText(el, { type: 'chars,lines', mask: 'lines', linesClass: 'grow-line' });

      gsap.from(split.chars, {
        yPercent: 118,
        // A touch of rotation stops a long word reading like a slot machine.
        rotate: (i: number) => (i % 2 ? 3 : -3),
        opacity: 0,
        duration: 0.95,
        ease: GSAP_EASE.grow,
        stagger,
        delay,
        scrollTrigger: immediate
          ? undefined
          : { trigger: el, start: 'top 88%', once: true },
      });
    }, el);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [children, reduced, delay, immediate, stagger]);

  return createElement(as, { ref, className }, children);
}
