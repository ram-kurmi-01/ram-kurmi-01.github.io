/**
 * Count-up number, triggered when scrolled into view.
 */
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CounterProps {
  to: number;
  from?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function Counter({
  to,
  from = 0,
  duration = 1600,
  prefix = '',
  suffix = '',
  className = '',
}: CounterProps) {
  const [val, setVal] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  // -30% meant the number had to be a third of the way up the viewport
  // before it started, so short visits saw a stuck 0.
  const inView = useInView(ref, { once: true, margin: '-12%' });

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setVal(Math.floor(from + (to - from) * easeOutCubic(progress)));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [inView, to, from, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val}
      {suffix}
    </span>
  );
}
