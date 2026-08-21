import React, { useState } from 'react';
import { LocationState, ServiceProvider, SafetyGuide } from '../types';
import { SAFETY_GUIDES } from '../data/mockData';
import { GuideModal } from '../components/modals/GuideModal';
import { ReportIncidentModal } from '../components/modals/ReportIncidentModal';

interface PoliceSecurityViewProps {
  location: LocationState;
  providers: ServiceProvider[];
  onOpenCallModal: (name: string, number: string) => void;
  onOpenShareModal: () => void;
}

export const PoliceSecurityView: React.FC<PoliceSecurityViewProps> = ({
  location,
  providers,
  onOpenCallModal,
  onOpenShareModal,
}) => {
  const [selectedGuide, setSelectedGuide] = useState<SafetyGuide | null>(null);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentCategory, setIncidentCategory] = useState('Crime / Harassment');

  const policeProviders = providers.filter((p) => p.category === 'police');

  const quickServices = [
    {
      id: 'report',
      title: 'Report a Crime',
      desc: 'File an online incident or FIR entry',
      icon: 'description',
      actionLabel: 'Report Incident →',
      onClick: () => {
        setIncidentCategory('Theft / Stolen Item');
        setShowIncidentModal(true);
      },
    },
    {
      id: 'nearest',
      title: 'Nearest Police Station',
      desc: 'Find closest police chowki or station',
      icon: 'location_on',
      actionLabel: 'Call Dispatch →',
      onClick: () => onOpenCallModal('Central Police Station', '100'),
    },
    {
      id: 'women-safety',
      title: 'Women Safety',
      desc: '24/7 dedicated anti-harassment cell',
      icon: 'female',
      actionLabel: 'Get Help 🛡',
      onClick: () => onOpenCallModal('Women Safety Cell', '1091'),
    },
    {
      id: 'lost-found',
      title: 'Lost & Found',
      desc: 'Report missing documents or valuables',
      icon: 'find_in_page',
      actionLabel: 'Report Lost Item →',
      onClick: () => {
        setIncidentCategory('Lost Property / Missing Person');
        setShowIncidentModal(true);
      },
    },
    {
      id: 'traffic',
      title: 'Traffic Assistance',
      desc: 'Road blockages, towing or accident clearance',
      icon: 'traffic',
      actionLabel: 'Get Assistance →',
      onClick: () => onOpenCallModal('Traffic Police Dispatch', '103'),
    },
    {
      id: 'security',
      title: 'Security Assistance',
      desc: 'Patrol escort or VIP safety escort',
      icon: 'security',
      actionLabel: 'Request Help →',
      onClick: () => {
        setIncidentCategory('Suspicious Activity');
        setShowIncidentModal(true);
      },
    },
  ];

  return (
    <div className="flex flex-col flex-1 max-w-5xl mx-auto w-full pb-16 space-y-8">
      {/* Header & Location (Matches Screenshot 5) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#041627] tracking-tight">
            Police & Security
          </h1>
          <p className="text-xs md:text-sm text-[#44474c] mt-0.5">
            Immediate law enforcement dispatch and crime reporting hub
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>Current Location: {location.name.split(',')[0]}</span>
        </div>
      </div>

      {/* Top Police Emergency 100 Card (Matches Screenshot 5) */}
      <div className="bg-white rounded-2xl p-6 border-2 border-[#b6171e] shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#ffdad6] text-[#b6171e] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_police
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#b6171e]">
              24/7 Priority Emergency
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-[#041627]">Police Emergency (100)</h2>
            <p className="text-xs text-[#44474c] mt-1">
              Direct priority connection to the nearest Police Control Room and Mobile Patrol Unit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto z-10 shrink-0">
          <span className="text-3xl md:text-4xl font-extrabold font-mono text-[#b6171e] hidden md:inline">
            100
          </span>
          <button
            onClick={() => onOpenCallModal('Police Emergency Dispatch', '100')}
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#b6171e] hover:bg-[#930010] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              call
            </span>
            <span>Call Police (100)</span>
          </button>
        </div>
      </div>

      {/* Quick Police Services Grid (Matches Screenshot 5) */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Quick Police Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickServices.map((svc) => (
            <div
              key={svc.id}
              onClick={svc.onClick}
              className="bg-white rounded-2xl p-5 border border-[#c4c6cd] shadow-xs hover:border-[#041627] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#d2e4fb] text-[#041627] flex items-center justify-center mb-3 group-hover:bg-[#041627] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-xl">{svc.icon}</span>
                </div>
                <h3 className="text-sm font-bold text-[#041627]">{svc.title}</h3>
                <p className="text-xs text-[#44474c] mt-1">{svc.desc}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#b6171e] group-hover:text-[#041627]">
                <span>{svc.actionLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby Police & Security List (Matches Screenshot 5) */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Nearby Police Stations & Units
        </h2>

        <div className="space-y-3">
          {policeProviders.map((prov) => (
            <div
              key={prov.id}
              className="bg-white rounded-2xl p-5 border border-[#c4c6cd] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#edeeef] text-[#041627] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    local_police
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#041627]">{prov.name}</h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-[#44474c] mt-0.5">{prov.address} • {prov.distanceKm} km away</p>
                  <p className="text-xs font-semibold text-emerald-700 mt-1">
                    Hotline: {prov.phone}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => {
                    const url = `https://maps.google.com/?q=${prov.coordinates.lat},${prov.coordinates.lng}`;
                    window.open(url, '_blank');
                  }}
                  className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-bold text-[#041627] flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">directions</span>
                  Directions
                </button>
                <button
                  onClick={() => onOpenCallModal(prov.name, prov.phone)}
                  className="flex-1 sm:flex-initial py-2 px-4 rounded-xl bg-[#041627] hover:bg-[#1a2b3c] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    call
                  </span>
                  Call
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Resources Guides Grid (Matches Screenshot 5) */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Safety Protocols & Guides
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAFETY_GUIDES.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-2xl p-5 border border-[#c4c6cd] shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#ffdad6] text-[#b6171e] flex items-center justify-center mb-2.5">
                  <span className="material-symbols-outlined text-base">
                    {guide.icon}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#041627]">{guide.title}</h3>
                <p className="text-xs text-[#44474c] mt-1 line-clamp-2 leading-relaxed">
                  {guide.summary}
                </p>
              </div>

              <button
                onClick={() => setSelectedGuide(guide)}
                className="mt-4 text-xs font-bold text-[#b6171e] hover:underline flex items-center gap-1"
              >
                <span>Read Protocol</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Guide Details Modal */}
      <GuideModal
        isOpen={Boolean(selectedGuide)}
        onClose={() => setSelectedGuide(null)}
        guide={selectedGuide}
      />

      {/* Report Incident Modal */}
      <ReportIncidentModal
        isOpen={showIncidentModal}
        onClose={() => setShowIncidentModal(false)}
        location={location}
        initialType={incidentCategory}
      />
    </div>
  );
};
