import React, { useState } from 'react';
import { SafetyGuide } from '../../types';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  guide: SafetyGuide | null;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  guide,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen || !guide) return null;

  const toggleStep = (idx: number) => {
    if (completedSteps.includes(idx)) {
      setCompletedSteps(completedSteps.filter((s) => s !== idx));
    } else {
      setCompletedSteps([...completedSteps, idx]);
    }
  };

  const handleReadAloud = () => {
    if (!window.speechSynthesis) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = `${guide.title}. ${guide.summary}. Steps: ${guide.steps.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-[#c4c6cd] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 md:p-5 bg-[#041627] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#b6171e] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {guide.icon}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-red-300 uppercase tracking-wider">
                Emergency First-Aid / Safety Protocol
              </span>
              <h3 className="text-lg md:text-xl font-bold">{guide.title}</h3>
            </div>
          </div>
          <button
            onClick={() => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
            <p className="text-xs text-blue-950 font-medium leading-relaxed">
              {guide.summary}
            </p>
            <button
              onClick={handleReadAloud}
              className={`shrink-0 p-2.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                isPlayingAudio
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-white text-[#041627] border border-blue-300 hover:bg-blue-100'
              }`}
              title="Listen to emergency voice instructions"
            >
              <span className="material-symbols-outlined text-base">
                {isPlayingAudio ? 'stop' : 'volume_up'}
              </span>
              <span className="hidden sm:inline">{isPlayingAudio ? 'Stop' : 'Listen'}</span>
            </button>
          </div>

          {guide.warning && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <span className="material-symbols-outlined text-amber-600 text-base shrink-0 mt-0.5">
                warning
              </span>
              <span>
                <strong>CRITICAL WARNING:</strong> {guide.warning}
              </span>
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold text-[#041627] uppercase tracking-wider mb-3">
              Action Checklist ({completedSteps.length}/{guide.steps.length} completed)
            </h4>

            <div className="space-y-2.5">
              {guide.steps.map((step, idx) => {
                const isDone = completedSteps.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950 line-through opacity-80'
                        : 'bg-white border-gray-200 hover:border-gray-400 text-[#191c1d]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px] ${
                        isDone ? 'bg-emerald-600 text-white' : 'bg-gray-100 border border-gray-300 text-gray-700'
                      }`}
                    >
                      {isDone ? '✓' : idx + 1}
                    </div>
                    <span className="flex-1 font-medium leading-relaxed">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center shrink-0">
          <span className="text-[11px] text-gray-500">
            Certified Emergency Reference Protocol
          </span>
          <button
            onClick={() => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              onClose();
            }}
            className="px-5 py-2 bg-[#041627] text-white rounded-lg text-xs font-bold hover:bg-[#1a2b3c] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
