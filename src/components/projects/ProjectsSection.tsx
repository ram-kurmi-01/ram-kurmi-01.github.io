import { useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { PROJECTS } from '../../data/projects';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import type { Project } from '../../data/projects';

export function ProjectsSection() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative py-24 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(125,211,252,0.06) 0%, transparent 72%)',
      }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          title="Selected"
          accent="Work"
          subtitle="A curated set of real projects that show product thinking, frontend quality, and full-stack execution."
        />

        <div className="grid grid-cols-1 gap-5">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onSelect={() => setSelected(project)}
            />
          ))}
        </div>

        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      </div>
    </section>
  );
}
