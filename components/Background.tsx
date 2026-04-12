import React, { useState, useEffect, useRef } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';

// Fix: The component is now explicitly typed as a React.FC to correctly handle React's special props like `key`.
const Star: React.FC<{ style: React.CSSProperties }> = ({ style }) => <div className="absolute rounded-full bg-white" style={style} />;

const Background: React.FC = () => {
  const [stars, setStars] = useState<React.CSSProperties[]>([]);
  const scrollProgress = useScrollProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Renamed 'speed' to 'depth' for clarity
    const generateStars = (count: number, minSize: number, maxSize: number, depth: number) => {
      return Array.from({ length: count }, () => ({
        width: `${Math.random() * (maxSize - minSize) + minSize}px`,
        height: `${Math.random() * (maxSize - minSize) + minSize}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 200}%`, // Spread stars over a larger vertical area to avoid them scrolling out of view
        opacity: Math.random() * 0.5 + 0.5,
        '--depth': depth, // Use a depth property
      }));
    };

    setStars([
      // Values represent how many pixels the layer will move up during the full scroll
      ...generateStars(100, 0.5, 1.5, 200),  // Far stars, move slowly
      ...generateStars(50, 1, 2.5, 500),     // Mid stars
      ...generateStars(20, 1.5, 3.5, 1000),  // Near stars, move fastest
    ]);
  }, []);

  // Interactive particles effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000, radius: 100 };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };
    window.addEventListener('mousemove', handleMouseMove);

    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.5 + 0.5;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
      }

      draw() {
        if(!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = (window.innerWidth * window.innerHeight) / 10000;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
      }
    };
    
    const animate = () => {
      if(!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    handleResize();
    animate();
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // This function now translates elements upwards as the user scrolls down, creating a proper parallax effect.
  // A larger depth value means the element appears closer and moves faster.
  const parallaxStyle = (depth: number): React.CSSProperties => ({
    transform: `translateY(${scrollProgress * -depth}px)`,
    transition: 'transform 0.1s linear'
  });

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#000010] to-[#0a041d] z-0 overflow-hidden">
      {/* Layer 1: Nebula. Wrapped in a parent div to separate parallax translation from rotation animation. */}
      <div
        className="absolute inset-0"
        style={parallaxStyle(100)} // Deepest layer, moves the slowest
      >
        <div
          className="w-full h-full bg-gradient-radial from-indigo-900/40 via-purple-900/20 to-transparent"
          style={{
            opacity: 0.7 + scrollProgress * 0.3,
            animation: 'spin 120s linear infinite',
            // Scale is now applied here, and rotation comes from the 'spin' animation
          }}
        />
      </div>

      {/* Layer 2: Stars */}
      <div className="absolute inset-0">
        {stars.map((style, i) => (
           <Star key={i} style={{ ...style, ...parallaxStyle(Number(style['--depth'])) }} />
        ))}
      </div>

      {/* Layer 3: Faint geometric patterns */}
       <div 
        className="absolute inset-0 opacity-5"
        style={{ 
            ...parallaxStyle(300), // Mid-ground layer
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
       />

      {/* Layer 4: Interactive particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-5" />


      {/* The spin animation now only handles rotation, preventing conflicts with inline transform styles. */}
      <style>{`
        @keyframes spin {
          from { transform: scale(1.5) rotate(0deg); }
          to { transform: scale(1.5) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Background;