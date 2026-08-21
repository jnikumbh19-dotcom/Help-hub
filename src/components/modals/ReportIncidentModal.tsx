import React, { useState } from 'react';
import { LocationState } from '../../types';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationState;
  initialType?: string;
  onSubmitted?: (details: string) => void;
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen,
  onClose,
  location,
  initialType = 'Crime / Harassment',
  onSubmitted,
}) => {
  const [incidentType, setIncidentType] = useState(initialType);
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSubmitted) {
      onSubmitted(`${incidentType}: ${description}`);
    }
    setTimeout(() => {
      setSubmitted(false);
      setDescription('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#c4c6cd] flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-5 bg-[#041627] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#b6171e] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-lg">report</span>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold">Log Safety Incident / FIR Entry</h3>
              <p className="text-xs text-gray-300">Directly routes to nearest Police Control Room</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {submitted ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce-subtle">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
              </div>
              <h4 className="text-lg font-bold text-[#041627]">Incident Report Registered</h4>
              <p className="text-xs text-[#44474c] max-w-sm">
                Reference ID <strong>#INC-{Math.floor(100000 + Math.random() * 900000)}</strong> has been generated and dispatched to the nearest PCR Unit for {location.name}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#041627] mb-1">
                  Incident Category
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#041627] focus:outline-none bg-white"
                >
                  <option value="Theft / Stolen Item">Theft / Stolen Vehicle or Item</option>
                  <option value="Physical Assault / Violence">Physical Assault / Violence</option>
                  <option value="Harassment / Stalking">Harassment / Stalking / Eve Teasing</option>
                  <option value="Road Accident & Hit-and-Run">Road Accident & Hit-and-Run</option>
                  <option value="Lost Property / Missing Person">Lost Property / Missing Documents</option>
                  <option value="Suspicious Activity">Suspicious Activity / Security Threat</option>
                  <option value="Cyber Fraud">Cyber Crime / Financial Fraud</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#041627] mb-1">
                  Incident Location
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${location.name} (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-xs text-gray-700 cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#041627] mb-1">
                  Detailed Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what happened, vehicle registration numbers, physical descriptions, or landmarks..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#041627] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#041627] mb-1">
                    Callback Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    disabled={isAnonymous}
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#041627] focus:outline-none disabled:opacity-50"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#44474c]">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>Submit Anonymously</span>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-800">
                <strong>Important:</strong> For immediate in-progress violent emergencies, call <strong>100</strong> or <strong>112</strong> instantly instead of submitting written reports.
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#b6171e] hover:bg-[#930010] text-white rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  Submit Incident Report
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
