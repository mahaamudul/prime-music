import React from 'react';
import { ChevronRight } from 'lucide-react';

const HorizontalScroll = ({ children, className = '', gapClassName = 'gap-4', showIndicator = true }) => {
  const scrollbarClass = showIndicator ? 'hide-scrollbar' : 'scrollbar-hide';

  return (
    <div className={`relative px-4 md:px-6 ${className}`}>
      <div className={`overflow-x-auto flex ${gapClassName} md:gap-5 ${scrollbarClass}`}>{children}</div>

      {showIndicator && (
        <div className="pointer-events-none hidden md:flex absolute right-3 top-1/2 -translate-y-1/2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60">
            <ChevronRight size={16} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HorizontalScroll;
