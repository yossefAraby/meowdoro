import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Page container component that properly handles spacing for both mobile and desktop layouts
 * - Adds small top margin on mobile
 * - Adds normal top padding on desktop
 * - Adds bottom padding on mobile to prevent overlap with the mobile navbar
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div 
      className={cn(
        "container mx-auto px-4",
        "mt-2 md:mt-0", // Small margin top on mobile only
        "pt-0 md:pt-8",  // No top padding on mobile, normal on desktop
        "pb-24 md:pb-8", // Extra bottom padding on mobile to avoid navbar overlap
        className
      )}
    >
      {children}
    </div>
  );
}; 