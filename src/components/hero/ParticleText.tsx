/**
 * Particle text: dots assemble into "Rohit Kurmi" and "Full Stack Developer"
 * Uses canvas 2D for broad compatibility and performance; optional Three.js version can be added.
 */
import { useEffect, useRef } from 'react';

const LINES = ['Rohit Kurmi', 'Full Stack Developer'];

export function ParticleText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Sample points from text via offscreen canvas; returns points and text width for centering
    const getTextPoints = (
      text: string,
      fontSize: number
    ): { points: { x: number; y: number }[]; textWidth: number; textHeight: number } => {
      const off = document.createElement('canvas');
      const scale = 2;
      const f = fontSize * scale;
      const octx = off.getContext('2d');
      if (!octx) return { points: [], textWidth: 0, textHeight: 0 };
      octx.font = `600 ${f}px "Outfit", system-ui, sans-serif`;
      const textWidth = octx.measureText(text).width / scale;
      const textHeight = fontSize * 1.2;
      off.width = Math.ceil(textWidth * scale) + 4;
      off.height = Math.ceil(textHeight * scale) + 4;
      octx.font = `600 ${f}px "Outfit", system-ui, sans-serif`;
      octx.fillStyle = 'black';
      octx.textBaseline = 'top';
      octx.fillText(text, 2, 2);
      const id = octx.getImageData(0, 0, off.width, off.height);
      const points: { x: number; y: number }[] = [];
      const step = 3;
      for (let py = 0; py < id.height; py += step) {
        for (let px = 0; px < id.width; px += step) {
          const i = (py * id.width + px) * 4;
          if (id.data[i + 3] > 128) {
            points.push({ x: px / scale, y: py / scale });
          }
        }
      }
      return { points, textWidth, textHeight };
    };

    const fontSize1 = Math.min(52, w / 10);
    const fontSize2 = Math.min(28, w / 18);
    const r1 = getTextPoints(LINES[0], fontSize1);
    const r2 = getTextPoints(LINES[1], fontSize2);
    const points1 = r1.points;
    const points2 = r2.points;

    if (points1.length === 0 && points2.length === 0) {
      return () => window.removeEventListener('resize', resize);
    }

    const blockHeight = r1.textHeight + r2.textHeight + 8;
    const startY = h * 0.38 - blockHeight / 2;
    const startY1 = startY;
    const startY2 = startY + r1.textHeight + 8;

    const allPoints = points1
      .map((p) => ({
        targetX: w / 2 - r1.textWidth / 2 + p.x,
        targetY: startY1 + p.y,
      }))
      .concat(
        points2.map((p) => ({
          targetX: w / 2 - r2.textWidth / 2 + p.x,
          targetY: startY2 + p.y,
        }))
      );

    // Scatter start positions
    const state = allPoints.map((p) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      targetX: p.targetX,
      targetY: p.targetY,
      vx: 0,
      vy: 0,
    }));

    const animate = () => {
      phaseRef.current += 0.008;
      ctx.clearRect(0, 0, w, h);
      state.forEach((s, i) => {
        const targetX = allPoints[i].targetX;
        const targetY = allPoints[i].targetY;
        s.x += (targetX - s.x) * 0.08 + Math.sin(phaseRef.current + i * 0.1) * 0.3;
        s.y += (targetY - s.y) * 0.08 + Math.cos(phaseRef.current * 0.7 + i * 0.1) * 0.3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${0.4 + 0.4 * Math.sin(phaseRef.current + i * 0.2)})`;
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(animate);
    };

    // Start animation after a short delay so particles "assemble"
    const startTimeout = setTimeout(() => {
      phaseRef.current = 0;
      animate();
    }, 300);

    return () => {
      window.removeEventListener('resize', resize);
      clearTimeout(startTimeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ minHeight: '280px' }}
      aria-hidden
    />
  );
}
