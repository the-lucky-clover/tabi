import React, { useRef } from 'react';
import { useOnScreen } from '../hooks/useOnScreen';
import { improveTypography } from '../lib/typography';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className }) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const onScreen = useOnScreen(ref, 0.5);

  const improvedText = improveTypography(text);
  // Split by regular space to get units that can wrap.
  // Units containing \u00A0 (non-breaking space) will stay together.
  const wrapUnits = improvedText.split(' ');

  let charIndexCounter = 0;

  return (
    <h2 ref={ref} className={`text-balance ${className}`} aria-label={text}>
      {wrapUnits.map((unit, unitIndex) => (
        <span key={unitIndex} className="inline-block whitespace-nowrap">
          {unit.split('').map((char) => {
            const currentIndex = charIndexCounter++;
            if (char === '\u00A0') {
              return <span key={currentIndex}>&nbsp;</span>;
            }
            return (
              <span
                key={`${char}-${currentIndex}`}
                className="inline-block transition-all duration-500"
                style={{
                  transform: onScreen ? 'translateY(0)' : 'translateY(100%)',
                  opacity: onScreen ? 1 : 0,
                  transitionDelay: `${currentIndex * 0.02}s`,
                }}
              >
                {char}
              </span>
            );
          })}
          {/* Add a regular space after the unit if it's not the last one */}
          {unitIndex < wrapUnits.length - 1 && <span key={`space-${unitIndex}`}> </span>}
        </span>
      ))}
    </h2>
  );
};

export default AnimatedText;