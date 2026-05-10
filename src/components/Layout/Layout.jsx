import React, { useEffect, useState } from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import SidePanel from './SidePanel';
import DesktopSidebar from './DesktopSidebar';
import DesktopTopBar from './DesktopTopBar';
import MiniPlayer from '../Common/MiniPlayer';
import Queue from '../Common/Queue';

const Layout = ({ children }) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  useEffect(() => {
    const openSidePanel = () => setSidePanelOpen(true);

    window.addEventListener('open-side-panel', openSidePanel);

    return () => {
      window.removeEventListener('open-side-panel', openSidePanel);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidePanelOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidePanelOpen]);

  return (
    <div className="bg-[#020e28] min-h-screen text-white">
      <div className="md:hidden">
        <Header
          searchOpen={mobileSearchOpen}
          onSearchClick={() => setMobileSearchOpen(true)}
          onSearchClose={() => setMobileSearchOpen(false)}
          onProfileClick={() => setSidePanelOpen(true)}
        />
      </div>

      <div className="hidden md:block">
        <DesktopSidebar />
        <DesktopTopBar />
      </div>
      
      {/* Main content area with padding for fixed header and nav */}
      <main className="pt-20 pb-24 mx-auto max-w-2xl md:max-w-none md:mx-0 md:pt-24 md:pb-8 md:pl-72 md:pr-6">
        {children}
      </main>

      <div className="md:hidden">
        <BottomNavigation />
      </div>

      {/* Mini Player */}
      <MiniPlayer />

      {/* Queue Panel */}
      <Queue />

      <SidePanel
        open={sidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
      />
      
    </div>
  );
};

export default Layout;
