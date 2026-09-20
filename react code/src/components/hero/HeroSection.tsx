import { lazy, Suspense, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { MagneticButton } from '../ui/MagneticButton';

const HeroCanvas = lazy(() => import('./HeroSapling').then((m) => ({ default: m.HeroSapling })));

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const yText    = useSpring(useTransform(scrollY, [0, 800], [0,  -120]), { stiffness: 80, damping: 22 });
  const yCanvas  = useSpring(useTransform(scrollY, [0, 800], [0,    80]), { stiffness: 80, damping: 22 });
  const opacity  = useTransform(scrollY, [0, 600], [1, 0]);
  const blur     = useTransform(scrollY, [0, 600], [0, 4]);
  const filter   = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(125,211,252,0.14) 0%, transparent 25%), radial-gradient(circle at 80% 12%, rgba(52,211,153,0.12) 0%, transparent 22%), radial-gradient(circle at 50% 70%, rgba(245,208,138,0.06) 0%, transparent 34%)',
        }}
      />

      <motion.div
        style={{ opacity, filter }}
        className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12"
      >
        <motion.div
          style={{ y: yText }}
          className="flex-1 text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/6 border border-white/10 text-slate-200 text-[11px] font-semibold tracking-[0.32em] uppercase mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-sky-300 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-300" />
            </span>
            Available for select projects
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-slate-300/80 font-medium mb-3 text-lg"
          >
            Hello, I&apos;m
          </motion.p>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-[-0.06em] leading-[0.92] text-balance">
            <span className="block text-white">Creative</span>
            <span className="block gradient-text">Full-Stack Developer</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-7 text-slate-100/95"
          >
            I build digital products that need to feel serious, modern, and alive.
          </motion.p>

          <p className="text-slate-300/72 text-base md:text-lg max-w-xl mx-auto lg:mx-0 mb-9 leading-relaxed">
            I design and ship production web applications, real-time products, and immersive frontend experiences with React, Node.js, Angular, TypeScript, and Three.js.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
          >
            <MagneticButton href="#projects" variant="primary">
              View Selected Work
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h15" />
              </svg>
            </MagneticButton>
            <MagneticButton href="#contact" variant="secondary">
              Let&apos;s Connect
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </MagneticButton>
          </motion.div>

          <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-3 text-xs uppercase tracking-[0.28em] text-slate-300/62">
            {['Frontend systems', 'Backend APIs', 'Three.js interfaces', 'Production deployment'].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          style={{ y: yCanvas }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 w-full min-w-0 flex items-center justify-center relative"
          data-cursor="drag"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[280px] h-[280px] md:w-[380px] md:h-[380px] tree-ring opacity-70" />
            <div className="absolute w-[330px] h-[330px] md:w-[440px] md:h-[440px] tree-ring opacity-40" style={{ animationDelay: '1s' }} />
          </div>
          <Suspense fallback={<div className="w-full h-[340px] md:h-[440px]" />}>
            <HeroCanvas />
          </Suspense>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-300/60 hover:text-white transition-colors flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.a>
    </section>
  );
}
