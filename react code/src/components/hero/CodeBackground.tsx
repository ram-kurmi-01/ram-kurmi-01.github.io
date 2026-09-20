import { useMemo } from 'react';
import { motion } from 'framer-motion';

const KEYWORDS = [
  'React',
  'Node.js',
  'Angular',
  'JavaScript',
  'TypeScript',
  'APIs',
  'MongoDB',
  'PostgreSQL',
  'Express',
  'NextJS',
  'Git',
  'AWS',
];

export function CodeBackground() {
  const items = useMemo(() => {
    return KEYWORDS.map((keyword, i) => ({
      id: i,
      keyword,
      x: Math.random() * 100 - 5,
      delay: Math.random() * 6,
      duration: 18 + Math.random() * 12,
      size: 0.85 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {/* Floating tech keywords – visible but not harsh */}
      {items.map(({ id, keyword, x, delay, duration, size }) => (
        <motion.div
          key={id}
          className="absolute font-mono whitespace-nowrap select-none text-moss-400/20"
          style={{
            left: `${x}%`,
            top: '-2rem',
            fontSize: `${size}rem`,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: '110vh',
            opacity: [0, 0.2, 0.2, 0],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            repeatDelay: 0,
          }}
        >
          {keyword}
        </motion.div>
      ))}
    </div>
  );
}
