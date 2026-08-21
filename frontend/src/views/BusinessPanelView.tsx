import React, { useState } from 'react';
import { User, ServiceProvider, CityData, EmergencyCategory } from '../types';
import { CITIES_DATA } from '../data/mockData';

interface BusinessPanelViewProps {
  currentUser: User;
  providers: ServiceProvider[];
  onUpdateProvider: (updatedProvider: ServiceProvider) => void;
  onAddNewProvider: (newProvider: ServiceProvider) => void;
  cities?: CityData[];
  onOpenCallModal: (name: string, number: string) => void;
  onNavigateHome: () => void;
}

export const BusinessPanelView: React.FC<BusinessPanelViewProps> = ({
  currentUser,
  providers,
  onUpdateProvider,
  onAddNewProvider,
  cities = CITIES_DATA,
  onOpenCallModal,
  onNavigateHome,
}) => {
  // Find provider owned by this user or fallback to first/matched
  const myProvider = providers.find(
    (p) => p.ownerId === currentUser.id || (currentUser.businessId && p.id === currentUser.businessId)
  ) || providers.find((p) => p.city.toLowerCase() === currentUser.city.toLowerCase() && p.category === 'breakdown') || providers[0];

  const [activeTab, setActiveTab] = useState<'profile' | 'services' | 'telemetry' | 'preview'>('profile');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState(myProvider?.name || '');
  const [category, setCategory] = useState<EmergencyCategory>(myProvider?.category || 'breakdown');
  const [subcategory, setSubcategory] = useState(myProvider?.subcategory || 'Roadside Assistance & Mechanic');
  const [phone, setPhone] = useState(myProvider?.phone || '');
  const [altPhone, setAltPhone] = useState(myProvider?.altPhone || '');
  const [address, setAddress] = useState(myProvider?.address || '');
  const [city, setCity] = useState(myProvider?.city || currentUser.city || 'Nashik');
  const [landmark, setLandmark] = useState(myProvider?.landmark || '');
  const [licenseNumber, setLicenseNumber] = useState(myProvider?.licenseNumber || 'NSK-GAR-2024-8819');
  const [isOpen24x7, setIsOpen24x7] = useState(myProvider?.isOpen24x7 ?? true);
  const [operatingHours, setOperatingHours] = useState(myProvider?.operatingHours || '24 Hours / 7 Days Non-Stop');
  const [isActiveDispatch, setIsActiveDispatch] = useState(myProvider?.isActive ?? true);
  const [serviceTags, setServiceTags] = useState<string[]>(
    myProvider?.services || ['Engine Diagnostics', 'Battery Jumpstart', 'Highway Breakdown Van', 'Puncture Repair']
  );
  const [newTagInput, setNewTagInput] = useState('');

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    if (!serviceTags.includes(newTagInput.trim())) {
      setServiceTags([...serviceTags, newTagInput.trim()]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setServiceTags(serviceTags.filter((t) => t !== tagToRemove));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myProvider) return;

    const updated: ServiceProvider = {
      ...myProvider,
      name: name.trim(),
      category,
      subcategory: subcategory.trim(),
      phone: phone.trim(),
      altPhone: altPhone.trim(),
      address: address.trim(),
      city,
      landmark: landmark.trim(),
      licenseNumber: licenseNumber.trim(),
      isOpen24x7,
      operatingHours: isOpen24x7 ? '24 Hours / 7 Days Non-Stop' : operatingHours.trim(),
      isActive: isActiveDispatch,
      services: serviceTags,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      lastVerifiedDate: new Date().toISOString().split('T')[0],
    };

    onUpdateProvider(updated);
    setSuccessNotice('Business profile & dispatch status saved successfully!');
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleSubmitForVerification = () => {
    if (!myProvider) return;
    const pendingUpdate: ServiceProvider = {
      ...myProvider,
      verificationStatus: 'pending',
      isVerified: false,
      lastVerifiedDate: new Date().toISOString().split('T')[0],
    };
    onUpdateProvider(pendingUpdate);
    setSuccessNotice('Listing submitted for Admin Verification! Review turnaround is typically ~2 hours.');
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  return (
    <div className="flex flex-col flex-1 max-w-6xl mx-auto w-full pb-16 space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-[#041627] text-white rounded-2xl p-5 md:p-6 shadow-md border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">storefront</span>
              Service Provider Portal
            </span>
            <span className="text-xs text-gray-400">• City: {city}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            {myProvider?.name || 'My Emergency Service Agency'}
          </h1>
          <p className="text-xs text-gray-300">
            Manage your listing, emergency hotlines, active dispatch availability, and admin verification status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-200">{currentUser.name}</p>
            <p className="text-[11px] text-gray-400">{currentUser.email}</p>
          </div>
          <button
            onClick={onNavigateHome}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            View Citizen App
          </button>
        </div>
      </div>

      {/* Verification Status Alert Banner */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          myProvider?.verificationStatus === 'verified'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : myProvider?.verificationStatus === 'pending'
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-red-50 border-red-300 text-red-950'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 ${
              myProvider?.verificationStatus === 'verified'
                ? 'bg-emerald-600'
                : myProvider?.verificationStatus === 'pending'
                ? 'bg-amber-600'
                : 'bg-red-600'
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {myProvider?.verificationStatus === 'verified'
                ? 'verified'
                : myProvider?.verificationStatus === 'pending'
                ? 'pending_actions'
                : 'warning'}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm">
                Status:{' '}
                {myProvider?.verificationStatus === 'verified'
                  ? 'Verified & Published to Directory'
                  : myProvider?.verificationStatus === 'pending'
                  ? 'Verification Pending Review'
                  : 'Action Required / Unverified'}
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  myProvider?.verificationStatus === 'verified'
                    ? 'bg-emerald-200 text-emerald-900'
                    : myProvider?.verificationStatus === 'pending'
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-red-200 text-red-900'
                }`}
              >
                {myProvider?.verificationStatus}
              </span>
            </div>
            <p className="text-xs opacity-80 mt-0.5">
              {myProvider?.verificationStatus === 'verified'
                ? `Your business is live in ${city} and directly accessible to citizens dialing emergency assistance.`
                : myProvider?.verificationStatus === 'pending'
                ? 'Your registration documents and license number are currently under review by Platform Admin.'
                : 'Please verify your trade license or commercial registration to gain the verified trust badge.'}
            </p>
          </div>
        </div>

        {myProvider?.verificationStatus !== 'verified' && (
          <button
            onClick={handleSubmitForVerification}
            className="px-4 py-2 bg-[#041627] hover:bg-[#1a2b3c] text-white rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">verified_user</span>
            Submit for Admin Verification
          </button>
        )}
      </div>

      {successNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
          <span>{successNotice}</span>
        </div>
      )}

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Calls Received Today</span>
            <span className="material-symbols-outlined text-red-600 text-base">call</span>
          </div>
          <p className="text-2xl font-black text-[#041627]">18</p>
          <span className="text-[10px] text-emerald-600 font-semibold">+4 from yesterday</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">GPS Navigations</span>
            <span className="material-symbols-outlined text-sky-600 text-base">navigation</span>
          </div>
          <p className="text-2xl font-black text-[#041627]">42</p>
          <span className="text-[10px] text-sky-600 font-semibold">Inquiries via Map</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Citizen Trust Score</span>
            <span className="material-symbols-outlined text-amber-500 text-base">star</span>
          </div>
          <p className="text-2xl font-black text-[#041627]">
            {myProvider?.rating || 4.9} <span className="text-xs text-gray-400 font-normal">/ 5.0</span>
          </p>
          <span className="text-[10px] text-gray-500">Based on {myProvider?.reviewCount || 240} reviews</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg. Dispatch ETA</span>
            <span className="material-symbols-outlined text-emerald-600 text-base">speed</span>
          </div>
          <p className="text-2xl font-black text-emerald-700">12 min</p>
          <span className="text-[10px] text-gray-500">Rapid Response Unit</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-4 pt-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'border-[#041627] text-[#041627]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">edit_note</span>
          Business Profile & Hotlines
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'services'
              ? 'border-[#041627] text-[#041627]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">miscellaneous_services</span>
          Services & Capabilities
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'preview'
              ? 'border-[#041627] text-[#041627]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">preview</span>
          Citizen Live Preview Card
        </button>
      </div>

      {/* TAB CONTENT: PROFILE FORM */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-b-xl border border-t-0 border-gray-200 space-y-5 text-xs">
          {/* Dispatch Status Toggle */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-sm text-[#041627]">Live Emergency Dispatch Availability</p>
              <p className="text-gray-500 text-xs">
                When enabled, your business is highlighted as active and accepting emergency calls right now.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActiveDispatch}
                onChange={(e) => setIsActiveDispatch(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Business / Garage Name *</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#041627]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Emergency Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EmergencyCategory)}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#041627]"
              >
                <option value="breakdown">Vehicle Breakdown / Garage</option>
                <option value="towing">Towing & Recovery</option>
                <option value="medical">Medical / Hospital / Ambulance</option>
                <option value="fuel">EV Charging & Mobile Fuel</option>
                <option value="pharmacy">24/7 Pharmacy & Medical Depot</option>
                <option value="locksmith">Locksmith & Keymaker</option>
                <option value="fire">Fire & Safety Contractor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Subcategory / Specialization</label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. Highway Breakdown, Engine Scan & Jumpstart"
                className="w-full p-2.5 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">City / Emergency Hub *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#041627]"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Primary Emergency Helpline *</label>
              <input
                required
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0253-XXXXXXX or Mobile"
                className="w-full p-2.5 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Alternate Dispatch / Driver Line</label>
              <input
                type="text"
                value={altPhone}
                onChange={(e) => setAltPhone(e.target.value)}
                placeholder="Mobile for WhatsApp / GPS dispatch"
                className="w-full p-2.5 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Street Address / Highway *</label>
              <input
                required
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. NH-60 Mumbai-Agra Highway"
                className="w-full p-2.5 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Landmark / Flyover Pillar</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near Dwarka Circle Flyover Pillar #14"
                className="w-full p-2.5 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Trade License / GST / Registration No.</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">24/7 Service Guarantee</label>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={isOpen24x7}
                    onChange={() => setIsOpen24x7(true)}
                    name="operatingHoursType"
                    className="text-[#041627]"
                  />
                  <span>24 Hours / 7 Days (Emergency Ready)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!isOpen24x7}
                    onChange={() => setIsOpen24x7(false)}
                    name="operatingHoursType"
                    className="text-[#041627]"
                  />
                  <span>Custom Shift Hours</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#041627] hover:bg-[#1a2b3c] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              Save Business Profile
            </button>
          </div>
        </form>
      )}

      {/* TAB CONTENT: SERVICES & TAGS */}
      {activeTab === 'services' && (
        <div className="bg-white p-6 rounded-b-xl border border-t-0 border-gray-200 space-y-6 text-xs">
          <div>
            <h3 className="font-bold text-sm text-[#041627] mb-1">Emergency Services & Equipment List</h3>
            <p className="text-gray-500">
              List the specific services your dispatch vehicles or workshop can provide. These help users find you when searching.
            </p>
          </div>

          {/* Add Tag */}
          <form onSubmit={handleAddTag} className="flex gap-2 max-w-md">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="e.g. Hydraulic Crane, Alternator Replacement..."
              className="flex-1 p-2.5 border border-gray-300 rounded-lg text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#041627] text-white font-bold rounded-lg hover:bg-[#1a2b3c]"
            >
              Add Service
            </button>
          </form>

          {/* Tag List */}
          <div className="flex flex-wrap gap-2 pt-2">
            {serviceTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 font-semibold border border-gray-200"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-400 hover:text-red-600 rounded-full"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleSaveProfile}
              className="px-6 py-2.5 bg-[#041627] text-white font-bold rounded-xl hover:bg-[#1a2b3c]"
            >
              Save Service List
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: CITIZEN PREVIEW CARD */}
      {activeTab === 'preview' && (
        <div className="bg-white p-6 rounded-b-xl border border-t-0 border-gray-200 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#041627]">Citizen Live Preview</h3>
            <p className="text-xs text-gray-500">
              This is how your business appears to citizens and highway travelers in the {city} emergency directory.
            </p>
          </div>

          <div className="max-w-xl mx-auto p-5 rounded-2xl border-2 border-[#041627] bg-white shadow-lg space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-extrabold text-[#041627]">{name || 'Your Business Name'}</h4>
                  {myProvider?.isVerified && (
                    <span className="material-symbols-outlined text-emerald-600 text-lg" title="Verified Service">
                      verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{subcategory} • {city}</p>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                {isOpen24x7 ? '24/7 OPEN' : 'HOURS SET'}
              </span>
            </div>

            <p className="text-xs text-gray-700 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-gray-400">location_on</span>
              <span>{address} {landmark && `(${landmark})`}</span>
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {serviceTags.slice(0, 4).map((s) => (
                <span key={s} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                  {s}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => onOpenCallModal(name, phone)}
                className="py-2.5 px-3 bg-[#ba1a1a] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-base">call</span>
                <span>Call {phone || 'Hotline'}</span>
              </button>
              <button
                onClick={() => alert(`Simulating navigation to ${address}`)}
                className="py-2.5 px-3 bg-[#041627] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">navigation</span>
                <span>Navigate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
