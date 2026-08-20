import React, { useState } from 'react';
import { LocationState, CityData } from '../../types';
import { CITIES_DATA } from '../../data/mockData';

interface ManualLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationState;
  onUpdateLocation: (newLocation: LocationState) => void;
  cities?: CityData[];
}

export const ManualLocationModal: React.FC<ManualLocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onUpdateLocation,
  cities = CITIES_DATA,
}) => {
  const [customAddress, setCustomAddress] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const handleUseGPS = () => {
    setIsDetecting(true);
    setGeoError(null);

    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetecting(false);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Find closest known city or use general GPS
        let closestCity = 'Nashik';
        let minDistance = 999999;
        cities.forEach((c) => {
          const d = Math.hypot(c.coordinates.lat - lat, c.coordinates.lng - lng);
          if (d < minDistance) {
            minDistance = d;
            closestCity = c.name;
          }
        });

        const newLoc: LocationState = {
          name: `${closestCity} (Device GPS)`,
          city: closestCity,
          address: `GPS Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
          lat,
          lng,
          isGPS: true,
          accuracyMeters: Math.round(position.coords.accuracy),
          statusText: `GPS Active • Nearest Hub: ${closestCity} (±${Math.round(position.coords.accuracy)}m)`,
        };
        onUpdateLocation(newLoc);
        onClose();
      },
      (error) => {
        setIsDetecting(false);
        setGeoError(
          error.code === 1
            ? 'Location permission was denied. Please select your city from the list below.'
            : 'Could not acquire precise GPS signal. Please pick your city below.'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectCity = (city: CityData) => {
    const newLoc: LocationState = {
      name: `${city.name}, ${city.state}`,
      city: city.name,
      address: `Central Emergency Zone, ${city.name}`,
      lat: city.coordinates.lat,
      lng: city.coordinates.lng,
      isGPS: false,
      statusText: `Active Location: ${city.name} (${city.tagline})`,
    };
    onUpdateLocation(newLoc);
    onClose();
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAddress.trim()) return;

    // Detect if input matches any city
    const matchedCity = cities.find(
      (c) =>
        c.name.toLowerCase().includes(customAddress.toLowerCase()) ||
        customAddress.toLowerCase().includes(c.name.toLowerCase())
    );

    const cityName = matchedCity ? matchedCity.name : 'Nashik';
    const baseLat = matchedCity ? matchedCity.coordinates.lat : 19.9975;
    const baseLng = matchedCity ? matchedCity.coordinates.lng : 73.7898;

    const newLoc: LocationState = {
      name: `${customAddress.trim()} (${cityName})`,
      city: cityName,
      address: customAddress.trim(),
      lat: baseLat + (Math.random() - 0.5) * 0.02,
      lng: baseLng + (Math.random() - 0.5) * 0.02,
      isGPS: false,
      statusText: `Manual: ${customAddress.trim()} in ${cityName}`,
    };
    onUpdateLocation(newLoc);
    onClose();
  };

  const filteredCities = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.state.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.tagline.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#c4c6cd] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 md:p-5 bg-[#041627] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#b6171e] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">location_city</span>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold">Select Location / City</h3>
              <p className="text-xs text-gray-300">Filter emergency assistance & nearest responders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* GPS Button */}
          <button
            onClick={handleUseGPS}
            disabled={isDetecting}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-50 border-2 border-emerald-600 hover:bg-emerald-100 text-emerald-950 font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs active:scale-95 disabled:opacity-60"
          >
            <span
              className={`material-symbols-outlined text-emerald-700 text-xl ${
                isDetecting ? 'animate-spin' : ''
              }`}
            >
              {isDetecting ? 'sync' : 'near_me'}
            </span>
            <span>{isDetecting ? 'Locating via GPS...' : 'Use My Current Location (GPS Auto-Detect)'}</span>
          </button>

          {geoError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
              <span className="material-symbols-outlined text-sm shrink-0 mt-0.5 text-amber-700">warning</span>
              <span>{geoError}</span>
            </div>
          )}

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search cities (e.g., Nashik, Pune, Mumbai)..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#041627] focus:outline-none"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-base">
              search
            </span>
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* City Grid */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Select City / Emergency Zone
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredCities.map((city) => {
                const isSelected =
                  currentLocation.city?.toLowerCase() === city.name.toLowerCase() ||
                  currentLocation.name.toLowerCase().includes(city.name.toLowerCase());

                return (
                  <button
                    key={city.id}
                    onClick={() => handleSelectCity(city)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#b6171e] bg-red-50/70 shadow-xs'
                        : 'border-gray-200 hover:border-[#041627] hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#041627]">{city.name}</span>
                      {isSelected ? (
                        <span className="material-symbols-outlined text-[#b6171e] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-mono">{city.state}</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{city.tagline}</p>
                    <div className="mt-2 pt-1.5 border-t border-gray-200/60 flex items-center justify-between text-[10px]">
                      <span className="text-emerald-700 font-semibold">Police: {city.emergencyHotlines.police.split('-')[0] || city.emergencyHotlines.police}</span>
                      <span className="text-red-700 font-semibold">Ambulance: {city.emergencyHotlines.ambulance}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Landmark Input */}
          <form onSubmit={handleSaveCustom} className="space-y-1.5 pt-3 border-t border-gray-200">
            <label className="block text-xs font-bold text-[#041627]">
              Or Enter Specific Highway, Landmark, or Toll Plaza:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder="e.g. Dwarka Circle Nashik or Mumbai-Pune Expressway"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#041627] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#041627] text-white rounded-lg text-xs font-bold hover:bg-[#1a2b3c] transition-colors"
              >
                Set
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
