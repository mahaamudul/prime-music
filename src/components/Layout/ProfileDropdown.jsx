import React, { useRef, useEffect } from 'react';
import { LogOut, Settings, User } from 'lucide-react';

const ProfileDropdown = ({ open, onClose, position = 'sidebar' }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-50 w-56 rounded-xl border border-white/10 bg-[#1A1F2E] shadow-2xl backdrop-blur-2xl ${
        position === 'sidebar' ? 'left-5 top-14' : 'right-6 top-14'
      }`}
    >
      {/* Profile Header */}
      <div className="border-b border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff7a3d] text-black text-[18px] font-bold">
            M
          </div>
          <div>
            <p className="text-[14px] font-semibold text-white">Mahmudul Hasan</p>
            <p className="text-[12px] text-white/55">Premium</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-1 p-2">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-[14px] font-medium text-white/80"
        >
          <User size={16} />
          <span>View profile</span>
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-[14px] font-medium text-white/80"
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-[14px] font-medium text-white/80"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
