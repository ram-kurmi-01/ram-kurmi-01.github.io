import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { Project } from '../../data/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
  onSelect: () => void;
}

export function ProjectCard({ project, index, onSelect }: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateY = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 200, damping: 20 });
  const rotateX = useSpring(useTransform(my, [0, 1], [10, -10]),  { stiffness: 200, damping: 20 });

  const onMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const onMouseLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    setHovered(false);
  };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      }}
      className="group rounded-3xl overflow-hidden card-forest relative"
    >
      <button
        type="button"
        onClick={onSelect}
        data-cursor="project"
        className="w-full text-left block"
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
          <div className="relative lg:col-span-5 min-h-[240px] lg:min-h-full overflow-hidden bg-slate-900/70">
          <motion.img
            src={project.image}
            alt={project.title}
            loading="lazy"
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <motion.div
            animate={{ y: hovered ? 0 : 8, opacity: hovered ? 1 : 0 }}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 text-slate-950 text-[11px] font-semibold tracking-[0.28em] uppercase backdrop-blur-sm"
          >
            View
          </motion.div>
          </div>

          <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Project {String(index + 1).padStart(2, '0')}</span>
                <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Selected work</span>
              </div>

              <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-[-0.04em] leading-[0.95] mb-4 group-hover:text-sky-100 transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-300/72 text-base md:text-lg leading-relaxed max-w-2xl mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-full bg-white/5 text-slate-200 text-xs md:text-sm border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-sky-200 transition-colors"
                >
                  Live demo
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </button>

      {/* Subtle hover glow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            'radial-gradient(400px circle at var(--x) var(--y), rgba(74,222,128,0.15), transparent 50%)',
        }}
      />
    </motion.article>
  );
}
