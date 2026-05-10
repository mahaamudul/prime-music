import React from 'react';
import { Home, Compass, Crown, Library } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hidden, setHidden] = React.useState(false);
  const lastScrollYRef = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || 0;
      const delta = currentScrollY - lastScrollYRef.current;

      if (currentScrollY < 24) {
        setHidden(false);
      } else if (delta > 8) {
        setHidden(true);
      } else if (delta < -8) {
        setHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    lastScrollYRef.current = window.scrollY || 0;
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Premium', path: '/premium', icon: Crown },
    { name: 'Library', path: '/library', icon: Library },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed left-0 right-0 bg-[#020e28]/35 backdrop-blur-xl mx-auto max-w-2xl md:hidden transition-transform duration-200 ${hidden ? 'translate-y-full' : 'translate-y-0'}`} style={{ bottom: 0 }}>
      <div className="flex justify-around items-center h-20">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center w-full h-20 transition ${
                active
                  ? 'text-white'
                  : 'text-white/65 hover:text-white'
              }`}
            >
              <Icon size={24} />
              <span className="text-[11px] leading-tight mt-1 font-semibold">{tab.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
