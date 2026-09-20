/**
 * Standard reveal wrapper used across sections.
 * Fades in with optional slide / scale, with stagger support.
 */
import { motion, type Variants } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  duration?: number;
  once?: boolean;
  margin?: string;
  as?: 'div' | 'section' | 'article' | 'li' | 'span';
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 30,
  x = 0,
  scale = 1,
  duration = 0.7,
  once = true,
  margin = '-60px',
  as = 'div',
}: RevealProps) {
  const Tag = motion[as] as typeof motion.div;
  const variants: Variants = {
    hidden:  { opacity: 0, y, x, scale },
    show:    { opacity: 1, y: 0, x: 0, scale: 1 },
  };

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: margin as `${number}px` }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      variants={variants}
    >
      {children}
    </Tag>
  );
}

/* ── Stagger container & items ──────────────────── */

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  /** Gap between children (seconds) */
  gap?: number;
  /** Wait before first child (seconds) */
  delay?: number;
  once?: boolean;
}

export function Stagger({
  children,
  className = '',
  gap = 0.08,
  delay = 0,
  once = true,
}: StaggerProps) {
  const variants: Variants = {
    hidden: {},
    show:   { transition: { staggerChildren: gap, delayChildren: delay } },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-50px' }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  const variants: Variants = {
    hidden: { opacity: 0, y },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
