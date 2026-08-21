import React from 'react';
import { ActiveScreen } from '../types';

interface BottomNavProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  onOpenLocationModal: () => void;
  onOpenCallModal: (name: string, number: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeScreen,
  setActiveScreen,
  onOpenLocationModal,
  onOpenCallModal,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[#c4c6cd] shadow-[0_-2px_12px_rgba(4,22,39,0.06)] z-50 flex justify-around items-center h-[68px] px-2">
      <button
        onClick={() => setActiveScreen('home')}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
          activeScreen === 'home' ? 'text-[#041627] font-bold' : 'text-[#44474c] hover:text-[#041627]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] px-3 py-0.5 rounded-full transition-all ${
            activeScreen === 'home' ? 'bg-[#1a2b3c] text-white' : ''
          }`}
          style={{ fontVariationSettings: activeScreen === 'home' ? "'FILL' 1" : "'FILL' 0" }}
        >
          home
        </span>
        <span className="text-[11px] mt-0.5 font-medium">Home</span>
      </button>

      <button
        onClick={onOpenLocationModal}
        className="flex flex-col items-center justify-center flex-1 h-full text-[#44474c] hover:text-[#041627] transition-all"
      >
        <span className="material-symbols-outlined text-[22px]">location_searching</span>
        <span className="text-[11px] mt-0.5 font-medium">Location</span>
      </button>

      {/* Center SOS Button */}
      <button
        onClick={() => onOpenCallModal('National Emergency 112', '112')}
        className="flex flex-col items-center justify-center -mt-5"
      >
        <div className="w-13 h-13 rounded-full bg-[#b6171e] text-white flex items-center justify-center shadow-lg active:scale-95 border-2 border-white animate-bounce-subtle">
          <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            emergency
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#b6171e] mt-1">SOS 112</span>
      </button>

      <button
        onClick={() => setActiveScreen('official-numbers')}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
          activeScreen === 'official-numbers' ? 'text-[#041627] font-bold' : 'text-[#44474c] hover:text-[#041627]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] px-3 py-0.5 rounded-full transition-all ${
            activeScreen === 'official-numbers' ? 'bg-[#1a2b3c] text-white' : ''
          }`}
          style={{ fontVariationSettings: activeScreen === 'official-numbers' ? "'FILL' 1" : "'FILL' 0" }}
        >
          contact_emergency
        </span>
        <span className="text-[11px] mt-0.5 font-medium">SOS Contacts</span>
      </button>

      <button
        onClick={() => setActiveScreen('offline-mode')}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
          activeScreen === 'offline-mode' ? 'text-[#041627] font-bold' : 'text-[#44474c] hover:text-[#041627]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[22px] px-3 py-0.5 rounded-full transition-all ${
            activeScreen === 'offline-mode' ? 'bg-[#1a2b3c] text-white' : ''
          }`}
          style={{ fontVariationSettings: activeScreen === 'offline-mode' ? "'FILL' 1" : "'FILL' 0" }}
        >
          wifi_off
        </span>
        <span className="text-[11px] mt-0.5 font-medium">Offline</span>
      </button>
    </nav>
  );
};
