import React, { useState } from 'react';
import { LocationState, SafetyGuide } from '../types';
import { OFFICIAL_EMERGENCY_CONTACTS, SAFETY_GUIDES, EMERGENCY_PHRASES } from '../data/mockData';
import { GuideModal } from '../components/modals/GuideModal';

interface OfflineModeViewProps {
  location: LocationState;
  onOpenCallModal: (name: string, number: string) => void;
  onOpenShareModal: () => void;
}

export const OfflineModeView: React.FC<OfflineModeViewProps> = ({
  location,
  onOpenCallModal,
  onOpenShareModal,
}) => {
  const [selectedGuide, setSelectedGuide] = useState<SafetyGuide | null>(null);
  const [copiedPhraseId, setCopiedPhraseId] = useState<string | null>(null);

  const handleCopyPhrase = (phraseId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPhraseId(phraseId);
    setTimeout(() => setCopiedPhraseId(null), 2000);
  };

  const handleSpeakPhrase = (text: string, lang = 'en-US') => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col flex-1 max-w-5xl mx-auto w-full pb-16 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#1a2b3c] text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-[#041627] flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              wifi_off
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold">Offline Emergency Protocol</h1>
              <span className="bg-amber-400 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                Zero Data Required
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              All telephone numbers, first aid checklists, and localized language cards work completely offline.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenShareModal}
          className="w-full md:w-auto py-3 px-5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all shrink-0"
        >
          <span className="material-symbols-outlined text-base">sms</span>
          <span>Draft SOS SMS with Coordinates</span>
        </button>
      </div>

      {/* Quick Dial Grid */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-red-600">emergency</span>
          Instant Phone Dialing (Works via Cellular GSM)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {OFFICIAL_EMERGENCY_CONTACTS.slice(0, 4).map((c) => (
            <div
              key={c.id}
              onClick={() => onOpenCallModal(c.name, c.number)}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-[#b6171e] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-700">{c.name}</span>
                <span className="material-symbols-outlined text-red-600 text-lg">call</span>
              </div>
              <p className="text-2xl font-extrabold font-mono text-[#041627] mt-2">{c.number}</p>
              <span className="text-[10px] text-gray-400 mt-1">Direct GSM Call</span>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-language Translation Cards (English / Hindi / Marathi) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-sky-600">translate</span>
            Emergency Multi-Lingual Communication Cards
          </h2>
          <span className="text-[11px] text-gray-400">Tap speaker to play or copy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EMERGENCY_PHRASES.map((phrase) => (
            <div
              key={phrase.id}
              className="bg-white rounded-xl p-4 border border-[#c4c6cd] shadow-xs space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                  {phrase.category}
                </span>
                <button
                  onClick={() => handleCopyPhrase(phrase.id, phrase.english)}
                  className="text-xs text-sky-700 font-bold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedPhraseId === phrase.id ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedPhraseId === phrase.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* English */}
              <div className="p-2.5 bg-gray-50 rounded-lg flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[#041627]">{phrase.english}</p>
                <button
                  onClick={() => handleSpeakPhrase(phrase.english, 'en-US')}
                  className="p-1 text-gray-500 hover:text-black shrink-0"
                  title="Speak English"
                >
                  <span className="material-symbols-outlined text-base">volume_up</span>
                </button>
              </div>

              {/* Hindi */}
              <div className="p-2.5 bg-amber-50/60 rounded-lg flex items-center justify-between gap-2 border border-amber-200/50">
                <p className="text-xs font-medium text-amber-950">{phrase.hindi}</p>
                <button
                  onClick={() => handleSpeakPhrase(phrase.hindi, 'hi-IN')}
                  className="p-1 text-amber-800 hover:text-black shrink-0"
                  title="Speak Hindi"
                >
                  <span className="material-symbols-outlined text-base">volume_up</span>
                </button>
              </div>

              {/* Marathi */}
              <div className="p-2.5 bg-blue-50/60 rounded-lg flex items-center justify-between gap-2 border border-blue-200/50">
                <p className="text-xs font-medium text-blue-950">{phrase.marathi}</p>
                <button
                  onClick={() => handleSpeakPhrase(phrase.marathi, 'mr-IN')}
                  className="p-1 text-blue-800 hover:text-black shrink-0"
                  title="Speak Marathi"
                >
                  <span className="material-symbols-outlined text-base">volume_up</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Offline First Aid Guides */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-emerald-600">medical_services</span>
          Offline First-Aid & Emergency Action Guides
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAFETY_GUIDES.map((guide) => (
            <div
              key={guide.id}
              onClick={() => setSelectedGuide(guide)}
              className="bg-white rounded-xl p-4 border border-[#c4c6cd] shadow-xs hover:border-[#041627] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#ffdad6] text-[#b6171e] flex items-center justify-center mb-2.5">
                  <span className="material-symbols-outlined text-xl">{guide.icon}</span>
                </div>
                <h3 className="text-sm font-bold text-[#041627]">{guide.title}</h3>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{guide.summary}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#b6171e]">
                <span>View Steps ({guide.steps.length})</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      <GuideModal
        isOpen={Boolean(selectedGuide)}
        onClose={() => setSelectedGuide(null)}
        guide={selectedGuide}
      />
    </div>
  );
};
