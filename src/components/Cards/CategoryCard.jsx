import React from 'react';

const CategoryCard = ({ category, onClick, isSelected = false }) => {
  // Parse color - handle both 0xFF and regular hex formats
  const parseColor = (colorStr) => {
    if (!colorStr) return '#1a1a1a';
    const hex = colorStr.replace('0xFF', '#').replace('0xff', '#');
    return hex.length === 7 ? hex : '#1a1a1a';
  };

  const bgColor = parseColor(category.domainant_color || category.dominant_color);
  const title = category.name || 'Category';

  const cardStyle = {
    backgroundColor: bgColor,
  };

  return (
    <div
      className="group cursor-pointer select-none transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && onClick) {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div
        className={`relative flex overflow-hidden rounded-[18px] px-3 py-3 shadow-[0_10px_20px_rgba(0,0,0,0.22)] transition-all duration-300 items-start justify-between gap-3 ${
          isSelected ? 'ring-2 ring-white/80' : 'ring-1 ring-white/10'
        }`}
        style={cardStyle}
      >
        <div className="relative z-10 flex w-full items-start justify-between gap-3">
          <h3 className="max-w-[60%] text-[14px] sm:text-[18px] font-extrabold leading-[1.05] tracking-[-0.02em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.22)]">
            {title}
          </h3>

          <div className="relative mt-1 shrink-0 rotate-45 w-14 h-14 sm:w-20 sm:h-20">
            <div
              className="absolute inset-0 overflow-hidden rounded-2xl bg-white/10 shadow-[0_10px_18px_rgba(0,0,0,0.22)]"
            >
              {category.cover_url ? (
                <img
                  src={category.cover_url}
                  alt={title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    console.warn('Category image failed to load:', category.name);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/10 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">
                  Music
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CategoryCard;
