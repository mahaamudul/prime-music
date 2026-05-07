import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  CirclePlus,
  Clock3,
  Gauge,
  MessageSquareText,
  PencilLine,
  Settings2,
  Users,
  Home,
  Compass,
  Crown,
  Library,
  Activity,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { icon: CirclePlus, label: 'Accounts' },
  { icon: Gauge, label: 'Listening stats' },
  { icon: Clock3, label: 'Recents' },
  { icon: MessageSquareText, label: 'Your Updates' },
  { icon: Settings2, label: 'Settings and privacy' },
  { icon: Activity, label: 'Activity' },
  { icon: Users, label: 'Invite friends' },
];

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Explore', path: '/explore', icon: Compass },
  { label: 'Premium', path: '/premium', icon: Crown },
  { label: 'Library', path: '/library', icon: Library },
];

const SidePanel = ({ open, onClose }) => {
  const panelRef = useRef(null);
  const startXRef = useRef(null);
  const currentXRef = useRef(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!open) {
      setClosing(false);
      startXRef.current = null;
      currentXRef.current = null;
    }
  }, [open]);

  const handleTouchStart = (event) => {
    startXRef.current = event.touches[0].clientX;
    currentXRef.current = startXRef.current;
  };

  const handleTouchMove = (event) => {
    currentXRef.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (startXRef.current == null || currentXRef.current == null) {
      return;
    }

    const deltaX = currentXRef.current - startXRef.current;
    if (deltaX < -50) {
      setClosing(true);
      onClose();
    }
  };

  const handleClose = () => {
    setClosing(true);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-200 ease-out ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <button
        type="button"
        aria-label="Close side panel"
        onClick={handleClose}
        className="absolute inset-0 bg-black/55"
      />

      <aside
        ref={panelRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`absolute left-0 top-0 h-full w-[84vw] md:w-[24rem] bg-[#020e28]/78 backdrop-blur-2xl border-r border-white/10 shadow-2xl transition-transform duration-200 ease-out will-change-transform ${
          open && !closing ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ maxWidth: 340 }}
      >
        <div className="h-full overflow-y-auto pb-6">
          <div className="px-5 pt-4 pb-5">
            <div className="flex items-center justify-between text-white/80 mb-8">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <ArrowLeft size={18} />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <PencilLine size={16} />
              </div>
            </div>

            <div className="space-y-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => onClose()}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium transition ${
                          isActive ? 'bg-white/10 text-white' : 'text-white/70'
                        }`
                      }
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}

              <div className="border-t border-white/10 pt-4 mt-4">
                {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    className="flex items-center gap-3 text-left text-white/70 hover:text-white w-full px-3 py-2 rounded-lg text-[14px] transition"
                  >
                    <Icon size={20} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white text-[16px] leading-none font-bold">Messages</h3>
                <div className="flex items-center gap-4 text-white/90">
                  <ArrowLeft size={20} className="rotate-180" />
                  <PencilLine size={18} />
                </div>
              </div>
              <p className="text-white/55 text-[12px] leading-snug mb-4">
                Share what you love with friends, directly on Prime Music.
              </p>

              <button
                type="button"
                className="flex items-center gap-3 text-white/70 hover:text-white transition text-[14px]"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <PencilLine size={18} />
                </div>
                <span className="font-normal">New message</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SidePanel;