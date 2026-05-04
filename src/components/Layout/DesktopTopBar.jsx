import React, { useState, useRef, useEffect } from 'react';
import { Home, Search, Bell, Download, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

const DesktopTopBar = () => {
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpenDesktop, setSearchOpenDesktop] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const openHandler = () => setSearchOpenDesktop(true);
    window.addEventListener('open-desktop-search', openHandler);

    return () => window.removeEventListener('open-desktop-search', openHandler);
  }, []);

  useEffect(() => {
    if (searchOpenDesktop && inputRef.current) inputRef.current.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') setSearchOpenDesktop(false);
    };

    const onClickOutside = (e) => {
      if (searchOpenDesktop && containerRef.current && !containerRef.current.contains(e.target)) {
        setSearchOpenDesktop(false);
      }
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [searchOpenDesktop]);

  return (
    <header className="hidden md:flex fixed left-72 right-0 top-0 z-40 h-20 items-center bg-[#020e28]/88 px-6 backdrop-blur-2xl shadow-lg">
      <div className="flex w-full items-center justify-between gap-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition"
        >
          <Home size={18} />
        </button>

        <div ref={containerRef} className="flex max-w-[620px] flex-1">
          {!searchOpenDesktop ? (
            <button
              type="button"
              onClick={() => setSearchOpenDesktop(true)}
              className="flex w-full items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-left text-white/45 transition"
            >
              <Search size={18} className="text-white/65" />
              <span className="truncate text-[14px] font-medium">What do you want to play?</span>
            </button>
          ) : (
            <div className="flex w-full items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <Search size={18} className="text-white/65" />
              <input
                ref={inputRef}
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/50"
                placeholder="Search music, artists, playlists"
              />
              <button type="button" onClick={() => setSearchOpenDesktop(false)} className="text-white/60">
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-black transition"
          >
            Explore Premium
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition"
          >
            <Download size={18} />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition"
          >
            <Bell size={18} />
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1DB954] text-black transition"
            >
              <span className="text-[16px] font-bold">M</span>
            </button>
            <ProfileDropdown
              open={profileDropdownOpen}
              onClose={() => setProfileDropdownOpen(false)}
              position="topbar"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DesktopTopBar;