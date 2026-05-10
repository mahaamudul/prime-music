import React, { useEffect, useRef, useState } from 'react';
import { Search, User, X } from 'lucide-react';

const Header = ({ searchOpen = false, onSearchClick, onSearchClose, onProfileClick }) => {
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleProfileOpen = () => {
    if (onProfileClick) {
      onProfileClick();
    }

    window.dispatchEvent(new Event('open-side-panel'));
  };

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchClick = () => {
    if (onSearchClick) {
      onSearchClick();
    }
  };

  const handleCloseSearch = () => {
    setSearchTerm('');
    if (onSearchClose) {
      onSearchClose();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#020e28] z-40 mx-auto max-w-2xl md:hidden overflow-hidden">
      <div className="flex items-center gap-1 px-2 py-2 h-16">
        {/* Profile button - always visible */}
        <button
          type="button"
          onClick={handleProfileOpen}
          onPointerUp={handleProfileOpen}
          onTouchEnd={handleProfileOpen}
          className="flex-shrink-0 w-9 h-9 bg-[#1DB954] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#1ed760] transition touch-manipulation"
        >
          <User size={20} className="text-black" />
        </button>

        {!searchOpen ? (
          <>
            {/* Logo when not searching */}
            <div className="flex-1 min-w-0">
              <h1 className="truncate text-white font-bold text-[18px] leading-none">Prime Music</h1>
            </div>

            {/* Search button when not searching */}
            <button
              type="button"
              onClick={handleSearchClick}
              className="flex-shrink-0 p-1 hover:bg-[#2A2F3E] rounded-full transition"
              aria-label="Open search"
            >
              <Search size={20} className="text-white" />
            </button>
          </>
        ) : (
          <>
            {/* Search field when searching - takes full available space */}
            <div className="flex flex-1 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 min-w-0">
              <Search size={14} className="flex-shrink-0 text-white/65" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="min-w-0 flex-1 bg-transparent text-[12px] text-white placeholder:text-white/45 outline-none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>

            {/* Close button when searching */}
            <button
              type="button"
              onClick={handleCloseSearch}
              className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#2A2F3E] transition p-0"
              aria-label="Close search"
            >
              <X size={16} className="text-white" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
