
import React, { useRef, useState, useEffect } from 'react';
import { useInView } from '@/lib/animation-utils';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  delay = 0,
  direction = 'up'
}) => {
  const { ref, isInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  // Determine the initial transform based on direction
  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(50px)';
      case 'down': return 'translateY(-50px)';
      case 'left': return 'translateX(50px)';
      case 'right': return 'translateX(-50px)';
      default: return 'translateY(50px)';
    }
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-1000',
        className
      )}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translate(0)' : getInitialTransform(),
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export const ParallaxImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}> = ({ src, alt, className, speed = 0.2 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const { top } = ref.current.getBoundingClientRect();
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      
      if (top < windowHeight && top > -ref.current.clientHeight) {
        setOffset((scrollPos - top) * speed);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);
  
  return (
    <div ref={ref} className={`overflow-hidden ${className || ''}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transform transition-transform"
        style={{ transform: `translateY(${offset}px)` }}
      />
    </div>
  );
};

export const FloatingElement: React.FC<{
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  delay?: number;
}> = ({ children, className, amplitude = 15, duration = 6, delay = 0 }) => {
  return (
    <div
      className={`inline-block ${className || ''}`}
      style={{
        animation: `floating ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <style jsx>{`
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-${amplitude}px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
      {children}
    </div>
  );
};
