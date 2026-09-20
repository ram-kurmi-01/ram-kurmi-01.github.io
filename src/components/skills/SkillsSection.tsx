import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { SKILL_GROUPS } from '../../data/skills';
import { Stagger, StaggerItem } from '../ui/Reveal';

const CATEGORY_ICONS: Record<string, string> = {
  'Front-End':            'UI',
  'Back-End':             'API',
  'Database':             'DB',
  'Version Control':      'VCS',
  'Deployment & Testing': 'OPS',
  'Soft Skills':          'TEAM',
};

const CATEGORY_HUE: Record<string, string> = {
  'Front-End':            'from-leaf/30 to-forest-300/10',
  'Back-End':             'from-forest-300/30 to-forest-400/10',
  'Database':             'from-forest-200/30 to-forest-500/10',
  'Version Control':      'from-leaf-light/30 to-forest-300/10',
  'Deployment & Testing': 'from-forest-100/30 to-forest-400/10',
  'Soft Skills':          'from-leaf/25 to-forest-500/10',
};

export function SkillsSection() {
  return (
    <section id="skills" className="relative py-24 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(34,197,94,0.04) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          title="Tech"
          accent="Stack"
          subtitle="The technologies I actually use to build and ship products."
        />

        <Stagger gap={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILL_GROUPS.map((group, i) => (
            <StaggerItem
              key={group.category}
              className="relative"
            >
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="card-forest rounded-2xl p-6 relative overflow-hidden group h-full"
              >
                {/* Tinted background blob */}
                <div
                  className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${CATEGORY_HUE[group.category] ?? 'from-leaf/20 to-forest-500/10'} blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-semibold tracking-[0.28em] text-sky-200">
                      {CATEGORY_ICONS[group.category] ?? '🌿'}
                    </div>
                    <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg">{group.category}</h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item, j) => (
                      <motion.span
                        key={item}
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 + j * 0.04 }}
                        whileHover={{ scale: 1.06, y: -2 }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-200 text-sm border border-white/10 hover:border-sky-300/40 hover:bg-white/8 hover:text-white transition-all duration-200 cursor-default"
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Featured tech orbit ring */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-400 text-sm uppercase tracking-[0.3em] mb-6">
            Daily-driver stack
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['React', 'Node.js', 'Angular', 'TypeScript', 'MongoDB', 'AWS', 'Next.js', 'FastAPI'].map(
              (tech, i) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i }}
                  whileHover={{ scale: 1.08, y: -4 }}
                  className="px-5 py-2.5 rounded-xl bg-white/5 text-slate-200 border border-white/10 text-sm font-medium hover:border-sky-300/40 hover:shadow-[0_0_18px_rgba(125,211,252,0.12)] transition-all"
                >
                  {tech}
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
