import React, { useState, useEffect } from 'react';
import { LocationState } from '../../types';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName: string;
  targetNumber: string;
  location: LocationState;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  targetName,
  targetNumber,
  location,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [dispatchedUnits, setDispatchedUnits] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      setCallStatus('connecting');
      setDispatchedUnits(false);
      return;
    }

    // Simulate connection after 1.5s
    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 1500);

    return () => clearTimeout(connectTimer);
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, callStatus]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleDirectTel = () => {
    window.location.href = `tel:${targetNumber.replace(/\D/g, '')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#041627] text-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-white/10 flex flex-col">
        {/* Top bar */}
        <div className="p-4 bg-[#1a2b3c] flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-red-300">
              Emergency Dispatch Line
            </span>
          </div>
          <span className="text-xs text-gray-400 font-mono">ENCRYPTED P2P</span>
        </div>

        {/* Call center display */}
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-[#b6171e] text-white flex items-center justify-center shadow-lg animate-pulse">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                phone_in_talk
              </span>
            </div>
            {callStatus === 'connected' && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-[#041627]">
                <span className="material-symbols-outlined text-sm block">check</span>
              </div>
            )}
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-white mb-1">{targetName}</h3>
          <p className="text-xl font-mono text-emerald-400 font-bold mb-3">{targetNumber}</p>

          <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-gray-300 mb-6">
            {callStatus === 'connecting' && 'Dialing emergency dispatch node...'}
            {callStatus === 'connected' && `Connected (${formatTime(callDuration)})`}
            {callStatus === 'ended' && 'Call Disconnected'}
          </div>

          {/* Location telemetry pill */}
          <div className="w-full bg-[#1a2b3c]/80 rounded-xl p-3.5 border border-white/10 text-left mb-6">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span className="flex items-center gap-1 font-semibold text-gray-200">
                <span className="material-symbols-outlined text-sm text-sky-400">near_me</span>
                Location Telemetry
              </span>
              <span className="text-emerald-400 font-mono">Transmitted</span>
            </div>
            <p className="text-xs font-medium text-white truncate">{location.name}</p>
            <p className="text-[11px] text-gray-400 font-mono">
              GPS: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          </div>

          {/* Operator Action simulated banner */}
          {callStatus === 'connected' && !dispatchedUnits && (
            <button
              onClick={() => setDispatchedUnits(true)}
              className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 mb-4 transition-all"
            >
              <span className="material-symbols-outlined text-sm">send_to_mobile</span>
              Transmit Priority SOS Alert to Unit
            </button>
          )}

          {dispatchedUnits && (
            <div className="w-full py-2 px-3 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-xs text-emerald-300 font-medium mb-4 flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-emerald-400 text-sm">done_all</span>
              GPS coordinates received. Closest vehicle dispatched (ETA ~6m).
            </div>
          )}

          {/* Call Controls */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-xs mb-6">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3.5 rounded-full flex flex-col items-center justify-center gap-1 text-xs transition-colors ${
                isMuted ? 'bg-white text-[#041627]' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                {isMuted ? 'mic_off' : 'mic'}
              </span>
              <span>{isMuted ? 'Muted' : 'Mute'}</span>
            </button>

            <button
              onClick={() => setIsSpeaker(!isSpeaker)}
              className={`p-3.5 rounded-full flex flex-col items-center justify-center gap-1 text-xs transition-colors ${
                isSpeaker ? 'bg-sky-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                {isSpeaker ? 'volume_up' : 'volume_down'}
              </span>
              <span>Speaker</span>
            </button>

            <button
              onClick={handleDirectTel}
              className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white flex flex-col items-center justify-center gap-1 text-xs transition-colors"
              title="Open Device Native Phone App"
            >
              <span className="material-symbols-outlined text-xl">dialpad</span>
              <span>Device Dial</span>
            </button>
          </div>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="w-full py-4 rounded-xl bg-[#b6171e] hover:bg-[#930010] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-2xl">call_end</span>
            End Emergency Call
          </button>
        </div>
      </div>
    </div>
  );
};
