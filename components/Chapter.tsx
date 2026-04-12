import React, { useRef } from 'react';
import { ChapterContent } from '../types';
import AnimatedText from './AnimatedText';
import { useOnScreen } from '../hooks/useOnScreen';
import Keyword from './Keyword';
import { improveTypography } from '../lib/typography';

interface ChapterProps {
  chapter: ChapterContent;
  index: number;
  total: number;
}

// This function parses a line and wraps special words in the Keyword component.
const parseAndRenderLine = (line: string) => {
  // Apply typography improvements first
  const improvedLine = improveTypography(line);
  
  // Regex to find words wrapped in *...* or ~...~
  // We need to be careful with \u00A0 which might be inside or outside the markers
  const parts = improvedLine.split(/(\*[^*]+\*|~[^~]+~)/g).filter(Boolean);
  
  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <Keyword key={index} effect="burn">{part.slice(1, -1)}</Keyword>;
    }
    if (part.startsWith('~') && part.endsWith('~')) {
      return <Keyword key={index} effect="holographic">{part.slice(1, -1)}</Keyword>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const Chapter: React.FC<ChapterProps> = ({ chapter, index }) => {
  const ref = useRef(null);
  const onScreen = useOnScreen(ref, 0.4);

  const isDarkTextChapter = chapter.visualStyle.gradient.includes('gray-100');

  return (
    <section 
      ref={ref}
      className={`min-h-screen flex flex-col justify-center items-center p-8 relative z-10 transition-opacity duration-1000 ${onScreen ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${chapter.visualStyle.gradient} opacity-40`} />
      <div className="text-center z-10 max-w-4xl mx-auto space-y-8">
        <h1 className={`font-cinzel text-5xl md:text-7xl font-bold mb-12 drop-shadow-lg ${isDarkTextChapter ? 'text-gray-800' : 'text-white'}`}>
            <AnimatedText text={chapter.title} />
        </h1>
        <div className="space-y-6">
          {chapter.lines.map((line, lineIndex) => (
             <p 
                key={lineIndex} 
                className={`text-pretty text-2xl md:text-3xl font-light leading-relaxed transition-all duration-700 delay-${lineIndex * 200} ${isDarkTextChapter ? 'text-gray-700' : 'text-white/80'} ${onScreen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${0.5 + lineIndex * 0.2}s`}}
            >
                {parseAndRenderLine(line)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Chapter;