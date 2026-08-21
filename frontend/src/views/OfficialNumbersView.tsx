import React from 'react';
import { OFFICIAL_EMERGENCY_CONTACTS } from '../data/mockData';

interface OfficialNumbersViewProps {
  onOpenCallModal: (name: string, number: string) => void;
}

export const OfficialNumbersView: React.FC<OfficialNumbersViewProps> = ({
  onOpenCallModal,
}) => {
  const primaryContacts = OFFICIAL_EMERGENCY_CONTACTS.filter((c) => c.category === 'primary');
  const specializedContacts = OFFICIAL_EMERGENCY_CONTACTS.filter((c) => c.category === 'specialized');

  return (
    <div className="flex flex-col flex-1 max-w-5xl mx-auto w-full pb-16 space-y-8">
      {/* Header (Matches Screenshot 4) */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#b6171e] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            contact_emergency
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#041627] tracking-tight">
            Official Emergency Contacts
          </h1>
        </div>
        <p className="text-sm text-[#44474c]">
          Immediate access to national emergency services. Tap any number to call instantly.
        </p>
      </div>

      {/* Primary Emergency Grid (Matches Screenshot 4) */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Primary National Numbers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {primaryContacts.map((contact) => {
            const is112 = contact.number === '112';

            if (is112) {
              return (
                <div
                  key={contact.id}
                  className="bg-[#ba1a1a] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:shadow-lg active:scale-[0.99]"
                >
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {contact.icon}
                      </span>
                      <span className="text-4xl md:text-5xl font-extrabold font-mono tracking-tight">
                        {contact.number}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mt-2">{contact.name}</h3>
                    <p className="text-xs text-white/80 mt-1 leading-relaxed">
                      {contact.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onOpenCallModal(contact.name, contact.number)}
                    className="mt-6 w-full py-3.5 px-4 bg-white hover:bg-gray-100 text-[#ba1a1a] rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      call
                    </span>
                    <span>Dial {contact.number} Now</span>
                  </button>
                </div>
              );
            }

            return (
              <div
                key={contact.id}
                className="bg-white rounded-2xl p-6 border border-[#c4c6cd] shadow-xs flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-[#041627] active:scale-[0.99]"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-12 h-12 rounded-xl bg-[#ffdad6] text-[#b6171e] flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {contact.icon}
                      </span>
                    </div>
                    <span className="text-3xl md:text-4xl font-extrabold font-mono text-[#041627]">
                      {contact.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#041627] mt-2">{contact.name}</h3>
                  <p className="text-xs text-[#44474c] mt-1 leading-relaxed">
                    {contact.description}
                  </p>
                </div>

                <button
                  onClick={() => onOpenCallModal(contact.name, contact.number)}
                  className="mt-6 w-full py-3 px-4 bg-[#041627] hover:bg-[#1a2b3c] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    call
                  </span>
                  <span>Call {contact.name}</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Specialized Helplines Section (Matches Screenshot 4) */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Specialized National Helplines
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {specializedContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl p-5 border border-[#c4c6cd] shadow-xs flex flex-col justify-between hover:shadow-md hover:border-gray-400 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#edeeef] text-[#041627] flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">
                      {contact.icon}
                    </span>
                  </div>
                  <span className="text-xl font-bold font-mono text-[#041627]">
                    {contact.number}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#041627] mt-3">{contact.name}</h3>
                <p className="text-[11px] text-[#44474c] mt-1 leading-normal">
                  {contact.description}
                </p>
              </div>

              <button
                onClick={() => onOpenCallModal(contact.name, contact.number)}
                className="mt-4 w-full py-2 px-3 bg-[#f3f4f5] hover:bg-[#041627] hover:text-white text-[#041627] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-sm">call</span>
                <span>Dial {contact.number}</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
