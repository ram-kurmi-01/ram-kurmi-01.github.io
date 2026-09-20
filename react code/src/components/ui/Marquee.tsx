/**
 * Infinite horizontal marquee.
 * Items render twice so the loop is seamless.
 */
import { motion } from 'framer-motion';

interface MarqueeProps {
  items: string[];
  /** Seconds for one full loop */
  speed?: number;
  /** Reverse direction */
  reverse?: boolean;
  className?: string;
}

export function Marquee({ items, speed = 30, reverse = false, className = '' }: MarqueeProps) {
  const doubled = [...items, ...items];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-16 md:w-24 bg-gradient-to-r from-forest-900 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-16 md:w-24 bg-gradient-to-l from-forest-900 to-transparent z-10" />

      <motion.div
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        className="flex items-center gap-4 sm:gap-6 lg:gap-8 whitespace-nowrap will-change-transform"
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-forest-700/40 border border-leaf/15 text-leaf-light/80 text-xs sm:text-sm font-medium tracking-wide hover:text-leaf hover:border-leaf/40 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-leaf" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
