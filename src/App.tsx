import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Lenis from 'lenis';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ForestBackground } from './components/background/ForestBackground';
import { HeroSection } from './components/hero/HeroSection';
import { AboutSection } from './components/about/AboutSection';
import { SkillsSection } from './components/skills/SkillsSection';
import { WorkflowSection as ServicesSection } from './components/workflow/WorkflowSection';
import { ExperienceSection } from './components/experience/ExperienceSection';
import { ProjectsSection } from './components/projects/ProjectsSection';
import { ContactSection } from './components/contact/ContactSection';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { Cursor } from './components/ui/Cursor';

function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ServicesSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </>
  );
}

function App() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let raf = 0;
    const ticker = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(ticker);
    };
    raf = requestAnimationFrame(ticker);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      <ForestBackground />
      <ScrollProgress />
      <Cursor />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
