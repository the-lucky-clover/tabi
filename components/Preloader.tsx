import React from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const Preloader: React.FC = () => {
  const prefersReduced = usePrefersReducedMotion();

  // Pre-compute per-petal rotation values so the keyframes are deterministic
  const petalAngles = [0, 60, 120, 180, 240, 300];

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center gap-8 overflow-hidden">
      <div className="relative w-64 h-64">
        {petalAngles.map((baseAngle, i) => (
          <div
            key={i}
            className="absolute inset-0 border-2 border-rose-400/50 rounded-full"
            style={
              prefersReduced
                ? { transform: `rotate(${baseAngle}deg) scale(1)`, opacity: 0.5 }
                : {
                    transform: `rotate(${baseAngle}deg) scale(0)`,
                    animation: `petal-burst-${i} 3s ease-out ${i * 0.1}s infinite`,
                  }
            }
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center font-cinzel text-white text-3xl animate-pulse">
          Tabitha
        </div>
      </div>
      <p className="text-balance text-white/70 tracking-widest animate-pulse">
        Preparing your journey&hellip;
      </p>
      {!prefersReduced && (
        <style>{`
          ${petalAngles.map((baseAngle, i) => `
            @keyframes petal-burst-${i} {
              0%   { transform: rotate(${baseAngle}deg) scale(0); opacity: 1; }
              70%  { transform: rotate(${baseAngle + 180}deg) scale(1.2); opacity: 0.5; }
              100% { transform: rotate(${baseAngle + 360}deg) scale(1.5); opacity: 0; }
            }
          `).join('')}
        `}</style>
      )}
    </div>
  );
};

export default Preloader;
