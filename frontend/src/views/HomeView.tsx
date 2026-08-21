import React, { useState } from 'react';
import { EmergencyCategory, LocationState, CityData, ServiceProvider, User } from '../types';
import { CITIES_DATA } from '../data/mockData';

interface HomeViewProps {
  location: LocationState;
  onSelectCategory: (category: EmergencyCategory) => void;
  onOpenLocationModal: () => void;
  onOpenCallModal: (name: string, number: string) => void;
  onSelectCityDirect?: (city: CityData) => void;
  onUseGPSDirect?: () => void;
  currentLanguage: 'en' | 'hi' | 'mr';
  providers?: ServiceProvider[];
  cities?: CityData[];
  currentUser?: User | null;
  onNavigateScreen?: (screen: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  location,
  onSelectCategory,
  onOpenLocationModal,
  onOpenCallModal,
  onSelectCityDirect,
  onUseGPSDirect,
  currentLanguage,
  providers = [],
  cities = CITIES_DATA,
  currentUser,
  onNavigateScreen,
}) => {
  const [naturalQuery, setNaturalQuery] = useState('');
  const [triageSuggestion, setTriageSuggestion] = useState<{
    category: EmergencyCategory;
    title: string;
    description: string;
  } | null>(null);

  // Active City info
  const activeCityData = cities.find(
    (c) =>
      c.name.toLowerCase() === (location.city || '').toLowerCase() ||
      location.name.toLowerCase().includes(c.name.toLowerCase())
  ) || cities[0];

  const cityProviders = providers.filter(
    (p) => p.city.toLowerCase() === (location.city || 'nashik').toLowerCase()
  );

  const categories = [
    {
      id: 'medical' as EmergencyCategory,
      title: currentLanguage === 'hi' ? 'चिकित्सा (Medical)' : currentLanguage === 'mr' ? 'वैद्यकीय (Medical)' : 'Medical Emergency',
      icon: 'medical_services',
      iconBg: 'bg-[#ffdad6] text-[#b6171e]',
      hoverBg: 'group-hover:bg-[#b6171e] group-hover:text-white',
      badge: 'Hospitals & Ambulance 108',
      count: cityProviders.filter((p) => p.category === 'medical').length,
    },
    {
      id: 'police' as EmergencyCategory,
      title: currentLanguage === 'hi' ? 'पुलिस / सुरक्षा' : currentLanguage === 'mr' ? 'पोलीस / सुरक्षा' : 'Police & Security',
      icon: 'local_police',
      iconBg: 'bg-[#d2e4fb] text-[#041627]',
      hoverBg: 'group-hover:bg-[#041627] group-hover:text-white',
      badge: 'PCR & Women Help 1091',
      count: cityProviders.filter((p) => p.category === 'police').length,
    },
    {
      id: 'fire' as EmergencyCategory,
      title: currentLanguage === 'hi' ? 'अग्निशमन (Fire)' : currentLanguage === 'mr' ? 'अग्निशामक (Fire)' : 'Fire & Rescue',
      icon: 'fire_truck',
      iconBg: 'bg-[#ffdad6] text-[#b6171e]',
      hoverBg: 'group-hover:bg-[#b6171e] group-hover:text-white',
      badge: 'Fire Stations & Hazmat',
      count: cityProviders.filter((p) => p.category === 'fire').length,
    },
    {
      id: 'breakdown' as EmergencyCategory,
      title: currentLanguage === 'hi' ? 'गाड़ी खराब (Breakdown)' : currentLanguage === 'mr' ? 'गाडी बंद (Breakdown)' : 'Vehicle Breakdown',
      icon: 'car_crash',
      iconBg: 'bg-[#e7e8e9] text-[#191c1d]',
      hoverBg: 'group-hover:bg-[#041627] group-hover:text-white',
      badge: '24/7 Mechanics & Jumpstart',
      count: cityProviders.filter((p) => p.category === 'breakdown').length,
    },
    {
      id: 'towing' as EmergencyCategory,
      title: currentLanguage === 'hi' ? 'टोइंग सेवा' : currentLanguage === 'mr' ? 'टोईंग सेवा' : 'Towing & Recovery',
      icon: 'source',
      iconBg: 'bg-[#e7e8e9] text-[#191c1d]',
      hoverBg: 'group-hover:bg-[#041627] group-hover:text-white',
      badge: 'Hydraulic Flatbed & Crane',
      count: cityProviders.filter((p) => p.category === 'towing').length,
    },
    {
      id: 'fuel' as EmergencyCategory,
      title: currentLanguage === 'hi' ? 'ईवी / ईंधन' : currentLanguage === 'mr' ? 'ईव्ही / इंधन' : 'EV Charging & Fuel',
      icon: 'ev_station',
      iconBg: 'bg-[#e7e8e9] text-[#191c1d]',
      hoverBg: 'group-hover:bg-[#041627] group-hover:text-white',
      badge: 'Fast DC & CNG Hubs',
      count: cityProviders.filter((p) => p.category === 'fuel').length,
    },
    {
      id: 'pharmacy' as EmergencyCategory,
      title: currentLanguage === 'hi' ? 'दवाखाना / फार्मेसी' : currentLanguage === 'mr' ? 'औषधालय (Pharmacy)' : '24/7 Pharmacy & O2',
      icon: 'local_pharmacy',
      iconBg: 'bg-[#e7e8e9] text-[#191c1d]',
      hoverBg: 'group-hover:bg-[#041627] group-hover:text-white',
      badge: 'Late Night Chemist & Oxygen',
      count: cityProviders.filter((p) => p.category === 'pharmacy').length,
    },
    {
      id: 'locksmith' as EmergencyCategory,
      title: currentLanguage === 'hi' ? 'ताला बनाने वाला' : currentLanguage === 'mr' ? 'कुलूप दुरुस्ती' : 'Locksmith Assist',
      icon: 'vpn_key',
      iconBg: 'bg-[#e7e8e9] text-[#191c1d]',
      hoverBg: 'group-hover:bg-[#041627] group-hover:text-white',
      badge: 'Auto & Residential Lockout',
      count: cityProviders.filter((p) => p.category === 'locksmith').length,
    },
  ];

  const handleSmartTriage = (input: string) => {
    setNaturalQuery(input);
    const q = input.toLowerCase();

    if (!q.trim()) {
      setTriageSuggestion(null);
      return;
    }

    if (
      q.includes('heart') ||
      q.includes('chest') ||
      q.includes('bleed') ||
      q.includes('pain') ||
      q.includes('doctor') ||
      q.includes('hospital') ||
      q.includes('unconscious') ||
      q.includes('breath')
    ) {
      setTriageSuggestion({
        category: 'medical',
        title: `Medical Emergency Detected in ${activeCityData.name}`,
        description: `Calling ${activeCityData.name} Hospital ER or dialing 108 / 112 immediately.`,
      });
    } else if (
      q.includes('thief') ||
      q.includes('theft') ||
      q.includes('stalk') ||
      q.includes('assault') ||
      q.includes('police') ||
      q.includes('harass') ||
      q.includes('danger') ||
      q.includes('fight')
    ) {
      setTriageSuggestion({
        category: 'police',
        title: `${activeCityData.name} Police Assistance Recommended`,
        description: `Connect with ${activeCityData.name} Police Commissionerate (${activeCityData.emergencyHotlines.police}) or dial 100.`,
      });
    } else if (q.includes('fire') || q.includes('smoke') || q.includes('flame') || q.includes('burn') || q.includes('gas leak')) {
      setTriageSuggestion({
        category: 'fire',
        title: 'Fire & Rescue Emergency',
        description: `Evacuate area and dispatch ${activeCityData.name} Fire Brigade (${activeCityData.emergencyHotlines.fire} / 101).`,
      });
    } else if (
      q.includes('tire') ||
      q.includes('puncture') ||
      q.includes('engine') ||
      q.includes('battery') ||
      q.includes('clutch') ||
      q.includes('breakdown') ||
      q.includes('car stopped') ||
      q.includes('bike')
    ) {
      setTriageSuggestion({
        category: 'breakdown',
        title: `Vehicle Breakdown & Mechanic Assistance in ${activeCityData.name}`,
        description: `Found verified roadside mechanics and jumpstart vans on highways.`,
      });
    } else if (q.includes('tow') || q.includes('stuck in ditch') || q.includes('accident car') || q.includes('flatbed')) {
      setTriageSuggestion({
        category: 'towing',
        title: `Towing & Recovery Services in ${activeCityData.name}`,
        description: 'Flatbed hydraulic recovery units ready for dispatch.',
      });
    } else if (
      q.includes('fuel') ||
      q.includes('petrol') ||
      q.includes('diesel') ||
      q.includes('charging') ||
      q.includes('battery empty') ||
      q.includes('ev')
    ) {
      setTriageSuggestion({
        category: 'fuel',
        title: 'EV Charging & Emergency Fuel Delivery',
        description: `Locating 24/7 fast DC hubs and CNG stations in ${activeCityData.name}.`,
      });
    } else if (
      q.includes('medicine') ||
      q.includes('tablet') ||
      q.includes('pharmacy') ||
      q.includes('oxygen') ||
      q.includes('insulin') ||
      q.includes('chemist')
    ) {
      setTriageSuggestion({
        category: 'pharmacy',
        title: '24/7 Pharmacy & Oxygen Supplies',
        description: `Locating open night chemists in ${activeCityData.name}.`,
      });
    } else if (q.includes('key') || q.includes('lock') || q.includes('locked out') || q.includes('car key')) {
      setTriageSuggestion({
        category: 'locksmith',
        title: 'Emergency Locksmith Service',
        description: `Automotive and residential lock specialists in ${activeCityData.name}.`,
      });
    } else {
      setTriageSuggestion({
        category: 'breakdown',
        title: 'Matching Emergency Assistance',
        description: `Searching verified emergency categories in ${activeCityData.name} for "${input}"...`,
      });
    }
  };

  return (
    <div className="flex-grow flex flex-col gap-6 max-w-[1200px] mx-auto w-full pb-12 animate-in fade-in">
      {/* Hero Section with Logo */}
      <section className="flex flex-col items-center justify-center text-center pt-2 pb-1">
        <img
          alt="HELP HUB Logo"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCV2wPp8OC8l9FMsRGMeFuxBuNKSHA19hk3VGyLUHxOBGHBWK2_QiIvUVuiuo2tHzGQpXmLxNzoAE_vzKdX1-tYvUXf_5C43tdeo0ePb9JGcV6vymoK1b2bI4Q1QkEh-KrY9NIInYs6vxsYbrjR6YaJprFfQ_JqkTj8CWZNIsiNm9RZ-JH5dEJkYmmLx8oStGLt7ZraSQ8bNzp_-Eh15XHXcihEe2-ZHbHTTeu7j1pEHqPCqSpxjban"
          className="w-24 h-24 md:w-28 md:h-28 rounded-2xl mb-3 object-contain shadow-xs border border-gray-200 bg-white p-2"
        />
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#041627] tracking-tight leading-tight">
          Tell us what happened. <br className="hidden md:inline" />
          <span className="text-[#b6171e]">We'll find the right help.</span>
        </h1>
        <p className="text-sm md:text-base text-[#44474c] mt-2 max-w-xl font-normal">
          Location-aware verified emergency assistance in <strong>{activeCityData.name}</strong> and across Maharashtra.
        </p>
      </section>

      {/* City / Location Selector Strip (LOCATION-WISE ASSISTANCE) */}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#c4c6cd] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#041627] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl text-[#b6171e]" style={{ fontVariationSettings: "'FILL' 1" }}>
                location_city
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active City / Region:</span>
                <span className="text-sm md:text-base font-extrabold text-[#041627]">{activeCityData.name}, {activeCityData.state}</span>
                {location.isGPS && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">gps_fixed</span> GPS Active
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{location.statusText || activeCityData.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onUseGPSDirect && (
              <button
                onClick={onUseGPSDirect}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs font-bold border border-emerald-300 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-emerald-700 text-base">near_me</span>
                Use My Location
              </button>
            )}
            <button
              onClick={onOpenLocationModal}
              className="px-3.5 py-2 rounded-xl border-2 border-[#041627] text-[#041627] text-xs font-bold hover:bg-[#041627] hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              Change City
            </button>
          </div>
        </div>

        {/* Quick City Chips (Nashik, Pune, Mumbai, etc.) */}
        <div className="pt-2 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
            Quick Switch City:
          </span>
          {cities.map((c) => {
            const isCurrent = (location.city || '').toLowerCase() === c.name.toLowerCase();
            return (
              <button
                key={c.id}
                onClick={() => onSelectCityDirect && onSelectCityDirect(c)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-[#041627] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{c.name}</span>
                {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
              </button>
            );
          })}
        </div>

        {/* Active City Hotlines Banner */}
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <button
            onClick={() => onOpenCallModal(`${activeCityData.name} Police`, activeCityData.emergencyHotlines.police)}
            className="p-2 rounded-lg bg-white border border-gray-200 hover:border-blue-500 flex items-center justify-between text-left"
          >
            <div>
              <span className="text-[10px] text-gray-400 block font-bold">POLICE PCR</span>
              <span className="font-mono font-bold text-blue-800">{activeCityData.emergencyHotlines.police}</span>
            </div>
            <span className="material-symbols-outlined text-blue-600 text-base">call</span>
          </button>

          <button
            onClick={() => onOpenCallModal(`${activeCityData.name} Ambulance`, activeCityData.emergencyHotlines.ambulance)}
            className="p-2 rounded-lg bg-white border border-gray-200 hover:border-emerald-500 flex items-center justify-between text-left"
          >
            <div>
              <span className="text-[10px] text-gray-400 block font-bold">AMBULANCE</span>
              <span className="font-mono font-bold text-emerald-800">{activeCityData.emergencyHotlines.ambulance}</span>
            </div>
            <span className="material-symbols-outlined text-emerald-600 text-base">call</span>
          </button>

          <button
            onClick={() => onOpenCallModal(`${activeCityData.name} Fire`, activeCityData.emergencyHotlines.fire)}
            className="p-2 rounded-lg bg-white border border-gray-200 hover:border-orange-500 flex items-center justify-between text-left"
          >
            <div>
              <span className="text-[10px] text-gray-400 block font-bold">FIRE DEPT</span>
              <span className="font-mono font-bold text-orange-800">{activeCityData.emergencyHotlines.fire}</span>
            </div>
            <span className="material-symbols-outlined text-orange-600 text-base">call</span>
          </button>

          <button
            onClick={() => onOpenCallModal('Women Helpline', activeCityData.emergencyHotlines.womenHelp || '1091')}
            className="p-2 rounded-lg bg-white border border-gray-200 hover:border-pink-500 flex items-center justify-between text-left"
          >
            <div>
              <span className="text-[10px] text-gray-400 block font-bold">WOMEN SOS</span>
              <span className="font-mono font-bold text-pink-800">{activeCityData.emergencyHotlines.womenHelp || '1091'}</span>
            </div>
            <span className="material-symbols-outlined text-pink-600 text-base">call</span>
          </button>
        </div>
      </div>

      {/* Natural Language / Problem Description Search */}
      <div className="bg-white p-4 rounded-xl border border-[#c4c6cd] shadow-xs space-y-2">
        <label className="block text-xs font-bold text-[#041627] uppercase tracking-wider flex items-center justify-between">
          <span>Or describe in your own words:</span>
          <span className="text-[11px] font-medium text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
            Instant Smart Triage
          </span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={naturalQuery}
            onChange={(e) => handleSmartTriage(e.target.value)}
            placeholder="e.g., 'Highway puncture near Dwarka circle', 'Severe chest pain', 'Car locked out'..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#041627] focus:outline-none placeholder-gray-400"
          />
          <span className="material-symbols-outlined absolute left-3 top-3.5 text-gray-400 text-lg">
            search
          </span>
          {naturalQuery && (
            <button
              onClick={() => {
                setNaturalQuery('');
                setTriageSuggestion(null);
              }}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {triageSuggestion && (
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg flex items-center justify-between gap-3 animate-in fade-in">
            <div className="min-w-0">
              <p className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-sky-600">auto_awesome</span>
                {triageSuggestion.title}
              </p>
              <p className="text-xs text-sky-800 truncate">{triageSuggestion.description}</p>
            </div>
            <button
              onClick={() => onSelectCategory(triageSuggestion.category)}
              className="px-4 py-1.5 bg-[#041627] text-white rounded-lg text-xs font-bold hover:bg-[#1a2b3c] whitespace-nowrap active:scale-95 shadow-xs"
            >
              View Assistance →
            </button>
          </div>
        )}
      </div>

      {/* Main 8 Problem Category Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-2xl font-bold text-[#041627] tracking-tight">Emergency Assistance Categories</h2>
            <p className="text-xs text-gray-500">
              Showing verified responders active in <strong>{activeCityData.name}</strong>
            </p>
          </div>
          <span className="text-xs font-bold text-[#b6171e]">24/7 Verified Network</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="bg-white rounded-2xl p-5 md:p-6 flex flex-col items-center justify-center gap-3 border border-[#c4c6cd] shadow-xs hover:shadow-md hover:border-[#041627] transition-all duration-200 active:scale-95 group text-center cursor-pointer min-h-[160px]"
            >
              <div
                className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${cat.iconBg} flex items-center justify-center ${cat.hoverBg} transition-colors shadow-xs`}
              >
                <span
                  className="material-symbols-outlined text-3xl md:text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {cat.icon}
                </span>
              </div>
              <div>
                <span className="text-sm md:text-base font-bold text-[#041627] block leading-tight">
                  {cat.title}
                </span>
                <span className="text-[11px] font-medium text-gray-500 mt-1 block">
                  {cat.badge}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Direct One-Tap Emergency Bar */}
      <section className="mt-2 bg-[#041627] text-white rounded-2xl p-5 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#b6171e] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              emergency
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold">National Unified Emergency Hotline</h3>
            <p className="text-xs text-gray-300">
              Direct dial 112 for Police, Fire, Medical, and Disaster response across all states.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => onOpenCallModal('National Emergency 112', '112')}
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-[#b6171e] hover:bg-[#930010] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">call</span>
            Dial 112 SOS
          </button>
          <button
            onClick={() => onOpenCallModal(`${activeCityData.name} Police`, activeCityData.emergencyHotlines.police)}
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">local_police</span>
            Call {activeCityData.name} Police
          </button>
        </div>
      </section>
    </div>
  );
};
