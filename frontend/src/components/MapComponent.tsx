import React, { useState } from 'react';
import { ServiceProvider, LocationState } from '../types';

interface MapComponentProps {
  providers: ServiceProvider[];
  selectedProvider: ServiceProvider | null;
  onSelectProvider: (provider: ServiceProvider) => void;
  userLocation: LocationState;
  onCall: (name: string, number: string) => void;
  onNavigate: (provider: ServiceProvider) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  providers,
  selectedProvider,
  onSelectProvider,
  userLocation,
  onCall,
  onNavigate,
}) => {
  const [mapLayer, setMapLayer] = useState<'standard' | 'satellite' | 'traffic'>('standard');
  const [zoomLevel, setZoomLevel] = useState(14);
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Pre-calculated visual pin coordinates positioned accurately relative to map canvas
  const pinCoordinates = [
    { top: '35%', left: '42%' },
    { top: '55%', left: '30%' },
    { top: '30%', left: '68%' },
    { top: '65%', left: '72%' },
    { top: '75%', left: '45%' },
    { top: '22%', left: '50%' },
    { top: '48%', left: '80%' },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medical':
        return 'local_hospital';
      case 'police':
        return 'local_police';
      case 'fire':
        return 'fire_truck';
      case 'towing':
        return 'source';
      case 'fuel':
        return 'ev_station';
      case 'pharmacy':
        return 'local_pharmacy';
      case 'locksmith':
        return 'vpn_key';
      default:
        return 'build';
    }
  };

  return (
    <div className="relative w-full h-full min-h-[340px] md:min-h-[480px] bg-[#edeeef] overflow-hidden rounded-xl md:rounded-none select-none border-b md:border-b-0 border-l border-[#c4c6cd]/50 shadow-inner">
      {/* Background Map Imagery */}
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtB5C1WuFklkpVZtd430UsZ-fUrGaK-2-7w8v5vSZdkhRLycn04diCLpNzNjudAzdGdvm0dTnljvWfC06_2Lj8ngGGUT2QVw8Gt_PKI8JQuhDc9_QZFLY6mIlRBtQN438jhA7jVGLdLfbK4Ou68hnWc99RXBl3xZF0V6vmJMrqvzsvI14iUnKaLDHevmaNRwRkz4FZ_imXEtzVyku-rZkF6S0jNv9NXzZlPxTsPh41Ew3rumfOA83S"
        alt="Downtown Emergency Map Area"
        className={`w-full h-full object-cover transition-all duration-300 ${
          mapLayer === 'satellite'
            ? 'brightness-90 contrast-125 filter hue-rotate-15'
            : mapLayer === 'traffic'
            ? 'brightness-95 contrast-110'
            : ''
        }`}
      />

      {/* Traffic Overlay indicator if selected */}
      {mapLayer === 'traffic' && (
        <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none mix-blend-overlay"></div>
      )}

      {/* User Current Position Beacon */}
      <div
        className="absolute top-[52%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center"
        title="Your Current Location"
      >
        <div className="relative flex items-center justify-center">
          <span className="w-10 h-10 rounded-full bg-sky-500/30 animate-ping absolute"></span>
          <span className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-sky-600 border-2 border-white"></span>
          </span>
        </div>
        <div className="bg-[#041627] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md mt-1 whitespace-nowrap">
          You are here
        </div>
      </div>

      {/* Render Providers as Map Markers */}
      {providers.map((provider, index) => {
        const coords = pinCoordinates[index % pinCoordinates.length];
        const isSelected = selectedProvider?.id === provider.id;
        const iconName = getCategoryIcon(provider.category);

        return (
          <div
            key={provider.id}
            style={{ top: coords.top, left: coords.left }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer transition-transform hover:scale-110 active:scale-95 group"
            onClick={() => onSelectProvider(provider)}
          >
            {/* Marker Pin */}
            <div
              className={`relative flex items-center justify-center rounded-full transition-all ${
                isSelected
                  ? 'w-12 h-12 bg-[#b6171e] text-white ring-4 ring-red-300/80 shadow-xl'
                  : 'w-10 h-10 bg-[#da3433] text-white shadow-lg border-2 border-white'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {iconName}
              </span>
            </div>

            {/* Marker Label */}
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#041627] text-white scale-105'
                  : 'bg-white/95 text-[#041627] border border-gray-200'
              }`}
            >
              {provider.name}
            </div>
          </div>
        );
      })}

      {/* Top-Right Map Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-40">
        <button
          onClick={() => {
            // Recenter
            const sound = new Audio();
          }}
          className="w-10 h-10 bg-white hover:bg-gray-100 rounded-full shadow-md flex items-center justify-center text-[#041627] active:scale-95 transition-all border border-gray-200"
          title="Recenter on your location"
          aria-label="Recenter Map"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            my_location
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="w-10 h-10 bg-white hover:bg-gray-100 rounded-full shadow-md flex items-center justify-center text-[#041627] active:scale-95 transition-all border border-gray-200"
            title="Switch Map Layers"
            aria-label="Map Layers"
          >
            <span className="material-symbols-outlined text-[20px]">layers</span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-1.5 w-36 text-xs z-50 animate-in fade-in">
              <button
                onClick={() => {
                  setMapLayer('standard');
                  setShowLayerMenu(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between ${
                  mapLayer === 'standard' ? 'bg-sky-50 text-sky-900 font-bold' : 'hover:bg-gray-100'
                }`}
              >
                <span>Standard</span>
                {mapLayer === 'standard' && <span className="material-symbols-outlined text-xs">check</span>}
              </button>
              <button
                onClick={() => {
                  setMapLayer('traffic');
                  setShowLayerMenu(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between ${
                  mapLayer === 'traffic' ? 'bg-sky-50 text-sky-900 font-bold' : 'hover:bg-gray-100'
                }`}
              >
                <span>Live Traffic</span>
                {mapLayer === 'traffic' && <span className="material-symbols-outlined text-xs">check</span>}
              </button>
              <button
                onClick={() => {
                  setMapLayer('satellite');
                  setShowLayerMenu(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between ${
                  mapLayer === 'satellite' ? 'bg-sky-50 text-sky-900 font-bold' : 'hover:bg-gray-100'
                }`}
              >
                <span>Satellite View</span>
                {mapLayer === 'satellite' && <span className="material-symbols-outlined text-xs">check</span>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom-Right Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden z-40">
        <button
          onClick={() => setZoomLevel((z) => Math.min(18, z + 1))}
          className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:bg-gray-200 border-b border-gray-200 font-bold text-sm"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(10, z - 1))}
          className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:bg-gray-200 font-bold text-sm"
          title="Zoom Out"
        >
          −
        </button>
      </div>

      {/* Selected Provider Bottom Popover Card (matching Screenshot 1 phone mockup bottom preview) */}
      {selectedProvider && (
        <div className="absolute bottom-4 left-4 right-14 md:right-16 bg-white rounded-xl p-3.5 shadow-2xl border border-gray-300 z-40 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex justify-between items-start">
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-xs md:text-sm text-[#041627] truncate">
                  {selectedProvider.name}
                </h4>
                {selectedProvider.isVerified && (
                  <span className="bg-[#10b981] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                <span className="text-emerald-600 font-bold">Open 24/7</span> •{' '}
                <span>{selectedProvider.distanceKm} km away</span> • ★ {selectedProvider.rating}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectProvider(null as unknown as ServiceProvider);
              }}
              className="text-gray-400 hover:text-gray-600 p-0.5"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2.5">
            <button
              onClick={() => onNavigate(selectedProvider)}
              className="py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-sm">directions</span>
              Directions
            </button>
            <button
              onClick={() => onCall(selectedProvider.name, selectedProvider.phone)}
              className="py-1.5 px-3 rounded-lg bg-[#041627] hover:bg-[#1a2b3c] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                call
              </span>
              Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
