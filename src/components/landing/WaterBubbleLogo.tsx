
import React, { useRef, useEffect } from 'react';
import { useWaterBubble } from '@/lib/animation-utils';

interface WaterBubbleLogoProps {
  imageUrl: string;
  className?: string;
}

export const WaterBubbleLogo: React.FC<WaterBubbleLogoProps> = ({ imageUrl, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useWaterBubble(imageUrl);
  
  useEffect(() => {
    // Ensure canvas fills the container
    const updateCanvasSize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative h-56 w-56 md:h-72 md:w-72 ${className || ''}`} 
      style={{ touchAction: "none" }}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 touch-none z-10"
      />
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <p className="text-sm text-center text-primary/50 opacity-75">
          Touch or hover to interact
        </p>
      </div>
    </div>
  );
};
