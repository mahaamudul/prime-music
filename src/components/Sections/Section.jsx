import React from 'react';

const Section = ({ title, onViewAll, children, titleWeight = 'bold' }) => {
  const titleClassName =
    titleWeight === 'light'
      ? 'text-[22px] leading-tight font-normal text-white/70'
      : 'text-[22px] leading-tight font-bold text-white';

  return (
    <section className="mb-6">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className={titleClassName}>{title}</h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-white text-[10px] font-normal border border-white rounded-full px-2  hover:bg-white/10 transition"
          >
            View All
          </button>
        )}
      </div>

      {/* Content */}
      {children}
    </section>
  );
};

export default Section;
