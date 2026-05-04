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
} from 'lucide-react';

const menuItems = [
  { icon: CirclePlus, label: 'Add account' },
  { icon: Gauge, label: 'Listening stats' },
  { icon: Clock3, label: 'Recents' },
  { icon: MessageSquareText, label: 'Your Updates' },
  { icon: Settings2, label: 'Settings and privacy' },
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
      className={`fixed inset-0 z-50 mx-auto max-w-2xl transition-opacity duration-200 ease-out ${
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
        className={`absolute left-0 top-0 h-full w-[84vw] max-w-[340px] bg-[#020e28]/78 backdrop-blur-2xl border-r border-white/10 shadow-2xl transition-transform duration-200 ease-out will-change-transform ${
          open && !closing ? 'translate-x-0' : '-translate-x-full'
        }`}
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

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-[#ff7a3d] flex items-center justify-center text-black text-[28px] font-bold">
                M
              </div>
              <div>
                <h2 className="text-[24px] leading-tight font-bold text-white">Mahmudul Hasan</h2>
                <p className="text-white/55 text-[14px] mt-1">View profile</p>
              </div>
            </div>

            <div className="space-y-6 border-t border-white/10 pt-5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    className="flex items-center gap-4 text-left text-white w-full"
                  >
                    <Icon size={26} strokeWidth={1.8} />
                    <span className="text-[20px] leading-tight font-normal">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="w-16 text-center">
                <div className="w-14 h-14 rounded-full bg-[#9b5d40] flex items-center justify-center text-black text-[28px] font-bold mx-auto">
                  M
                </div>
                <p className="text-white text-[12px] mt-3">Activity</p>
                <p className="text-white/55 text-[12px]">Turn on</p>
              </div>
              <div className="w-16 text-center">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                  <Users size={22} className="text-white" />
                </div>
                <p className="text-white text-[12px] mt-3">Invite friends</p>
              </div>
            </div>

            <div className="mt-12">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white text-[26px] leading-none font-bold">Messages</h3>
                <div className="flex items-center gap-4 text-white/90">
                  <ArrowLeft size={26} className="rotate-180" />
                  <PencilLine size={24} />
                </div>
              </div>
              <p className="text-white/55 text-[15px] leading-snug max-w-[240px]">
                Share what you love with friends, directly on Spotify.
              </p>

              <button
                type="button"
                className="mt-8 flex items-center gap-4 text-white"
              >
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                  <PencilLine size={22} />
                </div>
                <span className="text-[18px] font-normal">New message</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SidePanel;