/**
 * Custom cursor with contextual labels for links, projects, and drag targets.
 */
import { useEffect, useRef } from 'react';

export function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let dx = mx, dy = my;
    let gx = mx, gy = my;
    let scale = 1;
    let targetScale = 1;
    let mode: 'default' | 'link' | 'project' | 'drag' = 'default';

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const projectTarget = t.closest('[data-cursor="project"]');
      const dragTarget = t.closest('[data-cursor="drag"]');
      const inputTarget = t.closest('input, textarea, select, label');

      if (dragTarget) {
        mode = 'drag';
        targetScale = 2.2;
      } else if (projectTarget) {
        mode = 'project';
        targetScale = 2.8;
      } else if (inputTarget) {
        mode = 'default';
        targetScale = 1;
      } else {
        mode = 'default';
        targetScale = 1;
      }
    };

    const tick = () => {
      dx += (mx - dx) * 0.55;
      dy += (my - dy) * 0.55;
      gx += (mx - gx) * 0.13;
      gy += (my - gy) * 0.13;
      scale += (targetScale - scale) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform =
          `translate3d(${gx}px, ${gy}px, 0) translate(-50%, -50%) scale(${scale})`;
        glowRef.current.dataset.mode = mode;
      }

      raf = requestAnimationFrame(tick);
    };

    let raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        aria-hidden
        className="hidden md:block fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-[100] mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle, rgba(125,211,252,0.30) 0%, rgba(52,211,153,0.10) 45%, transparent 72%)',
          filter: 'blur(8px)',
          willChange: 'transform',
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="hidden md:block fixed top-0 left-0 w-2 h-2 rounded-full bg-leaf pointer-events-none z-[101]"
        style={{
          boxShadow: '0 0 10px rgba(125,211,252,0.7)',
          willChange: 'transform',
        }}
      />
      <div
        aria-hidden
        className="hidden md:flex fixed top-0 left-0 min-w-10 h-8 px-2.5 rounded-full items-center justify-center pointer-events-none z-[102]"
        style={{ opacity: 0, transform: 'translate3d(-999px, -999px, 0)' }}
      />
    </>
  );
}
