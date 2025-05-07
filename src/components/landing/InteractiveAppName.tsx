
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface InteractiveAppNameProps {
  className?: string;
}

export const InteractiveAppName: React.FC<InteractiveAppNameProps> = ({ className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const nameRef = useRef<HTMLSpanElement>(null);
  const letters = "Meowdoro".split('');
  const [letterStates, setLetterStates] = useState<{ offset: number; rotation: number; scale: number }[]>(
    letters.map(() => ({ offset: 0, rotation: 0, scale: 1 }))
  );
  
  // Handle mouse movement over the text
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!nameRef.current) return;
    
    const rect = nameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
    
    // Update letter states based on mouse position
    const newLetterStates = letters.map((_, index) => {
      const letterElement = nameRef.current?.children[index] as HTMLSpanElement;
      if (!letterElement) return { offset: 0, rotation: 0, scale: 1 };
      
      const letterRect = letterElement.getBoundingClientRect();
      const letterCenterX = letterRect.left - rect.left + letterRect.width / 2;
      
      // Calculate distance from mouse to letter
      const distanceFromMouse = Math.abs(x - letterCenterX);
      const maxDistance = rect.width / 2;
      const proximity = 1 - Math.min(distanceFromMouse / maxDistance, 1);
      
      // Apply effects based on proximity
      const offset = proximity * 10;
      const rotation = proximity * (Math.random() > 0.5 ? 10 : -10);
      const scale = 1 + proximity * 0.4;
      
      return { offset, rotation, scale };
    });
    
    setLetterStates(newLetterStates);
  };
  
  // Reset letter states when not hovering
  const handleMouseLeave = () => {
    setIsHovered(false);
    setLetterStates(letters.map(() => ({ offset: 0, rotation: 0, scale: 1 })));
  };
  
  return (
    <span 
      ref={nameRef}
      className={cn(
        "inline-block font-bold text-xl md:text-4xl lg:text-6xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent transition-all relative",
        isHovered ? "tracking-wider" : "tracking-normal",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1000px' }}
    >
      {letters.map((letter, index) => (
        <span 
          key={index}
          className="inline-block transition-all duration-200"
          style={{
            transform: `
              translateY(-${letterStates[index].offset}px) 
              rotateX(${letterStates[index].rotation}deg) 
              scale(${letterStates[index].scale})
            `,
            display: 'inline-block',
            transformOrigin: 'center bottom',
            textShadow: isHovered ? '0 0 8px hsla(var(--primary), 0.5)' : 'none',
          }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
};
