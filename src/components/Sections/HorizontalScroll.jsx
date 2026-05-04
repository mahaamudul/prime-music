import React from 'react';

const HorizontalScroll = ({ children, className = '', gapClassName = 'gap-4' }) => {
  return (
    <div className={`overflow-x-auto scrollbar-hide px-4 ${className}`}>
      <div className={`flex ${gapClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default HorizontalScroll;
