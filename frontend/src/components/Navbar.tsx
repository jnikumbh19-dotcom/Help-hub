import React, { useState } from 'react';
import { ActiveScreen, LocationState, User, CityData } from '../types';
import { CITIES_DATA } from '../data/mockData';

interface NavbarProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  location: LocationState;
  onOpenLocationModal: () => void;
  onOpenCallModal: (name: string, number: string) => void;
  currentLanguage: 'en' | 'hi' | 'mr';
  setCurrentLanguage: (lang: 'en' | 'hi' | 'mr') => void;
  currentUser: User | null;
  onLogout: () => void;
  cities?: CityData[];
  onSelectCityDirect?: (city: CityData) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  setActiveScreen,
  location,
  onOpenLocationModal,
  onOpenCallModal,
  currentLanguage,
  setCurrentLanguage,
  currentUser,
  onLogout,
  cities = CITIES_DATA,
  onSelectCityDirect,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  return (
    <header className="sticky top-0 bg-[#f8f9fa] border-b border-[#c4c6cd] shadow-xs z-50 transition-colors">
      <div className="flex justify-between items-center w-full px-3 md:px-6 h-16 max-w-7xl mx-auto gap-2">
        {/* Brand Logo & Back Button */}
        <div className="flex items-center gap-2 md:gap-3">
          {activeScreen !== 'home' && (
            <button
              onClick={() => setActiveScreen('home')}
              className="flex items-center text-[#041627] p-2 -ml-2 rounded-full hover:bg-[#e7e8e9] transition-colors active:scale-95"
              aria-label="Back to home"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                arrow_back
              </span>
            </button>
          )}

          <div
            onClick={() => setActiveScreen('home')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-[#041627] flex items-center justify-center text-white shadow-xs group-hover:bg-[#002a53] transition-colors">
              <span
                className="material-symbols-outlined text-red-500"
                style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
              >
                emergency
              </span>
            </div>
            <span className="text-lg md:text-xl font-black tracking-tight text-[#b6171e] group-hover:text-[#930010] transition-colors">
              HELP HUB
            </span>
          </div>

          {/* Quick City Dropdown Trigger in Navbar */}
          <div className="relative">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#041627] bg-white border border-[#c4c6cd] px-3 py-1.5 rounded-full shadow-xs hover:border-[#041627] transition-all"
            >
              <span className="material-symbols-outlined text-emerald-600 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                location_on
              </span>
              <span>{location.city || 'Nashik'}</span>
              <span className="material-symbols-outlined text-xs text-gray-400">expand_more</span>
            </button>

            {showCityDropdown && (
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in">
                <div className="px-3 py-1.5 border-b border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase">
                  <span>Switch City</span>
                  <button
                    onClick={() => {
                      setShowCityDropdown(false);
                      onOpenLocationModal();
                    }}
                    className="text-sky-700 lowercase"
                  >
                    GPS/All
                  </button>
                </div>
                {cities.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      if (onSelectCityDirect) onSelectCityDirect(c);
                      setShowCityDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between ${
                      (location.city || '').toLowerCase() === c.name.toLowerCase()
                        ? 'bg-red-50 text-[#b6171e] font-bold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{c.emergencyHotlines.police.split('-')[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-1.5 md:gap-2.5">
          {/* Language Switcher */}
          <div className="flex items-center bg-[#edeeef] p-0.5 rounded-full text-xs font-semibold text-[#44474c]">
            <button
              onClick={() => setCurrentLanguage('en')}
              className={`px-2 py-0.5 md:px-2.5 md:py-1 rounded-full transition-all text-[11px] font-bold ${
                currentLanguage === 'en' ? 'bg-[#041627] text-white shadow-xs' : 'hover:text-[#041627]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setCurrentLanguage('hi')}
              className={`px-2 py-0.5 md:px-2.5 md:py-1 rounded-full transition-all text-[11px] font-bold ${
                currentLanguage === 'hi' ? 'bg-[#041627] text-white shadow-xs' : 'hover:text-[#041627]'
              }`}
            >
              हिं
            </button>
            <button
              onClick={() => setCurrentLanguage('mr')}
              className={`px-2 py-0.5 md:px-2.5 md:py-1 rounded-full transition-all text-[11px] font-bold ${
                currentLanguage === 'mr' ? 'bg-[#041627] text-white shadow-xs' : 'hover:text-[#041627]'
              }`}
            >
              मरा
            </button>
          </div>

          {/* Quick SOS Dial (112) */}
          <button
            onClick={() => onOpenCallModal('National Unified Emergency', '112')}
            className="bg-[#b6171e] text-white hover:bg-[#930010] px-3 py-1.5 md:px-3.5 md:py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            title="Instant 112 National SOS Call"
          >
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              emergency
            </span>
            <span>SOS 112</span>
          </button>

          {/* User Auth Profile & Role Switcher Menu */}
          <div className="relative">
            {currentUser ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-1.5 p-1 md:px-2.5 md:py-1 rounded-full border transition-all ${
                  currentUser.role === 'admin'
                    ? 'border-red-400 bg-red-50 text-red-950'
                    : currentUser.role === 'business'
                    ? 'border-amber-400 bg-amber-50 text-amber-950'
                    : 'border-sky-400 bg-sky-50 text-sky-950'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold ${
                    currentUser.role === 'admin'
                      ? 'bg-red-700'
                      : currentUser.role === 'business'
                      ? 'bg-amber-600'
                      : 'bg-[#041627]'
                  }`}
                >
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden md:flex flex-col text-left text-[11px] leading-tight">
                  <span className="font-bold truncate max-w-[90px]">{currentUser.name.split(' ')[0]}</span>
                  <span className="text-[9px] uppercase font-semibold opacity-75">{currentUser.role}</span>
                </div>
                <span className="material-symbols-outlined text-xs text-gray-400 hidden md:inline">
                  expand_more
                </span>
              </button>
            ) : (
              <button
                onClick={() => setActiveScreen('auth')}
                className="px-3 py-1.5 rounded-full bg-[#041627] hover:bg-[#1a2b3c] text-white text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">login</span>
                <span>Sign In</span>
              </button>
            )}

            {/* Dropdown Menu */}
            {showUserMenu && currentUser && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in text-xs">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-bold text-[#041627]">{currentUser.name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                  <span
                    className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      currentUser.role === 'admin'
                        ? 'bg-red-100 text-red-800'
                        : currentUser.role === 'business'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    Role: {currentUser.role}
                  </span>
                </div>

                <div className="py-1">
                  {currentUser.role === 'admin' ? (
                    <>
                      <button
                        onClick={() => {
                          setActiveScreen('admin-portal');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center justify-between text-red-950 font-bold bg-red-50/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-red-700">security</span>
                          <span>Main Admin Portal</span>
                        </div>
                        <span className="text-[9px] bg-red-700 text-white px-1.5 py-0.2 rounded font-mono">
                          OWNER
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveScreen('user-dashboard');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                      >
                        <span className="material-symbols-outlined text-base text-sky-600">person</span>
                        <span>Citizen Profile View</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveScreen('business-panel');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                      >
                        <span className="material-symbols-outlined text-base text-amber-600">storefront</span>
                        <span>Service Provider View</span>
                      </button>
                    </>
                  ) : currentUser.role === 'business' ? (
                    <>
                      <button
                        onClick={() => {
                          setActiveScreen('business-panel');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-amber-50 flex items-center justify-between text-amber-950 font-bold bg-amber-50/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-amber-600">storefront</span>
                          <span>Business / Garage Panel</span>
                        </div>
                        <span className="text-[9px] bg-amber-600 text-white px-1.5 py-0.2 rounded font-mono">
                          BIZ
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveScreen('user-dashboard');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                      >
                        <span className="material-symbols-outlined text-base text-sky-600">person</span>
                        <span>Citizen Dashboard & ICE</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setActiveScreen('user-dashboard');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-sky-50 flex items-center justify-between text-sky-950 font-bold bg-sky-50/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-sky-600">person</span>
                          <span>Citizen Dashboard & ICE</span>
                        </div>
                        <span className="text-[9px] bg-sky-600 text-white px-1.5 py-0.2 rounded font-mono">
                          USER
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveScreen('business-panel');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                      >
                        <span className="material-symbols-outlined text-base text-amber-600">storefront</span>
                        <span>Register as Provider</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="pt-1 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setActiveScreen('auth');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                  >
                    <span className="material-symbols-outlined text-base text-gray-500">switch_account</span>
                    <span>Switch Role / Account</span>
                  </button>

                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-700 flex items-center gap-2 font-bold"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
