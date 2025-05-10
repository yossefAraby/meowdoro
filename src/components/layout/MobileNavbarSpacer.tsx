import React from 'react';

/**
 * A spacer component that matches the exact height of the mobile navbar
 * to prevent content from being hidden underneath it on mobile devices.
 * This should be included at the bottom of scrollable content areas.
 */
export const MobileNavbarSpacer: React.FC = () => {
  return (
    <div className="h-16 w-full md:hidden" aria-hidden="true" />
  );
};

export default MobileNavbarSpacer; 