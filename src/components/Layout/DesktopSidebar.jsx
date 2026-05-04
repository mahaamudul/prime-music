import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Crown, Library, Search, User } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Explore', path: '/explore', icon: Compass },
  { label: 'Premium', path: '/premium', icon: Crown },
  { label: 'Library', path: '/library', icon: Library },
];

const DesktopSidebar = ({ onSearchClick }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <aside className="hidden md:flex fixed left-0 top-0 z-30 h-screen w-72 flex-col bg-[#020e28]/90 px-5 py-5 backdrop-blur-2xl shadow-lg">
      <div className="mb-8 flex items-center gap-3 px-1">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1DB954] text-black">
          <User size={24} />
        </div>
        <div>
          <h1 className="text-[20px] font-bold leading-none text-white">Prime Music</h1>
          <p className="mt-1 text-[12px] text-white/55">Web player</p>
        </div>
      </div>

      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-4 py-3 text-[15px] font-medium transition ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/70'
                }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="mt-8 pt-5">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event('open-desktop-search'))}
          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-white/70 transition"
        >
          <Search size={20} />
          <span className="text-[15px] font-medium">Search</span>
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="mt-2 flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-white/70 transition"
          >
            <User size={20} />
            <span className="text-[15px] font-medium">Profile</span>
          </button>
          <ProfileDropdown
            open={profileDropdownOpen}
            onClose={() => setProfileDropdownOpen(false)}
            position="sidebar"
          />
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;