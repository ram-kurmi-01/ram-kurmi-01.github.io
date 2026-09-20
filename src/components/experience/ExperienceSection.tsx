import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { EXPERIENCE } from '../../data/experience';

export function ExperienceSection() {
  return (
    <section id="experience" className="relative py-24 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(22,163,74,0.05) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        <SectionHeading
          title="Experience"
          accent="Timeline"
          subtitle="Roles and project work that show where I&apos;ve actually built and shipped software."
        />

        <div className="relative">
          {/* Animated growing tree-trunk line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-150px' }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-px origin-top"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, #4ade80 8%, #22c55e 50%, #166534 90%, transparent 100%)',
              boxShadow: '0 0 12px rgba(74,222,128,0.4)',
            }}
            aria-hidden
          />

          {EXPERIENCE.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex flex-col md:flex-row gap-6 mb-14 last:mb-0 ${
                i % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* LEFT/RIGHT meta */}
              <div className={`pl-12 md:pl-0 md:w-1/2 ${
                i % 2 === 0 ? 'md:pr-14 md:text-right md:items-end' : 'md:pl-14 md:items-start'
              } flex flex-col`}>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold tracking-wider uppercase mb-3 self-start md:self-auto"
                  style={{ alignSelf: i % 2 === 0 ? 'flex-end' : 'flex-start' }}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
                  {entry.period}
                </motion.span>
                  <h3 className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">{entry.role}</h3>
                  <p className="text-slate-300/72 text-base font-medium">{entry.company}</p>
              </div>

              {/* Center node */}
              <div
                className="absolute left-4 md:left-1/2 -translate-x-1/2 mt-2 w-5 h-5 rounded-full flex items-center justify-center"
                aria-hidden
              >
                <motion.span
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.4 }}
                  className="absolute inset-0 rounded-full bg-leaf/40"
                />
                <span className="relative w-3 h-3 rounded-full bg-leaf shadow-[0_0_14px_rgba(74,222,128,0.7)] ring-4 ring-forest-900" />
              </div>

              {/* Card */}
              <div className="md:w-1/2 md:pl-14 ml-10 md:ml-0">
                    <motion.div
                  whileHover={{ y: -4 }}
                  className="card-forest rounded-2xl p-6 relative overflow-hidden"
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-sky-300/10 blur-2xl" />
                  <div className="relative">
                    <ul className="space-y-3">
                      {entry.bullets.map((bullet, j) => (
                        <motion.li
                          key={j}
                          initial={{ opacity: 0, x: 10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: j * 0.08 }}
                          className="text-slate-300/75 text-xs sm:text-sm md:text-base leading-relaxed flex gap-3"
                        >
                          <span className="text-sky-200 flex-shrink-0 mt-0.5">•</span>
                          <span>{bullet}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* Tree-base flourish at bottom */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute left-4 md:left-1/2 -bottom-2 -translate-x-1/2 text-3xl"
            aria-hidden
          >
            ·
          </motion.div>
        </div>
      </div>
    </section>
  );
}
