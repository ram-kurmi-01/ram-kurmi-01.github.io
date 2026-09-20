import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { MagneticButton } from '../ui/MagneticButton';
import { Counter } from '../ui/Counter';
import { Stagger, StaggerItem } from '../ui/Reveal';
import { AnimatedText } from '../ui/AnimatedText';

const HIGHLIGHTS = [
  { icon: 'Frontend', label: 'UI systems', text: 'Premium interfaces, motion, and responsive composition.' },
  { icon: 'Backend', label: 'Application logic', text: 'React, Angular, Node.js, FastAPI, APIs, and data flow.' },
  { icon: 'Performance', label: 'Production-minded', text: 'Fast, accessible UIs with restrained animation.' },
  { icon: 'Deployment', label: 'Delivery', text: 'Shipping to web and mobile environments with care.' },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 md:py-32 px-4 overflow-hidden">
      {/* Soft gradient panel */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(22,163,74,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          title="About"
          accent="Me"
          subtitle="A practical builder focused on reliable systems, polished interfaces, and thoughtful delivery."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: avatar card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-center lg:items-start"
          >
            {/* Avatar with rotating border */}
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-3 rounded-3xl"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0%, #4ade80 25%, transparent 50%, #22c55e 75%, transparent 100%)',
                  filter: 'blur(14px)',
                  opacity: 0.45,
                }}
              />
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-3xl card-forest p-1 overflow-hidden glow-green">
                  <div className="w-full h-full rounded-[20px] bg-gradient-to-br from-slate-900 via-slate-950 to-black flex items-center justify-center relative">
                    <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black gradient-text drop-shadow-[0_0_30px_rgba(125,211,252,0.22)]">
                    RK
                  </span>
                    <span className="absolute top-4 right-4 text-xs uppercase tracking-[0.35em] text-slate-400">Creative</span>
                    <span className="absolute bottom-4 left-4 text-xs uppercase tracking-[0.35em] text-slate-400">Full-stack</span>
                </div>
              </div>
            </div>

            {/* Quick stats with count-up animation */}
            <Stagger gap={0.1} className="mt-8 grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-xs sm:max-w-sm">
              <StaggerItem className="card-forest rounded-xl p-4 text-center">
                  <Counter to={4} suffix="+" className="text-2xl font-bold gradient-text" />
                  <div className="text-slate-400 text-xs uppercase tracking-wider mt-1">Years</div>
              </StaggerItem>
              <StaggerItem className="card-forest rounded-xl p-4 text-center">
                <Counter to={20} suffix="+" className="text-2xl font-bold gradient-text" />
                  <div className="text-slate-400 text-xs uppercase tracking-wider mt-1">Projects</div>
              </StaggerItem>
              <StaggerItem className="card-forest rounded-xl p-4 text-center">
                <Counter to={2} className="text-2xl font-bold gradient-text" />
                  <div className="text-slate-400 text-xs uppercase tracking-wider mt-1">Apps live</div>
              </StaggerItem>
            </Stagger>
          </motion.div>

          {/* RIGHT: text + highlight cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-leaf/10 border border-leaf/25 text-leaf text-xs font-medium tracking-wider uppercase mb-4">
              <span className="text-base">·</span> Full Stack Developer
            </div>

            <AnimatedText
              text="Developer. Builder. Problem Solver."
              el="h3"
              stagger={0.05}
              y={20}
              className="font-display text-2xl md:text-3xl font-bold text-white mb-4 leading-tight"
            />

            <p className="text-slate-300/75 text-base md:text-lg leading-relaxed mb-5 max-w-2xl">
              I build production-facing web applications and interactive interfaces with React, Angular, Node.js, FastAPI, and modern JavaScript. The work is usually a mix of product thinking, implementation detail, and clean frontend execution.
            </p>

            <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-2xl">
              I&apos;ve also shipped apps to the Google Play Store and App Store, so I care about deployment, maintainability, and the difference between a demo and a product.
            </p>

            {/* Highlight cards with stagger reveal */}
            <Stagger gap={0.1} delay={0.2} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {HIGHLIGHTS.map((h) => (
                <StaggerItem
                  key={h.label}
                  className="card-forest rounded-xl p-4 flex items-start gap-3 hover:border-white/20 transition-colors"
                >
                  <span className="text-sm uppercase tracking-[0.24em] text-sky-200 mt-1">{h.icon}</span>
                  <div>
                    <div className="text-white font-semibold text-sm">{h.label}</div>
                    <div className="text-slate-400 text-xs leading-relaxed mt-0.5">{h.text}</div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <MagneticButton href="#skills" variant="primary">
              Explore Skills
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
