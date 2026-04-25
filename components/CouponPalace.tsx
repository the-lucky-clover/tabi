import React from 'react';
import { Coupons } from '../constants';
import CouponCard from './CouponCard';
import AnimatedText from './AnimatedText';
import { improveTypography } from '../lib/typography';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const CouponPalace: React.FC = () => {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-gradient-to-b from-[#0a041d] to-[#1d0b38]">
      <div className="text-center mb-16">
        <h1 className="font-cinzel text-4xl md:text-6xl text-white font-bold">
          <AnimatedText text="Love Coupon Redemption Palace" />
        </h1>
        <p className="text-balance mt-4 text-lg text-white/70">
          {improveTypography("For my one and only, Tabitha.")}
        </p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Coupons.map((coupon, index) => (
          <div
            key={coupon.id}
            style={
              prefersReduced
                ? undefined
                : { animation: `fadeInUp 0.5s ease-out ${index * 0.08}s both` }
            }
          >
            <CouponCard coupon={coupon} />
          </div>
        ))}
      </div>
      {!prefersReduced && (
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      )}
    </section>
  );
};

export default CouponPalace;
