import React, { useState } from 'react';
import { User, ServiceProvider, CityData, ComplaintTicket } from '../types';
import { CITIES_DATA } from '../data/mockData';

interface UserDashboardViewProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  providers: ServiceProvider[];
  onOpenCallModal: (name: string, number: string) => void;
  onOpenShareModal: (provider?: ServiceProvider) => void;
  onNavigateCategory: (category: any) => void;
  onSubmitGrievance: (ticket: Partial<ComplaintTicket>) => void;
  cities?: CityData[];
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  currentUser,
  onUpdateUser,
  providers,
  onOpenCallModal,
  onOpenShareModal,
  onSubmitGrievance,
  cities = CITIES_DATA,
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'medical' | 'grievance'>('overview');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Form states for Medical ID
  const [bloodGroup, setBloodGroup] = useState(currentUser.emergencyProfile?.bloodGroup || 'O+ Positive');
  const [iceName, setIceName] = useState(currentUser.emergencyProfile?.iceContactName || 'Pooja Sharma');
  const [icePhone, setIcePhone] = useState(currentUser.emergencyProfile?.iceContactPhone || '+91 98220 54321');
  const [medicalNotes, setMedicalNotes] = useState(
    currentUser.emergencyProfile?.medicalNotes || 'No known allergies. Asthmatic (carries inhaler).'
  );
  const [vehicleNumber, setVehicleNumber] = useState(
    currentUser.emergencyProfile?.vehicleNumber || 'MH-15-DX-4412'
  );
  const [vehicleModel, setVehicleModel] = useState(
    currentUser.emergencyProfile?.vehicleModel || 'Hyundai Creta (Petrol)'
  );

  // Grievance form
  const [gSubject, setGSubject] = useState('');
  const [gCategory, setGCategory] = useState<'medical' | 'police' | 'breakdown' | 'towing' | 'other'>('breakdown');
  const [gProviderName, setGProviderName] = useState('');
  const [gDescription, setGDescription] = useState('');

  const savedProviders = providers.filter((p) => currentUser.savedProviderIds?.includes(p.id));

  const handleSaveMedicalProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...currentUser,
      emergencyProfile: {
        bloodGroup,
        iceContactName: iceName,
        iceContactPhone: icePhone,
        medicalNotes,
        vehicleNumber,
        vehicleModel,
      },
    };
    onUpdateUser(updated);
    setIsEditingProfile(false);
  };

  const handleRemoveSaved = (providerId: string) => {
    const updated: User = {
      ...currentUser,
      savedProviderIds: (currentUser.savedProviderIds || []).filter((id) => id !== providerId),
    };
    onUpdateUser(updated);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gSubject.trim() || !gDescription.trim()) return;

    onSubmitGrievance({
      userName: currentUser.name,
      userPhone: currentUser.phone,
      city: currentUser.city,
      providerName: gProviderName.trim() || undefined,
      category: gCategory as any,
      subject: gSubject.trim(),
      description: gDescription.trim(),
      priority: 'high',
      status: 'open',
    });

    setTicketSuccess(true);
    setGSubject('');
    setGDescription('');
    setGProviderName('');
    setTimeout(() => setTicketSuccess(false), 5000);
  };

  return (
    <div className="flex flex-col flex-1 max-w-6xl mx-auto w-full pb-16 space-y-6 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="bg-[#041627] text-white rounded-2xl p-5 md:p-6 shadow-md border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#b6171e] to-red-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-md border border-white/20">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-extrabold text-white">{currentUser.name}</h1>
              <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Citizen Account
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-0.5">
              {currentUser.email} • City: <strong>{currentUser.city}</strong> • Phone: {currentUser.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenShareModal()}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">share_location</span>
            Share GPS Location
          </button>
          <button
            onClick={() => onOpenCallModal('112 Emergency', '112')}
            className="px-4 py-2 rounded-xl bg-[#ba1a1a] hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
          >
            <span className="material-symbols-outlined text-sm">sos</span>
            Dial 112 SOS
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-4 pt-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-[#041627] text-[#041627]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">dashboard</span>
          Overview & Quick Actions
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'saved'
              ? 'border-[#041627] text-[#041627]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">bookmark</span>
          Saved Services ({savedProviders.length})
        </button>
        <button
          onClick={() => setActiveTab('medical')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'medical'
              ? 'border-[#041627] text-[#041627]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">medical_information</span>
          Emergency ICE Medical ID
        </button>
        <button
          onClick={() => setActiveTab('grievance')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'grievance'
              ? 'border-[#041627] text-[#041627]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">report_problem</span>
          Submit Complaint / Feedback
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Medical Summary Card & ICE Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-gradient-to-r from-red-50 to-orange-50 p-5 rounded-2xl border border-red-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-600 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                    <h3 className="font-bold text-sm text-[#041627]">In Case of Emergency (ICE) Profile</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('medical')}
                    className="text-xs font-bold text-red-700 hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-red-100">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Blood Group</span>
                    <p className="font-black text-red-700 text-base">{bloodGroup || 'Not Set'}</p>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-red-100">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">ICE Contact</span>
                    <p className="font-bold text-gray-800 truncate">{iceName || 'Not Set'}</p>
                    <p className="text-[10px] text-gray-500">{icePhone}</p>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-red-100">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Vehicle Number</span>
                    <p className="font-bold text-gray-800 font-mono">{vehicleNumber || 'MH-15-XX-0000'}</p>
                    <p className="text-[10px] text-gray-500 truncate">{vehicleModel}</p>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-red-100">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Medical Notes</span>
                    <p className="text-[11px] text-gray-700 line-clamp-2">{medicalNotes || 'No notes'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-red-200/60 flex items-center justify-between text-xs">
                <span className="text-gray-600 text-[11px]">
                  First responders can scan your emergency ID during critical care.
                </span>
                <button
                  onClick={() => onOpenCallModal(`ICE: ${iceName}`, icePhone)}
                  className="px-3 py-1.5 bg-red-700 text-white rounded-lg font-bold text-[11px] hover:bg-red-800 flex items-center gap-1 shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">call</span>
                  Call ICE ({iceName})
                </button>
              </div>
            </div>

            {/* Quick City Hotline QuickDial */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#041627] mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#041627] text-base">location_on</span>
                  {currentUser.city} Hotlines
                </h3>
                <p className="text-[11px] text-gray-500 mb-3">
                  Direct dispatch lines for your active city.
                </p>

                <div className="space-y-2 text-xs">
                  <button
                    onClick={() => onOpenCallModal('City Police Control Room', '100')}
                    className="w-full p-2 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-between border border-gray-200"
                  >
                    <span className="font-bold text-gray-800 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-blue-700">local_police</span>
                      Police PCR (100)
                    </span>
                    <span className="font-mono text-gray-600 font-bold">Dial 100</span>
                  </button>

                  <button
                    onClick={() => onOpenCallModal('Trauma Ambulance', '108')}
                    className="w-full p-2 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-between border border-gray-200"
                  >
                    <span className="font-bold text-gray-800 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-emerald-700">medical_services</span>
                      Ambulance 108
                    </span>
                    <span className="font-mono text-gray-600 font-bold">Dial 108</span>
                  </button>

                  <button
                    onClick={() => onOpenCallModal('Women Helpline', '1091')}
                    className="w-full p-2 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-between border border-gray-200"
                  >
                    <span className="font-bold text-gray-800 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-pink-700">female</span>
                      Women Help (1091)
                    </span>
                    <span className="font-mono text-gray-600 font-bold">Dial 1091</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Saved Services */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#041627] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#b6171e] text-base">bookmark</span>
                Your Bookmarked Emergency Responders ({savedProviders.length})
              </h3>
              <button
                onClick={() => setActiveTab('saved')}
                className="text-xs font-bold text-sky-700 hover:underline"
              >
                View All
              </button>
            </div>

            {savedProviders.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-500">
                <p>No emergency services bookmarked yet.</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Click the bookmark icon on any hospital, garage, or pharmacy card to pin them here for instant 1-tap dialing.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {savedProviders.slice(0, 3).map((p) => (
                  <div key={p.id} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-xs text-[#041627] line-clamp-1">{p.name}</h4>
                        {p.isVerified && (
                          <span className="material-symbols-outlined text-emerald-600 text-sm">verified</span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{p.address}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-200 flex gap-2">
                      <button
                        onClick={() => onOpenCallModal(p.name, p.phone)}
                        className="flex-1 py-1.5 bg-[#ba1a1a] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-xs">call</span>
                        Call
                      </button>
                      <button
                        onClick={() => {
                          const url = `https://maps.google.com/?q=${p.coordinates.lat},${p.coordinates.lng}`;
                          window.open(url, '_blank');
                        }}
                        className="flex-1 py-1.5 bg-[#041627] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">navigation</span>
                        Maps
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SAVED SERVICES */}
      {activeTab === 'saved' && (
        <div className="bg-white p-6 rounded-b-xl border border-t-0 border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#041627]">All Saved Emergency Contacts</h3>
              <p className="text-xs text-gray-500">
                Quickly accessible offline or online for rapid assistance in {currentUser.city}
              </p>
            </div>
          </div>

          {savedProviders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-xs space-y-2">
              <span className="material-symbols-outlined text-4xl text-gray-300">bookmark_border</span>
              <p className="font-bold">No Bookmarked Providers</p>
              <p className="text-gray-400 max-w-sm mx-auto">
                Explore hospitals, garages, or locksmiths in your city and click the bookmark icon to save them for emergency access.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-[#041627]">{provider.name}</h4>
                          {provider.isVerified && (
                            <span className="material-symbols-outlined text-emerald-600 text-base">verified</span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-500 uppercase tracking-wide">
                          {provider.category} • {provider.city}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveSaved(provider.id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Remove bookmark"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>

                    <p className="text-xs text-gray-700 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-gray-400">location_on</span>
                      <span>{provider.address}</span>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                    <button
                      onClick={() => onOpenCallModal(provider.name, provider.phone)}
                      className="flex-1 py-2 bg-[#ba1a1a] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-sm">call</span>
                      Call {provider.phone}
                    </button>
                    <button
                      onClick={() => {
                        const url = `https://maps.google.com/?q=${provider.coordinates.lat},${provider.coordinates.lng}`;
                        window.open(url, '_blank');
                      }}
                      className="px-4 py-2 bg-[#041627] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">navigation</span>
                      Navigate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MEDICAL ID FORM */}
      {activeTab === 'medical' && (
        <form onSubmit={handleSaveMedicalProfile} className="bg-white p-6 rounded-b-xl border border-t-0 border-gray-200 space-y-5 text-xs">
          <div>
            <h3 className="font-bold text-sm text-[#041627] mb-1">Emergency Medical & ICE Information</h3>
            <p className="text-gray-500">
              This critical information is used by doctors, paramedics, and rescue squads when emergency assistance is dispatched.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Blood Group *</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white font-bold text-red-700"
              >
                <option value="O+ Positive">O+ Positive</option>
                <option value="O- Negative">O- Negative</option>
                <option value="A+ Positive">A+ Positive</option>
                <option value="A- Negative">A- Negative</option>
                <option value="B+ Positive">B+ Positive</option>
                <option value="B- Negative">B- Negative</option>
                <option value="AB+ Positive">AB+ Positive</option>
                <option value="AB- Negative">AB- Negative</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">ICE Contact Full Name *</label>
              <input
                required
                type="text"
                value={iceName}
                onChange={(e) => setIceName(e.target.value)}
                placeholder="e.g. Pooja Sharma (Spouse)"
                className="w-full p-2.5 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">ICE Phone Number *</label>
              <input
                required
                type="tel"
                value={icePhone}
                onChange={(e) => setIcePhone(e.target.value)}
                placeholder="+91 98220 XXXXX"
                className="w-full p-2.5 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Registered Vehicle Registration No.</label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="e.g. MH-15-DX-4412"
                className="w-full p-2.5 border border-gray-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Vehicle Make & Model</label>
              <input
                type="text"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="e.g. Hyundai Creta 2023 (Petrol)"
                className="w-full p-2.5 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">
              Medical Conditions, Allergies & Medications
            </label>
            <textarea
              rows={3}
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              placeholder="e.g. Penicillin allergy, Diabetic, wears contact lenses..."
              className="w-full p-2.5 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-gray-200">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#041627] hover:bg-[#1a2b3c] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              Save Medical ID
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: COMPLAINT / GRIEVANCE */}
      {activeTab === 'grievance' && (
        <form onSubmit={handleSubmitTicket} className="bg-white p-6 rounded-b-xl border border-t-0 border-gray-200 space-y-4 text-xs">
          <div>
            <h3 className="font-bold text-sm text-[#041627] mb-1">Report an Incident or Service Grievance</h3>
            <p className="text-gray-500">
              Submissions are directly routed to the Platform Admin and Municipal Emergency Vigilance Desk.
            </p>
          </div>

          {ticketSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>Ticket submitted successfully! Admin desk will review and assign an officer.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Emergency Category *</label>
              <select
                value={gCategory}
                onChange={(e) => setGCategory(e.target.value as any)}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
              >
                <option value="breakdown">Vehicle Breakdown / Garage Overcharging</option>
                <option value="towing">Towing Service Issue</option>
                <option value="medical">Ambulance / Hospital Delay</option>
                <option value="police">Police / Security Grievance</option>
                <option value="other">General Platform Issue</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Provider / Agency Name (If applicable)</label>
              <input
                type="text"
                value={gProviderName}
                onChange={(e) => setGProviderName(e.target.value)}
                placeholder="e.g. Dwarka Fast Towing"
                className="w-full p-2.5 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Grievance Subject *</label>
            <input
              required
              type="text"
              value={gSubject}
              onChange={(e) => setGSubject(e.target.value)}
              placeholder="e.g. Overcharging on NH-60 or Incorrect GPS address"
              className="w-full p-2.5 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Detailed Incident Description *</label>
            <textarea
              required
              rows={4}
              value={gDescription}
              onChange={(e) => setGDescription(e.target.value)}
              placeholder="Please provide specifics: time of incident, location/kilometer marker, vehicle number, or amount involved..."
              className="w-full p-2.5 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-gray-200">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#ba1a1a] hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              Submit to Admin Vigilance
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
