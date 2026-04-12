import React, { useState, useRef } from 'react';
import { Coupon } from '../types';
import { improveTypography } from '../lib/typography';

interface CouponCardProps {
  coupon: Coupon;
}

const CouponCard: React.FC<CouponCardProps> = ({ coupon }) => {
  const [isRedeemed, setIsRedeemed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    const rotateY = x * 30; // Max rotation
    const rotateX = -y * 30;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
  };

  const handleRedeem = () => {
    if (isRedeemed) return;
    setIsRedeemed(true);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 4000);
  };

  return (
    <>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-96 rounded-2xl p-6 bg-gradient-to-br from-indigo-500/20 to-rose-500/20 backdrop-blur-md border border-white/20 transition-transform duration-300 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 rounded-2xl bg-black/20" style={{ transform: 'translateZ(-20px)' }}></div>
        <div className="flex flex-col h-full justify-between items-center text-center">
            <div className="flex-shrink-0">
                <div className="text-6xl mb-4" style={{ transform: 'translateZ(50px)' }}>{coupon.illustration}</div>
                <h3 className="text-balance font-cinzel text-xl font-bold text-white" style={{ transform: 'translateZ(40px)' }}>
                  {improveTypography(coupon.title)}
                </h3>
            </div>
            <p className="text-pretty text-sm text-white/80 leading-relaxed" style={{ transform: 'translateZ(30px)' }}>
              {improveTypography(coupon.description)}
            </p>
            <button
                onClick={handleRedeem}
                disabled={isRedeemed}
                className={`w-full py-2 px-4 rounded-lg font-bold transition-all duration-300 ${
                    isRedeemed
                    ? 'bg-green-500/50 text-white/70 cursor-not-allowed'
                    : 'bg-rose-500 text-white hover:bg-rose-400 hover:shadow-lg hover:shadow-rose-500/50'
                }`}
                style={{ transform: 'translateZ(20px)' }}
            >
                {isRedeemed ? 'Redeemed' : 'Redeem'}
            </button>
        </div>
      </div>
      {showConfirmation && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fade-in">
             <div className="bg-gradient-to-br from-gray-800 to-black border border-rose-500 p-8 rounded-lg text-center shadow-2xl shadow-rose-500/30">
                 <h2 className="font-cinzel text-2xl text-white mb-2 text-balance">
                   {improveTypography("Coupon Redeemed!")}
                 </h2>
                 <p className="text-white/80 text-pretty">
                   {improveTypography("A magical notice has been sent to Tabitha.")}
                 </p>
                 <div className="text-5xl mt-4 animate-ping">💌</div>
             </div>
         </div>
      )}
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease; }
      `}</style>
    </>
  );
};

export default CouponCard;