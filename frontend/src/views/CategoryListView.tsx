import React, { useState, useMemo } from 'react';
import { EmergencyCategory, ServiceProvider, LocationState } from '../types';
import { MapComponent } from '../components/MapComponent';

interface CategoryListViewProps {
  category: EmergencyCategory;
  providers: ServiceProvider[];
  location: LocationState;
  onSelectProvider: (provider: ServiceProvider) => void;
  onBack: () => void;
  onOpenCallModal: (name: string, number: string) => void;
  onOpenShareModal: (provider?: ServiceProvider) => void;
  onOpenLocationModal?: () => void;
}

export const CategoryListView: React.FC<CategoryListViewProps> = ({
  category,
  providers,
  location,
  onSelectProvider,
  onBack,
  onOpenCallModal,
  onOpenShareModal,
  onOpenLocationModal,
}) => {
  const [filterVerified, setFilterVerified] = useState(false);
  const [filter24x7, setFilter24x7] = useState(false);
  const [filterClosest, setFilterClosest] = useState(false);
  const [selectedMapProvider, setSelectedMapProvider] = useState<ServiceProvider | null>(null);
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');
  const [showAllCities, setShowAllCities] = useState(false);

  const categoryTitles: Record<EmergencyCategory, { name: string; subtitle: string; icon: string }> = {
    medical: { name: 'Medical Emergency', subtitle: 'Hospitals, Ambulances & ER Centers', icon: 'medical_services' },
    police: { name: 'Police & Security', subtitle: 'Stations, Mobile PCR Vans & Safety Desks', icon: 'local_police' },
    fire: { name: 'Fire & Rescue', subtitle: 'Fire Brigade Stations & Hazmat Teams', icon: 'fire_truck' },
    breakdown: { name: 'Vehicle Breakdown', subtitle: 'Roadside Mechanics, Jumpstart & Puncture', icon: 'car_crash' },
    towing: { name: 'Towing & Recovery', subtitle: 'Flatbed Tow Trucks & Heavy Extraction', icon: 'source' },
    fuel: { name: 'EV Charging & Fuel', subtitle: '24/7 Fast DC Hubs & Mobile Fuel Vans', icon: 'ev_station' },
    pharmacy: { name: '24/7 Pharmacy & O2', subtitle: 'Prescriptions, Insulin & Oxygen Depots', icon: 'local_pharmacy' },
    locksmith: { name: 'Locksmith Assistance', subtitle: 'Vehicle & Residential Lockout Experts', icon: 'vpn_key' },
    other: { name: 'Emergency Services', subtitle: 'Verified Local Responders', icon: 'emergency' },
  };

  const currentCatInfo = categoryTitles[category] || categoryTitles.other;
  const currentCityName = location.city || 'Nashik';

  // Filter providers by category and city
  const filtered = useMemo(() => {
    return providers.filter((p) => {
      if (p.category !== category) return false;
      if (!showAllCities && p.city.toLowerCase() !== currentCityName.toLowerCase()) {
        return false;
      }
      if (filterVerified && !p.isVerified) return false;
      if (filter24x7 && !p.isOpen24x7) return false;
      if (filterClosest && p.distanceKm > 2.5) return false;
      return true;
    });
  }, [providers, category, currentCityName, showAllCities, filterVerified, filter24x7, filterClosest]);

  const handleNavigate = (provider: ServiceProvider) => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(provider.name + ' ' + provider.address + ' ' + provider.city)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col flex-1 h-full max-w-7xl mx-auto w-full animate-in fade-in">
      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex bg-gray-200 p-1 rounded-xl mb-3">
        <button
          onClick={() => setMobileTab('list')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'list' ? 'bg-white text-[#041627] shadow-xs' : 'text-gray-600'
          }`}
        >
          <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
          List View ({filtered.length})
        </button>
        <button
          onClick={() => setMobileTab('map')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'map' ? 'bg-white text-[#041627] shadow-xs' : 'text-gray-600'
          }`}
        >
          <span className="material-symbols-outlined text-sm">map</span>
          Interactive Map
        </button>
      </div>

      {/* Main Grid: Left Column (Listing) + Right Column (Map) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-[580px]">
        {/* Left Listing Column */}
        <div
          className={`md:col-span-6 lg:col-span-7 flex flex-col gap-4 ${
            mobileTab === 'map' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header Title & City Switcher */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[#b6171e] text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {currentCatInfo.icon}
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#041627] tracking-tight">
                  {currentCatInfo.name}
                </h1>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-[#44474c] mt-0.5 flex-wrap">
                <span>
                  Emergency help in <strong className="text-[#041627]">{currentCityName}</strong>
                </span>
                {onOpenLocationModal && (
                  <button
                    onClick={onOpenLocationModal}
                    className="text-[#b6171e] font-bold hover:underline flex items-center gap-0.5 text-xs"
                  >
                    <span className="material-symbols-outlined text-xs">edit_location</span>
                    Change City
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenShareModal()}
                className="px-3 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 text-xs font-bold text-[#041627] flex items-center gap-1 active:scale-95 transition-all"
                title="Share these coordinates"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                <span className="hidden sm:inline">Share SOS</span>
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => {
                setFilterVerified(false);
                setFilter24x7(false);
                setFilterClosest(false);
                setShowAllCities(false);
              }}
              className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${
                !filterVerified && !filter24x7 && !filterClosest && !showAllCities
                  ? 'bg-[#041627] text-white shadow-xs'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              In {currentCityName} ({filtered.length})
            </button>

            <button
              onClick={() => setShowAllCities(!showAllCities)}
              className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${
                showAllCities
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Regions ({providers.filter((p) => p.category === category).length})
            </button>

            <button
              onClick={() => setFilterVerified(!filterVerified)}
              className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                filterVerified
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined text-xs">verified</span>
              Verified Only
            </button>

            <button
              onClick={() => setFilter24x7(!filter24x7)}
              className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${
                filter24x7
                  ? 'bg-sky-800 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Open 24/7
            </button>

            <button
              onClick={() => setFilterClosest(!filterClosest)}
              className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${
                filterClosest
                  ? 'bg-indigo-800 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Closest (&lt;2.5 km)
            </button>
          </div>

          {/* Providers List Cards */}
          <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center space-y-3 shadow-xs">
                <span className="material-symbols-outlined text-4xl text-gray-400">search_off</span>
                <p className="text-sm font-bold text-gray-700">
                  No verified {currentCatInfo.name} listings in {currentCityName} with selected filters.
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setShowAllCities(true)}
                    className="px-4 py-2 bg-[#041627] text-white rounded-xl text-xs font-bold"
                  >
                    View in All Maharashtra Cities
                  </button>
                  <button
                    onClick={() => {
                      setFilterVerified(false);
                      setFilter24x7(false);
                      setFilterClosest(false);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            ) : (
              filtered.map((prov) => (
                <div
                  key={prov.id}
                  onClick={() => setSelectedMapProvider(prov)}
                  className={`bg-white rounded-2xl p-4 md:p-5 border transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer ${
                    selectedMapProvider?.id === prov.id
                      ? 'border-[#041627] ring-2 ring-[#041627]/10'
                      : 'border-[#c4c6cd]'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base md:text-lg font-bold text-[#041627] truncate">
                          {prov.name}
                        </h3>
                        {prov.isVerified && (
                          <span className="bg-[#10b981] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">verified</span>
                            Verified
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-gray-100 text-gray-700">
                          {prov.city}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#44474c] mt-1 flex-wrap">
                        <span className="font-semibold text-amber-600 flex items-center">
                          ★ {prov.rating}
                          <span className="text-gray-400 font-normal ml-0.5">({prov.reviewCount})</span>
                        </span>
                        <span>•</span>
                        <span className="font-medium text-gray-600">{prov.address}</span>
                      </div>
                    </div>

                    <span className="bg-[#edeeef] text-[#041627] text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
                      {prov.distanceKm} km
                    </span>
                  </div>

                  {/* Operating Hours & Dispatch Readiness */}
                  <div className="mt-2.5 flex items-center gap-2 flex-wrap text-xs">
                    <span
                      className={`font-semibold flex items-center gap-1 ${
                        prov.isOpen24x7 ? 'text-emerald-700' : 'text-gray-700'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {prov.operatingHours || (prov.isOpen24x7 ? 'Open 24/7' : 'Standard Hours')}
                    </span>
                    {prov.capacityStatus?.erWaitTime && (
                      <span className="bg-sky-50 text-sky-800 text-[11px] font-medium px-2 py-0.5 rounded">
                        Wait: {prov.capacityStatus.erWaitTime}
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-gray-500">
                      📞 {prov.phone}
                    </span>
                  </div>

                  {/* Card Action Buttons (Call / Navigate / Details) */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCallModal(prov.name, prov.phone);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-[#041627] hover:bg-[#1a2b3c] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                    >
                      <span
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        call
                      </span>
                      <span>Call Now</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(prov);
                      }}
                      className="py-2.5 px-3 rounded-xl border border-[#041627] text-[#041627] hover:bg-gray-50 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">directions</span>
                      <span>Navigate</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProvider(prov);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-[#f3f4f5] hover:bg-[#e7e8e9] text-[#041627] text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
                    >
                      <span>Details</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Fallback Emergency Section */}
          <div className="bg-[#ffdad6] text-[#93000a] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-[#ffb3ac] mt-auto">
            <div className="flex items-center gap-2.5">
              <span
                className="material-symbols-outlined text-xl shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                crisis_alert
              </span>
              <p className="text-xs font-medium leading-tight">
                Immediate life-threatening distress or urgent crisis?
              </p>
            </div>
            <button
              onClick={() => onOpenCallModal('National Emergency 112', '112')}
              className="px-4 py-2 bg-[#b6171e] hover:bg-[#930010] text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap active:scale-95 transition-all shrink-0"
            >
              Call Official SOS (112)
            </button>
          </div>
        </div>

        {/* Right Map Column */}
        <div
          className={`md:col-span-6 lg:col-span-5 h-[400px] md:h-full flex flex-col ${
            mobileTab === 'list' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="h-full rounded-2xl overflow-hidden border border-[#c4c6cd] shadow-xs relative">
            <MapComponent
              providers={filtered}
              selectedProvider={selectedMapProvider}
              onSelectProvider={(p) => setSelectedMapProvider(p)}
              userLocation={location}
              onCall={onOpenCallModal}
              onNavigate={handleNavigate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
