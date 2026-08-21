import React, { useState } from 'react';
import { ServiceProvider, LocationState } from '../types';

interface ProviderDetailViewProps {
  provider: ServiceProvider;
  location: LocationState;
  onBack: () => void;
  onOpenCallModal: (name: string, number: string) => void;
  onOpenShareModal: (provider: ServiceProvider) => void;
}

export const ProviderDetailView: React.FC<ProviderDetailViewProps> = ({
  provider,
  location,
  onBack,
  onOpenCallModal,
  onOpenShareModal,
}) => {
  const [reportSuccess, setReportSuccess] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Incorrect phone number');

  const handleNavigate = () => {
    const url = `https://maps.google.com/?q=${provider.coordinates.lat},${provider.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setShowReportModal(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col flex-1 max-w-5xl mx-auto w-full pb-16">
      {/* Breadcrumb Navigation (Matches Screenshot 3) */}
      <nav className="flex items-center gap-2 text-xs text-[#44474c] mb-4">
        <button onClick={onBack} className="hover:text-[#041627] font-medium">
          Home
        </button>
        <span>/</span>
        <button onClick={onBack} className="hover:text-[#041627] capitalize font-medium">
          {provider.category} Providers
        </button>
        <span>/</span>
        <span className="text-[#041627] font-bold truncate">{provider.name}</span>
      </nav>

      {/* Main Hero Card with Top Red Accent Bar (Matches Screenshot 3) */}
      <div className="bg-white rounded-2xl border border-[#c4c6cd] overflow-hidden shadow-sm mb-6">
        <div className="h-2.5 bg-[#b6171e] w-full"></div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#ffdad6] text-[#b6171e] flex items-center justify-center shrink-0 shadow-xs border border-[#ffb3ac]">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {provider.category === 'medical'
                    ? 'local_hospital'
                    : provider.category === 'police'
                    ? 'local_police'
                    : provider.category === 'breakdown'
                    ? 'car_repair'
                    : provider.category === 'fire'
                    ? 'fire_truck'
                    : provider.category === 'pharmacy'
                    ? 'local_pharmacy'
                    : provider.category === 'fuel'
                    ? 'ev_station'
                    : 'build'}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-[#041627] tracking-tight">
                    {provider.name}
                  </h1>
                  {provider.isVerified && (
                    <span className="bg-[#10b981] text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-2 text-xs md:text-sm text-[#44474c] flex-wrap">
                  <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Open • Emergency 24/7
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-amber-600">
                    ★ {provider.rating} ({provider.reviewCount} reviews)
                  </span>
                  <span>•</span>
                  <span className="font-bold text-[#041627]">
                    {provider.distanceKm} km from you
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons (Matches Screenshot 3) */}
            <div className="flex flex-col sm:flex-row gap-3 md:items-center shrink-0">
              <button
                onClick={() => onOpenCallModal(provider.name, provider.phone)}
                className="py-3.5 px-6 rounded-xl bg-[#b6171e] hover:bg-[#930010] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  call
                </span>
                <span>Call Now ({provider.phone})</span>
              </button>

              <button
                onClick={handleNavigate}
                className="py-3.5 px-5 rounded-xl bg-[#041627] hover:bg-[#1a2b3c] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-lg">directions</span>
                <span>Navigate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Location, Map Preview, Contacts & Share Banner */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
          {/* Location & Map Preview Card (Matches Screenshot 3) */}
          <div className="bg-white rounded-2xl p-6 border border-[#c4c6cd] shadow-xs">
            <h2 className="text-base font-bold text-[#041627] flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#b6171e]">location_on</span>
              Location & Access
            </h2>

            <p className="text-sm font-medium text-[#191c1d] mb-1">{provider.address}</p>
            <p className="text-xs text-[#44474c] mb-4">{provider.city} • Landmark: {provider.landmark || 'Main Entrance Gate'}</p>

            {/* Street Map Image Preview (Matches Screenshot 3) */}
            <div className="relative rounded-xl overflow-hidden border border-gray-300 h-48 md:h-56 bg-gray-100 group">
              <img
                src={provider.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuALC5_ftc6UQJX3OmfmWw1SCkquzMQLnvYO9XZU8g-qQsApDLmYSMT4HDBBgJy-ajyXpD3N9XeafqOzbSpNPpCIoDSDZQ7yid84y_lT8i4zrxhvogDQ-1tVtzNOePNu7dkMYjK-Nfvo210IOrWbH1narbFmEQFDXqPKwquYmWLzPlhqCSnZIG_S7aXXFIZkr8aiGUxFctIIbfowkMAdTpDNnBgAX9ituQaQapc-6McrH69R558Xpss1'}
                alt={`${provider.name} map location`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={handleNavigate}
                className="absolute bottom-3 right-3 bg-[#041627]/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md hover:bg-[#041627] flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                Open in Full Maps
              </button>
            </div>
          </div>

          {/* Contact Details Card (Matches Screenshot 3) */}
          <div className="bg-white rounded-2xl p-6 border border-[#c4c6cd] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#041627] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#041627]">contact_phone</span>
              Direct Emergency Contacts
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                  Primary Hotline
                </span>
                <p className="text-base font-mono font-bold text-[#b6171e]">{provider.phone}</p>
                <button
                  onClick={() => onOpenCallModal(provider.name, provider.phone)}
                  className="mt-2 text-xs font-bold text-[#041627] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">call</span>
                  Direct Call
                </button>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                  Dispatch & Reception
                </span>
                <p className="text-base font-mono font-bold text-[#041627]">{provider.altPhone || provider.phone}</p>
                <button
                  onClick={() => onOpenCallModal(provider.name, provider.altPhone || provider.phone)}
                  className="mt-2 text-xs font-bold text-[#041627] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">call</span>
                  Secondary Line
                </button>
              </div>
            </div>
          </div>

          {/* Coordinate Help Blue Banner (Matches Screenshot 3) */}
          <div className="bg-[#d2e4fb] text-[#001d35] rounded-2xl p-5 border border-[#a2c8f8] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-[#004a77] flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-xl">share_location</span>
              </div>
              <div>
                <h3 className="text-sm font-bold">Coordinate Emergency Response</h3>
                <p className="text-xs text-[#003355] mt-0.5 leading-relaxed">
                  Share this facility's verified coordinates & contact numbers with your family or dispatch responders.
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenShareModal(provider)}
              className="px-5 py-2.5 bg-[#004a77] hover:bg-[#003355] text-white text-xs font-bold rounded-xl shadow-xs whitespace-nowrap active:scale-95 transition-all shrink-0 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">share</span>
              Share Details
            </button>
          </div>
        </div>

        {/* Right Column (4 cols): Capacity Status, Services & Verification Audit */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
          {/* Real-Time Capacity Status Card (Matches Screenshot 3) */}
          <div className="bg-white rounded-2xl p-6 border border-[#c4c6cd] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#041627] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#041627]">vital_signs</span>
                Live Facility Telemetry
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">ER Wait Time:</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {provider.capacityStatus?.erWaitTime || '~10 mins'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">ICU Bed Availability:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {provider.capacityStatus?.icuBeds || 'Available'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Blood Bank Status:</span>
                <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                  {provider.capacityStatus?.bloodBank || 'Operational'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span className="font-semibold text-gray-700">Medical Oxygen:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {provider.capacityStatus?.oxygen || 'Adequate'}
                </span>
              </div>
            </div>
          </div>

          {/* Available Specialized Services Chips */}
          <div className="bg-white rounded-2xl p-6 border border-[#c4c6cd] shadow-xs">
            <h2 className="text-base font-bold text-[#041627] mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#041627]">verified_user</span>
              Available Services
            </h2>
            <div className="flex flex-wrap gap-2">
              {provider.services.map((svc, idx) => (
                <span
                  key={idx}
                  className="bg-[#f3f4f5] text-[#191c1d] border border-gray-200 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {svc}
                </span>
              ))}
            </div>
          </div>

          {/* Report Incorrect Info Button (Matches Screenshot 3) */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center">
            <p className="text-xs text-gray-500 mb-2">
              Notice outdated hours or changed numbers?
            </p>
            <button
              onClick={() => setShowReportModal(true)}
              className="text-xs font-bold text-[#b6171e] hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <span className="material-symbols-outlined text-sm">flag</span>
              Report Incorrect Information
            </button>
          </div>
        </div>
      </div>

      {/* Report Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-300 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-[#041627]">Report Data Issue</h3>
              <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {reportSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 text-center font-bold">
                Thank you! Our audit operations team will re-verify this facility within 15 minutes.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">What is incorrect?</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="Incorrect phone number">Incorrect phone number</option>
                    <option value="Facility currently closed / relocated">Facility currently closed / relocated</option>
                    <option value="Incorrect GPS / address pin">Incorrect GPS / address pin</option>
                    <option value="Outdated service capacity">Outdated service capacity</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#b6171e] text-white rounded-lg font-bold"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
