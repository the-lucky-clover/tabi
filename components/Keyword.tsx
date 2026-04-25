import React, { useRef, useEffect } from 'react';
import { useOnScreen } from '../hooks/useOnScreen';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { gsap } from 'gsap';

interface KeywordProps {
  children: React.ReactNode;
  effect: 'burn' | 'holographic';
}

const Keyword: React.FC<KeywordProps> = ({ children, effect }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const onScreen = useOnScreen(ref, 0.5);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || effect !== 'burn') return;
    if (el.dataset.animated === 'true') return;

    if (prefersReduced) {
      // Show immediately, no animation
      gsap.set(el, { opacity: 1, color: 'inherit' });
      el.dataset.animated = 'true';
      return;
    }

    if (!onScreen) return;

    el.dataset.animated = 'true';
    gsap.set(el, { opacity: 0, color: '#ffc9b8' });
    gsap.to(el, {
      opacity: 1,
      color: 'inherit',
      textShadow: '0 0 20px rgba(255, 126, 95, 1), 0 0 40px rgba(255, 126, 95, 0.8)',
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(el, {
          textShadow: '0 0 0px rgba(255, 126, 95, 0)',
          duration: 1,
          ease: 'power2.out',
        });
      },
    });
  }, [onScreen, effect, prefersReduced]);

  if (effect === 'holographic') {
    return (
      <span className="keyword-holographic font-bold inline-block whitespace-nowrap">
        {children}
      </span>
    );
  }

  if (effect === 'burn') {
    return (
      <span
        ref={ref}
        className="font-bold inline-block whitespace-nowrap"
        style={{ opacity: prefersReduced ? 1 : 0 }}
      >
        {children}
      </span>
    );
  }

  return <>{children}</>;
};

export default Keyword;

