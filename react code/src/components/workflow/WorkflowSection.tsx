import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';

const SERVICES = [
  {
    label: 'Full-Stack Development',
    desc: 'Production web apps with React, Node.js, Express, APIs, and data-driven architecture.',
  },
  {
    label: 'Interactive Frontend',
    desc: 'Premium UI systems, motion design, and immersive interfaces that stay fast and accessible.',
  },
  {
    label: 'Web Applications',
    desc: 'Custom products for dashboards, portals, workflows, and operational tools.',
  },
  {
    label: 'API & Backend Development',
    desc: 'Secure endpoints, authentication flows, and scalable application logic.',
  },
  {
    label: 'Deployment & Production',
    desc: 'Shipping to real environments with sensible performance, maintainability, and monitoring in mind.',
  },
];

export function WorkflowSection() {
  return (
    <section id="workflow" className="relative py-24 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse 80% 40% at 50% 50%, rgba(125,211,252,0.05) 0%, transparent 72%)',
      }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          title="Services"
          accent="I offer"
          subtitle="The work I’m best positioned to do: serious product engineering with a polished frontend layer."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {SERVICES.map((service, index) => (
            <motion.article
              key={service.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="card-forest rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-300/5 via-transparent to-emerald-300/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <span className="text-[11px] uppercase tracking-[0.35em] text-slate-400">0{index + 1}</span>
                  <span className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-sky-300">
                    ↗
                  </span>
                </div>
                <h3 className="font-display text-2xl font-semibold text-white mb-3 tracking-[-0.03em]">
                  {service.label}
                </h3>
                <p className="text-slate-300/72 leading-relaxed text-sm md:text-[15px]">
                  {service.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
