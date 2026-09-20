import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  accent?: string;
}

export function SectionHeading({ title, subtitle, accent }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-center mb-14 md:mb-20"
    >
      <div className="flex justify-center mb-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px] font-semibold tracking-[0.35em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
          Selected
        </span>
      </div>

      <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-[-0.04em] leading-[0.95]">
        <span>{title}</span>
        {accent && <span className="block gradient-text">{accent}</span>}
      </h2>

      {subtitle && (
        <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto text-slate-300/75 leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* Section divider line */}
      <div className="mt-6 mx-auto w-20 sm:w-24 md:w-32 section-divider" />
    </motion.div>
  );
}
