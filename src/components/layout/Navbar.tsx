import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { href: '#home',       label: 'Home' },
  { href: '#about',      label: 'About' },
  { href: '#skills',     label: 'Stack' },
  { href: '#workflow',   label: 'Services' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects',   label: 'Work' },
  { href: '#contact',    label: 'Contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = NAV_LINKS.map((l) => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/8 shadow-[0_4px_30px_rgba(2,6,23,0.35)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-18">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="flex items-center gap-2 group"
        >
          <span className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-sky-300 via-cyan-200 to-emerald-200 flex items-center justify-center text-slate-950 font-black text-base shadow-[0_0_18px_rgba(125,211,252,0.28)] group-hover:scale-110 transition-transform">
            RK
          </span>
          <span className="text-xl font-bold gradient-text hidden sm:inline font-display tracking-tight">
            Rohit
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full bg-slate-950/45 border border-white/8 backdrop-blur-md">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeSection === href.slice(1)
                    ? 'text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {activeSection === href.slice(1) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-300 via-cyan-200 to-emerald-200"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{label}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Right CTA + mobile button */}
        <div className="flex items-center gap-2">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="hidden md:inline-flex px-4 py-2 rounded-full btn-ghost text-sm font-semibold"
          >
            Start a project
          </a>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            className="md:hidden p-2 text-slate-200 hover:text-white rounded-lg"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/8 overflow-hidden"
          >
            <ul className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === href.slice(1)
                        ? 'text-slate-950 bg-gradient-to-r from-sky-300 via-cyan-200 to-emerald-200'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="block w-full text-center px-4 py-3 rounded-lg btn-forest font-semibold"
                >
                  Start a project
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
