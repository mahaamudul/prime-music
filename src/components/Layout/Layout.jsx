import React, { useEffect, useState } from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import SearchModal from '../Common/SearchModal';
import SidePanel from './SidePanel';

const Layout = ({ children }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  useEffect(() => {
    const openSidePanel = () => setSidePanelOpen(true);

    window.addEventListener('open-side-panel', openSidePanel);

    return () => {
      window.removeEventListener('open-side-panel', openSidePanel);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidePanelOpen || searchOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidePanelOpen, searchOpen]);

  return (
    <div className="bg-[#020e28] min-h-screen text-white">
      <Header
        onSearchClick={() => setSearchOpen(true)}
        onProfileClick={() => setSidePanelOpen(true)}
      />
      
      {/* Main content area with padding for fixed header and nav */}
      <main className="pt-20 pb-24 mx-auto max-w-2xl">
        {children}
      </main>

      <BottomNavigation />

      <SidePanel
        open={sidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
      />
      
      {/* Search Modal */}
      {searchOpen && (
        <SearchModal onClose={() => setSearchOpen(false)} />
      )}
    </div>
  );
};

export default Layout;
