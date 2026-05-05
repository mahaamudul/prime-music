import React, { useRef, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const HorizontalScroll = ({ children, className = '', gapClassName = 'gap-4', showIndicator = true }) => {
  const scrollbarClass = showIndicator ? 'hide-scrollbar' : 'scrollbar-hide';
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`relative px-4 md:px-6 ${className}`}>
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={`overflow-x-auto flex ${gapClassName} md:gap-5 ${scrollbarClass}`}
      >
        {children}
      </div>

      {showIndicator && (
        <>
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default HorizontalScroll;
