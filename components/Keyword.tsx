import React, { useRef, useEffect } from 'react';
import { useOnScreen } from '../hooks/useOnScreen';
import { gsap } from 'gsap';

interface KeywordProps {
  children: React.ReactNode;
  effect: 'burn' | 'holographic';
}

const Keyword: React.FC<KeywordProps> = ({ children, effect }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const onScreen = useOnScreen(ref, 0.5);

  useEffect(() => {
    const el = ref.current;
    // Trigger animation only for 'burn' effect when it's on screen
    if (el && onScreen && effect === 'burn') {
      // Ensure animation runs only once
      if (el.dataset.animated === 'true') return;
      el.dataset.animated = 'true';

      // Set initial state for the burn effect
      gsap.set(el, { opacity: 0, color: '#ffc9b8' });

      // Animate the text burning in with a bright glow
      gsap.to(el, {
        opacity: 1,
        color: 'inherit', // Inherit color from parent <p>
        textShadow: '0 0 20px rgba(255, 126, 95, 1), 0 0 40px rgba(255, 126, 95, 0.8)',
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          // After the text appears, fade out the glow to leave crisp text
          gsap.to(el, {
            textShadow: '0 0 0px rgba(255, 126, 95, 0)',
            duration: 1,
            ease: 'power2.out',
          });
        },
      });
    }
  }, [onScreen, effect]);

  if (effect === 'holographic') {
    return <span className="keyword-holographic font-bold inline-block whitespace-nowrap">{children}</span>;
  }

  if (effect === 'burn') {
    // Initial opacity is 0, GSAP will handle animating it in
    return (
      <span ref={ref} className="font-bold inline-block whitespace-nowrap opacity-0">
        {children}
      </span>
    );
  }

  // Fallback, though should not be reached with the current setup
  return <>{children}</>;
};

export default Keyword;
