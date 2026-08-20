import React, { useState } from 'react';
import { LocationState, ServiceProvider } from '../../types';

interface ShareLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationState;
  selectedProvider?: ServiceProvider | null;
  problemCategory?: string;
}

export const ShareLocationModal: React.FC<ShareLocationModalProps> = ({
  isOpen,
  onClose,
  location,
  selectedProvider,
  problemCategory = 'Emergency Assistance',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const mapsUrl = `https://maps.google.com/?q=${location.lat},${location.lng}`;

  const messageText = selectedProvider
    ? `🚨 HELP HUB EMERGENCY ALERT:
I am at ${selectedProvider.name} (${selectedProvider.address}, ${selectedProvider.city}).
Category: ${selectedProvider.category.toUpperCase()}
Provider Phone: ${selectedProvider.phone}
My Live Location: ${mapsUrl} (${location.name})
Please track my status.`
    : `🚨 HELP HUB EMERGENCY ALERT:
I need urgent assistance (${problemCategory.toUpperCase()}).
Current Location: ${location.name}
Coordinates: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}
Live Google Map Link: ${mapsUrl}
Please assist or dispatch emergency responders.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
    }
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(messageText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleSMS = () => {
    const encoded = encodeURIComponent(messageText);
    window.location.href = `sms:?body=${encoded}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#c4c6cd] flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-5 bg-[#041627] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-lg">share</span>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold">Share Emergency Coordinates</h3>
              <p className="text-xs text-gray-300">Broadcast location & facility details</p>
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
        <div className="p-5 space-y-4">
          <div className="bg-[#f3f4f5] rounded-xl p-4 border border-[#c4c6cd]/80">
            <p className="text-xs font-bold text-[#041627] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-red-600">crisis_alert</span>
              Message Payload Preview
            </p>
            <pre className="text-xs font-mono text-[#191c1d] whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-lg border border-gray-200 select-all">
              {messageText}
            </pre>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={handleCopy}
              className="py-3 px-4 rounded-xl bg-[#1a2b3c] hover:bg-[#041627] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-base">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleSMS}
              className="py-3 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-base">sms</span>
              <span>Send SMS</span>
            </button>
          </div>

          <p className="text-[11px] text-[#74777d] text-center">
            GPS link opens Google Maps / Apple Maps on recipient device instantly.
          </p>
        </div>
      </div>
    </div>
  );
};
