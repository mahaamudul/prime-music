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
      <div className="flex items-center gap-2 px-3 py-2 h-16">
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

        {!searchOpen ? (
          <>
            <div className="flex-1 min-w-0">
              <h1 className="truncate text-white font-bold text-[20px] leading-none">Prime Music</h1>
            </div>

            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={handleSearchClick}
                className="p-2 hover:bg-[#2A2F3E] rounded-full transition"
                aria-label="Open search"
              >
                <Search size={24} className="text-white" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-1 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 min-w-0">
              <Search size={16} className="flex-shrink-0 text-white/65" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search songs..."
                className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-white/45 outline-none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>

            <button
              type="button"
              onClick={handleCloseSearch}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full hover:bg-[#2A2F3E] transition p-1"
              aria-label="Close search"
            >
              <X size={18} className="text-white" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
