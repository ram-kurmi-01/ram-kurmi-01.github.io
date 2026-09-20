import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function MagneticButton({
  children,
  className = '',
  href,
  onClick,
  variant = 'primary',
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
    setPosition({ x, y });
  };

  const handleLeave = () => setPosition({ x: 0, y: 0 });

  const base =
    'inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold transition-all duration-300';
  const variants = {
    primary: 'btn-forest',
    secondary: 'btn-ghost',
    ghost: 'text-leaf-light hover:text-mist-50 hover:bg-forest-700/40',
  };

  const style = { x: position.x, y: position.y };

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={style}
        className={`${base} ${variants[variant]} ${className}`}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={style}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
