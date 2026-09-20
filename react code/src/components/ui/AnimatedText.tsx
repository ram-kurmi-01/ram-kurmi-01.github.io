/**
 * Word-by-word reveal driven by viewport intersection.
 * Useful for headings, tag-lines, paragraphs.
 */
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  /** Class applied to each word span — use this for gradient/colour effects */
  wordClassName?: string;
  el?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  /** Delay between words (seconds) */
  stagger?: number;
  /** Initial delay before first word (seconds) */
  delay?: number;
  /** Y offset to slide in from */
  y?: number;
  /** Animate once or every time it enters view */
  once?: boolean;
}

const containerVariants = (stagger: number, delay: number) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

const wordVariants = (y: number) => ({
  hidden: { opacity: 0, y, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
});

export function AnimatedText({
  text,
  className = '',
  wordClassName = '',
  el = 'span',
  stagger = 0.06,
  delay = 0,
  y = 24,
  once = true,
}: AnimatedTextProps) {
  const Tag = motion[el] as typeof motion.span;
  const words = text.split(' ');

  return (
    <Tag
      className={className}
      variants={containerVariants(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-50px' }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordVariants(y)}
          className={`inline-block ${wordClassName}`.trim()}
          style={{ marginRight: '0.28em', willChange: 'transform, opacity' }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
