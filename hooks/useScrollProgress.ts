
import { useState, useEffect } from 'react';

export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // RAF throttling: we set a flag while a frame is pending so the scroll
    // handler never queues more than one rAF callback at a time.
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          setProgress(window.scrollY / totalHeight);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Set initial progress
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return progress;
};
