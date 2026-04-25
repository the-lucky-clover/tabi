import React, { useState, useEffect, useRef } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const Star: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="absolute rounded-full bg-white parallax-layer" style={style} />
);

// Named constants for particle system tuning
const MAX_PARTICLES = 220;
const GLOW_SIZE_THRESHOLD = 1.5;
const PARTICLE_CONNECTION_DISTANCE = 90;
const PARTICLE_COLORS = [
  'rgba(192, 132, 252, ', // purple-400
  'rgba(244, 114, 182, ', // pink-400
  'rgba(129, 140, 248, ', // indigo-400
  'rgba(251, 191,  36, ', // amber-400
  'rgba(167, 243, 208, ', // emerald-200
  'rgba(255, 255, 255, ', // white
];

const Background: React.FC = () => {
  const [stars, setStars] = useState<React.CSSProperties[]>([]);
  const scrollProgress = useScrollProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const generateStars = (count: number, minSize: number, maxSize: number, depth: number) =>
      Array.from({ length: count }, () => ({
        width:   `${Math.random() * (maxSize - minSize) + minSize}px`,
        height:  `${Math.random() * (maxSize - minSize) + minSize}px`,
        left:    `${Math.random() * 100}%`,
        top:     `${Math.random() * 200}%`,
        opacity: Math.random() * 0.5 + 0.5,
        '--depth': depth,
      }));

    setStars([
      ...generateStars(100, 0.5, 1.5,  200),
      ...generateStars(50,  1.0, 2.5,  500),
      ...generateStars(20,  1.5, 3.5, 1000),
    ]);
  }, []);

  // Interactive / animated particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999, radius: 120 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    // When reduced-motion is active, keep the canvas but skip interactivity/animation
    if (!prefersReduced) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      color: string;
      alpha: number;
      baseAlpha: number;
      pulseSpeed: number;
      pulseOffset: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 0.5;
        this.baseX = x;
        this.baseY = y;
        this.density = Math.random() * 25 + 5;
        this.baseAlpha = Math.random() * 0.45 + 0.2;
        this.alpha = this.baseAlpha;
        this.pulseSpeed = Math.random() * 0.015 + 0.005;
        this.pulseOffset = Math.random() * Math.PI * 2;
        const baseColor = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        this.color = baseColor + this.baseAlpha + ')';
      }

      draw(t: number) {
        if (!ctx) return;
        // Subtle brightness pulse
        const pulse = Math.sin(t * this.pulseSpeed + this.pulseOffset) * 0.15 + 1;
        const a = Math.min(1, this.baseAlpha * pulse);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace(/[\d.]+\)$/, `${a})`);
        ctx.fill();
        // Soft glow for larger particles
        if (this.size > GLOW_SIZE_THRESHOLD) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5);
          grad.addColorStop(0, this.color.replace(/[\d.]+\)$/, `${a * 0.4})`));
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = (mouse.radius - dist) / mouse.radius;
        if (dist < mouse.radius && force > 0) {
          this.x -= (dx / dist) * force * this.density;
          this.y -= (dy / dist) * force * this.density;
        } else {
          if (this.x !== this.baseX) this.x -= (this.x - this.baseX) / 12;
          if (this.y !== this.baseY) this.y -= (this.y - this.baseY) / 12;
        }
      }
    }

    const initParticles = () => {
      particles = [];
      // Fewer particles on small screens for performance
      const density = window.innerWidth < 768 ? 14000 : 9000;
      const count = Math.min(MAX_PARTICLES, Math.floor((canvas.width * canvas.height) / density));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
      }
    };

    let t = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t++;

      // Draw connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < PARTICLE_CONNECTION_DISTANCE) {
            const alpha = (1 - dist / PARTICLE_CONNECTION_DISTANCE) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(192, 132, 252, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        particles[i].update();
        particles[i].draw(t);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    handleResize();
    if (!prefersReduced) {
      animate();
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReduced]);

  // Parallax: translate upwards as the user scrolls. Disabled when reduced-motion is on.
  const parallaxStyle = (depth: number): React.CSSProperties =>
    prefersReduced
      ? {}
      : {
          transform: `translateY(${scrollProgress * -depth}px)`,
          willChange: 'transform',
        };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#000010] to-[#0a041d] z-0 overflow-hidden">
      {/* Layer 1: Nebula glow */}
      <div className="absolute inset-0 parallax-layer" style={parallaxStyle(100)}>
        <div
          className="w-full h-full bg-gradient-radial from-indigo-900/40 via-purple-900/20 to-transparent"
          style={{
            opacity: 0.7 + scrollProgress * 0.3,
            animation: prefersReduced ? 'none' : 'nebula-spin 120s linear infinite',
            transform: 'scale(1.5)',
          }}
        />
      </div>

      {/* Layer 2: Stars */}
      <div className="absolute inset-0">
        {stars.map((style, i) => (
          <Star key={i} style={{ ...style, ...parallaxStyle(Number(style['--depth'])) }} />
        ))}
      </div>

      {/* Layer 3: Subtle geometric overlay */}
      <div
        className="absolute inset-0 opacity-5 parallax-layer"
        style={{
          ...parallaxStyle(300),
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Layer 4: Interactive particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" style={{ zIndex: 5 }} />

      <style>{`
        @keyframes nebula-spin {
          from { transform: scale(1.5) rotate(0deg); }
          to   { transform: scale(1.5) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Background;
