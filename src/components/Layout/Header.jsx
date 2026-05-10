import React from 'react';
import { Search, User } from 'lucide-react';

const Header = ({ onSearchClick, onProfileClick }) => {
  const handleProfileOpen = () => {
    if (onProfileClick) {
      onProfileClick();
    }

    window.dispatchEvent(new Event('open-side-panel'));
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#020e28] z-40 mx-auto max-w-2xl md:hidden">
      <div className="flex items-center justify-between px-4 py-3 h-16">
        <div className="flex items-center gap-3">
          {/* Profile Icon */}
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={handleProfileOpen}
              onPointerUp={handleProfileOpen}
              onTouchEnd={handleProfileOpen}
              className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#1ed760] transition touch-manipulation"
            >
              <User size={24} className="text-black" />
            </button>
          </div>

          {/* Logo */}
          <div>
            <h1 className="text-white font-bold text-[20px] leading-none">Prime Music</h1>
          </div>
        </div>

        {/* Search Icon */}
        <div className="flex-shrink-0">
          <button
            onClick={onSearchClick}
            className="p-2 hover:bg-[#2A2F3E] rounded-full transition"
          >
            <Search size={24} className="text-white" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
