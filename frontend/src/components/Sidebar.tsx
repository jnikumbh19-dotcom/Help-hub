import React from 'react';
import { ActiveScreen, LocationState, User } from '../types';

interface SidebarProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  location: LocationState;
  onOpenLocationModal: () => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  setActiveScreen,
  location,
  onOpenLocationModal,
  currentUser,
  onLogout,
}) => {
  const navItems = [
    {
      id: 'home' as ActiveScreen,
      label: 'Home & Categories',
      icon: 'home',
      onClick: () => setActiveScreen('home'),
      active: activeScreen === 'home',
    },
    {
      id: 'user-dashboard' as ActiveScreen,
      label: 'Citizen ICE Profile',
      icon: 'person',
      onClick: () => setActiveScreen('user-dashboard'),
      active: activeScreen === 'user-dashboard',
      badge: currentUser?.role === 'user' ? 'My Profile' : undefined,
    },
    {
      id: 'business-panel' as ActiveScreen,
      label: 'Provider & Garage Panel',
      icon: 'storefront',
      onClick: () => setActiveScreen('business-panel'),
      active: activeScreen === 'business-panel',
      badge: currentUser?.role === 'business' ? 'My Business' : undefined,
    },
    {
      id: 'admin-portal' as ActiveScreen,
      label: 'Main Admin Portal',
      icon: 'security',
      onClick: () => setActiveScreen('admin-portal'),
      active: activeScreen === 'admin-portal',
      badge: currentUser?.role === 'admin' ? 'Owner' : 'Owner Only',
    },
    {
      id: 'official-numbers' as ActiveScreen,
      label: 'Official Hotlines & SOS',
      icon: 'contact_emergency',
      onClick: () => setActiveScreen('official-numbers'),
      active: activeScreen === 'official-numbers',
    },
    {
      id: 'offline-mode' as ActiveScreen,
      label: 'Offline First-Aid & Guides',
      icon: 'wifi_off',
      onClick: () => setActiveScreen('offline-mode'),
      active: activeScreen === 'offline-mode',
    },
  ];

  return (
    <aside className="hidden md:flex flex-col h-full py-6 w-72 bg-[#f8f9fa] border-r border-[#e1e3e4] shrink-0 sticky top-16 select-none">
      {/* Header section */}
      <div className="mb-4 px-6">
        <h2 className="text-xl font-black text-[#b6171e] tracking-tight">HELP HUB</h2>
        <div
          onClick={onOpenLocationModal}
          className="flex items-center gap-2 mt-1 cursor-pointer hover:opacity-80 transition-opacity bg-white p-2 rounded-xl border border-gray-200 shadow-2xs"
          title="Click to change city"
        >
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shrink-0"></span>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold text-[#041627] truncate">
              {location.city || 'Nashik'}
            </p>
            <p className="text-[10px] text-gray-500 truncate">{location.name}</p>
          </div>
          <span className="material-symbols-outlined text-xs text-gray-400 ml-auto">tune</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex flex-col gap-1 px-3 flex-grow overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Portals & Navigation
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`w-full flex items-center justify-between px-3.5 h-11 rounded-xl text-xs font-bold transition-all duration-150 text-left ${
              item.active
                ? 'bg-[#041627] text-white shadow-xs'
                : 'text-[#44474c] hover:bg-[#edeeef] hover:text-[#041627]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: item.active ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase ${
                  item.active
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="px-4 mt-auto pt-3 border-t border-[#e1e3e4]">
        {currentUser ? (
          <div className="p-3 bg-white rounded-xl border border-[#c4c6cd]/70 shadow-xs flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                currentUser.role === 'admin'
                  ? 'bg-red-700'
                  : currentUser.role === 'business'
                  ? 'bg-amber-600'
                  : 'bg-[#041627]'
              }`}
            >
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#041627] truncate">{currentUser.name}</p>
              <span
                className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                  currentUser.role === 'admin'
                    ? 'bg-red-100 text-red-800'
                    : currentUser.role === 'business'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-sky-100 text-sky-800'
                }`}
              >
                {currentUser.role}
              </span>
            </div>
            <button
              onClick={() => setActiveScreen('auth')}
              title="Switch account"
              className="text-gray-400 hover:text-gray-700 p-1"
            >
              <span className="material-symbols-outlined text-base">swap_horiz</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setActiveScreen('auth')}
            className="w-full p-2.5 bg-[#041627] hover:bg-[#1a2b3c] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">login</span>
            Sign In / Switch Role
          </button>
        )}
      </div>
    </aside>
  );
};
