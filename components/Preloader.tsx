import React from 'react';

const Preloader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center gap-8 overflow-hidden">
      <div className="relative w-64 h-64">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 border-2 border-rose-400/50 rounded-full"
            style={{
              transform: `rotate(${i * 30}deg) scale(0)`,
              animation: `petal-burst 3s ease-out ${i * 0.1}s infinite`,
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center font-cinzel text-white text-3xl animate-pulse">
          Tabitha
        </div>
      </div>
      <p className="text-balance text-white/70 tracking-widest animate-pulse">Preparing your journey...</p>
      <style>{`
        @keyframes petal-burst {
          0% { transform: rotate(0deg) scale(0); opacity: 1; }
          70% { transform: rotate(${Math.random() * 360}deg) scale(1.2); opacity: 0.5; }
          100% { transform: rotate(${Math.random() * 360}deg) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Preloader;